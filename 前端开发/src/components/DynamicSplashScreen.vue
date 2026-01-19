<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../api'

const props = defineProps({
  duration: {
    type: Number,
    default: 2500
  }
})

const emit = defineEmits(['finished'])
const isVisible = ref(true)
const eventConfig = ref<{ image?: string, text?: string } | null>(null)

onMounted(async () => {
  // 1. 优先从后端获取全局配置
  try {
    const response = await axios.get(`${API_BASE_URL}/public/config/app_splash_config`, { timeout: 1500 });
    if (response.data && response.data.value) {
      const remoteConfig = response.data.value;
      // 只有当远程配置有内容时才覆盖
      if (remoteConfig.image || remoteConfig.text) {
        eventConfig.value = remoteConfig;
      }
    }
  } catch (e) {
    console.warn('Failed to fetch remote splash config, falling back to local/default', e);
  }

  // 2. 如果远程获取失败或为空，则尝试从 LocalStorage 获取 (本地调试用)
  if (!eventConfig.value) {
    const savedEvent = localStorage.getItem('active_event_splash')
    if (savedEvent) {
      try {
        eventConfig.value = JSON.parse(savedEvent)
      } catch (e) {
        console.error('Failed to parse local event config', e)
      }
    }
  }

  // 设定定时器关闭开屏页
  setTimeout(() => {
    isVisible.value = false
    setTimeout(() => {
      emit('finished')
    }, 500) // 等待淡出动画结束
  }, props.duration)
})
</script>

<template>
  <Transition name="splash-fade">
    <div v-if="isVisible" class="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-between py-20 px-10">
      <!-- Background Decorations -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100 blur-[80px] rounded-full animate-float"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100 blur-[80px] rounded-full animate-float" style="animation-delay: -2s"></div>
      </div>

      <!-- Main Logo Area -->
      <div class="flex-grow flex flex-col items-center justify-center space-y-8 animate-logo-in">
        <div class="relative">
          <img 
            :src="eventConfig?.image || '/logo-pure.png'" 
            alt="Koala Logo" 
            class="w-48 md:w-64 h-auto drop-shadow-2xl transition-all duration-700"
            :class="{ 'scale-110': !eventConfig }"
          />
        </div>
      </div>

      <!-- Footer Branding -->
      <div class="text-center space-y-2 animate-text-up">
        <div v-if="!eventConfig">
          <h1 class="text-3xl md:text-4xl font-bold tracking-widest text-[#1a3a3a]">考拉健康</h1>
          <p class="text-sm md:text-base font-medium tracking-[0.2em] text-[#1a3a3a]/60 uppercase">Koala Health</p>
        </div>
        <div v-else>
          <p class="text-lg font-bold text-blue-600">{{ eventConfig.text }}</p>
        </div>
        <div class="pt-8">
          <div class="w-12 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full opacity-30"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.splash-fade-enter-from,
.splash-fade-leave-to {
  opacity: 0;
}

@keyframes logo-in {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes text-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-logo-in {
  animation: logo-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-text-up {
  animation: text-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
  opacity: 0;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); shadow: 0 0 0 transparent; }
  50% { transform: translate(2%, 3%) scale(1.02); }
}

.animate-float {
  animation: float 10s infinite ease-in-out;
}
</style>

# 动态开屏系统使用指南 (Dynamic Splash Screen Guide)

考拉健康 (HealthHub) 移动端内置了一套灵活的开屏（Splash Screen）方案，支持**原生闪屏**与**全局云端动态开屏**的无缝衔接。

## 1. 视觉架构

开屏分为两个阶段：
1.  **原生闪屏 (Native Splash)**：App 进程启动时的瞬间展示（约 1s），由 Android 系统控制。
2.  **全局动态开屏 (Cloud Dynamic Splash)**：Web 容器加载后的品牌展示阶段。App 会在此时**自动同步服务器配置**，决定显示默认品牌还是特定活动海报。

## 2. 全局管理（推荐）

通过管理后台，你可以即时更新全球所有效户的开屏配置，无需重新发布 App。

### 操作步骤
1.  **登录管理面板**：使用管理员账号登录 Web 端。
2.  **品牌配置**：点击顶部导航栏的“管理面板”，选择 **“品牌配置”** 标签页。
3.  **填写内容**：
    -   **活动海报 URL**：填入存储在图床或服务器上的图片链接。
    -   **祝福文字**：填入你想在底部展示的文字（如“新春快乐”）。
4.  **预览并保存**：在页面下方确认预览效果后点击“保存”，配置将立即在云端生效。

> [!TIP]
> 设定的配置将缓存于后端数据库，全球用户在下一次启动 App 时会自动请求并展示。

## 3. 默认展示 (Fallback)

如果没有设定任何全局活动，或者网络连接不可用，系统将自动退回到：
-   **LOGO**: `前端开发/public/logo-pure.png` (经典考拉图标)。
-   **文字**: 默认的“考拉健康 / Koala Health”中英文品牌底座。

## 4. 本地调试 (Local Override)

如果你需要在本地测试特定的海报效果而不影响其他用户，可以在控制台执行：

```javascript
localStorage.setItem('active_event_splash', JSON.stringify({
  image: 'https://example.com/test.png',
  text: '这是本地测试文字'
}));
```

## 5. 技术维护

-   **核心组件**: `前端开发/src/components/DynamicSplashScreen.vue`
-   **后端接口**: `GET /api/public/config/app_splash_config`
-   **管理接口**: `POST /api/admin/config` (需管理员权限)

---

*Koala Health - 全局触达，瞬时更新。*

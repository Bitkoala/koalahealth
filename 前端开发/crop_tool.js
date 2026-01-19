
const fs = require('fs');
const { execSync } = require('child_process');

try {
    // We don't have sharp or jimp, let's try to use powershell again but from a file to avoid escaping issues
    const psScript = `
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('C:\\temp_logo.png')
$width = $img.Width
$height = $img.Height
# Crop the top portion (assume koala is in top 70%)
$cropHeight = [int]($height * 0.7)
$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $cropHeight)
$bmp = New-Object System.Drawing.Bitmap($width, $cropHeight)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save('C:\\temp_icon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Host "Width: $width, Height: $height, Cropped: $cropHeight"
`;
    fs.writeFileSync('crop.ps1', psScript);
    const result = execSync('powershell -ExecutionPolicy Bypass -File crop.ps1').toString();
    console.log(result);
} catch (e) {
    console.error(e.message);
}

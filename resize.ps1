Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\PC\.gemini\antigravity\brain\c85f65cc-d242-44ce-892e-eb8dbbfe93cd\medstudy_icon_1783981883463.png"
$destDir = "c:\Users\PC\Documents\GitHub\MedStudy\frontend\public\icons"
$faviconPath = "c:\Users\PC\Documents\GitHub\MedStudy\frontend\public\favicon.ico"

$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

$srcImg = [System.Drawing.Image]::FromFile($sourcePath)

foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($srcImg, 0, 0, $size, $size)
    $g.Dispose()
    
    $destPath = Join-Path $destDir "icon-${size}x${size}.png"
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created $destPath"
}

$bmpIco = New-Object System.Drawing.Bitmap(32, 32)
$gIco = [System.Drawing.Graphics]::FromImage($bmpIco)
$gIco.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gIco.DrawImage($srcImg, 0, 0, 32, 32)
$gIco.Dispose()
$bmpIco.Save($faviconPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmpIco.Dispose()
Write-Host "Created $faviconPath"

$srcImg.Dispose()

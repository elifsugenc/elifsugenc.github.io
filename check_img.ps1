Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('C:\Users\MONSTER\.gemini\antigravity\brain\06376a21-acd9-4cc1-a22b-ebbc53f39571\.user_uploaded\media_1791321473379.png')
Write-Output "Image 1: $($bmp.Width) x $($bmp.Height)"

$bmp2 = [System.Drawing.Bitmap]::FromFile('C:\Users\MONSTER\.gemini\antigravity\brain\06376a21-acd9-4cc1-a22b-ebbc53f39571\.user_uploaded\media_1791321598095.png')
Write-Output "Image 2: $($bmp2.Width) x $($bmp2.Height)"

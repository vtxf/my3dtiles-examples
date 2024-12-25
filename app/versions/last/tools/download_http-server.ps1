$url = "https://gitee.com/vtxf3d/my3dtiles-examples/releases/download/%E7%AE%80%E6%98%93http%E6%9C%8D%E5%8A%A1%E5%99%A8/http-server-vtxf20221104.exe"
$output = ".\tools\http-server-vtxf20221104.exe"
try {
    Invoke-WebRequest -Uri $url -OutFile $output
    Write-Output "Download completed successfully."
} catch {
    Write-Output "Download failed with error code $($_.Exception.HResult)."
}


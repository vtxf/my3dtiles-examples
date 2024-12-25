@ IF NOT EXIST .\tools\http-server-vtxf20221104.exe (
    echo "首次使用需要下载http-server-vtxf20221104.exe，下载较慢，请耐心等待.."
    powershell .\tools\download_http-server.ps1
)
start .\tools\http-server-vtxf20221104.exe -p 9123
start "" "http://127.0.0.1:9123/index.html"
pause
@ IF NOT EXIST .\tools\http-server-vtxf20221104.exe (
    echo "�״�ʹ����Ҫ����http-server-vtxf20221104.exe�����ؽ����������ĵȴ�.."
    powershell .\tools\download_http-server.ps1
)
start .\tools\http-server-vtxf20221104.exe -p 9123
start "" "http://127.0.0.1:9123/index.html"
pause
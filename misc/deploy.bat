@echo off
setlocal enabledelayedexpansion

rem ������ĿĿ¼
set "projectDir=.."
rem ���ø��µ�Զ�ֿ̲��֧
set "remoteBranch=origin/master"

rem ����ѭ��ִ�и��²���
:loop
rem ������ĿĿ¼
cd /d %projectDir%
rem ִ��git fetch
git fetch origin master
rem ִ��git reset
git reset --hard %remoteBranch%
echo �����һ��Դ����£��´θ��½���5���Ӻ�...
rem �ȴ�5���ӣ�300�룩
ping 127.0.0.1 -n 301 > nul
goto loop
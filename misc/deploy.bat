@echo off
setlocal enabledelayedexpansion

rem 设置项目目录
set "projectDir=.."
rem 设置更新的远程仓库分支
set "remoteBranch=origin/master"

rem 无限循环执行更新操作
:loop
rem 进入项目目录
cd /d %projectDir%
rem 执行git fetch
git fetch origin master
rem 执行git reset
git reset --hard %remoteBranch%
echo 已完成一次源码更新，下次更新将在5分钟后...
rem 等待5分钟（300秒）
ping 127.0.0.1 -n 301 > nul
goto loop
const { exec } = require('child_process');
const path = require('path');

// 使用当前脚本所在目录作为工作目录
const projectDir = __dirname;

// 定义要执行的命令序列
const commands = [
    'git clean -df',
    'git fetch',
    'git reset master --hard'
];

// 定义执行git命令的函数
const executeGitCommand = (command, nextCommand) => {
    console.log(`即将执行命令: ${command}`);
    const startTime = Date.now();
    
    exec(command, { cwd: projectDir }, (error, stdout, stderr) => {
        const endTime = Date.now();
        const executionTime = endTime - startTime;

        if (error || stderr) {
            console.log(`命令 ${command} 执行完成，但有错误信息，耗时: ${executionTime} 毫秒`);
            console.log(`输出: ${stdout}`);
            console.log(`错误: ${error?.message || stderr}`);
        } else {
            console.log(`命令 ${command} 执行成功，耗时: ${executionTime} 毫秒`);
            console.log(`输出: ${stdout}`);
        }

        // 无论是否有错误都继续执行下一个命令
        if (nextCommand) {
            nextCommand();
        }
    });
};

const intervalTime = 3000; // 间隔时间，单位为毫秒

// 定义更新代码的函数
const updateCode = () => {
    let currentIndex = 0;

    const executeNext = () => {
        if (currentIndex < commands.length) {
            executeGitCommand(commands[currentIndex], () => {
                currentIndex++;
                executeNext();
            });
        } else {
            console.log(`所有命令执行完成，${intervalTime}ms后将再次执行！`);
        }
    };

    executeNext();
};

console.log('执行一次更新代码操作。');
updateCode();

// 每隔5分钟执行一次更新代码操作
console.log('启动定时器每5分钟执行一次更新代码操作。');
setInterval(updateCode, intervalTime); // 改回5分钟 (300000毫秒)

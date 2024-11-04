const { exec } = require('child_process');

// 可配置的项目目录路径
// let projectDir = 'C:\\Users\\vtxf\\Documents\\vtxf\\2024\\projects\\vtxf\\m3t-examples-202411';
let projectDir = '..';
// 可配置的远程仓库名
let remoteRepo = 'jinfei';
// 可配置的远程分支名
let remoteBranch = 'master';

// 定义执行git命令的函数
const executeGitCommand = (command, callback) => {
    console.log(`即将执行命令: ${command}`);
    const startTime = Date.now();
    exec(command, { cwd: projectDir }, (error, stdout, stderr) => {
        const endTime = Date.now();
        const executionTime = endTime - startTime;

        if (error) {
            console.error(`执行 ${command} 时出错: ${error.message}`);
            console.error(`命令执行失败，耗时: ${executionTime} 毫秒`);
            return;
        }
        if (stderr) {
            console.error(`执行 ${command} 时的错误信息: ${stderr}`);
            console.error(`命令执行出现错误信息，耗时: ${executionTime} 毫秒`);
            return;
        }
        console.log(`执行 ${command} 的结果: ${stdout}`);
        console.log(`命令执行成功，耗时: ${executionTime} 毫秒`);
        if (callback) {
            callback();
        }
    });
};

// 定义更新代码的函数
const updateCode = () => {
    // 先执行git fetch
    executeGitCommand(`git fetch ${remoteRepo} ${remoteBranch}`, () => {
        // 再执行git reset
        executeGitCommand(`git reset --hard ${remoteRepo}/${remoteBranch}`, () => {
            console.log('本地代码已更新为远程仓库最新代码。');
        });
    });
};

console.log(`执行一次更新代码操作。`)
updateCode();

// 每隔5分钟（300000毫秒）执行一次更新代码操作
console.log(`启动定时器每5分钟执行一次更新代码操作。`);
setInterval(updateCode, 3000);

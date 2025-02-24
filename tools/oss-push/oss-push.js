const OSS = require('ali-oss');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { glob } = require('glob');  // 修改这一行

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '.env') });

// OSS 客户端配置
const client = new OSS({
    region: process.env.OSS_REGION,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET,
});

// 要排除的文件和目录
// 要排除的文件和目录
const excludePatterns = [
    '.git/**',
    '.env',
    'node_modules/**',
    'tools/**',
    'package.json',
    'package-lock.json',
    '.gitignore',
];

// 上传单个文件
async function uploadFile(localFile, ossPath) {
    try {
        await client.put(ossPath, localFile);
        console.log(`上传成功: ${ossPath}`);
    } catch (error) {
        console.error(`上传失败: ${ossPath}`, error);
    }
}

// 获取所有需要上传的文件
function getFiles() {
    return glob('**/*', {
        ignore: excludePatterns,
        nodir: true,
        dot: true
    });  // glob 现在直接返回 Promise，不需要包装
}

// 检查 OSS 权限
async function checkOSSAccess() {
    try {
        // 尝试列出 bucket，这会验证基本访问权限
        await client.listBuckets();
        return true;
    } catch (error) {
        console.error('OSS 访问权限检查失败:', error.message);
        return false;
    }
}

async function main() {
    try {
        // 首先检查 OSS 访问权限
        const hasAccess = await checkOSSAccess();
        if (!hasAccess) {
            console.error('请检查您的 OSS 配置和权限是否正确！');
            return;
        }

        const files = await getFiles();
        console.log('需要上传的文件数量:', files.length);

        for (const file of files) {
            const localFile = path.resolve(file);
            const ossPath = 'm3t/examples/' + file.replace(/\\/g, '/');
            await uploadFile(localFile, ossPath);
        }

        console.log('所有文件上传完成！');
    } catch (error) {
        console.error('上传过程出错:', error);
        if (error.code === 'AccessDenied') {
            console.error('访问被拒绝，请检查：');
            console.error('1. OSS AccessKey 是否正确');
            console.error('2. Bucket 权限设置是否正确');
            console.error('3. 是否有该 Bucket 的写入权限');
        }
    }
}

main();
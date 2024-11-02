const fs = require('fs');
const path = require('path');

function isImageFile(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

function findMatchingImage(dirPath, baseName) {
    const files = fs.readdirSync(dirPath);
    return files.find(file => {
        const fileBaseName = path.parse(file).name;
        return fileBaseName === baseName && isImageFile(file);
    });
}

function shouldFlatten(dirPath, dirName) {
    // 检查子目录
    const subDirPath = path.join(dirPath, dirName);
    if (!fs.existsSync(subDirPath) || !fs.statSync(subDirPath).isDirectory()) {
        return false;
    }

    const subDirContents = fs.readdirSync(subDirPath);
    const m3tJsonFiles = subDirContents.filter(item => item.endsWith('.m3tjson'));
    
    // 检查是否只有一个与目录同名的m3tjson文件
    return m3tJsonFiles.length === 1 && m3tJsonFiles[0] === `${dirName}.m3tjson`;
}

function generateTree(dirPath, relativePath = '') {
    const stats = fs.statSync(dirPath);
    if (!stats.isDirectory()) return null;

    const items = fs.readdirSync(dirPath);
    const m3tJsonFiles = items.filter(item => item.endsWith('.m3tjson'));
    const dirs = items.filter(item => 
        fs.statSync(path.join(dirPath, item)).isDirectory()
    );

    const dirName = path.basename(dirPath);

    // 处理子目录
    const children = [];
    for (const dir of dirs) {
        // 检查是否需要扁平化处理
        if (shouldFlatten(dirPath, dir)) {
            const result = {
                name: dir,
                path: dir,
                content: {
                    type: "m3tJsonUri",
                    m3tJsonUri: `\${M3T_CurrentDir}${dir}/${dir}.m3tjson`
                }
            };

            const matchingImage = findMatchingImage(path.join(dirPath, dir), dir);
            if (matchingImage) {
                result.previewImageUri = `\${M3T_CurrentDir}${dir}/${matchingImage}`;
            }

            children.push(result);
        } else {
            const fullPath = path.join(dirPath, dir);
            const newRelativePath = path.join(relativePath, dir);
            const result = generateTree(fullPath, newRelativePath);
            if (result) children.push(result);
        }
    }

    // 处理m3tjson文件
    for (const file of m3tJsonFiles) {
        const baseName = path.parse(file).name;
        const matchingImage = findMatchingImage(dirPath, baseName);
        
        const node = {
            name: baseName,
            content: {
                type: "m3tJsonUri",
                m3tJsonUri: `\${M3T_CurrentDir}${file}`
            }
        };

        if (matchingImage) {
            node.previewImageUri = `\${M3T_CurrentDir}${matchingImage}`;
        }

        children.push(node);
    }

    if (children.length === 0) return null;

    // 设置collapse属性：只有最后一级目录（没有子目录的目录）为true
    const hasSubDirs = children.some(child => child.children);
    return {
        name: dirName,
        path: dirName,
        collapse: !hasSubDirs,
        children
    };
}

function generateFullJson() {
    const examplesPath = path.join(__dirname, 'examples');
    const tree = generateTree(examplesPath);

    const fullJson = {
        list: {
            root: {
                name: "m3t官方示例(来自网络)",
                path: "examples",
                collapse: true,
                children: tree ? tree.children : []
            }
        }
    };

    fs.writeFileSync(
        path.join(__dirname, 'm3t_list.json'),
        JSON.stringify(fullJson, null, 4),
        'utf8'
    );
}

generateFullJson();

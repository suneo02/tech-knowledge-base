const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { argv, exit } = require('process');

// 处理命令行参数
const files = argv.slice(2);

if (files.length === 0) {
    console.error('请提供要转换的本地化文件路径');
    console.error('用法: node migrate-locale-to-json.js <本地化文件1> [本地化文件2...]');
    exit(1);
}

// 处理单个文件：修复 -> 转换 -> 删除原文件
async function processFile(sourceFile) {
    const fullPath = path.resolve(sourceFile);
    
    // 检查文件是否存在
    if (!fs.existsSync(fullPath)) {
        console.error(`错误: 文件 ${sourceFile} 不存在`);
        return false;
    }
    
    const fileName = path.basename(sourceFile);
    const dirName = path.dirname(fullPath);
    
    // 确定目标文件名 (用 .json 替换 .js)
    const baseFileName = path.basename(fileName, '.js');
    let targetFileName = baseFileName;
    
    const targetFile = path.join(dirName, `${targetFileName}.json`);
    
    console.log(`\n========================================`);
    console.log(`开始处理: ${fileName} -> ${path.basename(targetFile)}`);
    console.log(`========================================`);
    
    // 步骤 1: 修复本地化文件
    console.log(`\n[步骤 1/3] 修复本地化文件...\n`);
    const fixResult = spawnSync('node', ['scripts/fix-locale-files.js', fullPath], { 
        stdio: 'inherit',
        encoding: 'utf-8'
    });
    
    if (fixResult.status !== 0) {
        console.error(`错误: 修复文件 ${fileName} 失败`);
        return false;
    }
    
    // 步骤 2: 转换为 JSON
    console.log(`\n[步骤 2/3] 转换为 JSON...\n`);
    const convertResult = spawnSync('node', ['scripts/convert-locale-to-json.js', fullPath, targetFile], { 
        stdio: 'inherit',
        encoding: 'utf-8'
    });
    
    if (convertResult.status !== 0) {
        console.error(`错误: 转换文件 ${fileName} 失败`);
        return false;
    }
    
    // 步骤 3: 删除原始文件
    console.log(`\n[步骤 3/3] 删除原始文件...\n`);
    try {
        fs.unlinkSync(fullPath);
        console.log(`已删除原始文件: ${fileName}`);
    } catch (error) {
        console.error(`错误: 删除文件 ${fileName} 失败:`, error);
        return false;
    }
    
    console.log(`\n完成: ${fileName} -> ${path.basename(targetFile)}`);
    return true;
}

// 主流程
async function main() {
    console.log(`准备转换 ${files.length} 个本地化文件...\n`);
    
    let successCount = 0;
    
    for (const file of files) {
        const success = await processFile(file);
        if (success) {
            successCount++;
        }
    }
    
    console.log(`\n========================================`);
    console.log(`转换完成: ${successCount}/${files.length} 个文件成功转换`);
    console.log(`========================================\n`);
}

// 执行主流程
main().catch(error => {
    console.error('执行过程中出现错误:', error);
    exit(1);
});
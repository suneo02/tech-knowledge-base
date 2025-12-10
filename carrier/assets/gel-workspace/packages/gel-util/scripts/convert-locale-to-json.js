import fs from 'fs';
import path from 'path';
import { argv, exit } from 'process';

// 获取命令行参数
const sourceFile = argv[2] ? path.resolve(argv[2]) : null;
const targetFile = argv[3] ? path.resolve(argv[3]) : null;

if (!sourceFile || !targetFile) {
    console.error('请提供源文件路径和目标文件路径');
    console.error('用法: node convert-locale-to-json.js <源JS文件> <目标JSON文件>');
    exit(1);
}

const fileName = path.basename(sourceFile);
console.log(`\n开始处理文件: ${fileName}`);
console.log('---------------------------------------');

fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) {
        console.error('读取文件错误:', err);
        return;
    }

    console.log(`源文件大小: ${(data.length / 1024).toFixed(2)} KB`);
    
    // 使用正则表达式提取键值对
    const regex = /(\d+):\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    let match;
    const result = {};
    let count = 0;
    
    while ((match = regex.exec(data)) !== null) {
        const key = match[1];
        const value = match[2]
            .replace(/\\"/g, '"')  // 处理转义的引号
            .replace(/\\\\/g, '\\'); // 处理转义的反斜杠
        
        result[key] = value;
        count++;
    }
    
    // 将结果写入 JSON 文件
    const jsonData = JSON.stringify(result, null, 2);
    
    fs.writeFile(targetFile, jsonData, 'utf8', (err) => {
        if (err) {
            console.error('写入文件错误:', err);
            return;
        }
        
        console.log(`处理完成，转换了 ${count} 个条目`);
        console.log(`目标文件大小: ${(jsonData.length / 1024).toFixed(2)} KB`);
        console.log('---------------------------------------');
        console.log(`文件已成功保存为: ${path.basename(targetFile)}\n`);
    });
}); 
import fs from 'fs';
import path from 'path';
import { argv, exit } from 'process';

// 获取命令行参数
const filePath = argv[2] ? path.resolve(argv[2]) : null;

if (!filePath) {
    console.error('请提供要处理的文件路径');
    exit(1);
}

const fileName = path.basename(filePath);
console.log(`\n开始处理文件: ${fileName}`);
console.log('---------------------------------------');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('读取文件错误:', err);
        return;
    }

    console.log(`文件大小: ${(data.length / 1024).toFixed(2)} KB`);
    
    let totalMatches = 0;
    let multilineMatches = 0;
    
    const processedData = data.replace(/(\d+)(:\s*)"([\s\S]*?)"/g, (match, key, colon, value) => {
        totalMatches++;
        
        // 检查是否是多行字符串
        const isMultiline = value.includes('\n');
        if (isMultiline) {
            multilineMatches++;
        }
        
        // 替换换行符及周围空格为单个空格，合并连续空格，去除首尾空格
        const cleanedValue = value
            .replace(/\s*\n\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        return `${key}${colon}"${cleanedValue}"`;
    });

    fs.writeFile(filePath, processedData, 'utf8', (err) => {
        if (err) {
            console.error('写入文件错误:', err);
            return;
        }
        
        console.log(`处理完成，总共处理了 ${totalMatches} 个字符串条目`);
        if (multilineMatches > 0) {
            console.log(`修复了 ${multilineMatches} 个包含换行符的多行字符串`);
        } else {
            console.log('未发现多行字符串问题，文件格式良好');
        }
        console.log('---------------------------------------');
        console.log(`文件 ${fileName} 已成功保存\n`);
    });
});
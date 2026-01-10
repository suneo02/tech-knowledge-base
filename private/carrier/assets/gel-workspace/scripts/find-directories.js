const fs = require('fs');
const path = require('path');

// 获取文件大小（KB）
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Math.round(stats.size / 1024); // 转换为KB
  } catch (error) {
    console.error(`无法获取文件大小 ${filePath}: ${error.message}`);
    return 0;
  }
}

// 计算目录中的文件和文件夹数量，以及文件大小信息
function analyzeDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    // 排除隐藏文件、目录、.gitignore文件和public目录
    const filteredItems = items.filter(item => {
      // 排除隐藏文件和目录
      if (item.startsWith('.')) return false;
      // 排除.gitignore文件
      if (item === '.gitignore') return false;
      // 排除public目录
      if (item === 'public') return false;
      return true;
    });
    
    let fileCount = 0;
    let dirCount = 0;
    let totalFileSize = 0;
    let largeFileCount = 0; // 大于100KB的文件数量
    const largeFiles = []; // 大文件列表
    
    filteredItems.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        dirCount++;
      } else {
        fileCount++;
        const fileSize = getFileSize(itemPath);
        totalFileSize += fileSize;
        
        if (fileSize > 100) { // 大于100KB的文件被认为是大文件
          largeFileCount++;
          largeFiles.push({ name: item, size: fileSize });
        }
      }
    });
    
    return {
      totalItems: filteredItems.length,
      fileCount,
      dirCount,
      totalFileSize,
      largeFileCount,
      largeFiles,
      avgFileSize: fileCount > 0 ? Math.round(totalFileSize / fileCount) : 0
    };
  } catch (error) {
    console.error(`无法分析目录 ${dirPath}: ${error.message}`);
    return {
      totalItems: 0,
      fileCount: 0,
      dirCount: 0,
      totalFileSize: 0,
      largeFileCount: 0,
      largeFiles: [],
      avgFileSize: 0
    };
  }
}

// 检查目录是否有README文件（不区分大小写）
function hasReadme(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    return items.some(item => {
      const lowerItem = item.toLowerCase();
      return lowerItem === 'readme.md' || lowerItem === 'readme.txt' || lowerItem === 'readme';
    });
  } catch (error) {
    console.error(`无法检查目录 ${dirPath} 的README: ${error.message}`);
    return false;
  }
}

// 扫描指定层级的目录
function scanDirectories(rootDir, maxDepth = Infinity) {
  const results = [];
  
  function scan(currentDir, relativePath = '', depth = 0) {
    if (depth > maxDepth) return;
    
    try {
      const items = fs.readdirSync(currentDir);
      
      // 跳过隐藏目录、node_modules、.git目录、public目录和资源目录
      const filteredItems = items.filter(item => {
        if (item.startsWith('.') || item === 'node_modules' || item === '.git' || 
            item === 'public' || item === 'assets' || item === 'images' || 
            item === 'img' || item === 'static') {
          return false;
        }
        return true;
      });
      
      // 只检查指定深度的目录
      if (depth >= 1 && depth <= maxDepth) {
        const analysis = analyzeDirectory(currentDir);
        const hasReadmeFile = hasReadme(currentDir);
        
        // 检查条件1：目录下有10个或更多文件
        const condition1 = analysis.totalItems >= 10;
        
        // 检查条件2：目录下文件数在5-10个之间，但这些文件都比较大
        const condition2 = analysis.totalItems > 5 && 
                          analysis.totalItems < 10 && 
                          analysis.fileCount > 0 && 
                          analysis.avgFileSize > 50; // 平均文件大小大于50KB
        
        if ((condition1 || condition2) && !hasReadmeFile) {
          results.push({
            path: relativePath || currentDir,
            fullPath: currentDir,
            depth: depth,
            analysis: analysis,
            meetsCondition1: condition1,
            meetsCondition2: condition2
          });
        }
      }
      
      // 递归检查子目录
      for (const item of filteredItems) {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          const nextRelativePath = relativePath ? path.join(relativePath, item) : item;
          scan(itemPath, nextRelativePath, depth + 1);
        }
      }
    } catch (error) {
      console.error(`无法扫描目录 ${currentDir}: ${error.message}`);
    }
  }
  
  scan(rootDir);
  return results;
}

// 主函数
function main() {
  const rootDir = process.argv[2] || '.'; // 默认为当前目录
  const maxDepth = process.argv[3] ? parseInt(process.argv[3]) : Infinity; // 默认扫描深度为无限
  
  console.log(`正在扫描目录: ${path.resolve(rootDir)} (深度: ${maxDepth === Infinity ? '无限' : maxDepth})\n`);
  console.log('查找条件：');
  console.log('1. 目录下有10个或更多文件');
  console.log('2. 目录下文件数在5-10个之间，但这些文件都比较大（平均大小>50KB）');
  console.log('并且这些目录都没有README文件\n');
  console.log('注意：已排除.gitignore文件、public目录和资源目录(assets、images、img、static)\n');
  
  const results = scanDirectories(path.resolve(rootDir), maxDepth);
  
  if (results.length === 0) {
    console.log('没有找到符合条件的目录');
  } else {
    console.log(`找到 ${results.length} 个符合条件的目录：\n`);
    
    // 按深度分组显示
    const groupedByDepth = {};
    results.forEach(dir => {
      if (!groupedByDepth[dir.depth]) {
        groupedByDepth[dir.depth] = [];
      }
      groupedByDepth[dir.depth].push(dir);
    });
    
    Object.keys(groupedByDepth).sort().forEach(depth => {
      console.log(`=== 深度 ${depth} ===`);
      groupedByDepth[depth].forEach((dir, index) => {
        console.log(`${index + 1}. 目录路径: ${dir.path}`);
        console.log(`   完整路径: ${dir.fullPath}`);
        console.log(`   文件/文件夹数量: ${dir.analysis.totalItems} (文件: ${dir.analysis.fileCount}, 目录: ${dir.analysis.dirCount})`);
        console.log(`   总文件大小: ${dir.analysis.totalFileSize} KB`);
        console.log(`   平均文件大小: ${dir.analysis.avgFileSize} KB`);
        console.log(`   大文件数量(>100KB): ${dir.analysis.largeFileCount}`);
        
        if (dir.analysis.largeFiles.length > 0) {
          console.log(`   大文件列表:`);
          dir.analysis.largeFiles.forEach(file => {
            console.log(`     - ${file.name}: ${file.size} KB`);
          });
        }
        
        console.log(`   满足条件: ${dir.meetsCondition1 ? '条件1(≥10个文件)' : ''}${dir.meetsCondition1 && dir.meetsCondition2 ? ', ' : ''}${dir.meetsCondition2 ? '条件2(5-10个大文件)' : ''}`);
        console.log('---');
      });
      console.log('');
    });
  }
}

// 运行脚本
main();
const fse = require('fs-extra');
const path = require('path');

const topDir = __dirname;

console.log('📦 [report-ai] Starting to copy TinyMCE and PDF.js files...');

let tinymceSourcePath;
let pdfjsSourcePath;
try {
  // Use require.resolve to find the package.json of tinymce, then get its directory.
  // This is the most robust way to find a dependency, regardless of package manager.
  // Node's resolver will walk up from the current directory to find the package.
  const tinymcePackageJsonPath = require.resolve('tinymce/package.json');
  tinymceSourcePath = path.dirname(tinymcePackageJsonPath);
} catch (err) {
  console.error('❌ [report-ai] Could not resolve the `tinymce` package.');
  console.error('Detailed error:', err);
  console.error(
    'Ensure `tinymce` is listed as a dependency in `apps/report-ai/package.json` and `pnpm install` has been run.'
  );
  process.exit(1); // Exit with an error code
}

// Find PDF.js package
try {
  const pdfjsPackageJsonPath = require.resolve('pdfjs-dist/package.json');
  pdfjsSourcePath = path.dirname(pdfjsPackageJsonPath);
  console.log('📄 [report-ai] Found PDF.js at:', pdfjsSourcePath);
} catch (err) {
  console.error('❌ [report-ai] Could not resolve the `pdfjs-dist` package.');
  console.error('Detailed error:', err);
  console.error(
    'Ensure `pdfjs-dist` is listed as a dependency in `apps/report-ai/package.json` and `pnpm install` has been run.'
  );
  process.exit(1); // Exit with an error code
}

// Destination: Vite public directory (shared with Storybook)
const vitePublicDir = path.join(topDir, 'public');
const tinymceViteDest = path.join(vitePublicDir, 'tinymce');
const pdfjsViteDest = path.join(vitePublicDir, 'pdfjs');

// --- Copy to Vite public (shared with Storybook) ---
if (fse.existsSync(vitePublicDir)) {
  try {
    fse.emptyDirSync(tinymceViteDest);
    fse.copySync(tinymceSourcePath, tinymceViteDest, { overwrite: true });
    console.log('✅ [report-ai] TinyMCE files copied successfully!');
    console.log('📁 Destination:', tinymceViteDest);
    console.log('💡 Note: Storybook will use these files via staticDirs configuration');
  } catch (err) {
    console.error('❌ [report-ai] Failed to copy TinyMCE to public directory.', err);
  }

  // --- Copy PDF.js Worker files ---
  try {
    fse.ensureDirSync(pdfjsViteDest);

    // Copy the worker file
    const workerSourcePaths = [
      path.join(pdfjsSourcePath, 'build', 'pdf.worker.min.js'), // 优先使用压缩版
      path.join(pdfjsSourcePath, 'build', 'pdf.worker.js'), // 未压缩版
      path.join(pdfjsSourcePath, 'legacy/build', 'pdf.worker.min.js'), // legacy压缩版
      path.join(pdfjsSourcePath, 'legacy/build', 'pdf.worker.js'), // legacy未压缩版
    ];

    const workerDestPath = path.join(pdfjsViteDest, 'pdf.worker.min.js');
    let workerCopied = false;

    for (const sourcePath of workerSourcePaths) {
      if (fse.existsSync(sourcePath)) {
        fse.copyFileSync(sourcePath, workerDestPath);
        console.log('✅ [report-ai] PDF.js Worker copied successfully!');
        console.log('📁 Source:', sourcePath);
        console.log('📁 Destination:', workerDestPath);
        workerCopied = true;
        break;
      }
    }

    if (!workerCopied) {
      console.warn('⚠️ [report-ai] PDF.js Worker not found in any expected location:');
      workerSourcePaths.forEach((p) => console.warn('  - Checked:', p));
    }

    // Copy cmaps for better font support (optional)
    const cmapsSourcePath = path.join(pdfjsSourcePath, 'cmaps');
    const cmapsDestPath = path.join(pdfjsViteDest, 'cmaps');

    if (fse.existsSync(cmapsSourcePath)) {
      fse.copySync(cmapsSourcePath, cmapsDestPath, { overwrite: true });
      console.log('✅ [report-ai] PDF.js CMaps copied successfully!');
    }
  } catch (err) {
    console.error('❌ [report-ai] Failed to copy PDF.js files to public directory.', err);
  }
} else {
  console.warn('⚠️ [report-ai] Public directory not found, skipping copy. Path:', vitePublicDir);
}

console.log('✨ [report-ai] TinyMCE and PDF.js postinstall script finished.');

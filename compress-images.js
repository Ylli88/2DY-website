const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Image compression using sharp
async function compressImages() {
  // Install sharp if not already installed
  try {
    require.resolve('sharp');
  } catch (e) {
    console.log('Installing sharp...');
    execSync('npm install sharp', { stdio: 'inherit' });
  }

  const sharp = require('sharp');
  
  const imageDir = path.join(__dirname, 'assets', 'images', 'hekur');
  const folders = ['konstruksione metalike', 'rrethoje metalike', 'dyer metalike'];
  
  let totalOriginal = 0;
  let totalCompressed = 0;
  
  for (const folder of folders) {
    const folderPath = path.join(imageDir, folder);
    if (!fs.existsSync(folderPath)) continue;
    
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.png'));
    
    console.log(`\nProcessing ${folder}...`);
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      const originalSize = stats.size;
      totalOriginal += originalSize;
      
      console.log(`  Compressing ${file} (${(originalSize / 1024 / 1024).toFixed(2)} MB)...`);
      
      // Backup original
      const backupPath = filePath + '.backup';
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
      }
      
      // Compress image
      await sharp(filePath)
        .resize(1382, 1728, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .png({ 
          quality: 85,
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: true
        })
        .toFile(filePath + '.tmp');
      
      // Replace original with compressed
      fs.unlinkSync(filePath);
      fs.renameSync(filePath + '.tmp', filePath);
      
      const newStats = fs.statSync(filePath);
      const newSize = newStats.size;
      totalCompressed += newSize;
      
      const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      console.log(`    ✓ Reduced to ${(newSize / 1024 / 1024).toFixed(2)} MB (${reduction}% smaller)`);
    }
  }
  
  console.log('\n=== Compression Complete ===');
  console.log(`Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Compressed total: ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total reduction: ${((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1)}%`);
  console.log('\nBackup files saved with .backup extension');
}

compressImages().catch(console.error);

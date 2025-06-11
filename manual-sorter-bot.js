#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Promisify fs functions for async/await
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const rename = promisify(fs.rename);
const readFile = promisify(fs.readFile);

/**
 * Manual Sorter Bot
 * 
 * This bot processes a folder of PDF manuals that have been processed by the Manual Library app
 * and sorts them into folders based on their brand and model metadata stored in companion JSON files.
 * 
 * Usage: node manual-sorter-bot.js <source-directory> [target-directory]
 */

class ManualSorterBot {
  constructor(sourceDirectory, targetDirectory = null) {
    this.sourceDirectory = path.resolve(sourceDirectory);
    this.targetDirectory = targetDirectory ? path.resolve(targetDirectory) : this.sourceDirectory;
    this.stats = {
      processed: 0,
      moved: 0,
      errors: 0,
      skipped: 0
    };
    this.dryRun = false;
  }

  /**
   * Set dry run mode - will show what would be done without actually moving files
   */
  setDryRun(enabled = true) {
    this.dryRun = enabled;
    return this;
  }

  /**
   * Main sorting function
   */
  async sort() {
    console.log('🤖 Manual Sorter Bot Starting...');
    console.log(`📁 Source Directory: ${this.sourceDirectory}`);
    console.log(`📁 Target Directory: ${this.targetDirectory}`);
    
    if (this.dryRun) {
      console.log('🧪 DRY RUN MODE - No files will be moved');
    }
    
    console.log('\n📋 Scanning for PDF manuals...\n');

    try {
      await this.processDirectory(this.sourceDirectory);
      this.printSummary();
    } catch (error) {
      console.error('❌ Fatal error during sorting:', error.message);
      process.exit(1);
    }
  }

  /**
   * Recursively process directory for PDF files
   */
  async processDirectory(dirPath) {
    try {
      const items = await readdir(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const itemStat = await stat(itemPath);
        
        if (itemStat.isDirectory()) {
          // Skip directories that look like our target structure
          if (this.isTargetDirectory(item)) {
            console.log(`⏭️  Skipping existing target directory: ${item}`);
            continue;
          }
          await this.processDirectory(itemPath);
        } else if (itemStat.isFile() && path.extname(item).toLowerCase() === '.pdf') {
          await this.processPDFFile(itemPath);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing directory ${dirPath}:`, error.message);
      this.stats.errors++;
    }
  }

  /**
   * Check if directory name suggests it's a target sorting directory
   */
  isTargetDirectory(dirName) {
    // Skip directories that look like brand folders (contain letters and possibly numbers/spaces)
    // but avoid skipping legitimate source directories
    const looksLikeBrandDir = /^[A-Za-z][A-Za-z0-9\s\-_]*$/.test(dirName) && 
                             dirName.length > 2 && 
                             dirName.length < 30;
    return looksLikeBrandDir;
  }

  /**
   * Process a single PDF file
   */
  async processPDFFile(pdfPath) {
    this.stats.processed++;
    const filename = path.basename(pdfPath);
    const jsonPath = pdfPath.replace(/\.pdf$/i, '.json');
    
    console.log(`📄 Processing: ${filename}`);
    
    // Check if companion JSON file exists
    if (!fs.existsSync(jsonPath)) {
      console.log(`   ⚠️  No JSON metadata found for ${filename}`);
      this.stats.skipped++;
      return;
    }

    try {
      // Read and parse JSON metadata
      const jsonContent = await readFile(jsonPath, 'utf8');
      const metadata = JSON.parse(jsonContent);
      
      // Extract brand and model
      const brand = this.sanitizeFolderName(metadata.brand);
      const model = this.sanitizeFolderName(metadata.model);
      
      if (!brand) {
        console.log(`   ⚠️  No brand information found for ${filename}`);
        this.stats.skipped++;
        return;
      }

      // Create target folder structure
      const targetFolderPath = this.createTargetPath(brand, model, metadata);
      
      // Move files if not in dry run mode
      if (this.dryRun) {
        console.log(`   🧪 [DRY RUN] Would move to: ${path.relative(this.targetDirectory, targetFolderPath)}`);
      } else {
        await this.moveFiles(pdfPath, jsonPath, targetFolderPath);
        console.log(`   ✅ Moved to: ${path.relative(this.targetDirectory, targetFolderPath)}`);
        this.stats.moved++;
      }
      
    } catch (error) {
      console.error(`   ❌ Error processing ${filename}:`, error.message);
      this.stats.errors++;
    }
  }

  /**
   * Create target path based on metadata
   */
  createTargetPath(brand, model, metadata) {
    let folderName = brand;
    
    if (model) {
      folderName += `_${model}`;
    }
    
    // Add year information if available
    if (metadata.yearRange) {
      folderName += `_${metadata.yearRange}`;
    } else if (metadata.year) {
      folderName += `_${metadata.year}`;
    }
    
    // Add manual type if available and specific
    if (metadata.manualType && 
        metadata.manualType !== 'other' && 
        metadata.manualType.length < 20) {
      const sanitizedType = this.sanitizeFolderName(metadata.manualType);
      if (sanitizedType) {
        folderName += `_${sanitizedType}`;
      }
    }
    
    return path.join(this.targetDirectory, folderName);
  }

  /**
   * Sanitize folder names for cross-platform compatibility
   */
  sanitizeFolderName(name) {
    if (!name || typeof name !== 'string') return '';
    
    return name
      .trim()
      .replace(/[<>:"/\\|?*]/g, '_')  // Replace invalid chars
      .replace(/\s+/g, '_')           // Replace spaces with underscores
      .replace(/_{2,}/g, '_')         // Replace multiple underscores with single
      .replace(/^_+|_+$/g, '')        // Remove leading/trailing underscores
      .substring(0, 50);              // Limit length
  }

  /**
   * Move PDF and JSON files to target directory
   */
  async moveFiles(pdfPath, jsonPath, targetFolderPath) {
    try {
      // Create target directory if it doesn't exist
      await mkdir(targetFolderPath, { recursive: true });
      
      const pdfFileName = path.basename(pdfPath);
      const jsonFileName = path.basename(jsonPath);
      
      const targetPdfPath = path.join(targetFolderPath, pdfFileName);
      const targetJsonPath = path.join(targetFolderPath, jsonFileName);
      
      // Check for existing files and handle conflicts
      const finalPdfPath = await this.handleFileConflict(targetPdfPath);
      const finalJsonPath = await this.handleFileConflict(targetJsonPath);
      
      // Move files
      await rename(pdfPath, finalPdfPath);
      if (fs.existsSync(jsonPath)) {
        await rename(jsonPath, finalJsonPath);
      }
      
    } catch (error) {
      throw new Error(`Failed to move files: ${error.message}`);
    }
  }

  /**
   * Handle file naming conflicts
   */
  async handleFileConflict(targetPath) {
    if (!fs.existsSync(targetPath)) {
      return targetPath;
    }
    
    const ext = path.extname(targetPath);
    const baseName = path.basename(targetPath, ext);
    const dir = path.dirname(targetPath);
    
    let counter = 1;
    let newPath;
    
    do {
      newPath = path.join(dir, `${baseName}_${counter}${ext}`);
      counter++;
    } while (fs.existsSync(newPath) && counter < 100);
    
    if (counter >= 100) {
      throw new Error('Too many file conflicts, could not generate unique name');
    }
    
    return newPath;
  }

  /**
   * Print summary statistics
   */
  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 SORTING SUMMARY');
    console.log('='.repeat(50));
    console.log(`📄 Total PDFs processed: ${this.stats.processed}`);
    console.log(`✅ Files moved: ${this.stats.moved}`);
    console.log(`⏭️  Files skipped: ${this.stats.skipped}`);
    console.log(`❌ Errors encountered: ${this.stats.errors}`);
    
    if (this.dryRun) {
      console.log('\n🧪 This was a DRY RUN - no files were actually moved');
      console.log('   Run without --dry-run flag to perform actual sorting');
    }
    
    console.log('\n🎉 Manual sorting completed!');
  }
}

/**
 * CLI Interface
 */
function printUsage() {
  console.log(`
📚 Manual Sorter Bot - PDF Manual Organization Tool

Usage: node manual-sorter-bot.js [options] <source-directory> [target-directory]

Arguments:
  source-directory    Directory containing PDF manuals with JSON metadata
  target-directory    Directory where sorted folders will be created (optional)
                     If not provided, files will be sorted within source directory

Options:
  --dry-run          Show what would be done without moving files
  --help            Show this help message

Examples:
  node manual-sorter-bot.js ./manuals
  node manual-sorter-bot.js --dry-run ./manuals ./sorted-manuals
  node manual-sorter-bot.js ./input-folder ./output-folder

The bot will organize manuals into folders like:
  Honda_CBR600RR_2003-2006_workshop_manual/
  Yamaha_YZF-R1_2009_owner_manual/
  Kawasaki_Ninja_250_parts_catalog/
`);
}

async function main() {
  const args = process.argv.slice(2);
  
  // Handle help flag
  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }
  
  // Handle dry run flag
  const dryRunIndex = args.indexOf('--dry-run');
  const isDryRun = dryRunIndex !== -1;
  if (isDryRun) {
    args.splice(dryRunIndex, 1);
  }
  
  // Validate arguments
  if (args.length < 1) {
    console.error('❌ Error: Source directory is required');
    printUsage();
    process.exit(1);
  }
  
  const sourceDirectory = args[0];
  const targetDirectory = args[1];
  
  // Check if source directory exists
  if (!fs.existsSync(sourceDirectory)) {
    console.error(`❌ Error: Source directory does not exist: ${sourceDirectory}`);
    process.exit(1);
  }
  
  // Create and run sorter
  const sorter = new ManualSorterBot(sourceDirectory, targetDirectory);
  if (isDryRun) {
    sorter.setDryRun(true);
  }
  
  await sorter.sort();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = ManualSorterBot; 
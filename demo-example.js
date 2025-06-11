#!/usr/bin/env node

/**
 * Demo Example - Manual Sorter Bot
 * 
 * This script demonstrates how the Manual Sorter Bot works by showing
 * example JSON metadata and the resulting folder structure.
 */

console.log(`
🎬 Manual Sorter Bot - Demo Examples
=========================================

This demo shows how your JSON metadata files are read and 
how folders are created based on the metadata content.

📄 Example JSON Metadata Files:
`);

// Example metadata structures
const examples = [
  {
    filename: "Honda_CBR600RR_Service.pdf",
    metadata: {
      "title": "Honda CBR600RR Service Manual",
      "brand": "Honda",
      "model": "CBR600RR", 
      "yearRange": "2003-2006",
      "manualType": "workshop manual"
    },
    resultFolder: "Honda_CBR600RR_2003-2006_workshop_manual"
  },
  {
    filename: "Yamaha_R1_Owner.pdf",
    metadata: {
      "title": "YZF-R1 Owner's Manual",
      "brand": "Yamaha",
      "model": "YZF-R1",
      "year": 2009,
      "manualType": "owner manual"
    },
    resultFolder: "Yamaha_YZF-R1_2009_owner_manual"
  },
  {
    filename: "Kawasaki_Parts.pdf",
    metadata: {
      "id": "ghi789",
      "title": "Ninja 250 Parts Catalog",
      "brand": "Kawasaki", 
      "model": "Ninja 250",
      "year": null,
      "yearRange": null,
      "manualType": "parts catalog",
      "bikeType": ["sport"],
      "language": "en",
      "tags": ["parts"],
      "description": "Parts catalog for Ninja 250"
    },
    resultFolder: "Kawasaki_Ninja_250_parts_catalog"
  },
  {
    filename: "BMW_Manual.pdf",
    metadata: {
      "id": "jkl012",
      "title": "R1200GS Manual",
      "brand": "BMW",
      "model": "R1200GS",
      "year": null,
      "yearRange": "2013-2016", 
      "manualType": "other",
      "bikeType": ["adventure"],
      "language": "en",
      "tags": ["bmw"],
      "description": "Service information for R1200GS"
    },
    resultFolder: "BMW_R1200GS_2013-2016"
  }
];

examples.forEach((example, index) => {
  console.log(`
${index + 1}. ${example.filename} + ${example.filename.replace('.pdf', '.json')}
   JSON Content (key fields):
   ${JSON.stringify(example.metadata, null, 3)}
   
   📁 Result Folder: ${example.resultFolder}/
   ├── ${example.filename}
   └── ${example.filename.replace('.pdf', '.json')}
`);
});

console.log(`
🎯 Sorting Logic:
The bot creates folder names using Brand_Model_Year_Type pattern

📋 Example Commands:
# Preview what would happen (safe to run)
node manual-sorter-bot.js --dry-run "/path/to/your/manuals"

# Sort files in the same directory  
node manual-sorter-bot.js "/path/to/your/manuals"

💡 Always run with --dry-run first!
`);

// If run with --test flag, show what the sorting function would do
if (process.argv.includes('--test')) {
  console.log(`
🧪 Testing Folder Name Generation:
===================================
`);
  
  const ManualSorterBot = require('./manual-sorter-bot.js');
  const bot = new ManualSorterBot('/fake/path');
  
  examples.forEach((example, index) => {
    const brand = bot.sanitizeFolderName(example.metadata.brand);
    const model = bot.sanitizeFolderName(example.metadata.model);
    const folderPath = bot.createTargetPath(brand, model, example.metadata);
    
    console.log(`${index + 1}. ${example.filename}`);
    console.log(`   Generated: ${require('path').basename(folderPath)}`);
    console.log(`   Expected:  ${example.resultFolder}`);
    console.log(`   Match: ${require('path').basename(folderPath) === example.resultFolder ? '✅' : '❌'}`);
    console.log('');
  });
} 
# 🤖 Manual Sorter Bot

A vibe-coded, tailor-made PDF manual organization tool designed specifically for the Manual Library project. This bot intelligently sorts motorcycle service manuals into a clean hierarchical folder structure based on their metadata.

## 🎯 Purpose

This bot was crafted to solve a specific problem: organizing hundreds of motorcycle service manuals that have been processed by the Manual Library app. Instead of having files scattered everywhere, it creates a beautiful, organized structure that makes finding manuals intuitive.

## ✨ What It Does

The Manual Sorter Bot reads PDF manuals and their companion JSON metadata files, then automatically organizes them into a logical folder structure:

```
📁 Your Manual Collection/
├── 📁 Honda/
│   ├── 📁 CBR600RR/
│   │   ├── 📄 2003_CBR600RR_ServiceManual.pdf
│   │   └── 📄 2003_CBR600RR_ServiceManual.json
│   └── 📁 CRF450R/
│       ├── 📄 2019_CRF450R_WorkshopManual.pdf
│       └── 📄 2019_CRF450R_WorkshopManual.json
├── 📁 Kawasaki/
│   ├── 📁 Z650/
│   │   ├── 📄 2017_Z650_ServiceManual.pdf
│   │   └── 📄 2017_Z650_ServiceManual.json
│   └── 📁 Ninja_250/
└── 📁 Yamaha/
    └── 📁 YZF-R1/
```

## 🚀 Features

- **Hierarchical Organization**: Creates `Brand/Model/` folder structure
- **Smart Conflict Resolution**: Handles duplicate filenames intelligently
- **Dry Run Mode**: Preview what will happen without moving files
- **Recursive Processing**: Scans subdirectories automatically
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Metadata-Driven**: Uses JSON metadata for accurate sorting
- **Safe Operation**: Creates folders as needed, preserves original files

## 📋 Requirements

- Node.js (v12 or higher)
- PDF manuals with companion JSON metadata files from Manual Library app

## 🛠️ Installation

1. Clone or download this repository
2. No dependencies needed - uses only Node.js built-in modules!

```bash
# No npm install required! 🎉
```

## 📖 Usage

### Basic Usage

```bash
# Sort manuals in current directory
node manual-sorter-bot.js ./manuals

# Sort from source to target directory
node manual-sorter-bot.js ./input-manuals ./organized-manuals
```

### Dry Run (Recommended First)

```bash
# See what would happen without moving files
node manual-sorter-bot.js --dry-run ./manuals
```

### Command Line Options

```bash
Usage: node manual-sorter-bot.js [options] <source-directory> [target-directory]

Arguments:
  source-directory    Directory containing PDF manuals with JSON metadata
  target-directory    Where sorted folders will be created (optional)

Options:
  --dry-run          Preview actions without moving files
  --help            Show help message

Examples:
  node manual-sorter-bot.js ./manuals
  node manual-sorter-bot.js --dry-run ./manuals ./sorted
  node manual-sorter-bot.js ./input ./output
```

## 💡 How It Works

1. **Scans** for PDF files recursively in the source directory
2. **Reads** companion JSON metadata files (same name as PDF)
3. **Extracts** brand and model information from metadata
4. **Creates** hierarchical folder structure: `Brand/Model/`
5. **Moves** both PDF and JSON files to appropriate folders
6. **Handles** conflicts by adding numbered suffixes if needed

### Expected JSON Structure

The bot expects JSON files with this structure:

```json
{
  "title": "2017_Z650_ServiceManual",
  "brand": "Kawasaki",
  "model": "Z650",
  "year": 2017,
  "manualType": "workshop manual",
  "language": "en",
  "id": "unique_id"
}
```

**Required fields**: `brand` (model is optional but recommended)

## 🎨 Vibe-Coded Philosophy

This bot was **vibe-coded** - meaning it was crafted with intuition and flow rather than rigid specifications. It evolved organically to solve the exact needs of the Manual Library project:

- **Tailor-made**: Built specifically for motorcycle manual organization
- **Intuitive**: Folder structure that makes sense to humans
- **Practical**: Handles real-world edge cases and conflicts
- **Flexible**: Adapts to different metadata formats gracefully

## 📊 Output Example

```
🤖 Manual Sorter Bot Starting...
📁 Source Directory: C:\manuals\input
📁 Target Directory: C:\manuals\organized

📋 Scanning for PDF manuals...

📄 Processing: 2017_Z650_ServiceManual.pdf
   ✅ Moved to: Kawasaki/Z650/

📄 Processing: 2003_CBR600RR_Manual.pdf
   ✅ Moved to: Honda/CBR600RR/

==================================================
📊 SORTING SUMMARY
==================================================
📄 Total PDFs processed: 15
✅ Files moved: 14
⏭️  Files skipped: 1
❌ Errors encountered: 0

🎉 Manual sorting completed!
```

## 🔧 Technical Details

- **Language**: Node.js (JavaScript)
- **Dependencies**: None (uses built-in modules only)
- **File Operations**: Promisified fs operations for async/await
- **Error Handling**: Graceful error handling with detailed logging
- **Cross-Platform**: Path handling works on all operating systems

## 🤝 Contributing

This is a vibe-coded project tailored specifically for the Manual Library app. Feel free to fork and adapt for your own use cases!

## 📝 License

MIT License - Feel free to use and modify as needed.

---

*Built with ❤️ for the Manual Library project - because organized manuals make happy mechanics!* 
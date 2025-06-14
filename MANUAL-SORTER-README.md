# 🤖 Manual Sorter Bot

An intelligent automation tool that organizes PDF manuals based on their JSON metadata files generated by the Manual Library application.

## 📋 Overview

The Manual Sorter Bot reads the JSON metadata files created by your Manual Library app and automatically sorts PDF manuals into organized folder structures based on brand, model, year, and manual type. This eliminates the need to manually organize hundreds of manuals.

## ✨ Features

- **🔍 Smart Metadata Reading** - Reads JSON companion files to understand manual details
- **📁 Intelligent Folder Structure** - Creates folders based on Brand_Model_Year_Type pattern
- **🧪 Dry Run Mode** - Preview what will be moved before making changes
- **⚡ Recursive Scanning** - Processes nested directories automatically
- **🛡️ Conflict Resolution** - Handles duplicate filenames gracefully
- **📊 Detailed Reporting** - Shows processing statistics and results
- **🔄 Both File Types** - Moves both PDF and JSON files together

## 🚀 Quick Start

### Windows Users (Easy Method)
1. **Double-click** `sort-manuals.bat`
2. **Follow the prompts** in the command window
3. **Choose your sorting mode**

### Command Line (All Platforms)
```bash
# Basic usage - sort within the same directory
node manual-sorter-bot.js /path/to/your/manuals

# Sort to a different directory
node manual-sorter-bot.js /path/to/source /path/to/target

# Dry run to see what would happen
node manual-sorter-bot.js --dry-run /path/to/your/manuals
```

## 📖 Usage Examples

### Example 1: Preview Before Sorting
```bash
node manual-sorter-bot.js --dry-run "C:\Users\John\Documents\Manuals"
```

**Output:**
```
🤖 Manual Sorter Bot Starting...
📁 Source Directory: C:\Users\John\Documents\Manuals
🧪 DRY RUN MODE - No files will be moved

📋 Scanning for PDF manuals...

📄 Processing: Honda_CBR600RR_Service.pdf
   🧪 [DRY RUN] Would move to: Honda_CBR600RR_2003-2006_workshop_manual
```

## 📁 Folder Structure Examples

The bot creates folders using this pattern: `Brand_Model_Year_Type`

```
📁 Sorted Manuals/
├── 📁 Honda_CBR600RR_2003-2006_workshop_manual/
├── 📁 Yamaha_YZF-R1_2009_owner_manual/
├── 📁 Kawasaki_Ninja_250_parts_catalog/
└── 📁 BMW_R1200GS_2013-2016/
```

## 🔧 Prerequisites

- **Node.js** installed on your system
- **Manual Library App** processed manuals (with JSON metadata files)
- **Windows/Mac/Linux** - Works on all platforms

## 📊 Understanding the Output

### Processing Status Icons
- `📄` - Processing a PDF file
- `✅` - Successfully moved files
- `⚠️` - Skipped file (no metadata or no brand info)
- `❌` - Error occurred
- `⏭️` - Skipped existing organized directory

## 🛡️ Safety Features

### 🧪 Dry Run Mode
Always test with `--dry-run` first to see what will happen.

### 📁 Conflict Resolution
If files with the same name exist in the target folder, the bot automatically adds a number suffix.

### 🔄 Backup Recommendation
**Always backup your files before running the bot!**

---

**Created for use with Manual Library - A modern PDF metadata editor** 📚 
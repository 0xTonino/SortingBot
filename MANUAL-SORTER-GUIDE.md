# 🤖 Manual Sorter Bot - Complete Guide

> Automatically organize your PDF manuals based on their JSON metadata from Manual Library

## 🎯 What This Bot Does

The Manual Sorter Bot automatically reads JSON metadata files created by your Manual Library application and sorts PDF manuals into organized folders. Instead of manually moving hundreds of files, the bot does it intelligently based on brand, model, year, and manual type.

## 🚀 Quick Start

### Windows Easy Mode
1. **Double-click** `sort-manuals.bat`
2. **Enter your manuals folder path**
3. **Choose dry-run first** to preview
4. **Run actual sorting** when satisfied

### Command Line
```bash
# Always start with a dry run to see what will happen
node manual-sorter-bot.js --dry-run "C:\Path\To\Your\Manuals"

# If the preview looks good, run the actual sort
node manual-sorter-bot.js "C:\Path\To\Your\Manuals"
```

## 📁 Before & After Example

**Before Sorting:**
```
📁 My Manuals/
├── Honda_CBR600RR_Service.pdf
├── Honda_CBR600RR_Service.json
├── Yamaha_R1_Owner.pdf
├── Yamaha_R1_Owner.json
├── Kawasaki_Parts.pdf
├── Kawasaki_Parts.json
└── BMW_Manual.pdf
└── BMW_Manual.json
```

**After Sorting:**
```
📁 My Manuals/
├── 📁 Honda_CBR600RR_2003-2006_workshop_manual/
│   ├── Honda_CBR600RR_Service.pdf
│   └── Honda_CBR600RR_Service.json
├── 📁 Yamaha_YZF-R1_2009_owner_manual/
│   ├── Yamaha_R1_Owner.pdf
│   └── Yamaha_R1_Owner.json
├── 📁 Kawasaki_Ninja_250_parts_catalog/
│   ├── Kawasaki_Parts.pdf
│   └── Kawasaki_Parts.json
└── 📁 BMW_R1200GS_2013-2016/
    ├── BMW_Manual.pdf
    └── BMW_Manual.json
```

## 📋 Step-by-Step Usage

### Step 1: Prerequisites Check
- ✅ **Node.js installed** (run `node --version` to check)
- ✅ **Manual Library processed PDFs** (with .json files)
- ✅ **Backup of your files** (always recommended!)

### Step 2: Run Dry Run (Safe Preview)
```bash
node manual-sorter-bot.js --dry-run "C:\Your\Manuals\Folder"
```

**Example Output:**
```
🤖 Manual Sorter Bot Starting...
📁 Source Directory: C:\Your\Manuals\Folder
🧪 DRY RUN MODE - No files will be moved

📋 Scanning for PDF manuals...

📄 Processing: Honda_CBR600RR_Service.pdf
   🧪 [DRY RUN] Would move to: Honda_CBR600RR_2003-2006_workshop_manual

📄 Processing: Yamaha_R1_Owner.pdf
   🧪 [DRY RUN] Would move to: Yamaha_YZF-R1_2009_owner_manual

📊 SORTING SUMMARY
==================================================
📄 Total PDFs processed: 12
✅ Files moved: 10
⏭️  Files skipped: 2
❌ Errors encountered: 0

🧪 This was a DRY RUN - no files were actually moved
```

### Step 3: Run Actual Sorting
If the dry run looks good:
```bash
node manual-sorter-bot.js "C:\Your\Manuals\Folder"
```

## 🔧 Advanced Options

### Sort to Different Location
```bash
# Sort from one folder to another
node manual-sorter-bot.js "C:\Unsorted\Manuals" "D:\Organized\Manuals"
```

### Folder Naming Pattern
The bot creates folders using this pattern:
```
{Brand}_{Model}_{Year|YearRange}_{ManualType}
```

**Examples:**
- `Honda_CBR600RR_2003-2006_workshop_manual`
- `Yamaha_YZF-R1_2009_owner_manual`
- `BMW_R1200GS_2013-2016`
- `Kawasaki_Ninja_250_parts_catalog`

## 🛡️ Safety Features

### 🧪 Dry Run Mode
**Always use dry run first!** It shows exactly what will happen without moving anything.

### 📁 File Conflict Handling
If files already exist in target folders, the bot adds numbers automatically.

### ⏭️ Smart Skipping
The bot automatically skips:
- PDFs without JSON metadata files
- Files without brand information
- Already organized folders
- System/hidden files

## 🐛 Common Issues

### ❌ "Node.js not found"
**Solution:** Install Node.js from https://nodejs.org/

### ⚠️ "No JSON metadata found"
**Solution:** Process the PDF through Manual Library app first

### ⚠️ "No brand information found" 
**Solution:** Add brand information using Manual Library app

### ❌ "Permission denied"
**Problem:** Files are in use or insufficient permissions
**Solutions:**
- Close PDF viewers/editors
- Run PowerShell as Administrator
- Check folder permissions

### 📄 No Files Being Processed
**Check:**
1. Both `.pdf` and `.json` files exist in the source folder
2. JSON files contain `brand` field
3. You have correct path to source directory

## 💡 Pro Tips

- **Always backup first** - Copy your files before running
- **Use dry run** - Preview with `--dry-run` before actual sorting
- **Close PDF viewers** - Make sure PDFs aren't open elsewhere

## 📊 Understanding the Output

### Status Icons
| Icon | Meaning |
|------|---------|
| 📄 | Processing a PDF file |
| ✅ | Successfully moved files |
| ⚠️ | Skipped file (missing metadata) |
| ❌ | Error occurred |
| 🧪 | Dry run preview |
| ⏭️ | Skipped existing organized folder |

### Summary Report
The bot shows a final summary:
- **Total PDFs processed** - How many PDF files were found
- **Files moved** - How many were successfully organized
- **Files skipped** - How many were skipped (missing metadata)
- **Errors encountered** - Any problems that occurred

## 🔍 What Gets Sorted vs Skipped

### ✅ Files That Get Sorted
- ✅ PDF files with companion JSON metadata
- ✅ JSON contains at least a `brand` field
- ✅ Files are readable and not in use

### ⏭️ Files That Get Skipped
- ⏭️ PDFs without companion JSON files
- ⏭️ JSON missing brand information
- ⏭️ Files already in organized folders
- ⏭️ Non-PDF files

## 📞 Need Help?

1. **Run with dry-run** to see what's happening
2. **Check console output** for specific error messages
3. **Verify JSON metadata** using a text editor
4. **Test with small batch** of files first

## 🎉 Success!

Once sorted, your manuals will be perfectly organized by brand and model, making them easy to find and manage. The Manual Library app will still work with the sorted files in their new locations.

---

**Manual Sorter Bot v1.0 - Created for Manual Library** 📚
*Automate your manual organization with confidence* 
# 🚨 CRITICAL DATABASE CONFIGURATION WARNING 🚨

## ⛔ DO NOT MODIFY DATABASE CONFIGURATION ⛔

### Files that MUST NOT be changed:

1. **server/index.ts** (lines 9-21) - Database URL protection system
2. **.env** - Database credentials and connection strings  
3. **drizzle.config.ts** - Database ORM configuration

### ⚠️ Why this matters:

This project uses a **special database protection system** that:
- Prevents connection to wrong databases
- Protects against Replit environment variable conflicts  
- Ensures connection to the correct Supabase database where all data exists

### 💥 What happens if you modify these:

- **Data loss** - Connection to wrong/empty database
- **Application failure** - Broken database connections
- **Feature breakage** - Image uploads, admin panel, contact forms stop working

### ✅ If you need to make database changes:

1. **READ replit.md first** - Check "Critical Configuration Notes" section
2. **Ask the user** - Get explicit permission before any database changes
3. **Test thoroughly** - Verify connection works after any changes

**Remember: The current configuration is working perfectly. Don't fix what isn't broken!**
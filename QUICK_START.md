# 🚀 NEXUS Quick Start Guide

## One-Click Setup Scripts

Download the NEXUS project and run ONE of these files based on your operating system:

### Windows Users
**Double-click:** `start_windows.bat`

This will:
- ✅ Check for `.env` file (creates if missing)
- ✅ Install dependencies
- ✅ Open browser to http://localhost:5000
- ✅ Start the development server

### macOS & Linux Users
**Open Terminal in project folder and run:**
```bash
chmod +x start_mac_linux.sh
./start_mac_linux.sh
```

Or double-click `start_mac_linux.sh` (if your system supports it)

This will:
- ✅ Check for `.env` file (creates if missing)
- ✅ Install dependencies
- ✅ Open browser to http://localhost:5000
- ✅ Start the development server

---

## Important: Configure Supabase

After running the setup script:

1. **Edit `.env` file** in the project root
2. **Add your Supabase credentials:**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. **Get credentials from:**
   - Go to https://supabase.com
   - Create account and new project
   - Copy URL from: Settings > API
   - Copy Anon Key from: Settings > API

4. **Save the file and the server will auto-reload**

---

## Demo Login Credentials

Once the server starts, use these to explore:

| Role   | ID  | Password   |
|--------|-----|-----------|
| 🎓 Student | R101 | 10011995 |
| 👨‍🏫 Faculty | F001 | 05051990 |
| 👑 Admin | A001 | 01011985 |

---

## What's Inside

- **Student Dashboard**: Mind maps, hall tickets, seating plans
- **Faculty Portal**: Attendance, seating algorithm, student management
- **Admin Console**: User management, bulk uploads, system config

---

## Troubleshooting

**Q: Port 5000 is already in use**
- Kill the process: `lsof -ti:5000 | xargs kill -9`
- Or restart your computer

**Q: npm install fails**
- Delete `node_modules` folder
- Run: `npm install` again

**Q: Supabase connection error**
- Verify `.env` has correct values
- Check internet connection
- Restart the server

**Q: Still getting errors?**
- See `README_LOCAL.md` for detailed troubleshooting
- Check browser console (F12) for error messages

---

**Built with ❤️ using React + Express + Supabase**

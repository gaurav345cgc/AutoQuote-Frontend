# 🚀 SmartQuote AI - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Start Backend Server

Open **Terminal 1**:

```bash
cd backend
npm start
```

You should see:
```
🚀 ================================================
   SmartQuote Backend API Server
🚀 ================================================
   📍 Server: http://localhost:3011
   🏥 Health: http://localhost:3011/health
   📋 API: http://localhost:3011/api/quotations
🚀 ================================================

✅ Connected to MongoDB successfully
📊 Database: smartquote
```

### Step 2: Start Frontend

Open **Terminal 2**:

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

### Step 3: Open Browser

Visit: **http://localhost:8080**

---

## 🎯 Test the System

### Test 1: Health Check

```bash
curl http://localhost:3011/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "SmartQuote API is running",
  "mongodb": "connected",
  "port": 3011
}
```

### Test 2: Generate a Quotation

1. Click **"Create with AI"** button
2. Paste this sample email:

```
Can you quote any of these?

I realize 240" LG on the 96" W items is likely not achievable.. So please quote your largest full sheets otherwise.

QTY 1 – SA240 316H – ¾" TK x 96" W x 144" LG
QTY 5 – SA240 316H – 1.500" TK x 48" W x 144" LG
QTY 5 – SA240 310 – 1/2" TK x 96" W x 240" LG
```

3. Click **"Generate Quote"**
4. Wait for AI to process (~6 seconds)
5. Review extracted products in ResultPanel
6. Click **"Save Quotation"** 
7. Products appear in main table!

---

## 📁 Project Structure

```
inteliquote-dash-main/
│
├── backend/                    ← Backend Server (Port 3011)
│   ├── index.js               ← Main server file
│   ├── package.json           ← Backend dependencies
│   └── node_modules/          ← Backend packages
│
├── src/                        ← Frontend React App (Port 8080)
│   ├── components/
│   │   ├── AIModal.tsx        ← AI generation modal
│   │   ├── QuotationsTable.tsx ← Product display
│   │   └── ResultPanel.tsx    ← Review products
│   ├── pages/
│   │   └── Index.tsx          ← Main page
│   └── services/
│       └── api.ts             ← API service layer
│
├── package.json               ← Frontend dependencies
└── README.md
```

---

## 🔄 How It Works

```
1. User pastes email in AIModal
          ↓
2. Frontend → Backend (/api/extract-and-search)
          ↓
3. Backend → External AI API
          ↓
4. AI extracts products
          ↓
5. Backend saves to MongoDB ✅
          ↓
6. Backend returns data to Frontend
          ↓
7. Products displayed in ResultPanel
          ↓
8. Auto-fetch all quotations from MongoDB
          ↓
9. Display in main table
```

---

## 🔍 Verify MongoDB

### Check Data in MongoDB Atlas

1. Go to: https://cloud.mongodb.com
2. Login with credentials
3. Navigate to: **Cluster0 → Collections → smartquote → quotations**
4. You should see your saved quotations!

### Check via API

```bash
curl http://localhost:3011/api/quotations
```

---

## ⚠️ Common Issues

### Issue 1: Backend Won't Start

**Error:** `Error: listen EADDRINUSE: address already in use :::3011`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3011
taskkill /PID [PID] /F

# Linux/Mac
lsof -ti:3011 | xargs kill -9
```

### Issue 2: MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Check:**
- ✅ MongoDB URI in `backend/index.js`
- ✅ Network access allowed in MongoDB Atlas
- ✅ Correct username/password

### Issue 3: Frontend Can't Reach Backend

**Error:** `Failed to fetch`

**Check:**
- ✅ Backend is running on port 3011
- ✅ No firewall blocking localhost
- ✅ Correct API URL in `src/components/AIModal.tsx`

### Issue 4: CORS Error

**Check:**
- ✅ Backend has `app.use(cors())` (it does)
- ✅ Frontend is on localhost:8080
- ✅ No browser extensions blocking requests

---

## 📊 Expected Behavior

### After AI Generation:
- ✅ Toast: "Quotation generated and saved to database!"
- ✅ ResultPanel shows extracted products
- ✅ Company information displayed
- ✅ Data saved to MongoDB automatically

### After Clicking "Save Quotation":
- ✅ ResultPanel closes
- ✅ Main table updates with new products
- ✅ Toast: "Products are displayed in the table!"
- ✅ Search works across all fields

### After Page Refresh:
- ✅ All saved products load automatically
- ✅ Sorted by newest first
- ✅ Search and actions available

---

## 🎨 UI Overview

### Main Page
- **Header:** Refresh, Create with AI, Manual Quotation buttons
- **Table:** Displays all products from all quotations
- **Columns:** Internal Ref, Product Desc, Grade, Shape, Specs, Qty, Unit, Weight/sqft, Cost, Actions
- **Search:** Filters products by any field

### AI Modal
- **Input:** Large textarea for customer email
- **Button:** "Generate Quote" (with sparkles icon)
- **Loading:** Animated buffer with 5 stages

### Result Panel
- **Left:** Company information card
- **Right:** Products table with all extracted data
- **Actions:** Edit, Save, Discard

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Backend health check |
| POST | `/api/extract-and-search` | AI extraction + auto-save ⭐ |
| GET | `/api/quotations` | Fetch all quotations |
| GET | `/api/quotations/:id` | Get single quotation |
| PUT | `/api/quotations/:id` | Update quotation |
| DELETE | `/api/quotations/:id` | Delete quotation |
| GET | `/api/stats` | System statistics |

---

## 🛠️ Development Commands

### Backend
```bash
cd backend
npm start         # Start production server
npm run dev       # Start with auto-reload (nodemon)
```

### Frontend
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Check for linting errors
```

---

## 📖 Additional Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete system architecture & data flow
- **[backend/README.md](backend/README.md)** - Backend API documentation
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions

---

## 🎉 You're Ready!

Your SmartQuote AI system is now fully functional:

- ✅ Backend isolated and handling all data operations
- ✅ MongoDB auto-saving successful AI extractions
- ✅ Frontend fetching and displaying all quotations
- ✅ Complete separation of concerns
- ✅ Production-ready architecture

**Happy quoting!** 🚀

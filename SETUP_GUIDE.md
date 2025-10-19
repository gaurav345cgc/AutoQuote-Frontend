# SmartQuote AI - Complete Setup Guide

## 🏗️ Architecture Overview

This project consists of **TWO separate applications**:

```
inteliquote-dash-main/
├── backend/              ← Standalone Node.js + MongoDB API
│   ├── index.js
│   ├── package.json
│   └── README.md
│
└── src/                  ← React Frontend (Vite)
    ├── components/
    ├── pages/
    └── services/
        └── api.ts        ← API calls only (no MongoDB logic)
```

### Separation of Concerns

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| **Backend** | Node.js + Express + MongoDB | Database operations, API endpoints |
| **Frontend** | React + TypeScript + Vite | UI, API calls, user interactions |

---

## 🚀 Installation & Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

**Dependencies installed:**
- express
- mongoose
- cors
- dotenv
- nodemon (dev)

### Step 2: Install Frontend Dependencies

```bash
cd ..
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

Create `backend/.env` file:

```env
PORT=3011
MONGODB_URI=mongodb+srv://iamgaurav345:gaurav345@cluster0.guqlmjb.mongodb.net/smartquote?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development
```

> **Note:** MongoDB URI is currently hardcoded in `backend/index.js` as a fallback. For production, always use `.env` files.

### Frontend Configuration

The frontend is pre-configured to connect to:
- Backend API: `http://localhost:3011/api`

Located in: `src/services/api.ts`

---

## 🎮 Running the Application

You need to run **BOTH** backend and frontend servers.

### Option 1: Run in Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on: **http://localhost:3011**

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on: **http://localhost:8080**

### Option 2: Background Processes

**Windows (PowerShell):**
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (new terminal)
cd ..
npm run dev
```

**Linux/Mac:**
```bash
# Run backend in background
cd backend && npm run dev &

# Run frontend
cd .. && npm run dev
```

---

## 📊 How It Works

### 1. User Flow

```
User Action → Frontend → API Call → Backend → MongoDB → Response → Frontend
```

### 2. Detailed Process

1. **AI Generation:**
   - User pastes email in AI Modal
   - Frontend calls external AI API (209.145.50.15:3010)
   - AI extracts products and company info
   - ResultPanel displays the data
   - **NO automatic save** (user controls when to save)

2. **Save to Database:**
   - User clicks "Save Quotation" button
   - Frontend calls: `POST /api/quotations`
   - Backend saves to MongoDB
   - Success toast displayed
   - Products reloaded from database

3. **Load Products:**
   - On page load: `GET /api/quotations`
   - Backend fetches all quotations from MongoDB
   - Frontend displays as product rows
   - Sorted by newest first

4. **Refresh:**
   - User clicks "Refresh Quotations"
   - Re-fetches from MongoDB
   - Updates display

---

## 🔌 API Integration

### Frontend API Service (`src/services/api.ts`)

The frontend has **NO MongoDB code**. Only API calls:

```typescript
// Save quotation
saveQuotation(data) → POST /api/quotations

// Fetch all quotations
fetchQuotations() → GET /api/quotations

// Fetch by ID
fetchQuotationById(id) → GET /api/quotations/:id

// Delete quotation
deleteQuotation(id) → DELETE /api/quotations/:id

// Update quotation
updateQuotation(id, data) → PUT /api/quotations/:id
```

### Backend API (`backend/index.js`)

RESTful API with MongoDB integration:

- ✅ CRUD operations for quotations
- ✅ Pagination support
- ✅ Statistics endpoint
- ✅ Error handling
- ✅ Input validation
- ✅ Health check

---

## 📁 File Structure

```
project-root/
│
├── backend/                    # Standalone Backend
│   ├── index.js               # Express server + MongoDB
│   ├── package.json           # Backend dependencies
│   ├── node_modules/          # Backend packages
│   └── README.md              # Backend documentation
│
├── src/                        # Frontend React App
│   ├── components/
│   │   ├── AIModal.tsx        # AI generation modal
│   │   ├── QuotationsTable.tsx # Product display
│   │   └── ResultPanel.tsx    # Review & save
│   ├── pages/
│   │   └── Index.tsx          # Main page (API calls only)
│   ├── services/
│   │   └── api.ts             # API service layer
│   └── ...
│
├── package.json               # Frontend dependencies
├── vite.config.ts             # Vite configuration
└── README.md                  # Project documentation
```

---

## 🧪 Testing

### 1. Test Backend

**Start backend:**
```bash
cd backend
npm run dev
```

**Health check:**
```bash
curl http://localhost:3011/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "SmartQuote API is running",
  "mongodb": "connected",
  "port": 3011
}
```

### 2. Test Frontend

**Start frontend:**
```bash
npm run dev
```

**Open browser:**
```
http://localhost:8080
```

### 3. End-to-End Test

1. Ensure backend is running (`http://localhost:3011`)
2. Open frontend (`http://localhost:8080`)
3. Click "Create with AI"
4. Paste sample email
5. Wait for AI to generate
6. Click "Save Quotation"
7. Check products appear in main table
8. Verify in MongoDB Atlas (optional)

---

## 🎯 Key Features

| Feature | Location | Type |
|---------|----------|------|
| AI Product Extraction | Frontend → External API | API Call |
| Save to MongoDB | Frontend → Backend → MongoDB | API Call |
| Load Products | Frontend → Backend → MongoDB | API Call |
| Search Products | Frontend | Client-side |
| Refresh Data | Frontend → Backend → MongoDB | API Call |

---

## 📝 Important Notes

### Frontend (`src/`)
- ✅ **No MongoDB dependencies**
- ✅ **No database logic**
- ✅ Only API calls via `fetch()`
- ✅ Clean separation of concerns

### Backend (`backend/`)
- ✅ Standalone Node.js project
- ✅ Own `package.json` and `node_modules`
- ✅ Can be deployed separately
- ✅ RESTful API design

---

## 🚢 Deployment

### Backend Deployment

**Options:**
- Heroku
- Railway
- Render
- DigitalOcean
- AWS EC2

**Steps:**
1. Push backend folder to Git
2. Set environment variables on platform
3. Deploy
4. Note the deployed URL

### Frontend Deployment

**Options:**
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

**Steps:**
1. Update `src/services/api.ts` with production backend URL
2. Build: `npm run build`
3. Deploy `dist` folder

---

## 🔧 Development Tips

### Running Both Servers

**Recommended Setup:**
- **Terminal 1:** Backend (`cd backend && npm run dev`)
- **Terminal 2:** Frontend (`npm run dev`)
- **Browser:** http://localhost:8080

### Debugging

**Backend Logs:**
```
✅ Connected to MongoDB successfully
✅ Quotation saved: [ID] with [N] products
📋 Fetched [N] quotations
```

**Frontend Console:**
```javascript
// In browser console
console.log('API Base:', 'http://localhost:3011/api')
```

**Check MongoDB:**
- Atlas Dashboard → Collections → `quotations`

---

## ❓ Troubleshooting

### Backend Won't Start

**Problem:** Port 3011 already in use  
**Solution:**
```bash
# Windows
netstat -ano | findstr :3011
taskkill /PID [PID] /F

# Linux/Mac
lsof -ti:3011 | xargs kill -9
```

### MongoDB Connection Failed

**Check:**
- ✅ MongoDB URI in `.env` or `backend/index.js`
- ✅ Network access in MongoDB Atlas
- ✅ Correct username/password

### Frontend Can't Reach Backend

**Check:**
- ✅ Backend is running on port 3011
- ✅ CORS is enabled (it is by default)
- ✅ No firewall blocking localhost

### CORS Error

**Solution:** Backend has CORS enabled:
```javascript
app.use(cors()); // Allows all origins
```

---

## 📚 Documentation

- [Backend API Documentation](backend/README.md)
- [MongoDB Setup](MONGODB_SETUP.md)

---

## ✨ Summary

| Aspect | Details |
|--------|---------|
| **Backend** | Separate Node.js app in `backend/` |
| **Frontend** | React app in `src/` |
| **Database** | MongoDB Atlas (via backend only) |
| **Communication** | REST API (fetch calls) |
| **Development** | Run both servers simultaneously |
| **Deployment** | Deploy separately on different platforms |

---

## 🎉 You're All Set!

1. **Start backend:** `cd backend && npm run dev`
2. **Start frontend:** `npm run dev` (in root)
3. **Open browser:** http://localhost:8080
4. **Generate quotations!** 🚀

---

**Need help?** Check the backend README: `backend/README.md`

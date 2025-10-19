# MongoDB Integration Setup Guide

## ✅ What's Been Implemented

### 1. Backend Server (`server/index.js`)
- Express.js server running on port **3011**
- MongoDB connection via Mongoose
- RESTful API for quotation management
- CORS enabled for frontend integration

### 2. Database Connection
- **MongoDB URI**: `mongodb+srv://iamgaurav345:gaurav345@cluster0.guqlmjb.mongodb.net/`
- **Database**: Cluster0
- **Collection**: `quotations`
- **Status**: ✅ Connected and working

### 3. Frontend Integration
- API service layer (`src/services/api.ts`)
- Automatic saving of successful AI quotations
- Load quotations from MongoDB on page load
- Refresh functionality to reload from database

---

## 🔄 How It Works

### Flow Diagram
```
1. User pastes email → AI Modal
2. AI extracts data → Success response
3. Automatically saved to MongoDB ✅
4. Products displayed in ResultPanel
5. On "Save" → Products added to main table
6. Data reloaded from MongoDB
```

### Key Features

#### 1. **Automatic Logging**
Every successful AI-generated quotation is automatically saved to MongoDB with:
- Company information
- All extracted products
- Original email text
- Timestamp
- Status: "success"

#### 2. **Load from Database**
On page load, all quotations are fetched and displayed as product line items in the main table.

#### 3. **Refresh**
Click "Refresh Quotations" to reload data from MongoDB.

---

## 🚀 Running the Application

### Option 1: Run Everything Together (Recommended)
```bash
npm run dev
```
This starts:
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3011

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev:client
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
```

---

## 📋 API Endpoints

### Base URL: `http://localhost:3011/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/quotations` | Save new quotation (auto-called after AI generation) |
| GET | `/quotations` | Fetch all quotations (called on page load) |
| GET | `/quotations/:id` | Fetch specific quotation |
| PUT | `/quotations/:id` | Update quotation |
| DELETE | `/quotations/:id` | Delete quotation |

### Health Check
```bash
GET http://localhost:3011/health
```
Response:
```json
{
  "status": "ok",
  "message": "Quotation API is running",
  "mongodb": "connected"
}
```

---

## 💾 Data Structure

### MongoDB Document Schema
```javascript
{
  _id: ObjectId("..."),
  company: {
    name: "Company Name",
    contact_person: "John Doe",
    city: "New York",
    state: "NY",
    phone: "123-456-7890",
    email: "contact@company.com",
    website: "https://company.com",
    street: "123 Main St",
    Order_date: "2025-10-19",
    Shipping_date: "2025-10-25"
  },
  products: [
    {
      internal_ref: "REF-001",
      product_desc: "Steel Plate",
      grade: "SA240 316H",
      shape: "Plate",
      specs: "3/4\" TK x 96\" W x 144\" LG",
      quantity: 5,
      unit: "pcs",
      weight_per_sqft: "30.6",
      cost: 1250.00
    }
  ],
  emailText: "Original customer email text...",
  status: "success",
  createdAt: "2025-10-19T08:15:37.000Z",
  updatedAt: "2025-10-19T08:15:37.000Z"
}
```

---

## 🔍 Testing

### 1. Check Server Status
```bash
curl http://localhost:3011/health
```

### 2. Manual Save Test
```bash
curl -X POST http://localhost:3011/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "company": {"name": "Test Company"},
    "products": [
      {
        "product_desc": "Test Product",
        "grade": "SA240",
        "quantity": 1,
        "cost": 100
      }
    ],
    "emailText": "Test email",
    "status": "success"
  }'
```

### 3. Fetch All Quotations
```bash
curl http://localhost:3011/api/quotations
```

---

## 📊 What Gets Saved

### On Every Successful AI Generation:
✅ Complete company information  
✅ All extracted products  
✅ Original email text  
✅ Status: "success"  
✅ Automatic timestamp  

### What's Displayed:
- Main page shows **all products** from **all quotations**
- Each product is a row in the table
- Search works across all fields
- Products are sorted by most recent first

---

## 🎯 User Journey

1. **Open App** → Products load from MongoDB automatically
2. **Click "Create with AI"** → Paste email
3. **AI Processes** → Extracts data
4. **Auto-Save** → Saved to MongoDB (behind the scenes)
5. **Review** → ResultPanel shows extracted data
6. **Save** → Products appear in main table
7. **Refresh** → Reload from database anytime

---

## 📝 Files Modified/Created

### New Files:
- ✅ `server/index.js` - Backend server
- ✅ `server/package.json` - ESM config
- ✅ `server/README.md` - Server docs
- ✅ `src/services/api.ts` - API service layer

### Modified Files:
- ✅ `package.json` - Added scripts and dependencies
- ✅ `src/pages/Index.tsx` - MongoDB integration
- ✅ `src/components/AIModal.tsx` - Pass emailText
- ✅ `src/components/QuotationsTable.tsx` - Loading state
- ✅ `src/components/ResultPanel.tsx` - Save handler

### Dependencies Added:
- ✅ express
- ✅ mongoose
- ✅ cors
- ✅ dotenv
- ✅ concurrently (dev)

---

## 🔐 Security Note

The MongoDB URI is currently hardcoded in `server/index.js`. For production:
1. Move to environment variables (.env file)
2. Add .env to .gitignore
3. Use proper authentication
4. Implement rate limiting
5. Add input validation

---

## ✨ Features Summary

| Feature | Status |
|---------|--------|
| Auto-save to MongoDB | ✅ Working |
| Load on page load | ✅ Working |
| Refresh from DB | ✅ Working |
| Product table display | ✅ Working |
| Search functionality | ✅ Working |
| Loading states | ✅ Working |
| Error handling | ✅ Working |
| Health check | ✅ Working |

---

## 🎉 You're All Set!

Run `npm run dev` and start generating quotations! Every successful generation will be logged to MongoDB and displayed on your main page.

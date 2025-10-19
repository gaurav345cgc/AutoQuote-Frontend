# SmartQuote AI - Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                          │
│                     (React Frontend - Port 8080)                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ HTTP Request
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API SERVER                          │
│                  (Node.js + Express - Port 3011)                 │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  POST /api/extract-and-search                              │ │
│  │  ├─ Receives emailText from frontend                       │ │
│  │  ├─ Calls external AI API (209.145.50.15:3010)            │ │
│  │  ├─ Saves to MongoDB if successful                        │ │
│  │  └─ Returns extracted data to frontend                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           │ Mongoose ODM                          │
│                           ▼                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  MongoDB Connection                        │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Network
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB ATLAS                               │
│              (Cloud Database - cluster0.guqlmjb)                 │
│                                                                   │
│  Database: smartquote                                            │
│  Collection: quotations                                          │
└─────────────────────────────────────────────────────────────────┘

                           │
                           │ External API Call
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL AI API                             │
│              (http://209.145.50.15:3010)                         │
│                                                                   │
│  Endpoint: /extract-and-search                                   │
│  Function: Extracts products from email text                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Data Flow

### **Flow 1: AI Quotation Generation** (Main Flow)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │──(1)───▶│   Backend   │──(2)───▶│  External   │         │   MongoDB   │
│  (AIModal)  │         │    API      │         │   AI API    │         │    Atlas    │
└─────────────┘         └─────────────┘         └─────────────┘         └─────────────┘
      │                        │                        │                        │
      │ User pastes email      │                        │                        │
      │ Clicks "Generate"      │                        │                        │
      │                        │                        │                        │
      │ POST emailText         │                        │                        │
      │───────────────────────▶│                        │                        │
      │                        │                        │                        │
      │                        │ POST emailText         │                        │
      │                        │───────────────────────▶│                        │
      │                        │                        │                        │
      │                        │                        │ AI Processing          │
      │                        │                        │ Extracts products      │
      │                        │                        │ Extracts company info  │
      │                        │                        │                        │
      │                        │ Response (JSON)        │                        │
      │                        │◀───────────────────────│                        │
      │                        │                        │                        │
      │                        │ Save to MongoDB        │                        │
      │                        │───────────────────────────────────────────────▶│
      │                        │                        │                        │
      │                        │                        │        Document saved  │
      │                        │◀───────────────────────────────────────────────│
      │                        │                        │                        │
      │ Response with data     │                        │                        │
      │◀───────────────────────│                        │                        │
      │                        │                        │                        │
      │ Display ResultPanel    │                        │                        │
      │ Auto-reload products   │                        │                        │
      │                        │                        │                        │
```

### **Step-by-Step Breakdown:**

1. **User Input** (Frontend)
   - User opens AI Modal
   - Pastes customer email text
   - Clicks "Generate Quote"

2. **Frontend → Backend** 
   ```javascript
   POST http://localhost:3011/api/extract-and-search
   Body: { "emailText": "..." }
   ```

3. **Backend → External AI API**
   ```javascript
   POST http://209.145.50.15:3010/extract-and-search
   Body: { "emailText": "..." }
   ```

4. **AI Processing**
   - Parses email text
   - Extracts product specifications
   - Identifies company information
   - Returns structured JSON

5. **Backend → MongoDB**
   - Validates AI response
   - Creates quotation document
   - Saves to `quotations` collection
   - Auto-generates timestamps

6. **Backend → Frontend**
   - Returns extracted data
   - Includes MongoDB ID
   - Includes thread_id

7. **Frontend Display**
   - Shows ResultPanel with products
   - Auto-fetches all quotations from MongoDB
   - Updates main table

---

### **Flow 2: Load Products on Page Load**

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │         │   Backend   │         │   MongoDB   │
│  (Index.tsx)│         │    API      │         │    Atlas    │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │                        │
      │ Component mounts       │                        │
      │ useEffect() runs       │                        │
      │                        │                        │
      │ GET /api/quotations    │                        │
      │───────────────────────▶│                        │
      │                        │                        │
      │                        │ Find all documents     │
      │                        │───────────────────────▶│
      │                        │                        │
      │                        │ Array of quotations    │
      │                        │◀───────────────────────│
      │                        │                        │
      │ Response (JSON array)  │                        │
      │◀───────────────────────│                        │
      │                        │                        │
      │ Map to product rows    │                        │
      │ Display in table       │                        │
      │                        │                        │
```

---

### **Flow 3: Refresh Quotations**

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │         │   Backend   │         │   MongoDB   │
│   (Header)  │         │    API      │         │    Atlas    │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │                        │
      │ User clicks Refresh    │                        │
      │                        │                        │
      │ GET /api/quotations    │                        │
      │───────────────────────▶│                        │
      │                        │                        │
      │                        │ Find all documents     │
      │                        │───────────────────────▶│
      │                        │                        │
      │                        │ Latest quotations      │
      │                        │◀───────────────────────│
      │                        │                        │
      │ Updated product list   │                        │
      │◀───────────────────────│                        │
      │                        │                        │
      │ Re-render table        │                        │
      │                        │                        │
```

---

## 📦 Data Models

### **Frontend Product Interface**

```typescript
interface Product {
  id: string;                    // Generated from MongoDB _id
  internal_ref?: string;         // e.g., "316H1500"
  product_desc?: string;         // e.g., "316H PLATE 1.5\""
  name?: string;                 // e.g., "STAINLESS STEEL"
  grade?: string;                // e.g., "316H"
  shape?: string;                // e.g., "PLATE"
  specs?: string;                // Full specifications
  size?: string;                 // Dimensions
  quantity?: string | number;    // e.g., "1" or 5
  unit?: string;                 // e.g., "in", "pcs"
  weight_per_sqft?: string;      // e.g., "63.337"
  cost?: string | number;        // e.g., "0" or 1250.50
  variant_type?: string;         // e.g., "Flat"
}
```

### **MongoDB Document Structure**

```javascript
{
  _id: ObjectId("670e1234567890abcdef1234"),
  
  company: {
    name: "ABC Corporation",
    contact_person: "John Doe",
    email: "john@abc.com",
    phone: "123-456-7890",
    city: "New York",
    state: "NY",
    street: "123 Main St",
    website: "https://abc.com",
    Order_date: "2025-10-20",
    Shipping_date: "2025-10-25",
    company_type: "Private",
    address_type: "Business",
    zip: "10001",
    display_name: "ABC Corp",
    reference: "REF-001"
  },
  
  products: [
    {
      internal_ref: "316H1500",
      product_desc: "316H PLATE 1.5\"",
      name: "STAINLESS STEEL",
      variant_type: "Flat",
      grade: "316H",
      shape: "PLATE",
      specs: "5 – SA240 316H – 1.500 TK x 48 W x 144 LG",
      size: "1.500 TK x 48 W x 144 LG",
      quantity: "1",
      unit: "in",
      weight_per_ft: "0",
      weight_per_sqft: "63.337",
      weight_per_piece: "",
      cost: "0"
    }
  ],
  
  emailText: "Can you quote any of these?\\n\\nQTY 1 – SA240 316H...",
  thread_id: "static",
  status: "success",
  
  createdAt: ISODate("2025-10-19T08:30:00.000Z"),
  updatedAt: ISODate("2025-10-19T08:30:00.000Z")
}
```

---

## 🔌 API Integration Points

### **1. Frontend ↔ Backend**

**Endpoint:** `http://localhost:3011/api/`

| Action | Method | Endpoint | Purpose |
|--------|--------|----------|---------|
| Generate Quote | POST | `/extract-and-search` | Send email, get AI extraction |
| Load Products | GET | `/quotations` | Fetch all saved quotations |
| Refresh | GET | `/quotations` | Re-fetch latest data |

### **2. Backend ↔ External AI API**

**Endpoint:** `http://209.145.50.15:3010/`

| Action | Method | Endpoint | Purpose |
|--------|--------|----------|---------|
| AI Extraction | POST | `/extract-and-search` | Extract products from email |

### **3. Backend ↔ MongoDB**

**Connection:** Mongoose ODM via MongoDB Atlas

| Action | Method | Purpose |
|--------|--------|---------|
| Save Quotation | `create()` | Save AI-extracted data |
| Fetch All | `find()` | Get all quotations |
| Update | `findByIdAndUpdate()` | Modify quotation |
| Delete | `findByIdAndDelete()` | Remove quotation |

---

## 🎯 Key Features

### **1. Isolated Backend**
- ✅ Frontend has NO MongoDB code
- ✅ Frontend has NO direct AI API calls
- ✅ All business logic in backend
- ✅ Backend handles data persistence

### **2. Automatic Saving**
- ✅ AI extraction triggers auto-save
- ✅ No manual "Save" button needed
- ✅ Data immediately available in MongoDB
- ✅ Products auto-refresh after save

### **3. Error Handling**
- ✅ Backend validates all inputs
- ✅ Graceful failure handling
- ✅ Detailed error messages
- ✅ Fallback responses

### **4. Scalability**
- ✅ Backend and frontend deploy separately
- ✅ Horizontal scaling possible
- ✅ MongoDB Atlas auto-scaling
- ✅ API rate limiting ready

---

## 🔒 Security Considerations

### **Current Setup**
- MongoDB URI in backend only
- CORS enabled for localhost
- No authentication/authorization
- Input validation on backend

### **Production Recommendations**
1. **Environment Variables**
   - Use `.env` files
   - Never commit credentials
   - Use secret management services

2. **Authentication**
   - Implement JWT tokens
   - API key authentication
   - Role-based access control

3. **Rate Limiting**
   - Protect AI API endpoint
   - Prevent abuse
   - Monitor usage

4. **CORS**
   - Restrict to specific domains
   - No wildcard (`*`) in production

5. **Input Validation**
   - Sanitize email text
   - Validate all inputs
   - Prevent injection attacks

---

## 📊 Performance Optimization

### **Backend**
- Connection pooling (Mongoose default)
- Index on `createdAt` for sorting
- Pagination for large datasets
- Caching layer (Redis) - optional

### **Frontend**
- React Query for caching
- Lazy loading for large tables
- Debounced search
- Virtual scrolling - optional

---

## 🧪 Testing Strategy

### **Backend Tests**
```bash
cd backend
npm test  # (to be implemented)
```

**Test Cases:**
- Health check returns 200
- AI extraction saves to MongoDB
- Invalid email text returns 400
- External AI API failure handling
- MongoDB connection errors

### **Frontend Tests**
```bash
npm test  # (to be implemented)
```

**Test Cases:**
- AI Modal sends correct payload
- Products display after generation
- Refresh updates product list
- Empty state shows correctly
- Error messages display properly

---

## 🚀 Deployment

### **Backend Deployment**

**Platform Options:**
- Railway (recommended)
- Render
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk

**Environment Variables:**
```env
PORT=3011
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
```

### **Frontend Deployment**

**Platform Options:**
- Vercel (recommended)
- Netlify
- Cloudflare Pages
- GitHub Pages

**Build Command:**
```bash
npm run build
```

**Environment Variable:**
Update `src/services/api.ts`:
```typescript
const API_BASE_URL = process.env.VITE_API_URL || 'https://your-backend.railway.app/api';
```

---

## 📝 Summary

| Component | Technology | Port | Responsibility |
|-----------|-----------|------|----------------|
| **Frontend** | React + TypeScript + Vite | 8080 | UI, API calls |
| **Backend** | Node.js + Express + Mongoose | 3011 | Business logic, MongoDB, AI proxy |
| **Database** | MongoDB Atlas | — | Data persistence |
| **External AI** | Python API | 3010 | Product extraction |

**Data Flow:**
```
User → Frontend → Backend → AI API + MongoDB → Backend → Frontend → User
```

**Key Principle:** Backend is fully isolated and handles all data operations. Frontend is a pure UI layer.

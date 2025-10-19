# 🔌 API Integration Test Guide

## ✅ Backend API Integration Complete!

Your edit and delete operations now make **real API calls** to the backend!

---

## 📡 **API Calls Being Made:**

### **1. Delete Product** 🗑️

**Frontend → Backend:**
```
DELETE http://localhost:3011/api/quotations/{quotationId}
```

**What Happens:**
1. User clicks Delete button
2. Confirmation dialog appears
3. User confirms
4. Frontend extracts quotation ID from product ID
5. **API Call:** `DELETE /api/quotations/{id}`
6. Backend deletes from MongoDB
7. Frontend reloads all quotations
8. Table updates automatically

**Console Logs (Backend):**
```
🗑️  Quotation deleted: 68f4a59ff0b966a2bdfa69b6
```

---

### **2. Edit Product** ✏️

**Frontend → Backend:**
```
GET http://localhost:3011/api/quotations/{quotationId}  (fetch current data)
PUT http://localhost:3011/api/quotations/{quotationId}  (update)
```

**What Happens:**
1. User clicks Edit button
2. Edit modal opens with current values
3. User makes changes
4. User clicks "Save Changes"
5. **API Call 1:** `GET /api/quotations/{id}` (fetch full quotation)
6. Frontend updates the specific product in the array
7. **API Call 2:** `PUT /api/quotations/{id}` (send updated data)
8. Backend updates MongoDB
9. Frontend reloads all quotations
10. Table updates automatically

**Request Body (Example):**
```json
{
  "products": [
    {
      "internal_ref": "316H1500",
      "product_desc": "UPDATED DESCRIPTION",
      "grade": "316H",
      "shape": "PLATE",
      "specs": "Updated specs",
      "quantity": "10",
      "unit": "pcs",
      "weight_per_sqft": "63.337",
      "cost": "1500"
    }
  ]
}
```

**Console Logs (Backend):**
```
✏️  Quotation updated: 68f4a59ff0b966a2bdfa69b6
```

---

## 🧪 **Testing Instructions:**

### **Step 1: Start Backend**
```bash
cd backend
npm start
```

**Verify:**
```
✅ Connected to MongoDB successfully
📊 Database: smartquote
```

---

### **Step 2: Start Frontend**
```bash
npm run dev
```

**Verify:**
```
  ➜  Local: http://localhost:8080/
```

---

### **Step 3: Generate Test Data**

1. Open http://localhost:8080
2. Click **"Create with AI"**
3. Paste sample email:
```
Can you quote any of these?

QTY 1 – SA240 316H – ¾" TK x 96" W x 144" LG
QTY 5 – SA240 316H – 1.500" TK x 48" W x 144" LG
```
4. Click **"Generate Quote"**
5. Wait for AI processing
6. Click **"Save Quotation"**
7. Products appear in table

---

### **Step 4: Test Edit**

1. **Find a product** in the table
2. **Click Edit button** (pencil icon)
3. **Edit modal opens** with all fields
4. **Make changes** (e.g., change quantity from "1" to "10")
5. **Click "Save Changes"**

**Watch Browser Network Tab:**
```
Request:  GET  /api/quotations/{id}   (Status: 200)
Request:  PUT  /api/quotations/{id}   (Status: 200)
```

**Watch Backend Console:**
```
✏️  Quotation updated: 68f4a59ff0b966a2bdfa69b6
📋 Fetched N quotations (page 1)
```

**Result:**
- ✅ Success toast appears
- ✅ Modal closes
- ✅ Table refreshes
- ✅ Changed values visible
- ✅ Data persisted in MongoDB

---

### **Step 5: Test Delete**

1. **Find a product** in the table
2. **Click Delete button** (trash icon)
3. **Confirmation dialog** appears
4. **Read the product name** to verify
5. **Click "Delete"** (red button)

**Watch Browser Network Tab:**
```
Request:  DELETE  /api/quotations/{id}   (Status: 200)
Request:  GET     /api/quotations        (Status: 200)
```

**Watch Backend Console:**
```
🗑️  Quotation deleted: 68f4a59ff0b966a2bdfa69b6
📋 Fetched N quotations (page 1)
```

**Result:**
- ✅ Success toast appears
- ✅ Dialog closes
- ✅ Table refreshes
- ✅ Product removed from table
- ✅ Deleted from MongoDB

---

## 🔍 **Network Tab Inspection:**

### **Open Chrome DevTools:**
1. Press `F12`
2. Go to **Network** tab
3. Filter by **Fetch/XHR**

### **Expected Requests:**

| Action | Method | URL | Status | Response |
|--------|--------|-----|--------|----------|
| **Page Load** | GET | `/api/quotations` | 200 | List of quotations |
| **AI Generate** | POST | `/api/extract-and-search` | 200 | Extracted data |
| **Auto-Reload** | GET | `/api/quotations` | 200 | Updated list |
| **Edit (Fetch)** | GET | `/api/quotations/{id}` | 200 | Single quotation |
| **Edit (Save)** | PUT | `/api/quotations/{id}` | 200 | Updated quotation |
| **Delete** | DELETE | `/api/quotations/{id}` | 200 | Success message |
| **Refresh** | GET | `/api/quotations` | 200 | Latest list |

---

## 📊 **Backend Logs to Watch:**

```bash
# When editing:
✏️  Quotation updated: 68f4a59ff0b966a2bdfa69b6
📋 Fetched 3 quotations (page 1)

# When deleting:
🗑️  Quotation deleted: 68f4a59ff0b966a2bdfa69b6
📋 Fetched 2 quotations (page 1)

# When AI generating:
🤖 Processing AI extraction request...
✅ AI extraction successful - 2 products found
💾 Quotation saved to MongoDB: 68f4a713f0b966a2bdfa69c2
```

---

## 🎯 **Data Flow:**

### **Edit Operation:**
```
User clicks Edit
      ↓
Modal opens
      ↓
User edits fields
      ↓
User clicks "Save"
      ↓
Frontend: GET /api/quotations/{id}
      ↓
Backend: Fetches from MongoDB
      ↓
Frontend: Updates product in array
      ↓
Frontend: PUT /api/quotations/{id}
      ↓
Backend: Updates MongoDB
      ↓
Frontend: GET /api/quotations (refresh)
      ↓
Backend: Fetches all quotations
      ↓
Frontend: Updates table
      ↓
User sees changes ✅
```

### **Delete Operation:**
```
User clicks Delete
      ↓
Confirmation dialog
      ↓
User confirms
      ↓
Frontend: DELETE /api/quotations/{id}
      ↓
Backend: Deletes from MongoDB
      ↓
Frontend: GET /api/quotations (refresh)
      ↓
Backend: Fetches remaining quotations
      ↓
Frontend: Updates table
      ↓
Product removed ✅
```

---

## ✅ **Success Indicators:**

### **Edit Working:**
- [x] Network tab shows GET then PUT requests
- [x] Backend logs show "Quotation updated"
- [x] Success toast appears
- [x] Table refreshes automatically
- [x] Changes persist after page reload
- [x] MongoDB shows updated data

### **Delete Working:**
- [x] Network tab shows DELETE request
- [x] Backend logs show "Quotation deleted"
- [x] Success toast appears
- [x] Table refreshes automatically
- [x] Product gone after page reload
- [x] MongoDB record deleted

---

## 🐛 **Troubleshooting:**

### **Edit not working?**

**Check:**
1. Backend is running on port 3011
2. Network tab shows 200 status codes
3. No CORS errors in console
4. MongoDB is connected

**Common Issues:**
- ❌ `Failed to fetch` → Backend not running
- ❌ `404 Not Found` → Wrong endpoint URL
- ❌ `500 Server Error` → Check backend logs
- ❌ Changes not persisting → Check MongoDB connection

### **Delete not working?**

**Check:**
1. Confirmation dialog appeared
2. You clicked "Delete" (not Cancel)
3. Network tab shows DELETE request
4. Backend logs show deletion

**Common Issues:**
- ❌ Product still there → Check if DELETE was called
- ❌ `404 Not Found` → Invalid quotation ID
- ❌ `500 Server Error` → MongoDB error

---

## 📋 **Verification Checklist:**

- [ ] Backend running on port 3011
- [ ] Frontend running on port 8080
- [ ] MongoDB connection successful
- [ ] Can generate quotations with AI
- [ ] Products appear in table
- [ ] Edit button opens modal
- [ ] Can edit all fields
- [ ] Save button calls API
- [ ] Table refreshes after edit
- [ ] Delete button shows confirmation
- [ ] Delete calls backend API
- [ ] Table refreshes after delete
- [ ] Network tab shows correct requests
- [ ] Backend logs show operations
- [ ] Changes persist in MongoDB

---

## 🎉 **Summary:**

✅ **Edit functionality** → Fully integrated with backend  
✅ **Delete functionality** → Fully integrated with backend  
✅ **API calls** → Working correctly  
✅ **Data persistence** → MongoDB saving/updating/deleting  
✅ **Auto-refresh** → Table updates after operations  
✅ **Error handling** → Toast notifications on failure  

**Your CRUD operations are now fully functional with backend API integration!** 🚀

---

## 🔗 **Related Documentation:**

- [FEATURES_GUIDE.md](FEATURES_GUIDE.md) - Feature overview
- [backend/README.md](backend/README.md) - Backend API docs
- [QUICKSTART.md](QUICKSTART.md) - Quick setup guide

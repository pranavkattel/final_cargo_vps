# Seed 400 Orders Script

This script populates your database with 400 test shipment orders for testing pagination and order management features.

## Usage

### Prerequisites
Make sure you have:
- MongoDB running (locally or remote)
- Backend dependencies installed (`npm install` in backend folder)
- `.env` file configured with `MONGODB_URI`

### Run the Script

From the project root:
```powershell
node backend/scripts/seed400Orders.js
```

Or from the backend folder:
```powershell
cd backend
node scripts/seed400Orders.js
```

## What It Does

The script will:
1. Connect to your MongoDB database
2. Generate 400 random shipment orders with:
   - Unique tracking IDs
   - Random customer information
   - Various origins and destinations
   - Different service types
   - Random statuses (pending, received, in-transit, delivered)
   - Priority levels (low, normal, high, urgent)
   - Assigned personnel and hubs
   - Status history
3. Insert them in batches of 50
4. Show statistics of created orders

## Generated Data

Each order includes:
- **Customer Info**: Name, email, phone, address
- **Shipment Details**: Origin, destination, weight, service type, description
- **Status**: Random status from the workflow
- **Dates**: Created date and estimated delivery
- **Admin Fields**: Assigned personnel, hub, priority, internal notes
- **History**: Initial status entry

## Sample Output

```
🚀 Starting seed script...
📊 Target: 400 orders
🔗 Connecting to: mongodb://localhost:27017/capital-cargo
✅ Connected to MongoDB
📦 Existing shipments in database: 0

🔨 Generating 400 test shipments...
   Generated 50/400 shipments...
   Generated 100/400 shipments...
   ...

💾 Inserting shipments into database...
   Inserted 50/400 shipments...
   Inserted 100/400 shipments...
   ...

✅ Success! Database now contains 400 total shipments
   (Added 400 new shipments)

📊 Statistics:
   pending: 98 shipments
   received: 102 shipments
   in-transit: 95 shipments
   delivered: 105 shipments

🎉 Seeding completed successfully!
```

## Testing Pagination

After running this script, you can test:
1. Navigate to the Order Management page
2. Try different "Items per page" settings (10, 25, 50, 100)
3. Test pagination controls with 400 orders
4. Try filtering and searching through large dataset
5. Test sorting with many records

## Clearing Data

If you want to start fresh, you can delete all shipments:

```javascript
// In MongoDB shell or using a script
db.shipments.deleteMany({});
```

Or use the `mongosh` command:
```powershell
mongosh
use capital-cargo
db.shipments.deleteMany({})
```

## Notes

- The script adds to existing data, it doesn't clear it first
- All tracking IDs are unique
- Dates are randomly distributed over the past year
- Phone numbers and emails are randomly generated
- The script uses the same data structure as your Shipment model

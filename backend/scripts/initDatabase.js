#!/usr/bin/env node
/*
  Idempotent database initializer for Cargo Capital backend.
  Usage:
    node backend/scripts/initDatabase.js [mongoUri]
  If no mongoUri is provided, will use process.env.MONGODB_URI or default to mongodb://localhost:27017/cargo-capital
*/

const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('../models/Admin');
const Shipment = require('../models/Shipment');

const sampleShipments = [
  {
    trackingId: 'CC001234567',
    serviceType: 'international',
    customerInfo: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-0123',
      address: '123 Main St, New York, NY 10001'
    },
    shipmentDetails: {
      origin: 'New York, USA',
      destination: 'London, UK',
      weight: 25,
      description: 'Electronics',
      serviceType: 'international'
    },
    status: 'in-transit',
    events: [
      { status: 'picked-up', description: 'Picked up from sender', location: 'NY Hub', timestamp: new Date('2025-07-14T09:00:00Z'), completed: true },
      { status: 'in-transit', description: 'In transit to destination', location: 'JFK Airport', timestamp: new Date('2025-07-15T14:30:00Z'), completed: false }
    ],
    estimatedDelivery: new Date('2025-07-20T10:00:00Z')
  },
  {
    trackingId: 'CC001234568',
    serviceType: 'international',
    customerInfo: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+44-20-7123-4567',
      address: '456 Oxford Street, London, UK'
    },
    shipmentDetails: {
      origin: 'Los Angeles, USA',
      destination: 'Sydney, Australia',
      weight: 15,
      description: 'Clothing',
      serviceType: 'international'
    },
    status: 'delivered',
    events: [
      { status: 'picked-up', description: 'Picked up', location: 'LA Hub', timestamp: new Date('2025-07-05T10:00:00Z'), completed: true },
      { status: 'delivered', description: 'Delivered to recipient', location: 'Sydney', timestamp: new Date('2025-07-10T16:00:00Z'), completed: true }
    ],
    estimatedDelivery: new Date('2025-07-10T16:00:00Z'),
    actualDelivery: new Date('2025-07-10T16:00:00Z')
  }
];

async function run() {
  try {
    const argUri = process.argv[2];
    const uri = argUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/cargo-capital';
    console.log('Connecting to', uri);

    await mongoose.connect(uri, {
      // using defaults for mongoose v6+ / v7+ - options like useNewUrlParser are deprecated
    });

    console.log('Connected to MongoDB');

    // Ensure indexes for Admin and Shipment collections
    console.log('Ensuring indexes...');
    await Admin.collection.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    await Shipment.collection.createIndex({ trackingId: 1 }, { unique: true }).catch(() => {});
    await Shipment.collection.createIndex({ status: 1 }).catch(() => {});

    // Ensure default admin exists (uses model helper which will hash password)
    console.log('Ensuring default admin user...');
    try {
      const created = await Admin.createDefaultAdmin();
      if (created) {
        console.log('Default admin created');
      } else {
        // If admin exists, also ensure it is active and not locked
        const admin = await Admin.findOne();
        if (admin) {
          admin.isActive = true;
          admin.loginAttempts = 0;
          admin.lockUntil = undefined;
          await admin.save();
          console.log('Existing admin ensured active and unlocked');
        }
      }
    } catch (err) {
      console.warn('Could not create default admin (already exists or error):', err.message);
    }

    // Seed sample shipments if none exist
    const shipmentCount = await Shipment.countDocuments();
    if (shipmentCount === 0) {
      console.log('Seeding sample shipments...');
      for (const s of sampleShipments) {
        try {
          const doc = new Shipment(s);
          await doc.save();
          console.log('Inserted shipment', doc.trackingId);
        } catch (err) {
          console.warn('Skipping insert (possible duplicate or validation):', err.message);
        }
      }
    } else {
      console.log('Shipments collection already has', shipmentCount, 'documents — skipping seed');
    }

    console.log('Initialization complete');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Initialization failed:', err);
    try { await mongoose.connection.close(); } catch(e){}
    process.exit(1);
  }
}

run();

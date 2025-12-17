/**
 * Script to populate database with 400 test shipments
 * Usage: node backend/scripts/seed400Orders.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import the Shipment model
const Shipment = require('../models/Shipment');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/capital-cargo';
const NUM_ORDERS = 400;

// Sample data arrays
const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Maria', 'Robert', 'Jennifer', 
  'William', 'Linda', 'Richard', 'Patricia', 'Joseph', 'Elizabeth', 'Thomas', 'Susan', 'Christopher', 'Jessica',
  'Daniel', 'Karen', 'Matthew', 'Nancy', 'Anthony', 'Betty', 'Mark', 'Margaret', 'Donald', 'Sandra'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

const cities = ['Kathmandu', 'Pokhara', 'Lalitpur', 'Biratnagar', 'Bharatpur', 'Birgunj', 'Dharan', 'Butwal', 'Hetauda', 'Janakpur'];

const countries = ['Nepal', 'India', 'China', 'USA', 'UK', 'Australia', 'Canada', 'Japan', 'Germany', 'France',
  'Singapore', 'UAE', 'South Korea', 'Thailand', 'Malaysia', 'Hong Kong', 'Qatar', 'Saudi Arabia', 'Italy', 'Spain'];

const serviceTypes = ['standard', 'express', 'overnight', 'international', 'freight'];

const statuses = ['processing', 'picked-up', 'in-transit', 'out-for-delivery', 'delivered', 'failed-delivery', 'returned', 'cancelled'];

const itemTypes = ['Electronics', 'Clothing', 'Books', 'Machinery', 'Food Items', 'Medical Supplies', 
  'Automobile Parts', 'Furniture', 'Documents', 'Textiles', 'Handicrafts', 'Cosmetics', 'Toys', 'Sports Equipment'];

const priorities = ['low', 'normal', 'high', 'urgent'];

const deliveryPersonnel = ['John Driver', 'Sarah Courier', 'Mike Delivery', 'Emma Transport', 'David Express'];

const hubs = ['Main Hub', 'North Branch', 'South Branch', 'East Hub', 'West Center'];

// Helper functions
const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

const randomPhone = () => {
  const prefixes = ['+977-98', '+977-97', '+977-96', '+1-555', '+44-20', '+61-2'];
  const prefix = randomItem(prefixes);
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${number}`;
};

const randomEmail = (name) => {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];
  return `${name.toLowerCase().replace(' ', '.')}@${randomItem(domains)}`;
};

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomWeight = () => {
  return (Math.random() * 50 + 0.5).toFixed(2);
};

const randomTrackingId = () => {
  const prefix = 'CCIPL';
  const randomNumbers = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  return `${prefix}${randomNumbers}`;
};

const generateShipment = (index) => {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const fullName = `${firstName} ${lastName}`;
  const origin = `${randomItem(cities)}, ${randomItem(countries)}`;
  const destination = `${randomItem(cities)}, ${randomItem(countries)}`;
  const createdDate = randomDate(new Date(2024, 0, 1), new Date());
  const estimatedDelivery = new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);

  return {
    trackingId: randomTrackingId(),
    customerInfo: {
      name: fullName,
      email: randomEmail(fullName),
      phone: randomPhone(),
      address: `${Math.floor(Math.random() * 999 + 1)} ${randomItem(['Main', 'Oak', 'Maple', 'Park', 'Hill'])} Street`
    },
    shipmentDetails: {
      origin: origin,
      destination: destination,
      weight: randomWeight(),
      serviceType: randomItem(serviceTypes),
      description: `${randomItem(itemTypes)} - Shipment #${index + 1}`
    },
    status: randomItem(statuses),
    estimatedDelivery: estimatedDelivery.toISOString(),
    events: [
      {
        status: 'processing',
        description: 'Shipment received and processing started',
        location: origin,
        timestamp: createdDate.toISOString(),
        completed: true
      }
    ]
  };
};

// Main execution
async function seedOrders() {
  try {
    console.log('🚀 Starting seed script...');
    console.log(`📊 Target: ${NUM_ORDERS} orders`);
    console.log(`🔗 Connecting to: ${MONGODB_URI}`);

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Check existing count
    const existingCount = await Shipment.countDocuments();
    console.log(`📦 Existing shipments in database: ${existingCount}`);

    // Ask for confirmation if there are existing records
    if (existingCount > 0) {
      console.log('⚠️  Warning: Database already contains shipments.');
      console.log('   This script will ADD 400 more shipments to the existing ones.');
      console.log('   If you want to start fresh, delete existing shipments first.');
    }

    // Generate shipments
    console.log(`\n🔨 Generating ${NUM_ORDERS} test shipments...`);
    const shipments = [];
    for (let i = 0; i < NUM_ORDERS; i++) {
      shipments.push(generateShipment(i));
      if ((i + 1) % 50 === 0) {
        console.log(`   Generated ${i + 1}/${NUM_ORDERS} shipments...`);
      }
    }

    // Insert into database in batches
    console.log('\n💾 Inserting shipments into database...');
    const batchSize = 50;
    let inserted = 0;

    for (let i = 0; i < shipments.length; i += batchSize) {
      const batch = shipments.slice(i, i + batchSize);
      await Shipment.insertMany(batch);
      inserted += batch.length;
      console.log(`   Inserted ${inserted}/${NUM_ORDERS} shipments...`);
    }

    // Final count
    const finalCount = await Shipment.countDocuments();
    console.log(`\n✅ Success! Database now contains ${finalCount} total shipments`);
    console.log(`   (Added ${NUM_ORDERS} new shipments)`);

    // Display some statistics
    console.log('\n📊 Statistics:');
    const statusCounts = await Shipment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    statusCounts.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} shipments`);
    });

    console.log('\n🎉 Seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
seedOrders();

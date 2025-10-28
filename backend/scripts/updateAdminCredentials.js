#!/usr/bin/env node
/*
  Usage: node updateAdminCredentials.js [email] [password]
  Example (PowerShell): node backend/scripts/updateAdminCredentials.js admin@cargocapital.com 'capitalcargo123$'
*/

const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('../models/Admin');

const email = process.argv[2] || 'admin@cargocapital.com';
const password = process.argv[3] || 'capitalcargo123$';

async function run() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cargo-capital';
    console.log('Connecting to', uri);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    let admin = await Admin.findOne();

    if (!admin) {
      console.log('No admin found - creating new admin user');
      const newAdmin = new Admin({
        name: 'Admin User',
        email,
        password,
        role: 'admin',
        isActive: true
      });
      await newAdmin.save();
      console.log('✅ Created admin:', email);
    } else {
      console.log('Found existing admin (id=', admin._id.toString(), '). Updating credentials...');
      admin.email = email;
      admin.password = password; // pre-save hook will hash
      // Ensure the account is active and clear any previous lock/login attempts
      admin.isActive = true;
      admin.loginAttempts = 0;
      admin.lockUntil = undefined;
      await admin.save();
      console.log('✅ Updated admin credentials to:', email);
    }

    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error updating admin credentials:', err);
    try { await mongoose.connection.close(); } catch(e){}
    process.exit(1);
  }
}

run();

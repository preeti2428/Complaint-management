const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Complaint = require('../models/Complaint')

dotenv.config()

const seedComplaints = [
  {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    title: 'Water Leakage Issue',
    description: 'Water pipeline damaged near market area. Continuous leakage causing road damage.',
    category: 'Water Supply',
    location: 'Ghaziabad',
    status: 'Pending',
  },
  {
    name: 'Anjali Verma',
    email: 'anjali.verma@example.com',
    title: 'Street Light Not Working',
    description: 'Street light pole near Sector 14 has been off for two weeks. Area is unsafe at night.',
    category: 'Electricity',
    location: 'Noida',
    status: 'In Progress',
  },
  {
    name: 'Mohit Singh',
    email: 'mohit.singh@example.com',
    title: 'Garbage Not Collected',
    description: 'Garbage collection truck skipped our lane for 10 days. Waste piling up.',
    category: 'Sanitation',
    location: 'Delhi',
    status: 'Pending',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    title: 'Pothole on Main Road',
    description: 'Large pothole on the main road near the bus stop. Multiple bikes have fallen.',
    category: 'Public Works',
    location: 'Hyderabad',
    status: 'In Progress',
  },
  {
    name: 'Amit Sharma',
    email: 'amit.sharma@example.com',
    title: 'Sewage Overflow',
    description: 'Sewage overflowing near the community park causing bad smell and health issues.',
    category: 'Sanitation',
    location: 'Lucknow',
    status: 'Pending',
  },
  {
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    title: 'Hospital Emergency Room Delay',
    description: 'Emergency room has long wait times. Need more staff during peak hours.',
    category: 'Health Services',
    location: 'Kochi',
    status: 'Resolved',
  },
  {
    name: 'Nikhil Das',
    email: 'nikhil.das@example.com',
    title: 'Traffic Signal Malfunction',
    description: 'Traffic signal stuck on red at junction 5 for 30 minutes. Causing heavy traffic.',
    category: 'Public Safety',
    location: 'Pune',
    status: 'Pending',
  },
]

const runSeed = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    console.error('MONGO_URI is not set')
    process.exit(1)
  }

  try {
    await mongoose.connect(mongoUri)
    await Complaint.deleteMany({})
    await Complaint.insertMany(seedComplaints)
    console.log(`Inserted ${seedComplaints.length} complaints`) 
  } catch (error) {
    console.error('Seed failed:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

runSeed()

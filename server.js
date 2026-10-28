import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// In-memory storage for hackathon demo (MongoDB optional)
let MEMBERS = []
let TRANSACTIONS = []
let LOANS = []

console.log("Trying MongoDB...")
import('mongoose').then(async ({default: mongoose}) => {
  try {
    await mongoose.connect('mongodb://localhost:27017/sanchay', {serverSelectionTimeoutMS: 2000})
    console.log("✅ Bada Godown Ready - MongoDB Connected")
  } catch (e) {
    console.log("⚠️ MongoDB nahi mila - In-memory mode pe chalega (Demo ke liye OK hai)")
  }
})

app.get('/', (req,res)=> res.send('Sanchay Backend Running ✅'))

app.post('/api/sync', (req,res)=>{
  const {members=[], transactions=[], loans=[]} = req.body
  console.log(`Sync request: ${members.length} members, ${transactions.length} tx, ${loans.length} loans`)
  MEMBERS = [...MEMBERS, ...members]
  TRANSACTIONS = [...TRANSACTIONS, ...transactions]
  LOANS = [...LOANS, ...loans]
  res.json({success:true, message: "Sync ho gaya", count: transactions.length})
})

app.get('/api/data', (req,res)=>{
  res.json({members: MEMBERS, transactions: TRANSACTIONS, loans: LOANS})
})

app.listen(5000, ()=> console.log('✅ Backend on http://localhost:5000'))
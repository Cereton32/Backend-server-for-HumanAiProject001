const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();


connectDB();


app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
  }));



app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/boards', require('./routes/boardRoutes'));
app.get('/api/test', (req, res) => {
    res.json({ message: "API is working!" });
  });


const PORT = process.env.PORT || 5005; 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
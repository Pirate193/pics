const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db')
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');// Importing auth routes
const {errorHandler} = require('./utils/errorHandler');




const app = express();// Initialize express app
// connect to our database
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());// Use Helmet for security headers 

app.use('/api/auth', authRoutes); // Use auth routes
app.use(errorHandler); // Global error handler

app.get('/',(req,res)=>{
    res.send('API is running...');
})


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

//handle unhandled promise  rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server and exit process
    server.close(() => process.exit(1));
});

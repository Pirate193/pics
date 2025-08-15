const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes.js'); // Importing auth routes
const userRoutes = require('./routes/userRoutes.js');
const pinRoutes = require('./routes/pinRoutes.js');
const boardRoutes = require('./routes/boardRoutes.js');

const { errorHandler } = require('./utils/errorHandler.js');


const app = express();// Initialize express app
// connect to our database
dotenv.config();
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());// Use Helmet for security headers 

app.use('/api/auth', authRoutes); // Use auth routes
app.use('/api/users',userRoutes);// users routes
app.use('/api/pins',pinRoutes); //pin routes
app.use('/api/boards',boardRoutes);// board routes 
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

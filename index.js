const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const dotenv = require('dotenv');
dotenv.config();



//CONNECT DB
const connectDB = require('./config/db');
connectDB();

//MIDDLEWARE
app.use(express.json());

//APP USE
app.use('/api/auth', require("./routes/auth"));

const PORT = process.env.PORT;
const server = app.listen(PORT, ()=> console.log(`server is running in port ${PORT}`));

//AVOID CRASHING
process.on('unhandledRejection', (err, promise) => {
    console.log(`Logged Error: ${err}`);
    server.close(() => process.exit(1));
});
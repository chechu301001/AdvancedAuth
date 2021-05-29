const mongoose = require('mongoose');

// mongoose connect to db
const connectDB = async () => {

    const DB = process.env.DB_CONNECT;

    await mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
    });

    console.log("Database Connected.");
}

module.exports = connectDB;
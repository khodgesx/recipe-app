const mongoose = require("mongoose");
// Configuration
const db = mongoose.connection;

// Connect to Mongo
mongoose.connect(process.env.MONGO_URI);

// Connection Error/Success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: '));
db.on('disconnected', () => console.log('mongo disconnected'));
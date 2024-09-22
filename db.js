require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
const clientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: { version: '1', strict: true, deprecationErrors: true },
};

async function connectDB() {
    try {
        await mongoose.connect(uri, clientOptions);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

async function disconnectDB() {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.error('MongoDB disconnection error:', error);
        process.exit(1); // Exit process with failure
    }
}

module.exports = {
    connectDB,
    disconnectDB,
};

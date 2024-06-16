const mongoose = require("mongoose");

const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'todoapp'  
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = { dbconnect };

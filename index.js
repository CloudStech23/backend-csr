// require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const options = {
    origin:'*',
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",

}
app.use(cors(options));
app.use(bodyParser.json({limit:'50mb'}));
app.use(express.json());
app.use(bodyParser.urlencoded({limit:'50mb', extended: true}));

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://udaysolanki530:cGJxtqNBgPKHkgJo@csr-data.iqypl.mongodb.net/CSR-data?retryWrites=true&w=majority", {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Updated Schema
const EventSchema = new mongoose.Schema({
    programType: String,
    customProgramType: String,
    title: String,
    description: String,
    eventDate: String,
    eventVenue: String,
    partner: String,
    beneficiarynum: String,
    beneficiarytext: String,
    //  
    unittype: String,
    quantvaluetext: String,
    images: [String],
    mainImage: String,
});
const Event = mongoose.model("csr-events", EventSchema); 

// Keep the cache mechanism
const cache = {
    data: null,
    lastUpdated: null,
    expirationTime: 3600000 // 1 hour in milliseconds
};

// API Route to Get Data
app.post("/api/events", async (req, res) => {
    
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.json({ message: "Event added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/events", async (req, res) => {
    try {
        // Check if cache exists and is not expired
        if (cache.data && cache.lastUpdated && 
            (Date.now() - cache.lastUpdated) < cache.expirationTime) {
            return res.json(cache.data);
        }

        // If no cache or expired, fetch from MongoDB
        const events = await Event.find();
        
        // Update cache
        cache.data = events;
        cache.lastUpdated = Date.now();
        
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a route to clear cache if needed
app.post("/api/clear-cache", (req, res) => {
    cache.data = null;
    cache.lastUpdated = null;
    res.json({ message: "Cache cleared successfully" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

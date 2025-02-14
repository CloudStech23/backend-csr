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
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Sample Schema
const EventSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    course: String,
    image: String
});
const Event = mongoose.model("csr-events", EventSchema); 

// API Route to Get Data
app.post("/api/events", async (req, res) => {
    
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.json({ message: "Student added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/events", async (req, res) => {
    try{
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

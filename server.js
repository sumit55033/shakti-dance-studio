const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================
// MongoDB Connection
// ==========================

mongoose.connect(
"mongodb://shaktiadmin:Sumit55033@ac-4hqhabo-shard-00-00.udiw6uq.mongodb.net:27017,ac-4hqhabo-shard-00-01.udiw6uq.mongodb.net:27017,ac-4hqhabo-shard-00-02.udiw6uq.mongodb.net:27017/shaktiDB?ssl=true&replicaSet=atlas-q616qg-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB Error:", err);
});

// ==========================
// Schema
// ==========================

const TrialSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    course: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Trial = mongoose.model("Trial", TrialSchema);

// ==========================
// Routes
// ==========================

app.get("/", (req, res) => {
    res.send("Shakti Dance Studio Backend Running 🚀");
});

app.post("/trial", async (req, res) => {

    try {

        const trial = new Trial({
            name: req.body.name,
            mobile: req.body.mobile,
            course: req.body.course
        });

        await trial.save();

        console.log("✅ New Trial Saved");

        res.json({
            success: true,
            message: "Trial Class Booked Successfully 🎉"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

});

// ==========================
// Server
// ==========================

const PORT = 5000;
// ==========================
// Get All Trials
// ==========================

app.get("/trials", async (req, res) => {

    try {

        const trials = await Trial.find().sort({ createdAt: -1 });

        res.json(trials);

    } catch (err) {

        res.status(500).json({
            message: "Error Fetching Data"
        });

    }

});

// ==========================
// Delete Trial
// ==========================

app.delete("/trial/:id", async (req, res) => {

    try {

        await Trial.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false
        });

    }

});
app.put("/trial/:id", async (req, res) => {
    try {
        await Trial.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            mobile: req.body.mobile,
            course: req.body.course
        });

        res.json({
            success: true,
            message: "Booking Updated Successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Update Failed"
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server Running On Port ${PORT}`);
});
app.get("/trials", async (req, res) => {
    try {
        const trials = await Trial.find().sort({ createdAt: -1 });
        res.json(trials);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching data"
        });
    }
});
// Import the modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create express instance
const app = express(); 

// Define the port
const PORT = 3001; 

// Parse incoming JSON requests
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Define the path to the JSON file
const dataFilePath = path.join(__dirname, "data.json");

// Read data from the JSON file
const readData = () => {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// Write data to the JSON file
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Handle GET request at the root
app.get("/", (req, res) => {
    res.send("Welcome to the Tasklist & Notetaking Application!");
});

// Handle GET request to retrieve stored data
app.get("/data", (req, res) => {
    const data = readData();
    res.json(data);
});

// Handle POST request to save new data with a unique ID
app.post("/data", (req, res) => {
    const newData = { id: uuidv4(), ...req.body };
    const currentData = readData();
    currentData.push(newData);
    writeData(currentData);
    res.json({ message: "Data saved successfully", data: newData });
});

// Handle POST request at the /echo route
app.post("/echo", (req, res) => {
    res.json({ received: req.body });
});

// Wildcards to handle undefined routes
app.all("*", (req, res) => {
    res.status(404).send("Route not found");
});

// Start server and listen on defined port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
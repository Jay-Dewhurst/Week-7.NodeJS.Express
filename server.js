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

// CRUD Operations (PARENT)
// Read and Write functions for the JSON file (CHILD)
const readData = () => {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// CRUD Modular (DRY) helper Function
const asyncHandler = (routeFunction) => {
    return (req, res) => {
        try {
            routeFunction(req, res);
        } catch (error) {
            console.error("Route error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

// CRUD - Create/POST (PARENT)
// Handle POST request to save new data with a unique ID (CHILD)
app.post("/data", (req, res) => {
    const newData = { id: uuidv4(), ...req.body };
    const currentData = readData();
    currentData.push(newData);
    writeData(currentData);
    res.json({ message: "Data saved successfully", data: newData });
});

// Handle POST request at the /echo route (CHILD)
app.post("/echo", (req, res) => {
    res.json({ received: req.body });
});

// CRUD - Read/GET (PARENT)
// Handle GET request at the root (CHILD)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle GET request to retrieve stored data (CHILD)
app.get("/data", (req, res) => {
    const data = readData();
    res.json(data);
});

// Handle GET request to retrieve stored data by ID (CHILD)
app.get("/data/:id", asyncHandler((req, res) => {
    const currentData = readData();
    const note = currentData.find((item) => item.id === req.params.id);

    if (!note) {
        return res.status(404).json({ message: "Note not found" });
        }
    
    res.status(200).json(note);
}));

// CRUD - Update/PUT (PARENT)
// Handle PUT request to update notes by ID (CHILD)
app.put("data/:id", asyncHandler((req, res) => {
    const currentData = readData();
    const index = currentData.findIndex((item) => item.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Note not found" });
    }

    const updateNote = { ...currentData[index], ...req.body, id: currentData[index].id };
    currentData[index] = updateNote;
    writeData(currentData);

    res.status(200).json({ message: "Note updated succesfully", data: updatedNote });
}));

// CRUD Delete/DELETE (PARENT)
// Handle DELETE request to delete notes by ID
app.delete("/data/:id", asyncHandler((req, res) => {
    const currentData = readData();
    const fileteredData = currentData.filter((item) => item.id !== req.params.id);

    if (filteredData.length === currentData.length) {
        return res.status(404).json({ message: "Note not found" });
    }

    writeData(filteredData);
    res.status(200).json({ message: "Note deleted succesfully" });
}));

// Wildcards to handle undefined routes
app.all(/.*/, (req, res) => {
    res.status(404).send("Route not found");
});

// Start server and listen on defined port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
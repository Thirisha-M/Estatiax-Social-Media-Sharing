const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS Headers setup
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.listen(8000, () => console.log("Server running at http://localhost:8000"));

// Serve static files
app.use('/properties', express.static(path.join(__dirname, 'properties')));


// GET Request
app.get('', async (req, res) => {
    res.status(200).json({ "Status": "Connection Successful" });
});

// POST Request for Event Image Upload

app.post('/property-image/:userId/:propertyId', upload.array('images', 10), async (req, res) => {
    const { userId, propertyId } = req.params;  // Get userId and eventId from URL params
    const userFolder = path.join(__dirname, 'properties', userId);  // Create user folder
    const propertyFolder = path.join(userFolder, propertyId);  // Create event folder inside user folder

    try {
        await fs.ensureDir(propertyFolder);  // Ensure directories exist
        let filePaths = [];  // Array to store image URLs
        await Promise.all(req.files.map(async (file) => {
            const filePath = path.join(propertyFolder, file.originalname);  // File path
            await fs.writeFile(filePath, file.buffer);  // Save the file

            // Push the URL to filePaths array
            filePaths.push(`${req.protocol}://${req.get('host')}/properties/${userId}/${propertyId}/${file.originalname}`);

        }
        ));             //  use to store Multiple images
        res.status(200).json({ filePaths })
    } catch (error) {
        res.status(500).json({ error: 'Error saving event images', details: error.message });
    }
})    //    use to post 10 images from via the request

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const axios = require("axios");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs-extra");

const app = express();
const port = 8000;

// Multer Storage for Image Upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CORS Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for uploaded property images
app.use("/properties", express.static(path.join(__dirname, "properties")));

// CORS Headers Setup
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Server Start
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Image Upload API
app.post("/property-image/:userId/:propertyId", upload.array("images", 10), async (req, res) => {
  const { userId, propertyId } = req.params;
  const userFolder = path.join(__dirname, "properties", userId);
  const propertyFolder = path.join(userFolder, propertyId);

  try {
    await fs.ensureDir(propertyFolder); // Ensure directories exist
    let filePaths = []; // Store uploaded file URLs

    await Promise.all(
      req.files.map(async (file) => {
        const filePath = path.join(propertyFolder, file.originalname);
        await fs.writeFile(filePath, file.buffer);
        filePaths.push(`${req.protocol}://${req.get("host")}/properties/${userId}/${propertyId}/${file.originalname}`);
      })
    );

    res.status(200).json({ filePaths });
  } catch (error) {
    res.status(500).json({ error: "Error saving property images", details: error.message });
  }
});

//Twitter API Setup
const oauth = OAuth({
  consumer: {
    key: "cvPxntimFW3510ahSMrblvwN5", 
    secret: "lmzFiGL5YoZPlumP9bZ581egPnM1AAXRlbFVMoIh49xpayEnx4", // API Secret Key
  },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

const callbackUrl =   "https://d5c6-2409-40f4-1001-9e34-989f-11e0-17c1-a7d7.ngrok-free.app";
// const couchDBURL = "https://192.168.57.185:5984/estatiax";
// const userName = "d_couchdb";
// const password = "Welcome#2";

//1) Request Token API
app.get("/twitter-api/request_token", async (req, res) => {
  const requestTokenUrl = "https://api.twitter.com/oauth/request_token";

  try {
    const requestData = {
      url: requestTokenUrl,
      method: "POST",
      data: { oauth_callback: callbackUrl },
    };

    const authHeader = oauth.toHeader(oauth.authorize(requestData));

    const response = await axios.post(requestTokenUrl, null, {
      headers: {
        Authorization: authHeader.Authorization,
        "Content-Type": "application/x-www-form-urlencoded",
        
      },
    });

    const data = new URLSearchParams(response.data);
    const oauth_token = data.get("oauth_token");
    const authorizeUrl = `https://api.twitter.com/oauth/authorize?oauth_token=${oauth_token}`;

    res.json({ oauth_token, authorizeUrl });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get Request Token" });
  }
});

//2) Access Token API
app.get("/twitter-api/access_token", async (req, res) => {
  const { oauth_token, oauth_verifier } = req.query;
  const accessTokenUrl = "https://api.twitter.com/oauth/access_token";

  try {
    const requestData = {
      url: accessTokenUrl,
      method: "POST",
      data: { oauth_token, oauth_verifier },
    };

    const authHeader = oauth.toHeader(oauth.authorize(requestData));

    const response = await axios.post(accessTokenUrl, new URLSearchParams(requestData.data), {
      headers: {
        Authorization: authHeader.Authorization,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessTokenData = new URLSearchParams(response.data);
    const accessToken = accessTokenData.get("oauth_token");
    const accessTokenSecret = accessTokenData.get("oauth_token_secret");

    res.status(200).json({ oauth_token: accessToken, oauth_token_secret: accessTokenSecret });
  } catch (error) {
    console.error("Access Token Error:", error.message);
    res.status(500).json({ error: "Failed to get Access Token" });
  }
});

//3) Post Tweet API
app.post("/twitter-api/post", async (req, res) => {
  const { text, oauth_token, oauth_token_secret } = req.body;
  const endpointURL = "https://api.twitter.com/2/tweets"; // Twitter API v2

  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
  };

  const requestData = {
    url: endpointURL,
    method: "POST",
  };

  const authHeader = oauth.toHeader(oauth.authorize(requestData, token));

  try {
    const response = await axios.post(
      endpointURL,
      { text },
      {
        headers: {
          Authorization: authHeader["Authorization"], // OAuth Header 
          "User-Agent": "v2CreateTweetJS",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Tweet Posted Successfully:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Tweet Post Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Unsuccessful request", details: error.message });
  }
});
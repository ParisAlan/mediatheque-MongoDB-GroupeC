require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
app.use(express.json());

// Sert index.html, style.css, frontend JS
app.use(express.static(path.join(__dirname))); // tous les fichiers statiques

// Connexion à MongoDB
const client = new MongoClient(process.env.MONGODB_URI);
let db;
async function connectDB() {
    try {
        await client.connect();
        db = client.db("semaine3");
        console.log("MongoDB connecté");
    } catch (err) {
        console.error("Erreur MongoDB:", err);
    }
}
connectDB();

// Endpoint pour récupérer tous les livres
app.get("/api/media", async (req, res) => {
    try {
        const movies = db.collection("exercice2");
        const data = await movies.find().toArray();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = app;

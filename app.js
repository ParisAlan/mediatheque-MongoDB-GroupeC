require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());
app.use(express.static('.')); // Sert les fichiers HTML/CSS/JS

// Connexion à MongoDB
const client = new MongoClient(process.env.MONGODB_URI);
let db;
async function connectDB() {
    try {
        await client.connect();
        db = client.db("semaine3");
        console.log("MongoDB connecté !");
    } catch (err) {
        console.error("Erreur MongoDB:", err);
    }
}
connectDB();

// Récupérer 9 livres suivant la page et la limit determiné
app.get("/api/media", async (req, res) => {
    try {
        const movies = db.collection("exercice2");

        // Récupère page et limit depuis l'URL, sinon valeurs par défaut
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const text = req.query.text || '';
        const skip = (page - 1) * limit;
        const order = req.query.order || 1;
        const dispo = req.query.dispo || '';

        const query = {
            "fields.titre_avec_lien_vers_le_catalogue": {
                $regex: `^${text}`,
                $options: "i"
            }
        };

        // Suivant le filtre, on utilise une valeur différente :
        let tri = { "fields.titre_avec_lien_vers_le_catalogue": 1 };
        if (order === "za") {
            tri = { "fields.titre_avec_lien_vers_le_catalogue": -1 };
        } else if (order === "resa") {
            tri = { "fields.nombre_de_reservations": -1 };
        } else if (order === "aser") {
            tri = { "fields.nombre_de_reservations": 1 };
        }

        // Suivant la recherche de disponibilités dans les filtres :

        if (dispo === "disponible") {
            query.FIELD9 = "";
        } else if (dispo === "emprunte") {
            query.FIELD9 = { $ne: "" };
        }

        // Récupération depuis MongoDB

            const data = await movies.find(query).sort(tri).skip(skip).limit(limit).toArray();

            res.json({ data });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Compter le nombre total de médias
app.get("/api/count", async (req, res) => {
    try {
        const movies = db.collection("exercice2");
        const total = await movies.countDocuments();
        res.json({ total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Emprunter un livre (remplit FIELD9 avec la date actuelle)

app.post("/api/media/:rang/emprunter", async (req, res) => {
    try {
        const movies = db.collection("exercice2");
        const rang = parseInt(req.params.rang);

        const result = await movies.updateOne(
            { "fields.rang": rang },   // Permet de trouver avec un rang spécifique
            { $set: { FIELD9: new Date() } }
        );

        res.json({ result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/media/:rang/retourner", async (req, res) => {
    try {
        const movies = db.collection("exercice2");
        const rang = parseInt(req.params.rang);

        const result = await movies.updateOne(
            { "fields.rang": rang },   // Permet de trouver avec un rang spécifique
            { $set: { FIELD9: "" } }
        );

        res.json({ result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const path = require('path');

app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, 'stats.html'));
});

app.get('/api/stats', async (req, res) => {
    try {

        const col = db.collection("exercice2");

        const resultatsGlobal = await col.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    resas: { $sum: "$fields.nombre_de_reservations" }
                }
            }
        ]).toArray();

        const resultatsType = await col.aggregate([
            {
                $group: {
                    _id: "$fields.type_de_document",
                    nombre: { $sum: 1 }
                }
            },
            { $sort: { nombre: -1 } }
        ]).toArray();

        const statsReservations = await col.aggregate([
            {
                $group: {
                    _id: "$fields.type_de_document",
                    nbDocs: { $sum: 1 },
                    totalResas: { $sum: "$fields.nombre_de_reservations" }
                }
            },
            { $sort: { totalResas: -1 } }
        ]).toArray();

        const topAuteurs = await col.aggregate([
            {
                $group: {
                    _id: "$fields.auteur",
                    nombre: { $sum: 1 }
                }
            },
            { $sort: { nombre: -1 } },
            { $limit: 10 }
        ]).toArray();

        const info = resultatsGlobal.length > 0 ? resultatsGlobal[0] : { total: 0, resas: 0 };

        res.json({
            nbTotal: info.total,
            nbResa: info.resas,
            nbTypes: resultatsType.length,
            listeTypes: resultatsType,
            classementResas: statsReservations,
            topAuteurs: topAuteurs
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Erreur de chargement" });
    }
});



module.exports = app;

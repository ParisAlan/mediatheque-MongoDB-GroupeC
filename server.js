const app = require("./app");
const { MongoClient } = require('mongodb');
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});

const path = require('path');

app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, 'stats.html'));
});

app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, 'stats.html'));
});

app.get('/api/stats', async (req, res) => {
    try {
        await client.connect();
        
        const db = client.db("semaine3");
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

        const info = resultatsGlobal.length > 0 ? resultatsGlobal[0] : { total: 0, resas: 0 };

        res.json({
            nbTotal: info.total,
            nbResa: info.resas,
            nbTypes: resultatsType.length,
            listeTypes: resultatsType
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Erreur de charfgement" });
    }
});
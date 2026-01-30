document.addEventListener('DOMContentLoaded', () => {
    chargerDonnees();

    document.getElementById('btn-maj').addEventListener('click', () => {
        location.reload();
    });
});

async function chargerDonnees() {
    try {
        const reponse = await fetch('/api/stats');
        const donnees = await reponse.json();

        document.getElementById('message-info').innerText = "✅ Statistiques chargées avec succès";
        
        document.getElementById('txt-total').innerText = donnees.nbTotal;
        document.getElementById('txt-types').innerText = donnees.nbTypes;
        document.getElementById('txt-resa').innerText = donnees.nbResa;

      
        const divListe = document.getElementById('liste-stats');
        divListe.innerHTML = '';

        let maxDocs = 0;
        if (donnees.listeTypes.length > 0) {
            maxDocs = donnees.listeTypes[0].nombre;
        }

        donnees.listeTypes.forEach((element, index) => {
            const nom = element._id || "Non défini";
            const nb = element.nombre;
            const pourcent = maxDocs > 0 ? (nb / maxDocs) * 100 : 0;
            
            // Rotation entre 7 couleurs
            const numCouleur = (index % 7) + 1; 

            divListe.innerHTML += `
                <div class="ligne-type">
                    <div class="titre-type">${nom}</div>
                    <div class="fond-barre">
                        <div class="barre couleur${numCouleur}" style="width: ${pourcent}%;">
                            ${nb}
                        </div>
                    </div>
                </div>
            `;
        });

        
        const divResa = document.getElementById('liste-reservations');
        divResa.innerHTML = ''; 
        
        let maxResa = 0;
        if (donnees.classementResas && donnees.classementResas.length > 0) {
            maxResa = donnees.classementResas[0].totalResas;
        }
        
        if (donnees.classementResas) {
            donnees.classementResas.forEach((item, index) => {
                const nom = item._id || "Non défini";
                const total = item.totalResas;
                const nbDocs = item.nbDocs;
                const moyenne = (nbDocs > 0) ? (total / nbDocs).toFixed(2) : 0;
                const pourcent = maxResa > 0 ? (total / maxResa) * 100 : 0;
                
                // Rotation entre 7 couleurs
                const numCouleur = (index % 7) + 1;
                
                divResa.innerHTML += `
                    <div class="ligne-type">
                        <div class="titre-type">${nom}</div>
                        
                        <div class="fond-barre">
                            <div class="barre couleur${numCouleur}" style="width: ${pourcent}%;">
                                ${total} réservations
                            </div>
                        </div>

                        <div class="details-stat">
                            ${nbDocs} document(s) • Moyenne: ${moyenne} réservation(s) par document
                        </div>
                    </div>
                `;
            });
        }

      
        const divAuteurs = document.getElementById('liste-auteurs');
        divAuteurs.innerHTML = ''; 
        
        let maxAuteur = 0;
        if (donnees.topAuteurs && donnees.topAuteurs.length > 0) {
            maxAuteur = donnees.topAuteurs[0].nombre;
        }

        if (donnees.topAuteurs) {
            donnees.topAuteurs.forEach((item, index) => {
                const nom = item._id || "Non défini";
                const nb = item.nombre;
                const pourcent = maxAuteur > 0 ? (nb / maxAuteur) * 100 : 0;
                
                // Rotation entre 7 couleurs
                const numCouleur = (index % 7) + 1;

                divAuteurs.innerHTML += `
                    <div class="ligne-type">
                        <div class="titre-type">${nom}</div>
                        <div class="fond-barre">
                            <div class="barre couleur${numCouleur}" style="width: ${pourcent}%;">
                                ${nb}
                            </div>
                        </div>
                    </div>
                `;
            });
        }

    } catch (err) {
        console.log(err);
        document.getElementById('message-info').innerText = "❌ Erreur de chargement";
        document.getElementById('message-info').style.backgroundColor = "#f8d7da";
        document.getElementById('message-info').style.color = "#721c24";
    }
}
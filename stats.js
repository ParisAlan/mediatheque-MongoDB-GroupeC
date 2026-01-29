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

        let max = 0;
        if (donnees.listeTypes.length > 0) {
            max = donnees.listeTypes[0].nombre;
        }

        donnees.listeTypes.forEach((element, index) => {
            const nom = element._id || "Non défini";
            const nb = element.nombre;
            const pourcent = (nb / max) * 100;
            
            const numCouleur = (index % 5) + 1; 

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
        if (donnees.classementResas) {
            donnees.classementResas.forEach((item, index) => {
                const nom = item._id || "Non défini";
                const total = item.totalResas;
                const nbDocs = item.nbDocs;
                const moyenne = (nbDocs > 0) ? (total / nbDocs).toFixed(2) : 0;
                const pourcent = (total / maxResa) * 100;
                const numCouleur = (index % 5) + 1;
                divResa.innerHTML += `
                    <div class="ligne-type">
                        <div class="titre-type">${nom}</div>
                        
                        <div class="fond-barre">
                            <div class="barre couleur${numCouleur}" style="width: ${pourcent}%;">
                                ${total}
                            </div>
                        </div>

                        <div class="details-stat" style="font-size: 0.8em; color: #666; margin-top: 2px;">
                            ${nbDocs} doc(s) • Moyenne: ${moyenne} / doc
                        </div>
                    </div>
                `;
            });
        }

    } catch (err) {
        console.log(err);
        document.getElementById('message-info').innerText = "Erreur de chargement";
    }
}

// VARIABLES & CONSTANTES

let currentPage = 1;
const limit = 9;
let paginationMax = 1;
let texte = "";
let order = "";
let dispo = "";

// SUITE AU CHARGEMENT DU DOM
document.addEventListener("DOMContentLoaded", () => {

    // FILTRE 1 : RECHERCHE AVEC INPUT SPE
    document.getElementById("searchInput").addEventListener("input", (e) => {
        texte = e.target.value;
        currentPage = 1;
        loadBooks(currentPage).then(r => {} );
    });

    // FILTRE 2 : ALPHABETIQUE / REVERSE OU AUTRES ?
    document.getElementById("sortSelect").addEventListener("change", (e) => {
        order = e.target.value;
        console.log(order)
        loadBooks(currentPage).then(r => {} );
    });

    // FILTRE 3 : DISPO OU PAS DISPO ?
    document.getElementById("disponibiliteSelect").addEventListener("change", (e) => {
        dispo = e.target.value;
        console.log(dispo)
        loadBooks(currentPage).then(r => {} );
    })

    afficherTotal();  // récupère total et paginationMax
    loadBooks(currentPage); // charge la première page
    setupPagination();      // initialise boutons
});

async function loadBooks(page = 1) {
    try {
        const res = await fetch(`/api/media?page=${page}&limit=${limit}&text=${texte}&order=${order}&dispo=${dispo}`);
        const data = await res.json();

        document.getElementById('message-info').innerText = "✅ Documents chargées avec succès";

        const container = document.getElementById("livres");
        container.innerHTML = ""; // vide le conteneur des anciens résultats quand on change de page

        data.data.forEach(book => {
            const div = document.createElement("div");

            let infoHTML = "";
            const button = document.createElement("button");

            if (book.FIELD9 ) {
                button.textContent = "Retourner";
                button.className = "btn-retour";

                infoHTML = `<span class="pas-dispo">📤 Emprunté</span>`;

                button.addEventListener("click", () => retournerLivre(book.fields.rang));
            } else {
                button.textContent = "Emprunter";
                button.className = "btn-emprunt";

                infoHTML = `<span class="dispo">✅ Disponible</span>`;

                button.addEventListener("click", () => emprunterLivre(book.fields.rang));
            }

            div.innerHTML = `
                <h2>${book.fields.titre_avec_lien_vers_le_catalogue}</h2>
                ${infoHTML}
                <p><strong>Auteur:</strong> ${book.fields.auteur}</p>
                <p><strong>Type:</strong> ${book.fields.type_de_document}</p>
                <p><strong>Réservations:</strong> ${book.fields.nombre_de_reservations}</p>
                <p><strong>Rang:</strong> ${book.fields.rang}</p>
                <p><strong>ID:</strong> ${book._id}</p>
            `;

            div.appendChild(button); // on ajoute le bouton réel
            container.appendChild(div);
        });

        // Met à jour les infos de page
        const pageInfo = document.getElementById('pageInfo');
        pageInfo.textContent = `Page ${currentPage} / ${paginationMax}`;

    } catch (err) {
        console.error(err);
        const container = document.getElementById("livres");
        if (container) container.textContent = "Erreur serveur";
    }
}

async function afficherTotal() {
    const res = await fetch("/api/count");
    const data = await res.json();
    document.getElementById("total").textContent = `Nombre total de médias : ${data.total}`;

    paginationMax = Math.ceil(data.total / limit); // met à jour la variable globale
}

// ON RAJOUTE L'ÉCOUTE DES CLICS SUR LES BOUTONS
function setupPagination() {
    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentPage < paginationMax) {
            currentPage++;
            loadBooks(currentPage);
        }
    });
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadBooks(currentPage);
        }
    });
}

async function emprunterLivre(bookRang) {
    try {
        await fetch(`/api/media/${bookRang}/emprunter`, { method: "POST" });
        loadBooks(currentPage); // refresh après emprunt
    } catch (err) {
        console.error(err);
    }
}

async function retournerLivre(bookRang) {
    try {
        await fetch(`/api/media/${bookRang}/retourner`, { method: "PUT" });
        loadBooks(currentPage); // refresh après retour
    } catch (err) {
        console.error(err);
    }
}

// HALISON : Fonction pour afficher le Top 5 dans une alerte ou console pour tester vite
document.getElementById("btnTop5")?.addEventListener("click", async () => {
    const res = await fetch("/api/top5-reservations");
    const top5 = await res.json();
    
    let message = "🏆 TOP 5 DES RÉSERVATIONS :\n\n";
    top5.forEach((book, index) => {
        message += `${index + 1}. ${book.fields.titre_avec_lien_vers_le_catalogue} (${book.fields.nombre_de_reservations} résas)\n`;
    });
    alert(message);
});



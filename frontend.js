let currentPage = 1;
const limit = 9;
let paginationMax = 1;
let texte = "";

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("searchInput").addEventListener("input", (e) => {
        texte = e.target.value;
        currentPage = 1;
        loadBooks(currentPage).then(r => {} );
    });
});

async function loadBooks(page = 1) {
    try {
        const res = await fetch(`/api/media?page=${page}&limit=${limit}&text=${texte}`);
        const data = await res.json();

        const container = document.getElementById("livres");
        container.innerHTML = ""; // vide le conteneur des anciens résultats quand on change de page

        data.data.forEach(book => {
            const div = document.createElement("div");

            let buttonHTML = "";
            let infoHTML = "";
            if (!book.fields.FIELD9) {
                buttonHTML = `<button>Emprunter</button>`;
                infoHTML = `<span class="dispo">✅ Disponible</span>`;
            } else {
                buttonHTML = `<button>Retourner</button>`;
                infoHTML = `<span class="pas-dispo">📤 Emprunté</span>`;
            }

            div.innerHTML = `
                <h2>${book.fields.titre_avec_lien_vers_le_catalogue}</h2>
                ${infoHTML}
                <p><strong>Auteur:</strong> ${book.fields.auteur }</p>
                <p><strong>Type:</strong> ${book.fields.type_de_document }</p>
                <p><strong>Réservations:</strong> ${book.fields.nombre_de_reservations }</p>
                <p><strong>Rang:</strong> ${book.fields.rang }</p>
                <p><strong>ID:</strong> ${book._id}</p>
                ${buttonHTML}
            `;

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

document.addEventListener("DOMContentLoaded", async () => {
    await afficherTotal();  // récupère total et paginationMax
    loadBooks(currentPage); // charge la première page
    setupPagination();      // initialise boutons
});

async function loadBooks() {
    try {
        const res = await fetch("/api/media");
        const data = await res.json();

        const container = document.getElementById("livres");

        data.forEach(book => {
            const div = document.createElement("div");

            div.innerHTML = `
                <h2>${book.fields.titre_avec_lien_vers_le_catalogue}</h2>
                <p><strong>Auteur:</strong> ${book.fields.auteur }</p>
                <p><strong>Type:</strong> ${book.fields.type_de_document }</p>
                <p><strong>Réservations:</strong> ${book.fields.nombre_de_reservations }</p>
                <p><strong>Rang:</strong> ${book.fields.rang }</p>
                <p><strong>ID:</strong> ${book._id}</p>
            `;

            // Si FIELD9 est vide, on ajoute un bouton qui permet de emprunter
            if (!book.fields.FIELD9) {
                const button = document.createElement("button");
                button.textContent = "Emprunter";
                button.onclick = () => {
                    alert(`Vous avez emprunté: ${book.fields.titre_avec_lien_vers_le_catalogue}`);
                    // ici tu pourrais faire un fetch PUT/POST pour mettre à jour FIELD9 dans Mongo
                };
                div.appendChild(button);
            } else {
                const button = document.createElement("button");
                button.textContent = "Retourner";
            }

            container.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        const container = document.getElementById("livres");
        if (container) container.textContent = "Erreur serveur";
    }
}

loadBooks().then(r => {} );

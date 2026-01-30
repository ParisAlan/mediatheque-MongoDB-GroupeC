// Gestion de l'affichage du formulaire
document.getElementById('btnShowForm').addEventListener('click', () => {
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('btnShowForm').style.display = 'none';
});

document.getElementById('btnCancel').addEventListener('click', () => {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('btnShowForm').style.display = 'block';
    document.getElementById('userForm').reset();
});

// Charger les utilisateurs
async function loadUsers() {
    const res = await fetch("/api/users");
    const users = await res.json();

    const tbody = document.getElementById("usersList");
    tbody.innerHTML = "";

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-message">Aucun utilisateur pour le moment</td></tr>';
        return;
    }

    users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${user.email}</td>
            <td>${user.password}</td>
            <td>
                <button class="btn-icon btn-edit" onclick="editUser('${user._id}', '${user.email}', '${user.password}')">
                    ✏️
                </button>
            </td>
            <td>
                <button class="btn-icon btn-delete" onclick="deleteUser('${user._id}')">
                    🗑️
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Supprimer un utilisateur
async function deleteUser(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
        return;
    }
    
    try {
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        await loadUsers();
    } catch (error) {
        alert("Erreur lors de la suppression");
    }
}

// Ajouter un utilisateur
document.getElementById("userForm").addEventListener("submit", async e => {
    e.preventDefault();

    const user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {
        await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        e.target.reset();
        document.getElementById('formSection').style.display = 'none';
        document.getElementById('btnShowForm').style.display = 'block';
        await loadUsers();
    } catch (error) {
        alert("Erreur lors de l'ajout");
    }
});

// Modifier un utilisateur
async function editUser(id, email, password) {
    const newEmail = prompt("Nouveau email :", email);
    if (!newEmail) return;
    
    const newPassword = prompt("Nouveau mot de passe :", password);
    if (!newPassword) return;

    try {
        await fetch(`/api/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: newEmail,
                password: newPassword
            })
        });

        loadUsers();
    } catch (error) {
        alert("Erreur lors de la modification");
    }
}


loadUsers();
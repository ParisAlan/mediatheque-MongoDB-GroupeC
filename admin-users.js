async function loadUsers() {
    const res = await fetch("/api/users");
    const users = await res.json();

    const list = document.getElementById("usersList");
    list.innerHTML = "";

    users.forEach(user => {
        const li = document.createElement("li");
        li.innerHTML = `
    <span id="user-${user._id}">
        ${user.email} (${user.password})
    </span>
    <button onclick="editUser('${user._id}', '${user.email}', '${user.password}')">
        Modifier
    </button>
    <button onclick="deleteUser('${user._id}')">
        Supprimer
    </button>
`;
        list.appendChild(li);
    });
}

async function deleteUser(id) {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    await loadUsers();
}

document.getElementById("userForm").addEventListener("submit", async e => {
    e.preventDefault();

    const user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });

    e.target.reset();
    await loadUsers();
});

loadUsers();

async function editUser(id, email, password) {
    const newEmail = prompt("Nouveau email :", email);
    const newPassword = prompt("Nouveau mot de passe :", password);

    if (!newEmail || !newPassword) return;

    await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: newEmail,
            password: newPassword
        })
    });

    loadUsers();
}
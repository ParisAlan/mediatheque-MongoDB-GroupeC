async function loadUsers() {
    const res = await fetch("/api/users");
    const users = await res.json();

    const list = document.getElementById("usersList");
    list.innerHTML = "";

    users.forEach(user => {
        const li = document.createElement("li");
        li.innerHTML = `
    <span id="user-${user._id}">
        ${user.name} (${user.email})
    </span>
    <button onclick="editUser('${user._id}', '${user.name}', '${user.email}')">
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
    loadUsers();
}

document.getElementById("userForm").addEventListener("submit", async e => {
    e.preventDefault();

    const user = {
        name: name.value,
        email: email.value
    };

    await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });

    e.target.reset();
    loadUsers();
});

loadUsers();

async function editUser(id, name, email) {
    const newName = prompt("Nouveau nom :", name);
    const newEmail = prompt("Nouvel email :", email);

    if (!newName || !newEmail) return;

    await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: newName,
            email: newEmail
        })
    });

    loadUsers();
}
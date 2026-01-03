const API = "http://localhost:8080/api/products";
async function loadInventory(){
    const res = await fetch(API);
    const products = await res.json();

    const tbody = document.getElementById("inventory");
    tbody.innerHTML = "";

    products.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${p.name}</td>
            <td>${p.quantity}</td>
            <td>
                <button onclick="removeOne(${p.id})">Remove 1</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
async function removeOne(id){
    const res = await fetch(`${API}/${id}/remove`, {method: "POST"});
    if(!res.ok) {
        alert(await res.text());
        return;
    }
    loadInventory();
}
document.getElementById("addForm").addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const quantity = Number(document.getElementById("quantity").value);

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity })
    });

    e.target.reset();
    loadInventory();
})

loadInventory();
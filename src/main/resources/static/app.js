const API = "http://localhost:8080/api/products";
async function loadInventory(){
    const res = await fetch(API);
    const products = await res.json();
    products.sort((a, b) => a.name.localeCompare(b.name));

    const tbody = document.getElementById("inventory");
    tbody.innerHTML = "";

    products.forEach(p => {
        const row = document.createElement("tr");
        const total = products.reduce((sum, p) => sum + p.quantity, 0);
        document.getElementById("totalQty").textContent = total;
        if(p.quantity <= 3){
            row.classList.add("low-stock");
        }
        row.innerHTML = `
            <td>${p.name}</td>
            <td>${p.quantity}</td>
            <td>
                <button onclick="removeOne(${p.id})">Remove 1</button>
            </td>
            <td>
                <input
                    type = "number"
                    min = "1" 
                    placeholder="Qty"
                    class ="remove-input"
                    onkeydown="handleBulkRemove(event, ${p.id})"
                    style="width: 70px;"
                />
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

async function handleBulkRemove(event, id) {
    if (event.key !== "Enter") return;

    const amount = Number(event.target.value);

    if (!Number.isInteger(amount) || amount <= 0) {
        alert("Enter a valid quantity");
        return;
    }

    const res = await fetch(`${API}/${id}/remove/${amount}`, {
        method: "POST"
    });

    if (!res.ok) {
        alert(await res.text());
        return;
    }

    event.target.value = "";
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
const api = async (url, options = {}) => {
    const response = await fetch(`/api${url}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok)
        throw new Error(
            payload.message ||
                payload.errors?.join(", ") ||
                "La solicitud no pudo completarse.",
        );
    return payload;
};
const escapeHtml = (value = "") =>
    String(value).replace(
        /[&<>'"]/g,
        (character) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;",
            })[character],
    );
const money = (value) =>
    new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
const showToast = (message, isError = false) => {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3200);
};
const formDataObject = (form) =>
    Object.fromEntries(new FormData(form).entries());
const run = (task) => task().catch((error) => showToast(error.message, true));

document.addEventListener("DOMContentLoaded", () => {
    const today = document.querySelector("#today");
    if (today)
        today.textContent = new Intl.DateTimeFormat("es-CL", {
            dateStyle: "long",
        }).format(new Date());
    document
        .querySelector("#menuButton")
        ?.addEventListener("click", () =>
            document.querySelector("#sidebar").classList.toggle("open"),
        );
    document.querySelectorAll("[data-filter]").forEach((input) =>
        input.addEventListener("input", () =>
            document
                .querySelectorAll(`${input.dataset.filter} tbody tr`)
                .forEach((row) => {
                    row.hidden = !row.textContent
                        .toLowerCase()
                        .includes(input.value.toLowerCase());
                }),
        ),
    );
    const page = document.body.dataset.page;
    if (page === "dashboard") loadDashboard();
    if (page === "users") loadUsers();
    if (page === "products") loadProducts();
    if (page === "categories") loadCategories();
    if (page === "sales") loadSales();
    if (page === "profiles") setupProfiles();
});
async function loadDashboard() {
    const results = await Promise.all([
        api("/products"),
        api("/users"),
        api("/sales"),
    ]);
    ["products", "users", "sales"].forEach((key, index) => {
        document.querySelector(`[data-stat="${key}"]`).textContent =
            results[index][key]?.length ?? 0;
    });
}
async function loadUsers() {
    const payload = await api("/users");
    const rows = document.querySelector("#usersRows");
    rows.innerHTML =
        (payload.users || [])
            .map(
                (user) =>
                    `<tr><td><strong>${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}</strong><small class="d-block text-muted">ID ${user.id}</small></td><td>${escapeHtml(user.rut)}</td><td>${escapeHtml(user.email)}</td><td>${escapeHtml(user.profile?.username || user.username || "-")}</td><td class="text-end"><button class="table-action" data-action="delete-user" data-id="${user.id}" title="Eliminar">×</button></td></tr>`,
            )
            .join("") ||
        '<tr><td colspan="5" class="empty-state">No hay usuarios registrados.</td></tr>';
    bindDelete(rows, "users", "Usuario");
}
function bindDelete(rows, resource, label) {
    rows.addEventListener(
        "click",
        (event) => {
            const button = event.target.closest("[data-action]");
            if (button)
                run(async () => {
                    if (!confirm(`¿Eliminar este ${label.toLowerCase()}?`))
                        return;
                    await api(`/${resource}/${button.dataset.id}`, {
                        method: "DELETE",
                    });
                    showToast(`${label} eliminado.`);
                    resource === "users" ? loadUsers() : loadProducts();
                });
        },
        { once: true },
    );
}
document.querySelector("#userForm")?.addEventListener("submit", (event) =>
    run(async () => {
        event.preventDefault();
        await api("/users", {
            method: "POST",
            body: JSON.stringify(formDataObject(event.target)),
        });
        bootstrap.Modal.getInstance(
            document.querySelector("#userModal"),
        ).hide();
        event.target.reset();
        showToast("Usuario creado correctamente.");
        loadUsers();
    }),
);
async function loadProducts() {
    const payload = await api("/products");
    const rows = document.querySelector("#productsRows");
    rows.innerHTML =
        (payload.products || [])
            .map(
                (product) =>
                    `<tr><td><strong>${escapeHtml(product.name)}</strong><small class="d-block text-muted">ID ${product.id}</small></td><td>${escapeHtml(product.category?.name || "Sin categoría")}</td><td>${money(product.price)}</td><td><span class="${product.stock < 5 ? "badge-stock badge-low" : "badge-stock"}">${product.stock} un.</span></td><td class="text-end"><button class="table-action" data-action="delete-product" data-id="${product.id}" title="Eliminar">×</button></td></tr>`,
            )
            .join("") ||
        '<tr><td colspan="5" class="empty-state">No hay productos registrados.</td></tr>';
    bindDelete(rows, "products", "Producto");
    setupSaleProducts(payload.products || []);
}
document.querySelector("#productForm")?.addEventListener("submit", (event) =>
    run(async () => {
        event.preventDefault();
        const data = formDataObject(event.target);
        ["price", "stock", "categoryId"].forEach((key) => {
            if (data[key] === "") delete data[key];
            else data[key] = Number(data[key]);
        });
        await api("/products", { method: "POST", body: JSON.stringify(data) });
        bootstrap.Modal.getInstance(
            document.querySelector("#productModal"),
        ).hide();
        event.target.reset();
        showToast("Producto creado correctamente.");
        loadProducts();
    }),
);
async function loadCategories() {
    const payload = await api("/categories");
    document.querySelector("#categoriesGrid").innerHTML =
        (payload.categories || [])
            .map(
                (category) =>
                    `<div class="category-item"><span>${escapeHtml(category.name)}</span><small>ID ${category.id}</small></div>`,
            )
            .join("") ||
        '<p class="empty-state">No hay categorías registradas.</p>';
}
document.querySelector("#categoryForm")?.addEventListener("submit", (event) =>
    run(async () => {
        event.preventDefault();
        await api("/categories", {
            method: "POST",
            body: JSON.stringify(formDataObject(event.target)),
        });
        event.target.reset();
        showToast("Categoría creada correctamente.");
        loadCategories();
    }),
);
async function loadSales() {
    const [payload, products] = await Promise.all([
        api("/sales"),
        api("/products"),
    ]);
    setupSaleProducts(products.products || []);
    const rows = document.querySelector("#salesRows");
    rows.innerHTML =
        (payload.sales || [])
            .map(
                (sale) =>
                    `<tr><td><strong>#${sale.id}</strong></td><td>${escapeHtml(sale.customer ? `${sale.customer.firstName} ${sale.customer.lastName}` : "Venta mostrador")}</td><td>${new Date(sale.date).toLocaleDateString("es-CL")}</td><td>${money(sale.total)}</td><td><button class="table-action" data-action="sale-detail" data-id="${sale.id}" title="Ver detalle">→</button></td></tr>`,
            )
            .join("") ||
        '<tr><td colspan="5" class="empty-state">No hay ventas registradas.</td></tr>';
    rows.addEventListener(
        "click",
        (event) => {
            const button = event.target.closest("[data-action]");
            if (button)
                run(async () => {
                    const detail = await api(`/sales/${button.dataset.id}`);
                    showToast(
                        `Venta #${detail.sale.id}: ${detail.sale.details?.length || 0} productos.`,
                    );
                });
        },
        { once: true },
    );
}
let cart = [];
function setupSaleProducts(products) {
    const select = document.querySelector("#saleProduct");
    if (!select) return;
    select.innerHTML = products
        .map(
            (product) =>
                `<option value="${product.id}" data-price="${product.price}">${escapeHtml(product.name)} (${product.stock} disponibles)</option>`,
        )
        .join("");
}
document.querySelector("#addCart")?.addEventListener("click", () => {
    const select = document.querySelector("#saleProduct");
    if (!select.value) return;
    const quantity = Number(document.querySelector("#saleQuantity").value);
    const existing = cart.find(
        (item) => item.productId === Number(select.value),
    );
    if (existing) existing.quantity += quantity;
    else
        cart.push({
            productId: Number(select.value),
            productName: select.selectedOptions[0].textContent.split(" (")[0],
            price: Number(select.selectedOptions[0].dataset.price),
            quantity,
        });
    renderCart();
});
function renderCart() {
    document.querySelector("#cartCount").textContent =
        `${cart.reduce((sum, item) => sum + item.quantity, 0)} artículos`;
    document.querySelector("#cartItems").innerHTML =
        cart
            .map(
                (item, index) =>
                    `<div class="cart-row"><span>${escapeHtml(item.productName)} × ${item.quantity}</span><strong>${money(item.price * item.quantity)} <button type="button" data-remove-cart="${index}">×</button></strong></div>`,
            )
            .join("") ||
        '<p class="empty-state">Agrega productos al carrito.</p>';
    document.querySelector("#saleTotal").textContent = money(
        cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    );
}
document.querySelector("#cartItems")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-cart]");
    if (button) {
        cart.splice(Number(button.dataset.removeCart), 1);
        renderCart();
    }
});
document.querySelector("#saleForm")?.addEventListener("submit", (event) =>
    run(async () => {
        event.preventDefault();
        if (!cart.length)
            throw new Error("Agrega al menos un producto al carrito.");
        await api("/sales", {
            method: "POST",
            body: JSON.stringify({
                userId: Number(event.target.userId.value),
                cart: cart.map(({ productId, quantity }) => ({
                    productId,
                    quantity,
                })),
            }),
        });
        event.target.reset();
        cart = [];
        renderCart();
        showToast("Venta registrada correctamente.");
        loadSales();
    }),
);
function setupProfiles() {
    document
        .querySelector("#profileForm")
        ?.addEventListener("submit", (event) =>
            run(async () => {
                event.preventDefault();
                const data = formDataObject(event.target);
                const profile = await api(`/profiles/${data.id}`);
                const result = document.querySelector("#profileResult");
                result.innerHTML = profile.profile
                    ? `Username actual: <strong>${escapeHtml(profile.profile.username)}</strong>`
                    : "No se encontró el perfil.";
                await api(`/profiles/${data.id}`, {
                    method: "PUT",
                    body: JSON.stringify({ username: data.username }),
                });
                result.innerHTML += `<br><span class="text-success">Actualizado a <strong>${escapeHtml(data.username)}</strong>.</span>`;
                showToast("Perfil actualizado correctamente.");
            }),
        );
}

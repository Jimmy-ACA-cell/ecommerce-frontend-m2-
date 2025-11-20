// Datos de productos 
const PRODUCTS = [
    {
        id: "m1",
        title: "Máquina Espresso Pro 2 Grupos",
        price: 3499000,
        img: "assets/img/maquina1.png",
        category: "Máquinas",
        description: "Máquina profesional de 2 grupos, ideal para cafeterías con volumen medio-alto."
    },
    {
        id: "m2",
        title: "Molino Comercial 75mm",
        price: 499900,
        img: "assets/img/grinder1.png",
        category: "Molinos",
        description: "Molino con muelas de 75mm para molienda consistente y duradera."
    },
    {
       id: "t1",
        title: "Tostadora 5kg",
        price: 2899900,
        img: "assets/img/roaster1.png", 
        category: "Tostadoras",
        description: "Tostadora para pequeños lotes, control de perfil y refrigeración rápida."
    },
    {
        id: "a1",
        title: "Tamper profesional 58mm",
        price: 39990,
        img: "assets/img/tamper.png",
        category: "Accesorios",
        description: "Tamper ergonómico con base niveladora y acabado en acero inoxidable."
    },
    {
        id: "a2",
        title: "balanza de precisión 0.1g",
        price: 89990,
        img: "assets/img/balanza1.png",
        category: "Accesorios",
        description: "Tamper ergonómico con base niveladora y acabado en acero inoxidable."
    },
    {
        id: "c1",
        title: "Café Especial - Colombia 1kg",
        price: 24990,
        img: "assets/img/cafecolombia1.png",
        category: "Café",
        description: "Café de especialidad, tueste medio, notas a caramelo y cítricos."
    },
    {
        id: "c2",
        title: "Café verde Especial - Colombia 1kg",
        price: 24990,
        img: "assets/img/cafevcolombia1.png",
        category: "Café",
        description: " Café verde de especialidad, grano sin tostar, notas a té verde y sutiles toques herbales."
    },
    {
        id: "c3",
        title: "Café Especialidad - Sello de autor 1kg",
        price: 24990,
        img: "assets/img/cafeVerdeSA.png",
        category: "Café",
        description: "Café de especialidad, tueste oscuro, notas a chocolate amargo y nuez."
    }
];

// Helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function formatPrice(n) {
    // Formato moneda CLP separación miles con punto y signo peso
    return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Carrito 
const CART_KEY = "sc_cart_v1";

function loadCart() {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = loadCart();
    const count = Object.values(cart).reduce((s, i) => s + i.qty, 0);
    const badges = $$('#cart-badge');
    badges.forEach(b => b.textContent = count);
}

//Render index productos
function renderProductsGrid() {
    const grid = $('#products-grid');
    if (!grid) return;
    grid.innerHTML = '';
    PRODUCTS.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4 mb-4';
        col.innerHTML = `
      <article class="card card-product h-100">
        <img src="${p.img}" class="card-img-top" alt="${p.title}" style="height:220px; object-fit:cover; border-top-left-radius:14px; border-top-right-radius:14px;">
        <div class="card-body">
          <h5 class="card-title text-white">${p.title}</h5>
          <p class="card-text text-muted small mb-2">${p.category}</p>
          <p class="price">${formatPrice(p.price)}</p>
          <div class="d-flex justify-content-between mt-3">
            <a href="productos.html?id=${p.id}" class="btn btn-outline-light">Ver más</a>
            <button class="btn btn-warning add-btn" data-id="${p.id}">Agregar</button>
          </div>
        </div>
      </article>`;
        grid.appendChild(col);
    });

    // Listeners botones agregar
    $$('.add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            addToCart(id);
        });
    });
}

//Render detalle de productos
function renderProductDetail() {
    const el = $('#product-detail');
    if (!el) return;
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) {
        el.innerHTML = `<div class="col-12"><p>Producto no encontrado</p></div>`;
        return;
    }
    el.innerHTML = `
    <div class="col-md-6">
      <img src="${p.img}" class="img-fluid rounded" alt="${p.title}" style="max-height:420px; object-fit:cover;">
    </div>
    <div class="col-md-6">
      <h2>${p.title}</h2>
      <p class="text-muted">${p.category}</p>
      <h3 class="price">${formatPrice(p.price)}</h3>
      <p>${p.description}</p>
      <div class="mt-4">
        <button class="btn btn-warning btn-lg" id="detail-add" data-id="${p.id}">Agregar al carrito</button>
        <a href="index.html" class="btn btn-outline-light ms-2">Volver</a>
      </div>
    </div>
  `;

    $('#detail-add').addEventListener('click', (e) => {
        addToCart(e.currentTarget.dataset.id);
    });
}

// Agregar al carrito
function addToCart(id, qty = 1) {
    const cart = loadCart();
    if (!cart[id]) cart[id] = { id, qty: 0 };
    cart[id].qty += qty;
    saveCart(cart);
    showToast('Producto agregado');
}


function showToast(msg) {
    // Aviso visual en esquina
    let t = document.createElement('div');
    t.className = 'toast-notice';
    t.style = "position:fixed;right:20px;bottom:20px;background:#111;padding:12px 16px;border-radius:8px;color:white;z-index:9999;opacity:0;transition:opacity .2s";
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.style.opacity = 1);
    setTimeout(() => {
        t.style.opacity = 0;
        setTimeout(() => t.remove(), 250);
    }, 1100);
}

//Render carrito
function renderCartPage() {
    const container = $('#cartContainer');
    if (!container) return;
    const cart = loadCart();
    container.innerHTML = '';
    const ids = Object.keys(cart);
    if (ids.length === 0) {
        container.innerHTML = `<div class="alert alert-light">Tu carrito está vacío.</div>`;
    } else {
        ids.forEach(id => {
            const item = cart[id];
            const product = PRODUCTS.find(p => p.id === id);
            const row = document.createElement('div');
            row.className = 'd-flex align-items-center mb-3';
            row.innerHTML = `
        <img src="${product.img}" style="width:84px;height:64px;object-fit:cover;border-radius:8px;margin-right:12px">
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h6 class="mb-1 text-white">${product.title}</h6>
              <small class="text-muted">${product.category}</small>
            </div>
            <div class="text-end">
              <div class="price">${formatPrice(product.price * item.qty)}</div>
              <small class="text-muted">Unit ${formatPrice(product.price)}</small>
            </div>
          </div>
          <div class="mt-2 d-flex align-items-center">
            <button class="btn btn-sm btn-outline-light me-2 minus-btn" data-id="${id}">-</button>
            <span class="px-3">${item.qty}</span>
            <button class="btn btn-sm btn-outline-light ms-2 plus-btn" data-id="${id}">+</button>
            <button class="btn btn-sm btn-danger ms-3 remove-btn" data-id="${id}">Eliminar</button>
          </div>
        </div>
      `;
            container.appendChild(row);
        });

        // listeners
        $$('.plus-btn').forEach(b => b.addEventListener('click', e => {
            const id = e.currentTarget.dataset.id;
            modifyQty(id, 1);
        }));
        $$('.minus-btn').forEach(b => b.addEventListener('click', e => {
            const id = e.currentTarget.dataset.id;
            modifyQty(id, -1);
        }));
        $$('.remove-btn').forEach(b => b.addEventListener('click', e => {
            const id = e.currentTarget.dataset.id;
            removeItem(id);
        }));
    }

    updateCartTotal();
}

//modificar cantidad
function modifyQty(id, delta) {
    const cart = loadCart();
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) delete cart[id];
    saveCart(cart);
    renderCartPage();
}

//eliminar item
function removeItem(id) {
    const cart = loadCart();
    if (cart[id]) delete cart[id];
    saveCart(cart);
    renderCartPage();
}

//total
function updateCartTotal() {
    const totalEl = $('#cart-total');
    if (!totalEl) return;
    const cart = loadCart();
    const total = Object.keys(cart).reduce((s, id) => {
        const p = PRODUCTS.find(x => x.id === id);
        return s + (p.price * cart[id].qty);
    }, 0);
    totalEl.textContent = formatPrice(total);
}

//  vaciar carrito
function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    renderCartPage();
}

//  Inicialización 
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    renderProductsGrid();
    renderProductDetail();
    renderCartPage();

    const clearBtn = $('#clear-cart');
    if (clearBtn) clearBtn.addEventListener('click', () => {
        if (confirm('¿Vaciar el carrito?')) clearCart();
    });

    const checkout = $('#checkout');
    if (checkout) checkout.addEventListener('click', () => {
        alert('Simulación de pago: gracias por tu compra (demo).');
        clearCart();
    });
});

/* ============================================
   AVEAM Collections — Product Data & Logic
   ============================================ */

// ── Product Catalog ──
const PRODUCTS = [
    {
        id: 'silk-hoodie-black',
        name: 'SILK EMBROIDERY HOODIE',
        price: 120,
        img: 'fotos/aveam_silk_hoodie_white_1777656488743.png',
        badge: 'NEW IN',
        categories: ['all', 'new-arrivals', 'hoodies', 'rtw-all', 'bordados', 'summer'],
        sizes: ['S', 'M', 'L', 'XL'],
        desc: 'Hoodie de algodón premium con bordado de seda hecho a mano. Diseño Atelier Nocturne exclusivo. Producción limitada bajo demanda.'
    },
    {
        id: 'brutal-cap',
        name: 'BRUTAL SIGNATURE CAP',
        price: 45,
        img: 'fotos/aveam_brutal_cap_white_1777656655425.png',
        badge: 'LIMITED',
        categories: ['all', 'new-arrivals', 'caps', 'acc-all', 'summer'],
        sizes: ['ONE SIZE'],
        desc: 'Gorra desestructurada con bordado AVEAM frontal. Cierre metálico ajustable. Algodón lavado premium.'
    },
    {
        id: 'atelier-hoodie',
        name: 'ATELIER NOCTURNE HOODIE',
        price: 150,
        img: 'fotos/aveam_silk_hoodie_white_1777656488743.png',
        badge: 'NEW IN',
        categories: ['all', 'new-arrivals', 'hoodies', 'rtw-all', 'bordados'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        desc: 'Edición premium del hoodie insignia con bordado completo en pecho. Hilo de seda metalizado sobre algodón 380gsm.'
    },
    {
        id: 'classic-cap',
        name: 'AVEAM CLASSIC CAP',
        price: 40,
        img: 'fotos/aveam_brutal_cap_white_1777656655425.png',
        badge: 'NEW IN',
        categories: ['all', 'caps', 'acc-all'],
        sizes: ['ONE SIZE'],
        desc: 'Gorra clásica con logo AVEAM bordado. Perfil bajo, algodón 100%. El accesorio esencial.'
    },
    {
        id: 'crest-hoodie',
        name: 'CREST EMBROIDERY HOODIE',
        price: 135,
        img: 'fotos/aveam_silk_hoodie_white_1777656488743.png',
        badge: 'COMING SOON',
        categories: ['all', 'hoodies', 'rtw-all', 'bordados', 'archive'],
        sizes: ['M', 'L', 'XL'],
        desc: 'Hoodie con escudo heráldico AVEAM bordado en hilo dorado. Pieza de archivo, edición numerada.'
    },
    {
        id: 'logo-tee',
        name: 'AVEAM LOGO TEE',
        price: 55,
        img: 'fotos/aveam_brutal_cap_white_1777656655425.png',
        badge: 'SOON',
        categories: ['all', 'tees', 'rtw-all'],
        sizes: ['S', 'M', 'L', 'XL'],
        desc: 'Camiseta oversize de algodón orgánico 240gsm con logo AVEAM bordado en pecho. Corte drop shoulder.'
    },
    {
        id: 'heritage-hoodie',
        name: 'HERITAGE PULLOVER',
        price: 160,
        img: 'fotos/aveam_silk_hoodie_white_1777656488743.png',
        badge: 'ARCHIVE',
        categories: ['all', 'hoodies', 'rtw-all', 'archive'],
        sizes: ['L', 'XL'],
        desc: 'Pieza de archivo de la primera colección AVEAM. Bordado artesanal de herencia española. Stock limitado.'
    },
    {
        id: 'trucker-cap',
        name: 'AVEAM TRUCKER CAP',
        price: 38,
        img: 'fotos/aveam_brutal_cap_white_1777656655425.png',
        badge: 'NEW IN',
        categories: ['all', 'new-arrivals', 'caps', 'acc-all', 'summer'],
        sizes: ['ONE SIZE'],
        desc: 'Gorra trucker con panel frontal bordado y malla trasera. Snap-back ajustable. Edición streetwear.'
    },
    {
        id: 'summer-mesh-hoodie',
        name: 'SUMMER MESH HOODIE',
        price: 95,
        img: 'fotos/aveam_silk_hoodie_white_1777656488743.png',
        badge: 'SUMMER 26',
        categories: ['all', 'new-arrivals', 'hoodies', 'rtw-all', 'summer'],
        sizes: ['S', 'M', 'L', 'XL'],
        desc: 'Hoodie ligero de tejido mesh para verano. Bordado AVEAM en pecho. Perfecto para noches de verano.'
    },
    {
        id: 'summer-resort-cap',
        name: 'RESORT SIGNATURE CAP',
        price: 42,
        img: 'fotos/aveam_brutal_cap_white_1777656655425.png',
        badge: 'SUMMER 26',
        categories: ['all', 'new-arrivals', 'caps', 'acc-all', 'summer'],
        sizes: ['ONE SIZE'],
        desc: 'Gorra resort de algodón lavado con bordado tonal. Inspirada en la Riviera española. Edición verano 2026.'
    },
    {
        id: 'summer-light-hoodie',
        name: 'AVEAM LIGHTWEIGHT PULLOVER',
        price: 110,
        img: 'fotos/aveam_silk_hoodie_white_1777656488743.png',
        badge: 'SUMMER 26',
        categories: ['all', 'new-arrivals', 'hoodies', 'rtw-all', 'summer'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        desc: 'Pullover ultraligero de algodón 220gsm con bordado minimalista. La pieza esencial del verano AVEAM.'
    }
];

// ── State ──
let currentCategory = 'all';
let cart = [];

// ── DOM ──
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('shop-grid');
    const titleEl = document.getElementById('shop-title');
    const countEl = document.getElementById('product-count');
    const emptyEl = document.getElementById('shop-empty');
    const catLinks = document.querySelectorAll('.cat-link');
    const sortSelect = document.getElementById('sort-select');

    // Sidebar (mobile)
    const menuToggle = document.getElementById('menu-toggle');
    const shopSidebar = document.getElementById('shop-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarClose = document.getElementById('sidebar-close');
    const mobileFilter = document.getElementById('mobile-filter-btn');

    // Cart
    const cartToggle = document.getElementById('cart-toggle');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartItemsEl = document.getElementById('cart-items');
    const cartEmptyEl = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');

    // Search
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');

    // Announcement
    const announcementClose = document.getElementById('announcement-close');
    const announcementBar = document.getElementById('announcement-bar');
    const storeHeader = document.getElementById('store-header');

    // ── Read URL param ──
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam) {
        currentCategory = catParam;
        catLinks.forEach(l => {
            l.classList.toggle('active', l.dataset.cat === catParam);
        });
    }

    // ── Render Products ──
    function renderProducts(category, sortBy = 'featured') {
        let filtered = PRODUCTS.filter(p => p.categories.includes(category));

        if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
        else if (sortBy === 'newest') filtered.sort((a, b) => (a.badge === 'NEW IN' ? -1 : 1));

        grid.innerHTML = '';

        if (filtered.length === 0) {
            emptyEl.style.display = 'flex';
            countEl.textContent = '0 PRODUCTS';
            return;
        }
        emptyEl.style.display = 'none';
        countEl.textContent = `${filtered.length} PRODUCT${filtered.length > 1 ? 'S' : ''}`;

        filtered.forEach((p, i) => {
            const card = document.createElement('article');
            card.className = 'shop-product';
            card.style.animationDelay = `${i * 0.07}s`;
            card.innerHTML = `
                <span class="p-badge">${p.badge}</span>
                <button class="p-wish" aria-label="Wishlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                </button>
                <div class="p-img-wrap" data-id="${p.id}">
                    <img src="${p.img}" alt="${p.name}" class="p-img" loading="lazy">
                </div>
                <div class="p-info">
                    <div class="p-name">${p.name}</div>
                    <div class="p-price">€${p.price.toFixed(2).replace('.', ',')} EUR</div>
                </div>
                <button class="p-add-btn" data-id="${p.id}">ADD TO BAG</button>
            `;
            grid.appendChild(card);
        });

        // Attach events
        grid.querySelectorAll('.p-add-btn').forEach(btn => {
            btn.addEventListener('click', () => addToCart(btn.dataset.id));
        });
        grid.querySelectorAll('.p-img-wrap').forEach(wrap => {
            wrap.addEventListener('click', () => openQuickView(wrap.dataset.id));
        });
        grid.querySelectorAll('.p-wish').forEach(btn => {
            btn.addEventListener('click', () => {
                const path = btn.querySelector('path');
                btn.classList.toggle('wishlisted');
                path.setAttribute('fill', btn.classList.contains('wishlisted') ? 'currentColor' : 'none');
            });
        });
    }

    // ── Category Title Map ──
    const TITLES = {
        'all': 'ALL PRODUCTS', 'new-arrivals': 'NEW ARRIVALS',
        'hoodies': 'HOODIES & SWEATSHIRTS', 'tees': 'TEES',
        'pants': 'PANTS', 'outerwear': 'OUTERWEAR', 'rtw-all': 'READY TO WEAR',
        'caps': 'CAPS & HATS', 'bags': 'BAGS', 'acc-all': 'ACCESSORIES',
        'bordados': 'BORDADOS', 'archive': 'ARCHIVE',
        'summer': 'SUMMER 2026 COLLECTION'
    };

    // ── Category Click ──
    catLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = link.dataset.cat;
            catLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            titleEl.textContent = TITLES[currentCategory] || currentCategory.toUpperCase();
            renderProducts(currentCategory, sortSelect.value);
            closeMobileSidebar();
            window.history.replaceState({}, '', `?cat=${currentCategory}`);
        });
    });

    // ── Sort ──
    sortSelect.addEventListener('change', () => {
        renderProducts(currentCategory, sortSelect.value);
    });

    // ── Quick View ──
    function openQuickView(productId) {
        const p = PRODUCTS.find(x => x.id === productId);
        if (!p) return;

        // Remove existing modal
        document.querySelectorAll('.quickview-overlay, .quickview-modal').forEach(el => el.remove());

        const overlay = document.createElement('div');
        overlay.className = 'quickview-overlay active';

        const modal = document.createElement('div');
        modal.className = 'quickview-modal active';
        modal.innerHTML = `
            <button class="qv-close" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <div class="qv-image"><img src="${p.img}" alt="${p.name}"></div>
            <div class="qv-details">
                <div class="qv-name">${p.name}</div>
                <div class="qv-price">€${p.price.toFixed(2).replace('.', ',')} EUR</div>
                <p class="qv-desc">${p.desc}</p>
                <div class="qv-sizes">${p.sizes.map((s, i) =>
                    `<button class="qv-size ${i === 0 ? 'selected' : ''}">${s}</button>`
                ).join('')}</div>
                <button class="qv-add-btn" data-id="${p.id}">ADD TO BAG</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Events
        overlay.addEventListener('click', closeQuickView);
        modal.querySelector('.qv-close').addEventListener('click', closeQuickView);
        modal.querySelectorAll('.qv-size').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.qv-size').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
        modal.querySelector('.qv-add-btn').addEventListener('click', () => {
            addToCart(p.id);
            closeQuickView();
        });
    }

    function closeQuickView() {
        document.querySelectorAll('.quickview-overlay, .quickview-modal').forEach(el => {
            el.classList.remove('active');
            setTimeout(() => el.remove(), 400);
        });
        document.body.style.overflow = '';
    }

    // ── Cart ──
    function addToCart(productId) {
        const p = PRODUCTS.find(x => x.id === productId);
        if (!p) return;
        cart.push({ ...p });
        updateCartUI();
        openCart();
    }

    function updateCartUI() {
        cartCount.textContent = cart.length;
        cartItemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());

        if (cart.length === 0) {
            cartEmptyEl.style.display = 'flex';
            cartFooter.style.display = 'none';
            return;
        }

        cartEmptyEl.style.display = 'none';
        cartFooter.style.display = 'block';

        let total = 0;
        cart.forEach((item, i) => {
            total += item.price;
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">€${item.price.toFixed(2).replace('.', ',')} EUR</div>
                    <button class="cart-item-remove" data-index="${i}">REMOVE</button>
                </div>
            `;
            cartItemsEl.appendChild(el);
        });

        cartTotalPrice.textContent = `€${total.toFixed(2).replace('.', ',')}`;

        cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                cart.splice(parseInt(btn.dataset.index), 1);
                updateCartUI();
            });
        });
    }

    function openCart() {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeCartFn() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartToggle.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCartFn);
    cartOverlay.addEventListener('click', closeCartFn);

    // ── Mobile Sidebar ──
    function openMobileSidebar() {
        shopSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeMobileSidebar() {
        shopSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openMobileSidebar);
    if (mobileFilter) mobileFilter.addEventListener('click', openMobileSidebar);
    sidebarClose.addEventListener('click', closeMobileSidebar);
    sidebarOverlay.addEventListener('click', closeMobileSidebar);

    // ── Search ──
    searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        setTimeout(() => searchInput.focus(), 300);
    });
    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
    });

    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase();
        const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(q));
        grid.innerHTML = '';
        filtered.forEach((p, i) => {
            const card = document.createElement('article');
            card.className = 'shop-product';
            card.style.animationDelay = `${i * 0.07}s`;
            card.innerHTML = `
                <span class="p-badge">${p.badge}</span>
                <div class="p-img-wrap" data-id="${p.id}">
                    <img src="${p.img}" alt="${p.name}" class="p-img" loading="lazy">
                </div>
                <div class="p-info">
                    <div class="p-name">${p.name}</div>
                    <div class="p-price">€${p.price.toFixed(2).replace('.', ',')} EUR</div>
                </div>
                <button class="p-add-btn" data-id="${p.id}">ADD TO BAG</button>
            `;
            grid.appendChild(card);
        });
        grid.querySelectorAll('.p-add-btn').forEach(btn => {
            btn.addEventListener('click', () => addToCart(btn.dataset.id));
        });
        grid.querySelectorAll('.p-img-wrap').forEach(w => {
            w.addEventListener('click', () => openQuickView(w.dataset.id));
        });
        countEl.textContent = `${filtered.length} PRODUCT${filtered.length !== 1 ? 'S' : ''}`;
    });

    // ── Announcement ──
    announcementClose.addEventListener('click', () => announcementBar.classList.add('hidden'));

    // ── Header scroll ──
    window.addEventListener('scroll', () => {
        storeHeader.classList.toggle('scrolled', window.scrollY > 30);
    });

    // ── ESC key ──
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileSidebar();
            closeCartFn();
            closeQuickView();
            searchOverlay.classList.remove('active');
        }
    });

    // ── Initial Render ──
    titleEl.textContent = TITLES[currentCategory] || 'ALL PRODUCTS';
    renderProducts(currentCategory);
});

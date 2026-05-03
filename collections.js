/* ============================================
   AVEAM Collections — Product Data & Logic
   ============================================ */

// ── Product Catalog (Dynamic) ──
let PRODUCTS = [];

// ── State ──
let currentCategory = 'all';
let shopifyClient = null;
let checkoutId = localStorage.getItem('aveam_checkout_id');
let currentCheckout = null;

// Initialize Shopify Client
if (window.ShopifyBuy) {
    shopifyClient = ShopifyBuy.buildClient({
        domain: 'aveam-clothing.myshopify.com',
        storefrontAccessToken: '031cbd799586da1b5f9ced2164f37f73'
    });
}

// ── Data Fetching ──
async function loadShopifyProducts() {
    const grid = document.getElementById('shop-grid');
    if (grid) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--mid-gray); letter-spacing: 0.1em; font-size: 0.8rem;">SYNCING AURA CATALOG...</div>';

    const query = `
    {
      products(first: 50) {
        edges {
          node {
            id
            title
            description
            options {
              name
              values
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
    `;

    try {
        const res = await fetch('https://aveam-clothing.myshopify.com/api/2024-01/graphql.json', {
            method: 'POST',
            headers: {
                'X-Shopify-Storefront-Access-Token': '031cbd799586da1b5f9ced2164f37f73',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        const json = await res.json();
        
        if (json.errors) {
            console.error("Shopify GraphQL Errors:", json.errors);
            throw new Error("GraphQL Error");
        }

        const products = json.data.products.edges.map(e => e.node);
        
        PRODUCTS = products.map(p => {
            const variants = p.variants.edges.map(e => e.node);
            
            let colors = [];
            let sizes = [];
            
            const colorOption = p.options.find(o => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour');
            if (colorOption) colors = colorOption.values;
            
            const sizeOption = p.options.find(o => o.name.toLowerCase() === 'size' || o.name.toLowerCase() === 'talla');
            if (sizeOption) sizes = sizeOption.values;
            
            if (colors.length === 0 && sizes.length === 0) {
                 sizes = [...new Set(variants.map(v => v.title))].filter(s => s !== 'Default Title');
            }
            
            return {
                id: p.id,
                shopifyId: p.id,
                name: p.title,
                price: parseFloat(variants[0].price.amount),
                img: p.images.edges.length > 0 ? p.images.edges[0].node.url : '',
                badge: '',
                categories: ['all'],
                colors: colors,
                sizes: sizes.length > 0 ? sizes : ['ONE SIZE'],
                variants: variants,
                desc: p.description || 'Producto oficial de AVEAM.'
            };
        });
        
        // Re-render
        if (typeof renderProducts === 'function') {
            const currentCat = typeof currentCategory !== 'undefined' ? currentCategory : 'all';
            const sortVal = document.getElementById('sort-select') ? document.getElementById('sort-select').value : 'newest';
            renderProducts(currentCat, sortVal);
        }
    } catch (e) {
        console.error("Error loading products from Shopify:", e);
        if (grid) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: red;">Failed to load catalog. Please refresh.</div>';
    }
}

// ── DOM ──
document.addEventListener('DOMContentLoaded', () => {
    // Start fetching immediately
    loadShopifyProducts();
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
            if (PRODUCTS.length === 0) {
                // Si todavía está vacío, significa que está cargando o no hay nada en Shopify
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--mid-gray);">SYNCING AURA CATALOG...</div>';
            } else {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--mid-gray);">NO PRODUCTS FOUND IN THIS CATEGORY.</div>';
            }
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

// ── Helper ──
function getCssColor(name) {
    const map = {
        'sport grey': '#9ba1a8',
        'ash grey': '#b2b6b9',
        'dark heather': '#424242',
        'heather grey': '#9e9e9e',
        'navy': '#000080',
        'maroon': '#800000'
    };
    return map[name.toLowerCase()] || name.replace(/\s+/g, '');
}

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
        
        let colorHtml = '';
        if (p.colors && p.colors.length > 0) {
            colorHtml = `
                <div style="font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; color: var(--mid-gray);">COLOR</div>
                <div class="qv-colors" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                    ${p.colors.map((c, i) => `<button class="qv-color-swatch ${i === 0 ? 'selected' : ''}" style="background-color: ${getCssColor(c)}; width: 24px; height: 24px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; transition: transform 0.2s;" data-color="${c}" title="${c}"></button>`).join('')}
                </div>
            `;
        }

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
                
                ${colorHtml}

                <div style="font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; color: var(--mid-gray);">SIZE</div>
                <div class="qv-sizes">${p.sizes.map((s, i) =>
                    `<button class="qv-size ${i === 0 ? 'selected' : ''}" data-size="${s}">${s}</button>`
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

        modal.querySelectorAll('.qv-color-swatch').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.qv-color-swatch').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        modal.querySelector('.qv-add-btn').addEventListener('click', () => {
            const selectedSizeEl = modal.querySelector('.qv-size.selected');
            const size = selectedSizeEl ? selectedSizeEl.dataset.size : null;
            
            const selectedColorEl = modal.querySelector('.qv-color-swatch.selected');
            const color = selectedColorEl ? selectedColorEl.dataset.color : null;

            addToCart(p.id, size, color);
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

    // ── Cart / Shopify Integration ──
    async function initCheckout() {
        if (!shopifyClient) return;
        
        try {
            if (checkoutId) {
                // Fetch existing checkout
                currentCheckout = await shopifyClient.checkout.fetch(checkoutId);
                // If it was completed, create a new one
                if (!currentCheckout || currentCheckout.completedAt) {
                    currentCheckout = await shopifyClient.checkout.create();
                    checkoutId = currentCheckout.id;
                    localStorage.setItem('aveam_checkout_id', checkoutId);
                }
            } else {
                // Create new checkout
                currentCheckout = await shopifyClient.checkout.create();
                checkoutId = currentCheckout.id;
                localStorage.setItem('aveam_checkout_id', checkoutId);
            }
            updateCartUI();
        } catch (e) {
            console.error('Error initializing checkout', e);
        }
    }

    async function addToCart(productId, size = null, color = null) {
        const p = PRODUCTS.find(x => x.id === productId);
        if (!p) return;
        
        openCart(); // Open drawer immediately for feedback
        
        if (!shopifyClient || !currentCheckout) {
            alert("Shopify SDK not initialized yet.");
            return;
        }

        cartItemsEl.innerHTML = '<div style="padding: 2rem; text-align: center;">Adding to bag...</div>';
        
        try {
            let selectedVariant = null;

            // Find variant matching BOTH color and size
            if (p.variants && p.variants.length > 0) {
                selectedVariant = p.variants.find(v => {
                    const matchesSize = size ? v.selectedOptions.some(o => (o.name.toLowerCase() === 'size' || o.name.toLowerCase() === 'talla') && o.value === size) : true;
                    const matchesColor = color ? v.selectedOptions.some(o => (o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour') && o.value === color) : true;
                    return matchesSize && matchesColor;
                });
                if (!selectedVariant) selectedVariant = p.variants[0];
            } else {
                // Fallback if no full variants loaded (should not happen)
                const shopifyProduct = await shopifyClient.product.fetch(p.shopifyId);
                selectedVariant = shopifyProduct.variants[0];
            }

            // Fallback for btoa if SDK strictly requires it
            let finalVariantId = selectedVariant.id;
            if (!finalVariantId.includes('Z2lkOi')) {
                 finalVariantId = btoa(finalVariantId);
            }

            const lineItemsToAdd = [{
                variantId: finalVariantId,
                quantity: 1
            }];

            currentCheckout = await shopifyClient.checkout.addLineItems(checkoutId, lineItemsToAdd);
            updateCartUI();

        } catch (e) {
            console.error('Error adding to cart', e);
            alert("Failed to add to cart. Please try again.");
            updateCartUI();
        }
    }

    function updateCartUI() {
        if (!currentCheckout) return;

        const lineItems = currentCheckout.lineItems;
        cartCount.textContent = lineItems.length;
        cartItemsEl.innerHTML = '';

        if (lineItems.length === 0) {
            cartEmptyEl.style.display = 'flex';
            cartFooter.style.display = 'none';
            cartItemsEl.appendChild(cartEmptyEl);
            return;
        }

        cartEmptyEl.style.display = 'none';
        cartFooter.style.display = 'block';

        lineItems.forEach((item) => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <img src="${item.variant.image ? item.variant.image.src : ''}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.title}</div>
                    <div class="cart-item-price">€${item.variant.price.amount} EUR</div>
                    <div style="font-size: 0.6rem; color: #999; margin-top: 2px;">${item.variant.title !== 'Default Title' ? item.variant.title : ''}</div>
                    <button class="cart-item-remove" data-id="${item.id}">REMOVE</button>
                </div>
            `;
            cartItemsEl.appendChild(el);
        });

        cartTotalPrice.textContent = `€${currentCheckout.totalPrice.amount} EUR`;

        cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', async () => {
                cartItemsEl.innerHTML = '<div style="padding: 2rem; text-align: center;">Removing...</div>';
                currentCheckout = await shopifyClient.checkout.removeLineItems(checkoutId, [btn.dataset.id]);
                updateCartUI();
            });
        });
    }

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (currentCheckout && currentCheckout.webUrl) {
                window.location.href = currentCheckout.webUrl;
            }
        });
    }

    // Initialize checkout on load
    initCheckout();

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

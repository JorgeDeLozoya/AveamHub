/* ============================================
   AVEAM STORE — Interactive Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ── Elements ──
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarNav = document.getElementById('sidebar-nav');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');

    const cartToggle = document.getElementById('cart-toggle');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');

    const categoryTitle = document.getElementById('category-title');
    const productCards = document.querySelectorAll('.product-card');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    const announcementBar = document.getElementById('announcement-bar');
    const announcementClose = document.getElementById('announcement-close');
    const storeHeader = document.getElementById('store-header');

    let cart = [];

    // ── Announcement Bar ──
    if (announcementClose) {
        announcementClose.addEventListener('click', () => {
            announcementBar.classList.add('hidden');
        });
    }

    // ── Header scroll effect ──
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            storeHeader.classList.add('scrolled');
        } else {
            storeHeader.classList.remove('scrolled');
        }
    });

    // ── Sidebar ──
    function openSidebar() {
        sidebarNav.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        sidebarNav.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    // ── Sidebar Category Filtering ──
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;

            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update category title
            categoryTitle.textContent = link.textContent;

            // Filter products
            productCards.forEach(card => {
                const cardCategories = card.dataset.category || '';
                if (category === 'all' || cardCategories.includes(category)) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                    });
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => { card.style.display = 'none'; }, 400);
                }
            });

            closeSidebar();

            // Scroll to shop
            document.getElementById('shop').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ── Search ──
    function openSearch() {
        searchOverlay.classList.add('active');
        setTimeout(() => searchInput.focus(), 300);
        document.body.style.overflow = 'hidden';
    }
    function closeSearch() {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        document.body.style.overflow = '';
    }

    searchToggle.addEventListener('click', openSearch);
    searchClose.addEventListener('click', closeSearch);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        productCards.forEach(card => {
            const name = card.querySelector('.product-name').textContent.toLowerCase();
            card.style.display = name.includes(query) || query === '' ? '' : 'none';
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearch();
            closeSidebar();
            closeCart();
        }
    });

    // ── Cart ──
    function openCart() {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeCart() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartToggle.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    function updateCart() {
        cartCount.textContent = cart.length;

        if (cart.length === 0) {
            cartEmpty.style.display = 'flex';
            cartFooter.style.display = 'none';
            // Remove all cart items
            cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());
        } else {
            cartEmpty.style.display = 'none';
            cartFooter.style.display = 'block';

            // Clear and rebuild
            cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());

            let total = 0;
            cart.forEach((item, index) => {
                total += item.price;
                const cartItemEl = document.createElement('div');
                cartItemEl.className = 'cart-item';
                cartItemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">€${item.price.toFixed(2).replace('.', ',')} EUR</div>
                        <button class="cart-item-remove" data-index="${index}">REMOVE</button>
                    </div>
                `;
                cartItems.appendChild(cartItemEl);
            });

            cartTotalPrice.textContent = `€${total.toFixed(2).replace('.', ',')}`;

            // Attach remove handlers
            cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.index);
                    cart.splice(idx, 1);
                    updateCart();
                });
            });
        }
    }

    // ── Add to Cart ──
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const img = card.querySelector('.product-img').src;

            cart.push({ name, price, img });
            updateCart();
            openCart();

            // Button feedback
            const originalText = btn.textContent;
            btn.textContent = 'ADDED ✓';
            btn.style.background = '#1a1a1a';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 1500);
        });
    });

    // ── Wishlist Toggle ──
    document.querySelectorAll('.product-wishlist').forEach(btn => {
        btn.addEventListener('click', () => {
            const svg = btn.querySelector('svg path');
            if (btn.classList.contains('wishlisted')) {
                btn.classList.remove('wishlisted');
                svg.setAttribute('fill', 'none');
            } else {
                btn.classList.add('wishlisted');
                svg.setAttribute('fill', 'currentColor');
            }
        });
    });

    // ── Scroll reveal for product cards ──
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(card);
    });
});

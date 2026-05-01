// AVEAM Clothing - Core Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('AVEAM Hub Initialized');

    const appView = document.getElementById('app-view');
    const navItems = document.querySelectorAll('.nav-item');

    // Production State
    let productionTasks = [
        { prenda: 'Chaqueta Denim', diseño: 'AVEAM Custom Back', prioridad: 'Alta', estado: 'Esperando Prenda' }
    ];

    // Keep track of the current dashboard HTML to restore it
    const dashboardTemplate = appView ? appView.innerHTML : '';

    const views = {
        'Dashboard': () => {
            appView.innerHTML = dashboardTemplate;
            initDashboard();
        },
        'Productos': () => {
            appView.innerHTML = `
                <header>
                    <div>
                        <h1>Inventario & Productos</h1>
                        <p style="color: var(--text-muted)">Gestión sincronizada con Shopify y Printful.</p>
                    </div>
                    <button class="card btn-primary">
                        + Nuevo Producto
                    </button>
                </header>
                <div class="dashboard-grid">
                    ${renderProductCard('Sudadera "AVEAM" Black', 'Bordado Pecho - Hilo Oro', '45.00 €', 'Activo')}
                    ${renderProductCard('Gorra Premium Navy', 'Bordado Frontal 3D', '32.00 €', 'Activo')}
                    ${renderProductCard('Camiseta Logo Gold', 'DTG Premium', '28.50 €', 'En Pausa')}
                </div>
            `;
        },
        'Producción': () => {
            appView.innerHTML = `
                <header>
                    <div>
                        <h1>Línea de Producción</h1>
                        <p style="color: var(--text-muted)">Estado de bordados y pedidos locales.</p>
                    </div>
                    <button class="card btn-primary" id="add-task-btn">+ Añadir Bordado</button>
                </header>
                <div class="dashboard-grid">
                    <div class="card">
                        <div class="card-title">Máquina 1 (Brother PR)</div>
                        <div class="card-value">En proceso</div>
                        <div style="margin-top: 10px; height: 4px; background: #333; border-radius: 2px;">
                            <div style="width: 65%; height: 100%; background: var(--accent-primary); border-radius: 2px;"></div>
                        </div>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 10px;">Diseño: Logo Espalda 15cm</p>
                    </div>
                    <div class="card">
                        <div class="card-title">Hilos en Stock</div>
                        <div class="card-value">12 Bobinas</div>
                        <p style="font-size: 0.8rem; color: #4caf50; margin-top: 10px;">Stock de Oro Metálico OK</p>
                    </div>
                </div>
                <h2 class="section-title">Pedidos de Bordado Local</h2>
                <div class="card" style="padding: 0; overflow: hidden;">
                    <table class="order-list">
                        <thead>
                            <tr>
                                <th>Prenda</th>
                                <th>Diseño</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody id="production-table-body">
                            ${productionTasks.map(task => `
                                <tr>
                                    <td>${task.prenda}</td>
                                    <td>${task.diseño}</td>
                                    <td>${task.prioridad}</td>
                                    <td><span class="status-pill status-pending">${task.estado}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            
            document.getElementById('add-task-btn').addEventListener('click', () => {
                const prenda = prompt('¿Qué prenda es?');
                const diseño = prompt('¿Qué diseño lleva?');
                if (prenda && diseño) {
                    productionTasks.push({ prenda, diseño, prioridad: 'Media', estado: 'Pendiente' });
                    views['Producción'](); // Refresh view
                }
            });
        },
        'Redes Sociales': () => {
            appView.innerHTML = `
                <header>
                    <div>
                        <h1>Planificador de RRSS</h1>
                        <p style="color: var(--text-muted)">TikTok, Instagram y X.</p>
                    </div>
                    <button class="card btn-primary">+ Nueva Publicación</button>
                </header>
                <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));">
                    <div class="card">
                        <h3 style="margin-bottom: 1rem;">Calendario Semanal</h3>
                        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; text-align: center;">
                            ${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => `<div style="font-size: 0.7rem; color: var(--text-dim)">${d}</div>`).join('')}
                            ${Array.from({length: 31}, (_, i) => `<div style="padding: 10px 0; border: 1px solid var(--border-color); border-radius: 4px; font-size: 0.8rem; ${i === 4 ? 'background: var(--accent-glow); color: var(--accent-primary); border-color: var(--accent-primary)' : ''}">${i + 1}</div>`).join('')}
                        </div>
                    </div>
                    <div class="card">
                        <h3 style="margin-bottom: 1rem;">Próximos Reels/TikToks</h3>
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            <div style="display: flex; gap: 1rem; align-items: center; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 10px;">
                                <div style="width: 40px; height: 40px; background: #000; border-radius: 8px; display: grid; place-items: center;">🎥</div>
                                <div style="flex: 1">
                                    <div style="font-size: 0.9rem; font-weight: 600;">Making of Sudadera Gold</div>
                                    <div style="font-size: 0.7rem; color: var(--text-muted);">TikTok - Mañana 18:00</div>
                                </div>
                                <span class="status-pill status-shipped">Listo</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        'Analíticas': () => {
            appView.innerHTML = `
                <header>
                    <h1>Analíticas AVEAM</h1>
                </header>
                <div class="dashboard-grid">
                    <div class="card" style="height: 300px; display: flex; flex-direction: column; justify-content: flex-end;">
                        <h3 style="margin-bottom: auto">Ventas 7 Días</h3>
                        <div style="display: flex; align-items: flex-end; gap: 10px; height: 150px;">
                            ${[40, 60, 45, 90, 100, 80, 120].map(h => `<div style="flex: 1; height: ${h}%; background: linear-gradient(to top, var(--accent-secondary), var(--accent-primary)); border-radius: 4px 4px 0 0;"></div>`).join('')}
                        </div>
                    </div>
                    <div class="card">
                        <h3>Fuentes de Tráfico</h3>
                        <div style="margin-top: 2rem;">
                            ${renderProgress('Instagram', 65)}
                            ${renderProgress('TikTok', 25)}
                            ${renderProgress('Directo', 10)}
                        </div>
                    </div>
                </div>
            `;
        },
        'Configuración': () => {
            appView.innerHTML = `
                <header>
                    <h1>Configuración</h1>
                </header>
                <div class="card" style="max-width: 600px;">
                    <h3>Integraciones</h3>
                    <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px;">
                            <span>Shopify Store</span>
                            <span style="color: #4caf50;">● Conectado</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px;">
                            <span>Printful API</span>
                            <span style="color: #4caf50;">● Conectado</span>
                        </div>
                    </div>
                    <div style="margin-top: 2rem;">
                        <a href="index.html" style="color: var(--accent-primary); text-decoration: none;">← Volver a la Tienda Pública</a>
                    </div>
                </div>
            `;
        }
    };

    function renderProductCard(title, desc, price, status) {
        return `
            <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 180px; background: #1a1a1a; display: grid; place-items: center; border-bottom: 1px solid var(--border-color);">
                    <span style="color: var(--text-dim)">Preview</span>
                </div>
                <div style="padding: 1.2rem;">
                    <div style="font-weight: 700;">${title}</div>
                    <div style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px;">${desc}</div>
                    <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 800;">${price}</span>
                        <span class="status-pill ${status === 'Activo' ? 'status-delivered' : 'status-pending'}">${status}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderProgress(label, percent) {
        return `
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 5px;">
                    <span>${label}</span>
                    <span>${percent}%</span>
                </div>
                <div style="height: 6px; background: #222; border-radius: 3px;">
                    <div style="width: ${percent}%; height: 100%; background: var(--accent-primary); border-radius: 3px;"></div>
                </div>
            </div>
        `;
    }

    function initDashboard() {
        // Re-initialize any dashboard specific listeners if needed
    }

    if (appView) {
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const pageName = item.querySelector('span').innerText;
                if (views[pageName]) {
                    appView.style.opacity = '0';
                    setTimeout(() => {
                        views[pageName]();
                        appView.style.opacity = '1';
                    }, 150);
                }
            });
        });
    }

    // Handle hover effects for cards dynamically added
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('card')) {
            // CSS transition handles this, but we can add JS logic here
        }
    });
});

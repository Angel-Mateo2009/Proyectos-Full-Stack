// --- Estado Global ---
        let inventory = JSON.parse(localStorage.getItem('sm_inventory')) || [
            { id: 1, name: "Aceite Sintético 5W30", price: 55, stock: 24, min: 10 },
            { id: 2, name: "Filtro de Aire Premium", price: 15, stock: 5, min: 8 }
        ];
        let expenses = JSON.parse(localStorage.getItem('sm_expenses')) || [];
        let sales = JSON.parse(localStorage.getItem('sm_sales')) || [];
        let currentView = 'panel';

        // --- Auth ---
        window.handleLogin = (e) => {
            e.preventDefault();
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('main-app').classList.remove('hidden');
            navigate('panel');
        };
        window.logout = () => location.reload();

        // --- Navegación ---
        window.navigate = (view) => {
            currentView = view;
            document.getElementById('current-view-title').innerText = view === 'panel' ? 'Panel de Control' : view.toUpperCase();
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            document.getElementById(`nav-${view}`).classList.add('active');

            const area = document.getElementById('content-area');
            area.innerHTML = '';
            
            if(view === 'panel') renderDashboard(area);
            else if(view === 'inventario') renderInventory(area);
            else if(view === 'ventas') renderSales(area);
            else if(view === 'gastos') renderExpenses(area);
            else if(view === 'reportes') renderReports(area);
            
            lucide.createIcons();
        };

        // --- Renders ---
        function renderDashboard(container) {
            const stockVal = inventory.reduce((acc, i) => acc + (i.stock * i.price), 0);
            const totalExp = expenses.reduce((acc, e) => acc + e.amount, 0);
            const totalSales = sales.reduce((acc, s) => acc + s.price, 0);

            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-black p-6 rounded-3xl border border-white/5 shadow-2xl">
                        <p class="text-[10px] font-black text-slate-500 uppercase mb-2">Activos Stock</p>
                        <h3 class="text-3xl font-black text-orange-500">$${stockVal.toLocaleString()}</h3>
                    </div>
                    <div class="bg-black p-6 rounded-3xl border border-white/5 shadow-2xl">
                        <p class="text-[10px] font-black text-slate-500 uppercase mb-2">Ventas Brutas</p>
                        <h3 class="text-3xl font-black text-emerald-500">$${totalSales.toLocaleString()}</h3>
                    </div>
                    <div class="bg-black p-6 rounded-3xl border border-white/5 shadow-2xl">
                        <p class="text-[10px] font-black text-slate-500 uppercase mb-2">Gastos Totales</p>
                        <h3 class="text-3xl font-black text-rose-500">$${totalExp.toLocaleString()}</h3>
                    </div>
                    <div class="bg-black p-6 rounded-3xl border border-white/5 shadow-2xl">
                        <p class="text-[10px] font-black text-slate-500 uppercase mb-2">Utilidad Neta</p>
                        <h3 class="text-3xl font-black text-white">$${(totalSales - totalExp).toLocaleString()}</h3>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[400px]">
                    <div class="bg-black/40 p-8 rounded-3xl border border-white/5 flex flex-col">
                        <h4 class="text-xs font-bold text-slate-400 mb-4 uppercase">Flujo de Stock</h4>
                        <div class="flex-1 relative"><canvas id="dashChart"></canvas></div>
                    </div>
                    <div class="bg-black rounded-3xl border border-white/5 overflow-hidden relative">
                         <div class="absolute top-4 left-4 z-10 bg-black/60 px-3 py-1 rounded-lg border border-white/10 flex items-center gap-2">
                             <span class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                             <span class="text-[10px] font-bold text-white uppercase">CCTV - Taller</span>
                        </div>
                        <video class="w-full h-full object-cover opacity-60" autoplay muted loop playsinline>
                            <source src="https://cdn.pixabay.com/video/2019/04/16/22905-331572978_large.mp4" type="video/mp4">
                        </video>
                    </div>
                </div>
            `;
            setTimeout(initChart, 100);
        }

        function renderInventory(container) {
            container.innerHTML = `
                <div class="flex justify-between items-center mb-8">
                    <h3 class="text-xl font-black text-white uppercase tracking-tighter">Inventario de Almacén</h3>
                    <button onclick="openModal('inventory')" class="btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
                        <i data-lucide="plus-circle"></i> NUEVO PRODUCTO
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${inventory.map(item => `
                        <div class="bg-black p-6 rounded-3xl border border-white/5 status-card ${item.stock <= item.min ? 'status-red' : 'status-yellow'} relative group">
                            <button onclick="deleteItem('inventory', ${item.id})" class="absolute top-4 right-4 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                <i data-lucide="trash-2" size="18"></i>
                            </button>
                            <h4 class="font-bold text-white mb-4 uppercase tracking-tighter">${item.name}</h4>
                            <div class="flex justify-between items-end">
                                <div><p class="text-[10px] text-slate-500 uppercase font-bold">P. Venta</p><p class="text-xl font-black text-orange-500">$${item.price}</p></div>
                                <div class="text-right">
                                    <p class="text-[10px] text-slate-500 uppercase font-bold mb-1">Stock</p>
                                    <div class="flex items-center gap-3 bg-white/10 p-2 rounded-xl border border-white/5">
                                        <button onclick="updateStock(${item.id}, -1)" class="text-white hover:text-orange-500">-</button>
                                        <span class="font-black text-white w-8 text-center">${item.stock}</span>
                                        <button onclick="updateStock(${item.id}, 1)" class="text-white hover:text-orange-500">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function renderSales(container) {
            container.innerHTML = `
                <div class="flex justify-between items-center mb-8">
                    <h3 class="text-xl font-black text-white uppercase tracking-tighter">Ventas de Repuestos</h3>
                    <button onclick="openModal('sales')" class="btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
                        <i data-lucide="car"></i> NUEVA VENTA
                    </button>
                </div>
                <div class="bg-black rounded-3xl border border-white/5 overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-white/5 text-[10px] font-black text-slate-500 uppercase">
                            <tr><th class="p-6">Fecha</th><th class="p-6">Producto</th><th class="p-6">Vehículo</th><th class="p-6 text-right">Monto</th><th class="p-6"></th></tr>
                        </thead>
                        <tbody class="text-sm">
                            ${sales.map(s => `
                                <tr class="border-b border-white/5 hover:bg-white/5">
                                    <td class="p-6 text-xs text-slate-500">${new Date(s.date).toLocaleDateString()}</td>
                                    <td class="p-6 font-bold text-white">${s.productName}</td>
                                    <td class="p-6">
                                        <span class="text-white block text-xs font-bold">${s.carModel}</span>
                                        <span class="vehicle-tag">${s.vehicle}</span>
                                    </td>
                                    <td class="p-6 text-right font-black text-orange-500">$${s.price.toFixed(2)}</td>
                                    <td class="p-6 text-right">
                                        <button onclick="deleteItem('sales', ${s.id})" class="text-slate-700 hover:text-rose-500"><i data-lucide="trash-2" size="16"></i></button>
                                    </td>
                                </tr>
                            `).reverse().join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        function renderExpenses(container) {
            container.innerHTML = `
                <div class="flex justify-between items-center mb-8">
                    <h3 class="text-xl font-black text-white uppercase tracking-tighter">Gastos Operativos</h3>
                    <button onclick="openModal('expenses')" class="btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
                        <i data-lucide="minus-circle"></i> REGISTRAR GASTO
                    </button>
                </div>
                <div class="bg-black rounded-3xl border border-white/5 overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-white/5 text-[10px] font-black text-slate-500 uppercase">
                            <tr><th class="p-6">Fecha</th><th class="p-6">Concepto</th><th class="p-6 text-right">Monto</th><th class="p-6"></th></tr>
                        </thead>
                        <tbody class="text-sm">
                            ${expenses.map(e => `
                                <tr class="border-b border-white/5 hover:bg-white/5">
                                    <td class="p-6 text-xs text-slate-500">${new Date(e.date).toLocaleDateString()}</td>
                                    <td class="p-6 font-bold text-white">${e.desc}</td>
                                    <td class="p-6 text-right font-black text-rose-500">$${e.amount.toFixed(2)}</td>
                                    <td class="p-6 text-right">
                                        <button onclick="deleteItem('expenses', ${e.id})" class="text-slate-700 hover:text-rose-500"><i data-lucide="trash-2" size="16"></i></button>
                                    </td>
                                </tr>
                            `).reverse().join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        function renderReports(container) {
            // Lógica de cálculo de periodos
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split('T')[0];
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

            const calcStats = (period) => {
                let filterDate = today;
                if(period === 'semanal') filterDate = startOfWeek;
                if(period === 'mensual') filterDate = startOfMonth;

                const s = sales.filter(x => x.date >= filterDate).reduce((a, b) => a + b.price, 0);
                const e = expenses.filter(x => x.date >= filterDate).reduce((a, b) => a + b.amount, 0);
                return { s, e, b: s - e };
            };

            const daily = calcStats('diario');
            const weekly = calcStats('semanal');
            const monthly = calcStats('mensual');

            container.innerHTML = `
                <h3 class="text-2xl font-black text-white uppercase mb-8">Centro de Reportes & BI</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div class="bg-black p-6 rounded-3xl border border-white/5">
                        <p class="text-[10px] text-slate-500 font-bold uppercase mb-2">Cierre Diario</p>
                        <p class="text-2xl font-black text-emerald-500">$${daily.s.toFixed(2)} <span class="text-xs text-slate-500 font-normal">Ventas</span></p>
                        <p class="text-lg font-bold text-rose-500">-$${daily.e.toFixed(2)} <span class="text-xs text-slate-500 font-normal">Gastos</span></p>
                    </div>
                    <div class="bg-black p-6 rounded-3xl border border-white/5">
                        <p class="text-[10px] text-slate-500 font-bold uppercase mb-2">Semana Actual</p>
                        <p class="text-2xl font-black text-emerald-500">$${weekly.s.toFixed(2)}</p>
                        <p class="text-lg font-bold text-white">Balance: $${weekly.b.toFixed(2)}</p>
                    </div>
                    <div class="bg-black p-6 rounded-3xl border border-white/5">
                        <p class="text-[10px] text-slate-500 font-bold uppercase mb-2">Mensual Proyectado</p>
                        <p class="text-2xl font-black text-orange-500">$${monthly.s.toFixed(2)}</p>
                        <p class="text-lg font-bold text-white">Neto: $${monthly.b.toFixed(2)}</p>
                    </div>
                </div>

                <div class="bg-zinc-800/50 p-8 rounded-3xl border border-white/5 text-center mb-12">
                    <i data-lucide="download-cloud" class="mx-auto text-orange-500 mb-4" size="48"></i>
                    <h4 class="text-xl font-bold mb-4">Exportación de Datos Maestros</h4>
                    <div class="flex flex-wrap justify-center gap-4">
                        <button onclick="exportData('csv')" class="bg-orange-500 text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-orange-400">
                            <i data-lucide="file-spreadsheet"></i> EXCEL (.CSV)
                        </button>
                        <button onclick="exportData('json')" class="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-200">
                            <i data-lucide="database"></i> RESPALDO (.JSON)
                        </button>
                    </div>
                </div>

                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-black text-slate-400 uppercase text-xs">Historial Consolidado</h4>
                    <button onclick="clearHistory()" class="text-rose-500 text-[10px] font-bold uppercase hover:underline">Reiniciar Historial</button>
                </div>
                <div class="bg-black rounded-2xl border border-white/5 max-h-64 overflow-y-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="sticky top-0 bg-zinc-900">
                            <tr class="text-slate-500 border-b border-white/10 uppercase">
                                <th class="p-4">Fecha</th>
                                <th class="p-4">Tipo</th>
                                <th class="p-4">Concepto</th>
                                <th class="p-4 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${[...sales, ...expenses].sort((a,b) => new Date(b.date) - new Date(a.date)).map(i => `
                                <tr class="border-b border-white/5">
                                    <td class="p-4 text-slate-500">${new Date(i.date).toLocaleDateString()}</td>
                                    <td class="p-4 font-bold ${i.desc ? 'text-rose-400' : 'text-emerald-400'}">${i.desc ? 'GASTO' : 'VENTA'}</td>
                                    <td class="p-4 text-white">${i.productName || i.desc}</td>
                                    <td class="p-4 text-right font-black">$${(i.price || i.amount).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // --- Operaciones ---
        window.openModal = (type) => {
            document.getElementById('modal-edit').classList.remove('hidden');
            document.getElementById('modal-type-hidden').value = type;
            document.getElementById('inventory-fields').classList.toggle('hidden', type !== 'inventory');
            document.getElementById('sales-fields').classList.toggle('hidden', type !== 'sales');
            document.getElementById('expense-fields').classList.toggle('hidden', type !== 'expenses');
            
            if(type === 'sales') {
                const sel = document.getElementById('sale-product-id');
                sel.innerHTML = inventory.filter(i => i.stock > 0).map(i => `<option value="${i.id}">${i.name} ($${i.price})</option>`).join('');
            }
            lucide.createIcons();
        };

        window.closeModal = () => document.getElementById('modal-edit').classList.add('hidden');

        window.handleFormSubmit = (e) => {
            e.preventDefault();
            const type = document.getElementById('modal-type-hidden').value;
            
            if(type === 'inventory') {
                inventory.push({
                    id: Date.now(),
                    name: document.getElementById('edit-name').value,
                    price: parseFloat(document.getElementById('edit-price').value),
                    stock: parseInt(document.getElementById('edit-stock').value),
                    min: 5
                });
            } else if(type === 'sales') {
                const prodId = parseInt(document.getElementById('sale-product-id').value);
                const p = inventory.find(i => i.id === prodId);
                if(p) {
                    p.stock--;
                    sales.push({
                        id: Date.now(),
                        productName: p.name,
                        price: p.price,
                        vehicle: document.getElementById('sale-vehicle').value || "S/P",
                        carModel: document.getElementById('sale-car-model').value || "Genérico",
                        date: new Date().toISOString()
                    });
                }
            } else {
                expenses.push({
                    id: Date.now(),
                    desc: document.getElementById('exp-desc').value,
                    amount: parseFloat(document.getElementById('exp-amount').value),
                    date: new Date().toISOString()
                });
            }
            saveData();
            closeModal();
            navigate(currentView);
        };

        window.deleteItem = (type, id) => {
            if(type === 'inventory') inventory = inventory.filter(i => i.id !== id);
            else if(type === 'sales') sales = sales.filter(s => s.id !== id);
            else expenses = expenses.filter(e => e.id !== id);
            saveData();
            navigate(currentView);
        };

        window.updateStock = (id, delta) => {
            const i = inventory.find(x => x.id === id);
            if(i) i.stock = Math.max(0, i.stock + delta);
            saveData();
            navigate(currentView);
        };

        function saveData() {
            localStorage.setItem('sm_inventory', JSON.stringify(inventory));
            localStorage.setItem('sm_expenses', JSON.stringify(expenses));
            localStorage.setItem('sm_sales', JSON.stringify(sales));
        }

        window.exportData = (format) => {
            if(format === 'csv') {
                let csv = "FECHA;TIPO;CONCEPTO;VEHICULO;PLACA;MONTO\n";
                sales.forEach(s => csv += `${new Date(s.date).toLocaleDateString()};VENTA;${s.productName};${s.carModel};${s.vehicle};${s.price}\n`);
                expenses.forEach(e => csv += `${new Date(e.date).toLocaleDateString()};GASTO;${e.desc};-;-;${e.amount}\n`);
                const blob = new Blob(["\ufeff" + csv], { type: 'text/csv' });
                download(blob, `Reporte_SIGEA_${new Date().toISOString().split('T')[0]}.csv`);
            } else {
                const data = JSON.stringify({ inventory, sales, expenses }, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                download(blob, `Respaldo_SIGEA_${Date.now()}.json`);
            }
        };

        function download(blob, name) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            a.click();
        }

        window.clearHistory = () => {
            if(confirm("¿Estás completamente seguro? Esto borrará permanentemente el historial de ventas y gastos.")) {
                sales = [];
                expenses = [];
                saveData();
                navigate('reportes');
            }
        };

        function initChart() {
            const ctx = document.getElementById('dashChart');
            if(!ctx) return;
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: inventory.map(i => i.name.split(' ')[0]),
                    datasets: [{
                        label: 'Stock',
                        data: inventory.map(i => i.stock),
                        borderColor: '#ff6b00',
                        tension: 0.4,
                        fill: true,
                        backgroundColor: 'rgba(255, 107, 0, 0.1)'
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { 
                        y: { grid: { color: 'rgba(255,255,255,0.05)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        window.addEventListener('DOMContentLoaded', () => {
            document.getElementById('date-display').innerText = new Date().toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' });
            lucide.createIcons();
        });
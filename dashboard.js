/**
 * DashPoint POS Dashboard Interactive Logic (DASH.webp layout with Blue Palette)
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DEFAULT MENU ITEMS (Matching DASH.webp exactly) ---
    const DEFAULT_DISHES = [
        {
            id: 'dish-1',
            name: 'Japanese Sushi',
            category: 'sweets',
            price: 10.15,
            desc: 'Fresh salmon, tuna rolls with avocado & wasabi',
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
            badge: 'Popular'
        },
        {
            id: 'dish-2',
            name: 'Italian Pasta',
            category: 'pastas',
            price: 20.36,
            desc: 'Penne arrabbiata tossed in garlic herbs & rich tomato sauce',
            image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628120b?auto=format&fit=crop&w=600&q=80',
            badge: 'Chef Choice'
        },
        {
            id: 'dish-3',
            name: 'Luxury Indomie',
            category: 'pastas',
            price: 24.86,
            desc: 'Gourmet ramen noodles with soft poached egg & scallions',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
            badge: 'Special'
        },
        {
            id: 'dish-4',
            name: 'Milky Banana Juice',
            category: 'drinks',
            price: 18.23,
            desc: 'Creamy banana puree with vanilla cream & cold milk',
            image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
            badge: 'Drinks'
        },
        {
            id: 'dish-5',
            name: 'Mozarella Pizza',
            category: 'pizza',
            price: 46.23,
            desc: 'Wood-fired crust with fresh basil & buffalo mozzarella',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
            badge: 'Best Seller'
        },
        {
            id: 'dish-6',
            name: 'Burger Delux',
            category: 'burger',
            price: 18.35,
            desc: 'Double beef patty with melted cheddar, lettuce & crispy fries',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
            badge: 'Top Rated'
        },
        {
            id: 'dish-7',
            name: 'Tacos Salsa With Chicken',
            category: 'burger',
            price: 35.49,
            desc: 'Three grilled chicken soft corn tacos with lime & salsa verde',
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
            badge: 'Mexican'
        },
        {
            id: 'dish-8',
            name: 'Orginal Meat Burger',
            category: 'burger',
            price: 25.54,
            desc: 'Brioche bun, charred angus beef patty with truffle mayo',
            image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
            badge: 'Signature'
        }
    ];

    // --- 2. ACTIVE ORDERS STATE (Matching DASH.webp defaults) ---
    let activeOrders = JSON.parse(localStorage.getItem('dashpoint_orders')) || [
        {
            id: 'ORD-1006',
            table: 'T6',
            customer: 'James Hall',
            orderType: 'dine-in',
            status: 'Ready',
            items: [
                { id: 'dish-2', name: 'Italian Pasta', price: 20.36, qty: 2, image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628120b?auto=format&fit=crop&w=600&q=80' },
                { id: 'dish-6', name: 'Burger Delux', price: 18.35, qty: 3, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
                { id: 'dish-1', name: 'Japanese Sushi', price: 10.15, qty: 2, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80' },
                { id: 'dish-8', name: 'Orginal Meat Burger', price: 35.49, qty: 1, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80' }
            ]
        },
        {
            id: 'ORD-1007',
            table: 'T7',
            customer: 'John Dukes',
            orderType: 'dine-in',
            status: 'in process',
            items: [
                { id: 'dish-5', name: 'Mozarella Pizza', price: 46.23, qty: 1, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
                { id: 'dish-4', name: 'Milky Banana Juice', price: 18.23, qty: 2, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80' }
            ]
        },
        {
            id: 'ORD-1008',
            table: 'T8',
            customer: 'Paula Mora',
            orderType: 'dine-in',
            status: 'in process',
            items: [
                { id: 'dish-7', name: 'Tacos Salsa With Chicken', price: 35.49, qty: 2, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80' },
                { id: 'dish-6', name: 'Burger Delux', price: 18.35, qty: 3, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
                { id: 'dish-4', name: 'Milky Banana Juice', price: 18.23, qty: 2, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80' }
            ]
        }
    ];

    let customDishes = JSON.parse(localStorage.getItem('dashpoint_custom_dishes')) || [];
    let reservations = JSON.parse(localStorage.getItem('dashpoint_reservations')) || [
        { name: 'Michael Scott', table: 'T1', guests: 4, time: '19:30' },
        { name: 'Pam Beesly', table: 'T4', guests: 2, time: '20:00' }
    ];

    let currentSelectedTable = 'T6';
    let currentCategory = 'all';
    let currentSearchTerm = '';
    let selectedPaymentMethod = 'Cash';

    // Tax & Discount configuration
    const TAX_RATE = 0.10; // 10%
    const DISCOUNT_RATE = 0.20; // 20%

    // --- 3. DOM ELEMENT REFERENCES ---
    const dishesContainer = document.getElementById('dishes-container');
    const categoryPicker = document.getElementById('category-picker');
    const searchInput = document.getElementById('menu-search-input');
    const orderCarousel = document.getElementById('order-lists-carousel');
    
    // Billing Sidebar DOM
    const billingTableName = document.getElementById('billing-table-name');
    const billingCustomerName = document.getElementById('billing-customer-name');
    const cartItemsList = document.getElementById('cart-items-list');
    const billSubtotal = document.getElementById('bill-subtotal');
    const billTax = document.getElementById('bill-tax');
    const billDiscount = document.getElementById('bill-discount');
    const billGrandTotal = document.getElementById('bill-grand-total');
    const btnPayBills = document.getElementById('btn-pay-bills');

    // Views
    const navLinks = document.querySelectorAll('.sidebar-menu .nav-link');
    const viewPanes = document.querySelectorAll('.view-pane');
    const pageHeading = document.getElementById('page-heading');

    // --- 4. RENDER DISHES GRID ---
    function getAllDishes() {
        return [...DEFAULT_DISHES, ...customDishes];
    }

    function renderDishesGrid() {
        const allDishes = getAllDishes();
        const activeOrder = getActiveOrder();

        const filtered = allDishes.filter(dish => {
            const matchesCat = (currentCategory === 'all') || (dish.category === currentCategory);
            const matchesSearch = dish.name.toLowerCase().includes(currentSearchTerm) || 
                                  dish.desc.toLowerCase().includes(currentSearchTerm);
            return matchesCat && matchesSearch;
        });

        dishesContainer.innerHTML = '';

        if (filtered.length === 0) {
            dishesContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #94a3b8;">
                    <p style="font-size: 1.1rem; font-weight: 600;">No dishes found matching your criteria.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(dish => {
            // Check if this dish is in current table's order
            const itemInCart = activeOrder ? activeOrder.items.find(i => i.name === dish.name) : null;
            const inOrder = !!itemInCart;
            const qty = itemInCart ? itemInCart.qty : 0;

            const card = document.createElement('div');
            card.className = `dish-card ${inOrder ? 'in-order-mode' : ''}`;
            card.id = `card-${dish.id}`;

            card.innerHTML = `
                <div class="dish-image-wrap">
                    <img src="${dish.image}" alt="${dish.name}" class="dish-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'">
                    <span class="dish-badge">${dish.badge || 'Fresh'}</span>
                </div>
                <div class="dish-body">
                    <h4 class="dish-title">${dish.name}</h4>
                    <p class="dish-desc">${dish.desc}</p>
                    <div class="dish-footer">
                        <span class="dish-price">$${dish.price.toFixed(2)}</span>
                        ${inOrder ? `
                            <div class="counter-controls-pill">
                                <button class="counter-btn" onclick="updateItemQuantity('${dish.name}', -1)">-</button>
                                <span class="counter-val">${qty}</span>
                                <button class="counter-btn" onclick="updateItemQuantity('${dish.name}', 1)">+</button>
                            </div>
                        ` : `
                            <button class="btn-add-dish" onclick="addDishToCurrentOrder('${dish.id}')" title="Add to Order">+</button>
                        `}
                    </div>
                </div>
            `;
            dishesContainer.appendChild(card);
        });
    }

    // --- 5. RENDER ORDER LISTS CAROUSEL ---
    function renderOrderCarousel() {
        orderCarousel.innerHTML = '';

        activeOrders.forEach(order => {
            const isSelected = order.table === currentSelectedTable;
            const totalItemsCount = order.items.reduce((acc, i) => acc + i.qty, 0);

            const card = document.createElement('div');
            card.className = `order-card ${isSelected ? 'card-primary' : ''}`;
            card.setAttribute('data-table', order.table);

            const isReady = order.status === 'Ready';
            const statusClass = isReady ? 'status-ready' : 'status-process';

            card.innerHTML = `
                <div class="table-badge">${order.table}</div>
                <div class="order-details">
                    <div class="customer-row">
                        <span class="customer-name">${order.customer}</span>
                        <span class="status-pill ${statusClass}">${order.status}</span>
                    </div>
                    <div class="items-status">${totalItemsCount} Items &rarr; ${isReady ? 'Ready to Serve' : 'Kitchen'}</div>
                </div>
            `;

            card.addEventListener('click', () => {
                currentSelectedTable = order.table;
                renderOrderCarousel();
                renderBillingSidebar();
                renderDishesGrid();
            });

            orderCarousel.appendChild(card);
        });

        // Add "New Order" quick card at the end
        const addCard = document.createElement('button');
        addCard.className = 'order-card add-order-card';
        addCard.id = 'btn-quick-new-order';
        addCard.innerHTML = `
            <div class="add-icon">+</div>
            <span>New Order</span>
        `;
        addCard.addEventListener('click', () => {
            promptCreateNewOrder();
        });
        orderCarousel.appendChild(addCard);

        document.getElementById('sidebar-order-count').textContent = activeOrders.length;
    }

    // --- 6. RENDER RIGHT BILLING SIDEBAR ---
    function getActiveOrder() {
        return activeOrders.find(o => o.table === currentSelectedTable);
    }

    function renderBillingSidebar() {
        const activeOrder = getActiveOrder();

        if (!activeOrder) {
            billingTableName.textContent = currentSelectedTable;
            billingCustomerName.textContent = 'Vacant Table';
            cartItemsList.innerHTML = `
                <div style="text-align: center; padding: 2rem 1rem; color: #94a3b8;">
                    <p style="font-weight: 600;">No active order for ${currentSelectedTable}.</p>
                    <button class="btn btn-primary btn-sm mt-3" onclick="promptCreateNewOrder('${currentSelectedTable}')">+ Start Order</button>
                </div>
            `;
            billSubtotal.textContent = '$0.00';
            billTax.textContent = '$0.00';
            billDiscount.textContent = '$0.00';
            billGrandTotal.textContent = '$0.00';
            btnPayBills.disabled = true;
            btnPayBills.style.opacity = '0.5';
            return;
        }

        btnPayBills.disabled = false;
        btnPayBills.style.opacity = '1';

        billingTableName.textContent = `Table ${activeOrder.table.replace('T', '')}`;
        billingCustomerName.textContent = activeOrder.customer;

        cartItemsList.innerHTML = '';

        let subtotal = 0;

        activeOrder.items.forEach(item => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;

            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-thumb" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80'">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="cart-qty-btn" onclick="updateItemQuantity('${item.name}', -1)">-</button>
                    <span class="cart-qty-val">${item.qty}</span>
                    <button class="cart-qty-btn" onclick="updateItemQuantity('${item.name}', 1)">+</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                <button class="cart-remove-btn" onclick="removeItemFromOrder('${item.name}')" title="Remove item">&times;</button>
            `;
            cartItemsList.appendChild(row);
        });

        const tax = subtotal * TAX_RATE;
        const discount = subtotal * DISCOUNT_RATE;
        const grandTotal = Math.max(0, subtotal + tax - discount);

        billSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        billTax.textContent = `$${tax.toFixed(2)}`;
        billDiscount.textContent = `-$${discount.toFixed(2)}`;
        billGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;
    }

    // --- 7. CART & ORDER ACTIONS ---
    window.addDishToCurrentOrder = function(dishId) {
        let activeOrder = getActiveOrder();
        const allDishes = getAllDishes();
        const dish = allDishes.find(d => d.id === dishId);

        if (!dish) return;

        if (!activeOrder) {
            // Auto-create order for this table
            activeOrder = {
                id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
                table: currentSelectedTable,
                customer: 'Guest (' + currentSelectedTable + ')',
                orderType: 'dine-in',
                status: 'in process',
                items: []
            };
            activeOrders.push(activeOrder);
        }

        const existing = activeOrder.items.find(i => i.name === dish.name);
        if (existing) {
            existing.qty += 1;
        } else {
            activeOrder.items.push({
                id: dish.id,
                name: dish.name,
                price: dish.price,
                qty: 1,
                image: dish.image
            });
        }

        saveOrdersToStorage();
        renderBillingSidebar();
        renderOrderCarousel();
        renderDishesGrid();
    };

    window.updateItemQuantity = function(dishName, delta) {
        const activeOrder = getActiveOrder();
        if (!activeOrder) return;

        const item = activeOrder.items.find(i => i.name === dishName);
        if (!item) return;

        item.qty += delta;

        if (item.qty <= 0) {
            activeOrder.items = activeOrder.items.filter(i => i.name !== dishName);
        }

        saveOrdersToStorage();
        renderBillingSidebar();
        renderOrderCarousel();
        renderDishesGrid();
    };

    window.removeItemFromOrder = function(dishName) {
        const activeOrder = getActiveOrder();
        if (!activeOrder) return;

        activeOrder.items = activeOrder.items.filter(i => i.name !== dishName);

        saveOrdersToStorage();
        renderBillingSidebar();
        renderOrderCarousel();
        renderDishesGrid();
    };

    function saveOrdersToStorage() {
        localStorage.setItem('dashpoint_orders', JSON.stringify(activeOrders));
    }

    window.promptCreateNewOrder = function(preferredTable = null) {
        const tableNum = preferredTable || prompt('Enter Table Number (e.g. T1, T2, T9):', 'T9');
        if (!tableNum) return;

        const formattedTable = tableNum.toUpperCase().startsWith('T') ? tableNum.toUpperCase() : 'T' + tableNum;
        const customerName = prompt('Enter Customer Name:', 'New Guest') || 'Guest';

        let existing = activeOrders.find(o => o.table === formattedTable);
        if (existing) {
            currentSelectedTable = formattedTable;
        } else {
            activeOrders.push({
                id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
                table: formattedTable,
                customer: customerName,
                orderType: 'dine-in',
                status: 'in process',
                items: []
            });
            currentSelectedTable = formattedTable;
            saveOrdersToStorage();
        }

        renderOrderCarousel();
        renderBillingSidebar();
        renderDishesGrid();
        renderTablesFloorMap();
    };

    // --- 8. CATEGORY PICKER & SEARCH ---
    categoryPicker.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-card');
        if (!btn) return;

        document.querySelectorAll('.category-card').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentCategory = btn.getAttribute('data-category');
        renderDishesGrid();
    });

    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        renderDishesGrid();
    });

    // --- 9. NAVIGATION / VIEW SWITCHER ---
    window.switchNavTab = function(viewId) {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-view') === viewId);
        });

        viewPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `view-${viewId}`);
        });

        const capitalized = viewId.charAt(0).toUpperCase() + viewId.slice(1);
        pageHeading.textContent = capitalized;

        if (viewId === 'tables') renderTablesFloorMap();
        if (viewId === 'orders') renderOrdersTableView();
        if (viewId === 'dashboard') renderDashboardKPIs();
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            switchNavTab(view);
        });
    });

    // --- 10. TABLES FLOOR MAP & RESERVATIONS ---
    function renderTablesFloorMap() {
        const grid = document.getElementById('tables-map-grid');
        const selectBox = document.getElementById('res-table');
        const occupiedSet = new Set(activeOrders.map(o => o.table));

        grid.innerHTML = '';
        selectBox.innerHTML = '';

        let vacantCount = 0;
        let occupiedCount = 0;

        for (let i = 1; i <= 20; i++) {
            const tCode = `T${i}`;
            const isOccupied = occupiedSet.has(tCode);

            if (isOccupied) occupiedCount++;
            else {
                vacantCount++;
                const opt = document.createElement('option');
                opt.value = tCode;
                opt.textContent = `Table ${i} (Vacant)`;
                selectBox.appendChild(opt);
            }

            const slot = document.createElement('div');
            slot.className = `table-slot-card ${isOccupied ? 'occupied' : 'vacant'}`;
            slot.innerHTML = `
                <div class="slot-num">${tCode}</div>
                <div class="slot-status">${isOccupied ? 'Occupied' : 'Free'}</div>
            `;

            slot.addEventListener('click', () => {
                currentSelectedTable = tCode;
                switchNavTab('menu');
                renderOrderCarousel();
                renderBillingSidebar();
                renderDishesGrid();
            });

            grid.appendChild(slot);
        }

        document.getElementById('legend-vacant-count').textContent = vacantCount;
        document.getElementById('legend-occupied-count').textContent = occupiedCount;

        renderReservationsList();
    }

    function renderReservationsList() {
        const list = document.getElementById('reservations-list');
        list.innerHTML = '';

        if (reservations.length === 0) {
            list.innerHTML = `<p class="text-muted text-sm">No reservations scheduled.</p>`;
            return;
        }

        reservations.forEach((res, idx) => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.padding = '0.6rem 0';
            item.style.borderBottom = '1px solid #f1f5f9';
            item.style.fontSize = '0.875rem';

            item.innerHTML = `
                <div>
                    <strong>${res.name}</strong> (${res.table})<br>
                    <span class="text-muted text-sm">${res.guests} Guests • ${res.time}</span>
                </div>
                <button class="btn btn-outline btn-sm" onclick="cancelReservation(${idx})">Cancel</button>
            `;
            list.appendChild(item);
        });
    }

    window.cancelReservation = function(idx) {
        reservations.splice(idx, 1);
        localStorage.setItem('dashpoint_reservations', JSON.stringify(reservations));
        renderReservationsList();
    };

    document.getElementById('reservation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('res-name').value;
        const table = document.getElementById('res-table').value;
        const guests = document.getElementById('res-guests').value;
        const time = document.getElementById('res-time').value;

        reservations.push({ name, table, guests, time });
        localStorage.setItem('dashpoint_reservations', JSON.stringify(reservations));

        // Start order for this table
        activeOrders.push({
            id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
            table: table,
            customer: name,
            orderType: 'dine-in',
            status: 'Ready',
            items: []
        });
        saveOrdersToStorage();

        e.target.reset();
        renderTablesFloorMap();
        alert(`Table ${table} successfully reserved for ${name}!`);
    });

    // --- 11. ORDERS TABLE VIEW ---
    function renderOrdersTableView() {
        const tbody = document.getElementById('orders-table-body');
        tbody.innerHTML = '';

        if (activeOrders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No active orders found.</td></tr>`;
            return;
        }

        activeOrders.forEach(order => {
            const total = order.items.reduce((acc, i) => acc + (i.price * i.qty), 0);
            const itemsSummary = order.items.map(i => `${i.name} (x${i.qty})`).join(', ') || 'No items yet';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${order.id}</strong></td>
                <td><span class="badge badge-success">${order.table}</span></td>
                <td>${order.customer}</td>
                <td style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${itemsSummary}</td>
                <td><strong>$${total.toFixed(2)}</strong></td>
                <td><span class="status-pill ${order.status === 'Ready' ? 'status-ready' : 'status-process'}">${order.status}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="selectAndGoToOrder('${order.table}')">View</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.selectAndGoToOrder = function(tableCode) {
        currentSelectedTable = tableCode;
        switchNavTab('menu');
        renderOrderCarousel();
        renderBillingSidebar();
        renderDishesGrid();
    };

    // --- 12. DASHBOARD OVERVIEW KPIS ---
    function renderDashboardKPIs() {
        let totalRev = 1428.50;
        activeOrders.forEach(o => {
            const sub = o.items.reduce((a, i) => a + (i.price * i.qty), 0);
            totalRev += sub;
        });

        document.getElementById('kpi-revenue').textContent = `$${totalRev.toFixed(2)}`;
        document.getElementById('kpi-orders').textContent = 38 + activeOrders.length;
        document.getElementById('kpi-occupied-tables').textContent = `${activeOrders.length} / 20`;
        document.getElementById('kpi-vacant-tables').textContent = `${20 - activeOrders.length} Vacant Tables`;
    }

    // --- 13. MODALS (ADD CUSTOM DISH & RECEIPT) ---
    const dishModal = document.getElementById('dish-modal');
    const receiptModal = document.getElementById('receipt-modal');

    window.openDishModal = function() { dishModal.classList.add('active'); };
    window.closeDishModal = function() { dishModal.classList.remove('active'); };

    document.getElementById('btn-open-dish-modal').addEventListener('click', openDishModal);

    document.getElementById('custom-dish-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('modal-dish-name').value;
        const category = document.getElementById('modal-dish-category').value;
        const price = parseFloat(document.getElementById('modal-dish-price').value);
        const desc = document.getElementById('modal-dish-desc').value;
        const img = document.getElementById('modal-dish-img').value || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

        const newDish = {
            id: 'dish-' + (Date.now()),
            name: name,
            category: category,
            price: price,
            desc: desc,
            image: img,
            badge: 'New'
        };

        customDishes.push(newDish);
        localStorage.setItem('dashpoint_custom_dishes', JSON.stringify(customDishes));

        e.target.reset();
        closeDishModal();
        renderDishesGrid();
        alert(`"${name}" has been added to the menu!`);
    });

    // Pay Bills Action
    btnPayBills.addEventListener('click', () => {
        const activeOrder = getActiveOrder();
        if (!activeOrder || activeOrder.items.length === 0) {
            alert('Cannot pay bill for an empty order!');
            return;
        }

        const subtotal = activeOrder.items.reduce((a, i) => a + (i.price * i.qty), 0);
        const tax = subtotal * TAX_RATE;
        const discount = subtotal * DISCOUNT_RATE;
        const grandTotal = subtotal + tax - discount;

        document.getElementById('receipt-timestamp').textContent = new Date().toLocaleString();
        
        let itemsHtml = `<div style="margin-bottom: 0.75rem;"><strong>Table:</strong> ${activeOrder.table} | <strong>Guest:</strong> ${activeOrder.customer}</div>`;
        itemsHtml += `<div style="margin-bottom: 0.75rem;"><strong>Payment Method:</strong> ${selectedPaymentMethod}</div><hr style="border:none; border-top:1px dashed #cbd5e1; margin:0.5rem 0;">`;

        activeOrder.items.forEach(i => {
            itemsHtml += `
                <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                    <span>${i.name} x${i.qty}</span>
                    <span>$${(i.price * i.qty).toFixed(2)}</span>
                </div>
            `;
        });

        itemsHtml += `
            <hr style="border:none; border-top:1px dashed #cbd5e1; margin:0.5rem 0;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:1rem; margin-top:0.5rem;">
                <span>Total Paid</span>
                <span style="color:#2563eb;">$${grandTotal.toFixed(2)}</span>
            </div>
        `;

        document.getElementById('receipt-content').innerHTML = itemsHtml;
        receiptModal.classList.add('active');

        // Complete & clear order
        activeOrders = activeOrders.filter(o => o.table !== activeOrder.table);
        saveOrdersToStorage();
    });

    window.closeReceiptModal = function() {
        receiptModal.classList.remove('active');
        renderOrderCarousel();
        renderBillingSidebar();
        renderDishesGrid();
        renderTablesFloorMap();
    };

    // Payment Method selection
    document.querySelectorAll('.payment-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.payment-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedPaymentMethod = pill.getAttribute('data-method');
        });
    });

    // Dine In / Take Away selector
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const activeOrder = getActiveOrder();
            if (activeOrder) {
                activeOrder.orderType = btn.getAttribute('data-type');
                saveOrdersToStorage();
            }
        });
    });

    // See all buttons
    document.getElementById('btn-see-all-orders')?.addEventListener('click', () => switchNavTab('orders'));
    document.getElementById('btn-see-all-categories')?.addEventListener('click', () => {
        currentCategory = 'all';
        document.querySelectorAll('.category-card').forEach(b => b.classList.toggle('active', b.getAttribute('data-category') === 'all'));
        renderDishesGrid();
    });

    // --- 14. INITIALIZE DASHBOARD ---
    renderOrderCarousel();
    renderBillingSidebar();
    renderDishesGrid();
    renderTablesFloorMap();
});

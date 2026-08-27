/**
 * DashPoint POS Dashboard Interactive Logic (DASH.webp layout with Blue Palette)
 * Includes comprehensive HTML5 + JavaScript client-side form validation
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Helper Validation & Feedback Functions ---
    const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

    function setError(inputElement, errorElement, message) {
        if (!inputElement || !errorElement) return;
        inputElement.classList.add('is-invalid');
        inputElement.classList.remove('is-valid');
        inputElement.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function setSuccess(inputElement, errorElement) {
        if (!inputElement || !errorElement) return;
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        inputElement.setAttribute('aria-invalid', 'false');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function clearStatus(inputElement, errorElement) {
        if (!inputElement || !errorElement) return;
        inputElement.classList.remove('is-invalid');
        inputElement.classList.remove('is-valid');
        inputElement.removeAttribute('aria-invalid');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function triggerShake(element) {
        if (!element) return;
        element.classList.remove('shake-animation');
        void element.offsetWidth; // Force reflow
        element.classList.add('shake-animation');
    }

    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close-btn" title="Close">&times;</button>
        `;
        toast.querySelector('.toast-close-btn').addEventListener('click', () => {
            toast.remove();
        });
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

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

    // --- 2. POS CONFIGURATION & STATE ---
    let savedSettings = JSON.parse(localStorage.getItem('dashpoint_settings')) || {
        tax: 10,
        discount: 20,
        currency: '$'
    };

    let TAX_RATE = (savedSettings.tax || 10) / 100;
    let DISCOUNT_RATE = (savedSettings.discount || 20) / 100;
    let CURRENCY_SYMBOL = savedSettings.currency || '$';

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

    // Update logged in user name if available
    const loggedUser = JSON.parse(localStorage.getItem('dashpoint_current_user'));
    if (loggedUser && loggedUser.name) {
        const userNameEl = document.querySelector('.user-name');
        if (userNameEl) userNameEl.textContent = loggedUser.name;
    }

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
    const billTaxPercent = document.getElementById('bill-tax-percent');
    const billDiscount = document.getElementById('bill-discount');
    const billDiscountPercent = document.getElementById('bill-discount-percent');
    const billGrandTotal = document.getElementById('bill-grand-total');
    const btnPayBills = document.getElementById('btn-pay-bills');

    // Views
    const navLinks = document.querySelectorAll('.sidebar-menu .nav-link');
    const viewPanes = document.querySelectorAll('.view-pane');
    const pageHeading = document.getElementById('page-heading');

    // Sync initial settings to form fields and labels
    const settingTaxInput = document.getElementById('setting-tax');
    const settingDiscountInput = document.getElementById('setting-discount');
    const settingCurrencyInput = document.getElementById('setting-currency');

    if (settingTaxInput) settingTaxInput.value = savedSettings.tax;
    if (settingDiscountInput) settingDiscountInput.value = savedSettings.discount;
    if (settingCurrencyInput) settingCurrencyInput.value = savedSettings.currency;
    if (billTaxPercent) billTaxPercent.textContent = `${savedSettings.tax}%`;
    if (billDiscountPercent) billDiscountPercent.textContent = `${savedSettings.discount}%`;

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
                        <span class="dish-price">${CURRENCY_SYMBOL}${dish.price.toFixed(2)}</span>
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

        const badgeEl = document.getElementById('sidebar-order-count');
        if (badgeEl) badgeEl.textContent = activeOrders.length;
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
            billSubtotal.textContent = `${CURRENCY_SYMBOL}0.00`;
            billTax.textContent = `${CURRENCY_SYMBOL}0.00`;
            billDiscount.textContent = `${CURRENCY_SYMBOL}0.00`;
            billGrandTotal.textContent = `${CURRENCY_SYMBOL}0.00`;
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
                    <div class="cart-item-price">${CURRENCY_SYMBOL}${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="cart-qty-btn" onclick="updateItemQuantity('${item.name}', -1)">-</button>
                    <span class="cart-qty-val">${item.qty}</span>
                    <button class="cart-qty-btn" onclick="updateItemQuantity('${item.name}', 1)">+</button>
                </div>
                <div class="cart-item-total">${CURRENCY_SYMBOL}${itemTotal.toFixed(2)}</div>
                <button class="cart-remove-btn" onclick="removeItemFromOrder('${item.name}')" title="Remove item">&times;</button>
            `;
            cartItemsList.appendChild(row);
        });

        const tax = subtotal * TAX_RATE;
        const discount = subtotal * DISCOUNT_RATE;
        const grandTotal = Math.max(0, subtotal + tax - discount);

        billSubtotal.textContent = `${CURRENCY_SYMBOL}${subtotal.toFixed(2)}`;
        billTax.textContent = `${CURRENCY_SYMBOL}${tax.toFixed(2)}`;
        billDiscount.textContent = `-${CURRENCY_SYMBOL}${discount.toFixed(2)}`;
        billGrandTotal.textContent = `${CURRENCY_SYMBOL}${grandTotal.toFixed(2)}`;
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
        showToast(`Added ${dish.name} to ${activeOrder.table}`, 'info');
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
        showToast(`Removed ${dishName}`, 'info');
    };

    function saveOrdersToStorage() {
        localStorage.setItem('dashpoint_orders', JSON.stringify(activeOrders));
    }

    window.promptCreateNewOrder = function(preferredTable = null) {
        let tableNum = preferredTable;
        if (!tableNum) {
            tableNum = prompt('Enter Table Number (e.g. T1, T2, T9, 10):', 'T9');
            if (tableNum === null) return; // User cancelled
            tableNum = tableNum.trim();
        }

        if (!tableNum) {
            showToast('Table number is required to start an order.', 'error');
            return;
        }

        // Validate table format
        const cleanNum = tableNum.replace(/[^0-9]/g, '');
        const tableInt = parseInt(cleanNum, 10);
        if (isNaN(tableInt) || tableInt < 1 || tableInt > 20) {
            showToast('Please enter a valid table number between T1 and T20.', 'error');
            return;
        }

        const formattedTable = `T${tableInt}`;
        let customerName = prompt('Enter Customer Name:', 'New Guest');
        if (customerName === null) return;
        customerName = customerName.trim() || 'Guest';

        let existing = activeOrders.find(o => o.table === formattedTable);
        if (existing) {
            currentSelectedTable = formattedTable;
            showToast(`Switched to active order for Table ${formattedTable}`, 'info');
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
            showToast(`Order created for Table ${formattedTable} (${customerName})`, 'success');
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

    // --- 10. TABLES FLOOR MAP & RESERVATION FORM VALIDATION ---
    function renderTablesFloorMap() {
        const grid = document.getElementById('tables-map-grid');
        const selectBox = document.getElementById('res-table');
        const occupiedSet = new Set(activeOrders.map(o => o.table));

        grid.innerHTML = '';
        selectBox.innerHTML = '';

        let vacantCount = 0;
        let occupiedCount = 0;

        // Default empty option for select
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = '-- Select Vacant Table --';
        selectBox.appendChild(defaultOpt);

        for (let i = 1; i <= 20; i++) {
            const tCode = `T${i}`;
            const isOccupied = occupiedSet.has(tCode);

            if (isOccupied) {
                occupiedCount++;
            } else {
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

        const vacantCountEl = document.getElementById('legend-vacant-count');
        const occupiedCountEl = document.getElementById('legend-occupied-count');
        if (vacantCountEl) vacantCountEl.textContent = vacantCount;
        if (occupiedCountEl) occupiedCountEl.textContent = occupiedCount;

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
        const cancelled = reservations[idx];
        reservations.splice(idx, 1);
        localStorage.setItem('dashpoint_reservations', JSON.stringify(reservations));
        renderReservationsList();
        if (cancelled) showToast(`Reservation for ${cancelled.name} cancelled.`, 'info');
    };

    // --- 10.1 RESERVATION FORM JS VALIDATION ---
    const reservationForm = document.getElementById('reservation-form');
    const resNameInput = document.getElementById('res-name');
    const resTableSelect = document.getElementById('res-table');
    const resGuestsInput = document.getElementById('res-guests');
    const resTimeInput = document.getElementById('res-time');

    const resNameError = document.getElementById('res-name-error');
    const resTableError = document.getElementById('res-table-error');
    const resGuestsError = document.getElementById('res-guests-error');
    const resTimeError = document.getElementById('res-time-error');

    function validateResName(showEmpty = true) {
        const val = resNameInput.value.trim();
        if (val === '') {
            if (showEmpty) setError(resNameInput, resNameError, 'Customer name is required.');
            else clearStatus(resNameInput, resNameError);
            return false;
        }
        if (val.length < 2) {
            setError(resNameInput, resNameError, 'Name must be at least 2 characters.');
            return false;
        }
        if (!NAME_REGEX.test(val)) {
            setError(resNameInput, resNameError, 'Name can only contain letters, spaces, and hyphens.');
            return false;
        }
        setSuccess(resNameInput, resNameError);
        return true;
    }

    function validateResTable(showEmpty = true) {
        const val = resTableSelect.value;
        if (!val) {
            if (showEmpty) setError(resTableSelect, resTableError, 'Please select a vacant table.');
            else clearStatus(resTableSelect, resTableError);
            return false;
        }
        setSuccess(resTableSelect, resTableError);
        return true;
    }

    function validateResGuests(showEmpty = true) {
        const val = parseInt(resGuestsInput.value, 10);
        if (isNaN(val) || resGuestsInput.value.trim() === '') {
            if (showEmpty) setError(resGuestsInput, resGuestsError, 'Number of guests is required.');
            else clearStatus(resGuestsInput, resGuestsError);
            return false;
        }
        if (val < 1 || val > 12) {
            setError(resGuestsInput, resGuestsError, 'Guests must be between 1 and 12.');
            return false;
        }
        setSuccess(resGuestsInput, resGuestsError);
        return true;
    }

    function validateResTime(showEmpty = true) {
        const val = resTimeInput.value;
        if (!val) {
            if (showEmpty) setError(resTimeInput, resTimeError, 'Booking time is required.');
            else clearStatus(resTimeInput, resTimeError);
            return false;
        }
        setSuccess(resTimeInput, resTimeError);
        return true;
    }

    resNameInput.addEventListener('input', () => {
        if (resNameInput.classList.contains('is-invalid') || resNameInput.value.length >= 2) validateResName(true);
    });
    resNameInput.addEventListener('blur', () => validateResName(true));

    resTableSelect.addEventListener('change', () => validateResTable(true));
    resGuestsInput.addEventListener('input', () => validateResGuests(true));
    resTimeInput.addEventListener('input', () => validateResTime(true));

    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const isNameValid = validateResName(true);
        const isTableValid = validateResTable(true);
        const isGuestsValid = validateResGuests(true);
        const isTimeValid = validateResTime(true);

        if (!isNameValid || !isTableValid || !isGuestsValid || !isTimeValid) {
            triggerShake(reservationForm);
            if (!isNameValid) resNameInput.focus();
            else if (!isTableValid) resTableSelect.focus();
            else if (!isGuestsValid) resGuestsInput.focus();
            else resTimeInput.focus();
            return;
        }

        const name = resNameInput.value.trim();
        const table = resTableSelect.value;
        const guests = parseInt(resGuestsInput.value, 10);
        const time = resTimeInput.value;

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

        reservationForm.reset();
        clearStatus(resNameInput, resNameError);
        clearStatus(resTableSelect, resTableError);
        clearStatus(resGuestsInput, resGuestsError);
        clearStatus(resTimeInput, resTimeError);

        renderTablesFloorMap();
        showToast(`Table ${table} successfully reserved for ${name}!`, 'success');
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
                <td><strong>${CURRENCY_SYMBOL}${total.toFixed(2)}</strong></td>
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

        const revEl = document.getElementById('kpi-revenue');
        const ordEl = document.getElementById('kpi-orders');
        const occEl = document.getElementById('kpi-occupied-tables');
        const vacEl = document.getElementById('kpi-vacant-tables');

        if (revEl) revEl.textContent = `${CURRENCY_SYMBOL}${totalRev.toFixed(2)}`;
        if (ordEl) ordEl.textContent = 38 + activeOrders.length;
        if (occEl) occEl.textContent = `${activeOrders.length} / 20`;
        if (vacEl) vacEl.textContent = `${20 - activeOrders.length} Vacant Tables`;
    }

    // --- 13. MODALS (ADD CUSTOM DISH & RECEIPT) ---
    const dishModal = document.getElementById('dish-modal');
    const receiptModal = document.getElementById('receipt-modal');

    window.openDishModal = function() { dishModal.classList.add('active'); };
    window.closeDishModal = function() {
        dishModal.classList.remove('active');
        clearStatus(dishNameInput, dishNameError);
        clearStatus(dishCatSelect, dishCatError);
        clearStatus(dishPriceInput, dishPriceError);
        clearStatus(dishDescInput, dishDescError);
        clearStatus(dishImgInput, dishImgError);
    };

    const openDishBtn = document.getElementById('btn-open-dish-modal');
    if (openDishBtn) openDishBtn.addEventListener('click', openDishModal);

    // --- 13.1 CUSTOM DISH FORM JS VALIDATION ---
    const customDishForm = document.getElementById('custom-dish-form');
    const dishNameInput = document.getElementById('modal-dish-name');
    const dishCatSelect = document.getElementById('modal-dish-category');
    const dishPriceInput = document.getElementById('modal-dish-price');
    const dishDescInput = document.getElementById('modal-dish-desc');
    const dishImgInput = document.getElementById('modal-dish-img');

    const dishNameError = document.getElementById('modal-dish-name-error');
    const dishCatError = document.getElementById('modal-dish-category-error');
    const dishPriceError = document.getElementById('modal-dish-price-error');
    const dishDescError = document.getElementById('modal-dish-desc-error');
    const dishImgError = document.getElementById('modal-dish-img-error');

    function validateDishName(showEmpty = true) {
        const val = dishNameInput.value.trim();
        if (val === '') {
            if (showEmpty) setError(dishNameInput, dishNameError, 'Dish name is required.');
            else clearStatus(dishNameInput, dishNameError);
            return false;
        }
        if (val.length < 2) {
            setError(dishNameInput, dishNameError, 'Dish name must be at least 2 characters.');
            return false;
        }
        setSuccess(dishNameInput, dishNameError);
        return true;
    }

    function validateDishCategory(showEmpty = true) {
        const val = dishCatSelect.value;
        if (!val) {
            if (showEmpty) setError(dishCatSelect, dishCatError, 'Please select a dish category.');
            else clearStatus(dishCatSelect, dishCatError);
            return false;
        }
        setSuccess(dishCatSelect, dishCatError);
        return true;
    }

    function validateDishPrice(showEmpty = true) {
        const val = parseFloat(dishPriceInput.value);
        if (isNaN(val) || dishPriceInput.value.trim() === '') {
            if (showEmpty) setError(dishPriceInput, dishPriceError, 'Price is required.');
            else clearStatus(dishPriceInput, dishPriceError);
            return false;
        }
        if (val < 0.50) {
            setError(dishPriceInput, dishPriceError, 'Price must be at least $0.50.');
            return false;
        }
        if (val > 999.99) {
            setError(dishPriceInput, dishPriceError, 'Price cannot exceed $999.99.');
            return false;
        }
        setSuccess(dishPriceInput, dishPriceError);
        return true;
    }

    function validateDishDesc(showEmpty = true) {
        const val = dishDescInput.value.trim();
        if (val === '') {
            if (showEmpty) setError(dishDescInput, dishDescError, 'Description is required.');
            else clearStatus(dishDescInput, dishDescError);
            return false;
        }
        if (val.length < 5) {
            setError(dishDescInput, dishDescError, 'Description must be at least 5 characters long.');
            return false;
        }
        setSuccess(dishDescInput, dishDescError);
        return true;
    }

    function validateDishImg() {
        const val = dishImgInput.value.trim();
        if (!val) {
            clearStatus(dishImgInput, dishImgError);
            return true;
        }
        try {
            const url = new URL(val);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                setError(dishImgInput, dishImgError, 'URL must begin with http:// or https://');
                return false;
            }
            setSuccess(dishImgInput, dishImgError);
            return true;
        } catch (_) {
            setError(dishImgInput, dishImgError, 'Please enter a valid image URL.');
            return false;
        }
    }

    dishNameInput.addEventListener('input', () => {
        if (dishNameInput.classList.contains('is-invalid') || dishNameInput.value.length >= 2) validateDishName(true);
    });
    dishNameInput.addEventListener('blur', () => validateDishName(true));

    dishCatSelect.addEventListener('change', () => validateDishCategory(true));
    dishPriceInput.addEventListener('input', () => validateDishPrice(true));
    dishDescInput.addEventListener('input', () => {
        if (dishDescInput.classList.contains('is-invalid') || dishDescInput.value.length >= 5) validateDishDesc(true);
    });
    dishImgInput.addEventListener('input', () => validateDishImg());

    customDishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const isNameValid = validateDishName(true);
        const isCatValid = validateDishCategory(true);
        const isPriceValid = validateDishPrice(true);
        const isDescValid = validateDishDesc(true);
        const isImgValid = validateDishImg();

        if (!isNameValid || !isCatValid || !isPriceValid || !isDescValid || !isImgValid) {
            triggerShake(customDishForm.closest('.modal-card'));
            if (!isNameValid) dishNameInput.focus();
            else if (!isCatValid) dishCatSelect.focus();
            else if (!isPriceValid) dishPriceInput.focus();
            else if (!isDescValid) dishDescInput.focus();
            else if (!isImgValid) dishImgInput.focus();
            return;
        }

        const name = dishNameInput.value.trim();
        const category = dishCatSelect.value;
        const price = parseFloat(dishPriceInput.value);
        const desc = dishDescInput.value.trim();
        const img = dishImgInput.value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

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

        customDishForm.reset();
        closeDishModal();
        renderDishesGrid();
        showToast(`"${name}" has been added to the menu!`, 'success');
    });

    // --- 14. POS CONFIGURATION SETTINGS FORM VALIDATION ---
    const posSettingsForm = document.getElementById('pos-settings-form');
    const settingTaxError = document.getElementById('setting-tax-error');
    const settingDiscountError = document.getElementById('setting-discount-error');
    const settingCurrencyError = document.getElementById('setting-currency-error');

    function validateSettingTax(showEmpty = true) {
        const val = parseFloat(settingTaxInput.value);
        if (isNaN(val) || settingTaxInput.value.trim() === '') {
            if (showEmpty) setError(settingTaxInput, settingTaxError, 'Tax percentage is required.');
            else clearStatus(settingTaxInput, settingTaxError);
            return false;
        }
        if (val < 0 || val > 30) {
            setError(settingTaxInput, settingTaxError, 'Tax must be between 0% and 30%.');
            return false;
        }
        setSuccess(settingTaxInput, settingTaxError);
        return true;
    }

    function validateSettingDiscount(showEmpty = true) {
        const val = parseFloat(settingDiscountInput.value);
        if (isNaN(val) || settingDiscountInput.value.trim() === '') {
            if (showEmpty) setError(settingDiscountInput, settingDiscountError, 'Discount percentage is required.');
            else clearStatus(settingDiscountInput, settingDiscountError);
            return false;
        }
        if (val < 0 || val > 100) {
            setError(settingDiscountInput, settingDiscountError, 'Discount must be between 0% and 100%.');
            return false;
        }
        setSuccess(settingDiscountInput, settingDiscountError);
        return true;
    }

    function validateSettingCurrency(showEmpty = true) {
        const val = settingCurrencyInput.value.trim();
        if (val === '') {
            if (showEmpty) setError(settingCurrencyInput, settingCurrencyError, 'Currency symbol is required.');
            else clearStatus(settingCurrencyInput, settingCurrencyError);
            return false;
        }
        if (val.length > 3) {
            setError(settingCurrencyInput, settingCurrencyError, 'Currency symbol must be 1-3 characters (e.g. $, €, £).');
            return false;
        }
        setSuccess(settingCurrencyInput, settingCurrencyError);
        return true;
    }

    settingTaxInput.addEventListener('input', () => validateSettingTax(true));
    settingDiscountInput.addEventListener('input', () => validateSettingDiscount(true));
    settingCurrencyInput.addEventListener('input', () => validateSettingCurrency(true));

    posSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const isTaxValid = validateSettingTax(true);
        const isDiscValid = validateSettingDiscount(true);
        const isCurrValid = validateSettingCurrency(true);

        if (!isTaxValid || !isDiscValid || !isCurrValid) {
            triggerShake(posSettingsForm);
            if (!isTaxValid) settingTaxInput.focus();
            else if (!isDiscValid) settingDiscountInput.focus();
            else settingCurrencyInput.focus();
            return;
        }

        const newTax = parseFloat(settingTaxInput.value);
        const newDiscount = parseFloat(settingDiscountInput.value);
        const newCurrency = settingCurrencyInput.value.trim();

        TAX_RATE = newTax / 100;
        DISCOUNT_RATE = newDiscount / 100;
        CURRENCY_SYMBOL = newCurrency;

        savedSettings = { tax: newTax, discount: newDiscount, currency: newCurrency };
        localStorage.setItem('dashpoint_settings', JSON.stringify(savedSettings));

        if (billTaxPercent) billTaxPercent.textContent = `${newTax}%`;
        if (billDiscountPercent) billDiscountPercent.textContent = `${newDiscount}%`;

        renderBillingSidebar();
        renderDishesGrid();
        renderDashboardKPIs();
        renderOrdersTableView();

        showToast('POS settings saved successfully!', 'success');
    });

    // --- 15. CHAT FORM JS VALIDATION ---
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) {
            triggerShake(chatInput);
            chatInput.focus();
            return;
        }

        const msgEl = document.createElement('div');
        msgEl.className = 'chat-msg sent';
        msgEl.innerHTML = `<strong>You (${loggedUser ? loggedUser.name : 'Server'}):</strong> ${msg}`;
        chatMessages.appendChild(msgEl);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Automated kitchen acknowledgment
        setTimeout(() => {
            const replyEl = document.createElement('div');
            replyEl.className = 'chat-msg received';
            replyEl.innerHTML = `<strong>Kitchen Station:</strong> Received order note: "${msg}". Processing now!`;
            chatMessages.appendChild(replyEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1200);
    });

    // --- 16. BILL PAYMENT & RECEIPT MODAL ---
    btnPayBills.addEventListener('click', () => {
        const activeOrder = getActiveOrder();
        if (!activeOrder || activeOrder.items.length === 0) {
            showToast('Cannot pay bill for an empty order. Please add dishes first!', 'error');
            return;
        }

        const subtotal = activeOrder.items.reduce((a, i) => a + (i.price * i.qty), 0);
        const tax = subtotal * TAX_RATE;
        const discount = subtotal * DISCOUNT_RATE;
        const grandTotal = Math.max(0, subtotal + tax - discount);

        document.getElementById('receipt-timestamp').textContent = new Date().toLocaleString();
        
        let itemsHtml = `<div style="margin-bottom: 0.75rem;"><strong>Table:</strong> ${activeOrder.table} | <strong>Guest:</strong> ${activeOrder.customer}</div>`;
        itemsHtml += `<div style="margin-bottom: 0.75rem;"><strong>Payment Method:</strong> ${selectedPaymentMethod}</div><hr style="border:none; border-top:1px dashed #cbd5e1; margin:0.5rem 0;">`;

        activeOrder.items.forEach(i => {
            itemsHtml += `
                <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                    <span>${i.name} x${i.qty}</span>
                    <span>${CURRENCY_SYMBOL}${(i.price * i.qty).toFixed(2)}</span>
                </div>
            `;
        });

        itemsHtml += `
            <hr style="border:none; border-top:1px dashed #cbd5e1; margin:0.5rem 0;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:1rem; margin-top:0.5rem;">
                <span>Total Paid</span>
                <span style="color:#2563eb;">${CURRENCY_SYMBOL}${grandTotal.toFixed(2)}</span>
            </div>
        `;

        document.getElementById('receipt-content').innerHTML = itemsHtml;
        receiptModal.classList.add('active');

        // Complete & clear order
        activeOrders = activeOrders.filter(o => o.table !== activeOrder.table);
        saveOrdersToStorage();
        showToast(`Bill paid for ${activeOrder.table}!`, 'success');
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

    // --- 17. INITIALIZE DASHBOARD ---
    renderOrderCarousel();
    renderBillingSidebar();
    renderDishesGrid();
    renderTablesFloorMap();
});

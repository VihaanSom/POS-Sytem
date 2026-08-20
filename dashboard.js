document.addEventListener('DOMContentLoaded', () => {
    const TOTAL_TABLES = 20;
    
    // --- Navigation Logic ---
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-target]');
    const sectionPanes = document.querySelectorAll('.section-pane');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            sectionPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- State Management via LocalStorage ---
    let bookings = JSON.parse(localStorage.getItem('dashpoint_bookings')) || [];
    let customDishes = JSON.parse(localStorage.getItem('dashpoint_custom_dishes')) || [];

    // --- DOM Elements for Bookings ---
    const bookingForm = document.getElementById('booking-form');
    const bookingsContainer = document.getElementById('bookings-container');
    const noBookingsMsg = document.getElementById('no-bookings-msg');
    
    const occupiedStat = document.getElementById('occupied-tables-stat');
    const vacantStat = document.getElementById('vacant-tables-stat');

    // --- DOM Elements for Menu ---
    const addDishForm = document.getElementById('add-dish-form');
    const customDishesGrid = document.getElementById('custom-dishes-grid');
    const noDishesMsg = document.getElementById('no-dishes-msg');

    // --- Render Functions ---
    function renderStats() {
        const occupied = bookings.length;
        const vacant = TOTAL_TABLES - occupied;
        
        occupiedStat.textContent = occupied;
        vacantStat.textContent = vacant;
    }

    function renderBookings() {
        if (bookings.length === 0) {
            bookingsContainer.innerHTML = '';
            noBookingsMsg.style.display = 'block';
            renderStats();
            return;
        }

        noBookingsMsg.style.display = 'none';
        bookingsContainer.innerHTML = '';

        bookings.forEach((booking, index) => {
            const item = document.createElement('div');
            item.className = 'booking-item';
            item.innerHTML = `
                <div class="booking-info">
                    <h5>${booking.name}</h5>
                    <p>Guests: ${booking.guests} | Time: ${booking.time}</p>
                </div>
                <button class="btn btn-danger" onclick="removeBooking(${index})">Finish</button>
            `;
            bookingsContainer.appendChild(item);
        });
        
        renderStats();
    }

    function renderDishes() {
        if (customDishes.length === 0) {
            customDishesGrid.innerHTML = '';
            noDishesMsg.style.display = 'block';
            return;
        }

        noDishesMsg.style.display = 'none';
        customDishesGrid.innerHTML = '';

        customDishes.forEach((dish, index) => {
            const item = document.createElement('div');
            item.className = 'dish-card';
            item.innerHTML = `
                <div class="dish-details">
                    <h5>${dish.name}</h5>
                    <p class="badge badge-success" style="display:inline-block; margin-bottom:0.25rem;">${dish.category}</p>
                    <div class="dish-price">$${Number(dish.price).toFixed(2)}</div>
                </div>
                <button class="btn btn-danger" onclick="removeDish(${index})">Remove</button>
            `;
            customDishesGrid.appendChild(item);
        });
    }

    // --- Global Remove Functions for inline onclick ---
    window.removeBooking = function(index) {
        bookings.splice(index, 1);
        localStorage.setItem('dashpoint_bookings', JSON.stringify(bookings));
        renderBookings();
    };

    window.removeDish = function(index) {
        customDishes.splice(index, 1);
        localStorage.setItem('dashpoint_custom_dishes', JSON.stringify(customDishes));
        renderDishes();
    };

    // --- Form Submissions ---
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if(bookings.length >= TOTAL_TABLES) {
            alert('All tables are currently occupied!');
            return;
        }

        const name = document.getElementById('customer-name').value;
        const guests = document.getElementById('guest-count').value;
        const time = document.getElementById('booking-time').value;

        bookings.push({ name, guests, time });
        localStorage.setItem('dashpoint_bookings', JSON.stringify(bookings));
        
        bookingForm.reset();
        renderBookings();
    });

    addDishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('dish-name').value;
        const category = document.getElementById('dish-category').value;
        const price = document.getElementById('dish-price').value;

        customDishes.push({ name, category, price });
        localStorage.setItem('dashpoint_custom_dishes', JSON.stringify(customDishes));
        
        addDishForm.reset();
        renderDishes();
    });

    // --- Initial Render ---
    renderBookings();
    renderDishes();
});

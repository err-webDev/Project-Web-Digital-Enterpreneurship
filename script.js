const menuItems = [
    { id: 1, name: 'Nasi Goreng Balap', price: 25000, category: 'Makanan' },
    { id: 2, name: 'Mie Ayam Backsow', price: 20000, category: 'Makanan' },
    { id: 3, name: 'Ayam Geprek PKI', price: 22000, category: 'Makanan' },
    { id: 4, name: 'SoBan', price: 10000, category: 'Makanan' },
    { id: 5, name: 'Gado-Gado Mail', price: 15000, category: 'Makanan' },
    { id: 6, name: 'Mix Parlay', price: 30000, category: 'Makanan' },
    { id: 7, name: 'Es Teh Manis', price: 5000, category: 'Minuman' },
    { id: 8, name: 'Ice Caffe Latte', price: 12000, category: 'Minuman' },
    { id: 9, name: 'Es Jeruk', price: 8000, category: 'Minuman' },
    { id: 9, name: 'Es Kelapa', price: 10000, category: 'Minuman' },
];

let cart = [];

function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function renderMenu() {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = menuItems.map(item => `
                <div class="menu-item">
                    <div class="menu-item-image"></div>
                    <h3>${item.name}</h3>
                    <div class="price">${formatCurrency(item.price)}</div>
                    <button onclick="addToCart(${item.id})">+ Tambah ke Keranjang</button>
                </div>
            `).join('');
}

function addToCart(itemId) {
    const item = menuItems.find(m => m.id === itemId);
    const cartItem = cart.find(c => c.id === itemId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    renderCart();
}

function updateQuantity(itemId, change) {
    const cartItem = cart.find(c => c.id === itemId);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(c => c.id !== itemId);
        }
    }
    renderCart();
}

function renderCart() {
    const cartContent = document.getElementById('cartContent');

    if (cart.length === 0) {
        cartContent.innerHTML = '<div class="empty-cart">Keranjang masih kosong<br>Silakan pilih menu</div>';
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    cartContent.innerHTML = `
                <div class="cart-items">
                    ${cart.map(item => `
                        <div class="cart-item">
                            <div class="cart-item-info">
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-price">${formatCurrency(item.price)}</div>
                            </div>
                            <div class="cart-item-controls">
                                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-total">
                    <div class="cart-total-row">
                        <span>Subtotal:</span>
                        <span>${formatCurrency(subtotal)}</span>
                    </div>
                    <div class="cart-total-row">
                        <span>Pajak (10%):</span>
                        <span>${formatCurrency(tax)}</span>
                    </div>
                    <div class="cart-total-row final">
                        <span>Total:</span>
                        <span>${formatCurrency(total)}</span>
                    </div>
                </div>
                <button class="checkout-btn" onclick="checkout()">Checkout & Lihat Struk</button>
            `;
}

function checkout() {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('id-ID');

    const receiptView = document.getElementById('receiptView');
    receiptView.innerHTML = `
                <div class="receipt">
                    <div class="receipt-header">
                        <h2>🍽️ RESTO KALCER</h2>
                        <p>Jl. Raya Kuliner No. 123</p>
                        <p>Telp: (021) 1234-5678</p>
                        <div class="receipt-date">
                            <p>${dateStr}</p>
                            <p>${timeStr}</p>
                        </div>
                    </div>
                    
                    <div class="receipt-items">
                        <h3 style="margin-bottom: 15px; color: #667eea;">Detail Pesanan</h3>
                        ${cart.map(item => `
                            <div class="receipt-item">
                                <span class="receipt-item-name">${item.name}</span>
                                <span class="receipt-item-qty">x${item.quantity}</span>
                                <span class="receipt-item-price">${formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="receipt-summary">
                        <div class="receipt-summary-row">
                            <span>Subtotal:</span>
                            <span>${formatCurrency(subtotal)}</span>
                        </div>
                        <div class="receipt-summary-row">
                            <span>Pajak (10%):</span>
                            <span>${formatCurrency(tax)}</span>
                        </div>
                        <div class="receipt-summary-row total">
                            <span>TOTAL BAYAR:</span>
                            <span>${formatCurrency(total)}</span>
                        </div>
                    </div>
                    
                    <div class="receipt-footer">
                        <p><strong>Terima kasih atas pesanan Anda!</strong></p>
                        <p>Pesanan akan segera diproses</p>
                        <p style="margin-top: 15px; font-size: 0.9em;">Simpan struk ini sebagai bukti pembayaran</p>
                    </div>
                    
                    <div class="button-group">
                        <button class="download-btn" onclick="downloadReceipt()">📥 Download Struk</button>
                        <button class="back-btn" onclick="backToMenu()">🔄 Pesan Lagi</button>
                    </div>
                </div>
            `;

    document.getElementById('menuView').style.display = 'none';
    receiptView.style.display = 'block';
}

function backToMenu() {
    cart = [];
    document.getElementById('menuView').style.display = 'block';
    document.getElementById('receiptView').style.display = 'none';
    renderCart();
}

function downloadReceipt() {
    const receiptElement = document.querySelector('.receipt');

    // Clone the receipt to modify for print
    const printContent = receiptElement.cloneNode(true);

    // Remove buttons from print version
    const buttons = printContent.querySelectorAll('.button-group');
    buttons.forEach(btn => btn.remove());

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (!printWindow) {
        alert('Pop-up diblokir! Silakan izinkan pop-up untuk browser ini agar bisa download struk.');
        return;
    }

    printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Struk Belanja - Resto Kalcer</title>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            margin: 20px;
                            background: white;
                        }
                        .receipt {
                            max-width: 500px;
                            margin: 0 auto;
                            padding: 30px;
                            border: 2px solid #667eea;
                            border-radius: 10px;
                        }
                        .receipt-header {
                            text-align: center;
                            border-bottom: 2px dashed #667eea;
                            padding-bottom: 20px;
                            margin-bottom: 20px;
                        }
                        .receipt-header h2 {
                            color: #667eea;
                            font-size: 2em;
                            margin-bottom: 10px;
                        }
                        .receipt-header p {
                            margin: 5px 0;
                        }
                        .receipt-date {
                            color: #666;
                            font-size: 0.9em;
                            margin-top: 10px;
                        }
                        .receipt-date p {
                            margin: 3px 0;
                        }
                        .receipt-items {
                            margin-bottom: 20px;
                        }
                        .receipt-items h3 {
                            margin-bottom: 15px;
                            color: #667eea;
                        }
                        .receipt-item {
                            display: flex;
                            justify-content: space-between;
                            padding: 10px 0;
                            border-bottom: 1px solid #e0e0e0;
                        }
                        .receipt-item-name {
                            flex: 1;
                        }
                        .receipt-item-qty {
                            margin: 0 15px;
                            color: #666;
                        }
                        .receipt-item-price {
                            font-weight: 600;
                            color: #667eea;
                        }
                        .receipt-summary {
                            border-top: 2px solid #667eea;
                            padding-top: 15px;
                            margin-top: 15px;
                        }
                        .receipt-summary-row {
                            display: flex;
                            justify-content: space-between;
                            padding: 8px 0;
                            font-size: 1.1em;
                        }
                        .receipt-summary-row.total {
                            font-size: 1.4em;
                            font-weight: bold;
                            color: #667eea;
                            margin-top: 10px;
                            padding-top: 10px;
                            border-top: 2px dashed #667eea;
                        }
                        .receipt-footer {
                            text-align: center;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 2px dashed #667eea;
                        }
                        .receipt-footer p {
                            color: #666;
                            margin: 5px 0;
                        }
                        @media print {
                            body {
                                margin: 0;
                            }
                            .receipt {
                                border: none;
                                box-shadow: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${printContent.outerHTML}
                </body>
                </html>
            `);

    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = function () {
        setTimeout(function () {
            printWindow.focus();
            printWindow.print();
        }, 250);
    };
}

// Initialize
renderMenu();
renderCart();
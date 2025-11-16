// Глобальные переменные
let cart = [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    updateCartCount();
    renderCart(); // Рендерим корзину если на странице cart.html
    initializeForms();
    initializeCartHandlers();
});

// Инициализация обработчиков корзины
function initializeCartHandlers() {
    // Обработчик для кнопок добавления в корзину
    document.addEventListener('click', function(e) {
        const addButton = e.target.closest('.add-to-cart, [data-add-to-cart]');
        
        if (addButton) {
            e.preventDefault();
            
            // Получаем данные о товаре
            const productData = {
                id: addButton.dataset.productId || addButton.dataset.id,
                name: addButton.dataset.productName || addButton.dataset.name || 'Товар',
                price: parseFloat(addButton.dataset.productPrice || addButton.dataset.price || 0),
                image: addButton.dataset.productImage || addButton.dataset.image || '',
                discount: addButton.dataset.discount === 'true',
                discountPrice: parseFloat(addButton.dataset.discountPrice || 0)
            };
            
            if (!productData.id) {
                console.error('Ошибка: не указан ID товара');
                showNotification('Ошибка: не указан ID товара', 'danger');
                return;
            }
            
            addToCart(productData);
        }
        
        // Обработчики для кнопок увеличения/уменьшения количества в корзине
        if (e.target.classList.contains('cart-increase')) {
            const productId = e.target.dataset.productId;
            updateQuantity(productId, 1);
        }
        
        if (e.target.classList.contains('cart-decrease')) {
            const productId = e.target.dataset.productId;
            updateQuantity(productId, -1);
        }
        
        if (e.target.classList.contains('cart-remove')) {
            const productId = e.target.dataset.productId;
            removeFromCart(productId);
        }
    });
}

// Работа с корзиной
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Ошибка загрузки корзины:', e);
            cart = [];
        }
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Ошибка сохранения корзины:', e);
        showNotification('Ошибка сохранения корзины', 'danger');
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Показываем/скрываем счетчик
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

function addToCart(product) {
    // Валидация данных
    if (!product.id || !product.name) {
        console.error('Неверные данные товара:', product);
        showNotification('Ошибка добавления товара', 'danger');
        return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Упрощаем логику цены
        const finalPrice = product.discount && product.discountPrice ? product.discountPrice : product.price;
        
        cart.push({
            id: product.id,
            name: product.name,
            price: finalPrice,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    renderCart(); // Обновляем отображение корзины
    showNotification(`Товар "${product.name}" добавлен в корзину!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    renderCart();
    showNotification('Товар удален из корзины', 'warning');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            updateCartCount();
            renderCart();
        }
    }
}

function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartCount();
    renderCart();
    showNotification('Корзина очищена', 'info');
}

// Отображение корзины
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartEmpty = document.getElementById('cart-empty');
    const cartNotEmpty = document.getElementById('cart-not-empty');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartNotEmpty) cartNotEmpty.style.display = 'none';
        if (cartTotal) cartTotal.textContent = '0';
        return;
    }
    
    // Показываем блок с товарами
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartNotEmpty) cartNotEmpty.style.display = 'block';
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        // Исправленная верстка карточки товара
        html += `
            <div class="cart-item row align-items-center border-bottom py-3 mx-0">
                <div class="col-3 col-md-2 text-center px-2">
                    <div class="cart-item-image">
                        ${item.image && item.image !== '' ? 
                            `<img src="${item.image}" alt="${item.name}" class="img-fluid rounded" style="max-height: 80px; width: auto;">` : 
                            '<div class="bg-light text-muted d-flex align-items-center justify-content-center rounded" style="height: 80px; width: 80px;"><small>Нет фото</small></div>'
                        }
                    </div>
                </div>
                <div class="col-5 col-md-4 px-2">
                    <h6 class="mb-1 cart-item-name">${item.name}</h6>
                    <p class="text-muted mb-0">${formatPrice(item.price)} руб.</p>
                </div>
                <div class="col-4 col-md-3 px-2">
                    <div class="quantity-controls d-flex align-items-center justify-content-center">
                        <button class="btn btn-sm btn-outline-secondary cart-decrease" data-product-id="${item.id}">-</button>
                        <span class="mx-2 fw-bold cart-quantity">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary cart-increase" data-product-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="col-4 col-md-2 text-center px-2 mt-2 mt-md-0">
                    <strong class="cart-item-total">${formatPrice(itemTotal)} руб.</strong>
                </div>
                <div class="col-2 col-md-1 text-center px-2 mt-2 mt-md-0">
                    <button class="btn btn-outline-danger btn-sm cart-remove" data-product-id="${item.id}" title="Удалить">
                        <span style="font-size: 16px; line-height: 1;">×</span>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = html;
    if (cartTotal) cartTotal.textContent = formatPrice(total);
}

// Уведомления с Bootstrap Toast
function showNotification(message, type = 'success') {
    // Создаем контейнер для уведомлений если его нет
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { 
        delay: 3000,
        autohide: true
    });
    toast.show();
    
    // Удаляем элемент после скрытия
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Инициализация форм
function initializeForms() {
    // Форма обратной связи
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            this.reset();
        });
    }
    
    // Форма входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Вход выполнен успешно!', 'success');
        });
    }
    
    // Форма регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Регистрация прошла успешно!', 'success');
        });
    }
    
    // Форма оформления заказа
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Заказ успешно оформлен! С вами свяжутся для подтверждения.', 'success');
            clearCart();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
}

// Вспомогательные функции
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Функция для оформления заказа
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста! Добавьте товары перед оформлением заказа.', 'warning');
        return;
    }
    
    // Перенаправляем на страницу оформления заказа
    window.location.href = 'checkout.html';
}

// Экспортируем функции для глобального использования
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.formatPrice = formatPrice;
window.proceedToCheckout = proceedToCheckout;

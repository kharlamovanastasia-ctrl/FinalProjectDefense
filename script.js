// Функции для переключения страниц
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

// Функции для формы входа/регистрации
function switchForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const buttons = document.querySelectorAll('.form-switch button');
    
    if (formType === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        buttons[0].classList.remove('active');
        buttons[1].classList.add('active');
    }
}

// Обработка форм
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Вход выполнен успешно!');
    showPage('home-page');
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Регистрация прошла успешно!');
    showPage('home-page');
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    this.reset();
});

// Функции для работы с корзиной
function updateQuantity(product, change) {
    const input = document.getElementById(`${product}-quantity`);
    let newValue = parseInt(input.value) + change;
    
    if (newValue < 1) newValue = 1;
    
    input.value = newValue;
    updateCartTotal();
}

function updateCartTotal() {
    const pumpPrice = 15490;
    const pistonsPrice = 28750;
    
    const pumpQuantity = parseInt(document.getElementById('pump-quantity').value);
    const pistonsQuantity = parseInt(document.getElementById('pistons-quantity').value);
    
    const subtotal = (pumpPrice * pumpQuantity) + (pistonsPrice * pistonsQuantity);
    
    document.getElementById('subtotal').textContent = subtotal.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('total').textContent = subtotal.toLocaleString('ru-RU') + ' ₽';
    
    // Обновляем счетчик в корзине
    const totalItems = pumpQuantity + pistonsQuantity;
    document.querySelector('.cart-count').textContent = totalItems;
}

// Функция оформления заказа
function checkout() {
    alert('Спасибо за покупку! Ваш заказ оформлен.');
    showPage('home-page');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    showPage('home-page');
});
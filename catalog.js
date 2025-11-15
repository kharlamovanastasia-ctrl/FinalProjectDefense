// Данные товаров
const products = [
{
id: 1,
name: "Фильтр масляный МТЗ-82",
description: Аналог масляного фильтра для тракторов МТЗ-80/82.",
price: 1500,
category: "Фильтры",
brand: "МТЗ",
image: "images/filtrmaslyaniy"
},
{
id: 2,
name: "Тормозные колодки John Deere",
description: "Тормозные колодки для комбайнов John Deere серии 1000.",
price: 3200,
category: "Тормоза",
brand: "John Deere",
image: "https://a.allegroimg.com/original/11bd9a/260edf7d44b7a49034db4abdc37e/Klocki-hamulcowe-John-Deere-Gator-TX-Zestaw-Przod-Tyl-Oryginal"
},
{
id: 3,
name: "Свеча зажигания Bosch",
description: "Свеча зажигания для дизельных двигателей.",
price: 450,
category: "Двигатель",
brand: "Bosch",
image: "images/products/spark-plug-bosch.jpg"
},
{
id: 4,
name: "Воздушный фильтр MANN",
description: "Воздушный фильтр для грузовиков и сельхозтехники.",
price: 2100,
category: "Фильтры",
brand: "MANN",
image: "images/products/air-filter-mann.jpg"
},
{
id: 5,
name: "Ремень привода Case IH",
description: "Ремень привода для комбайнов Case IH Axial-Flow.",
price: 1800,
category: "Привод",
brand: "Case IH",
image: "images/products/belt-case.jpg"
},
{
id: 6,
name: "Аккумулятор 12V",
description: "Аккумуляторная батарея 12V 100Ah для сельхозтехники.",
price: 5200,
category: "Электрика",
brand: "Bosch",
image: "images/products/battery-bosch.jpg"
},
{
id: 7,
name: "Фильтр топливный МТЗ",
description: "Топливный фильтр тонкой очистки для тракторов МТЗ.",
price: 800,
category: "Фильтры",
brand: "МТЗ",
image: "images/products/fuel-filter-mtz.jpg"
},
{
id: 8,
name: "Давление масла датчик",
description: "Датчик давления масла для тракторов и комбайнов.",
price: 1200,
category: "Электрика",
brand: "John Deere",
image: "images/products/oil-sensor.jpg"
}
];

// Функция для отрисовки одного товара
function renderProduct(product) {
return <div class="col-md-4 col-lg-3"> <div class="card product-card h-100"> <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;"> <div class="card-body d-flex flex-column"> <h5 class="card-title">${product.name}</h5> <p class="card-text flex-grow-1">${product.description}</p> <p class="price fw-bold">${product.price} ₽</p> <button class="btn btn-primary-custom" onclick="addToCart(${product.id})">В корзину</button> </div> </div> </div>;
}

// Переменные для каталога
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 6;
let currentView = 'grid';

// Инициализация каталога
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productsGrid')) {
        initializeCatalog();
    }
});

function initializeCatalog() {
    filteredProducts = [...productsDatabase];
    displayProducts();
    setupPagination();
}

// Отображение товаров
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Показываем загрузку
    loadingSpinner.style.display = 'block';
    grid.innerHTML = '';
    
    // Имитируем загрузку
    setTimeout(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);
        
        document.getElementById('productCount').textContent = filteredProducts.length;
        
        if (productsToShow.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h4 class="text-muted">Товары не найдены</h4>
                    <p>Попробуйте изменить параметры фильтра</p>
                    <button class="btn btn-primary-custom mt-3" onclick="resetFilters()">Сбросить фильтры</button>
                </div>
            `;
        } else {
            productsToShow.forEach(product => {
                const productCard = createProductCard(product);
                grid.innerHTML += productCard;
            });
        }
        
        loadingSpinner.style.display = 'none';
    }, 500);
}

// Создание карточки товара
function createProductCard(product) {
    const finalPrice = product.discount ? product.discountPrice : product.price;
    
    return `
        <div class="col-md-6 col-lg-4">
            <div class="product-card card shadow-sm h-100">
                <div class="product-image position-relative">
                    ${product.discount > 0 ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
                    ${product.inStock ? '<div class="stock-badge">В наличии</div>' : '<div class="stock-badge bg-secondary">Нет в наличии</div>'}
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text flex-grow-1 text-muted">${product.description}</p>
                    
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">${product.brand}</small>
                        <small class="text-muted">${product.category}</small>
                    </div>
                    
                    <div class="product-price mb-3">
                        ${product.discount > 0 ? `
                            <div class="d-flex align-items-center">
                                <span class="fw-bold text-green fs-5 me-2">${formatPrice(finalPrice)} ₽</span>
                                <span class="text-muted text-decoration-line-through small">${formatPrice(product.price)} ₽</span>
                            </div>
                        ` : `
                            <span class="fw-bold text-green fs-5">${formatPrice(product.price)} ₽</span>
                        `}
                    </div>
                    
                    <button class="btn btn-primary-custom mt-auto ${!product.inStock ? 'disabled' : ''}" 
                            onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                            ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'В корзину' : 'Нет в наличии'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Фильтрация товаров
function applyFilters() {
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;
    const brand = document.getElementById('brandFilter').value;
    const category = document.getElementById('categoryFilter').value;
    
    filteredProducts = productsDatabase.filter(product => {
        const price = product.discount ? product.discountPrice : product.price;
        const brandMatch = !brand || product.brand === brand;
        const categoryMatch = !category || product.category === category;
        const priceMatch = price >= minPrice && price <= maxPrice;
        
        return brandMatch && categoryMatch && priceMatch;
    });
    
    currentPage = 1;
    displayProducts();
    setupPagination();
}

function resetFilters() {
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('brandFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('sortSelect').value = 'name-asc';
    
    filteredProducts = [...productsDatabase];
    currentPage = 1;
    displayProducts();
    setupPagination();
}

// Сортировка товаров
function sortProducts() {
    const sortValue = document.getElementById('sortSelect').value;
    
    filteredProducts.sort((a, b) => {
        const priceA = a.discount ? a.discountPrice : a.price;
        const priceB = b.discount ? b.discountPrice : b.price;
        
        switch (sortValue) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'price-asc':
                return priceA - priceB;
            case 'price-desc':
                return priceB - priceA;
            case 'popular':
                return b.popularity - a.popularity;
            default:
                return 0;
        }
    });
    
    currentPage = 1;
    displayProducts();
    setupPagination();
}

// Пагинация
function setupPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Кнопка "Назад"
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Назад</a>`;
    pagination.appendChild(prevLi);
    
    // Номера страниц
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(li);
    }
    
    // Кнопка "Вперед"
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Вперед</a>`;
    pagination.appendChild(nextLi);
}

function changePage(page) {
    currentPage = page;
    displayProducts();
    setupPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Изменение вида отображения
function changeView(viewType) {
    currentView = viewType;
    const grid = document.getElementById('productsGrid');
    const buttons = document.querySelectorAll('.view-options .btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (viewType === 'list') {
        grid.className = 'row g-4 list-view';
        // Можно добавить дополнительные стили для списка
    } else {
        grid.className = 'row g-4';
    }
}

// Форматирование цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}
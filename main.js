const goods = [
    { title: "Робот-пылесос xiaomi", price: 20000, img: 'https://via.placeholder.com/180' },
    { title: "Samsung Galaxy", price: 21500, img: 'https://via.placeholder.com/180' },
    { title: "Стиральная машина hotpoint", price: 32000, img: 'https://via.placeholder.com/180' },
    { title: "Умные часы apple watch", price: 26000, img: 'https://via.placeholder.com/180' },
    { title: "Ноутбук TOSHIBA", price: 25000, img: 'https://via.placeholder.com/180' },
    { title: "Холодильник INDESIT", price: 30500, img: 'https://via.placeholder.com/180' },
    { title: "Принтер hp", price: 12000, img: 'https://via.placeholder.com/180' },
    { title: "Колонки SVEN", price: 2000, img: 'https://via.placeholder.com/180' },

];

const renderGoodsItem = (title= "product", price=0, img = 'https://via.placeholder.com/180') => {
    return `<div class="goods-item">
        <img src="${img}" alt="alt">
        <h3>${title}</h3>
        <div class="wrapper">
            <p class="price">${price}</p>
            <button class="btn-bye">В корзину</button>
        </div>
    </div>`
};

const renderGoodsList = (list, container) => {
    const goodsList = list.map(good => renderGoodsItem(good.title, good.price, good.img)).join(`\n`);
    document.querySelector(container).innerHTML = goodsList;
};

renderGoodsList(goods, '.goods-list');

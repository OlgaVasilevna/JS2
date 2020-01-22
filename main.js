class GoodsItem {
    constructor(id, title = 'Без названия', price = 0, img = '') {
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
    }
    render() {
        return `
            <div class="goods-item" data-id="${this.id}">
                <img src="${this.img}" alt="alt">
                <h3>${this.title}</h3>
                <div class="wrapper">
                    <p class="price">${this.price}</p>
                    <button class="btn-bye">В корзину</button>
                </div>
            </div>
        `;
    }
}
class GoodsList {
    constructor(container) {
        this.container = document.querySelector(container);
        this.goods = [];
        this.cart = new GoodsCart();
        this.summa=0;
    }
    checkSum(){
        this.goods.forEach(product => this.summa+=product.price)
    }


    initListeners() {
        const buttons = [...this.container.querySelectorAll('.btn-bye')];
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                console.dir(event.target)
                const goodId = event.target.parentElement.parentElement.getAttribute('data-id');
                this.addToCart(parseInt(goodId));
            })
        })
    }
    findGood(id) {
        return this.goods.find(good => good.id === id);
    }
    addToCart(goodId) {
        const good = this.findGood(goodId);
        this.cart.addToCart(good);
    }
    fetchGoods() {
        this.goods = [
            {id: 1, title: "Робот-пылесос xiaomi", price: 20000, img: 'https://via.placeholder.com/180' },
            {id: 2, title: "Samsung Galaxy", price: 21500, img: 'https://via.placeholder.com/180' },
            {id: 3, title: "Стиральная машина hotpoint", price: 32000, img: 'https://via.placeholder.com/180' },
            {id: 4, title: "Умные часы apple watch", price: 26000, img: 'https://via.placeholder.com/180' },
            {id: 5, title: "Ноутбук TOSHIBA", price: 25000, img: 'https://via.placeholder.com/180' },
            {id: 6, title: "Холодильник INDESIT", price: 30500, img: 'https://via.placeholder.com/180' },
            {id: 7, title: "Принтер hp", price: 12000, img: 'https://via.placeholder.com/180' },
            {id: 8, title: "Колонки SVEN", price: 2000, img: 'https://via.placeholder.com/180' },

        ]
    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.id, good.title, good.price, good.img);
            listHtml += goodItem.render();
        });
        this.container.innerHTML = listHtml;
        this.initListeners();
    }
}
class CartItem extends GoodsItem{
    constructor(id, title, price, img){
        super(id, title, price, img);
        this.quantity=1;
    }
}


class GoodsCart {
    constructor(){
        this.sum=0;
        this.count=0;
        this.cartGoods = [];
    }
    addToCart(good){
        const id =good.id;
        let find= this.cartGoods.find(good => good.id===id)
        if (find){
            find.quantity++
        }
        else{
            this.cartGoods.push(new CartItem(good.id, good.title,good.price,good.img))
        }
    }

    deleteToCart(){}

    }
    

const list = new GoodsList('.goods-list');
list.fetchGoods();
list.render();
const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
function makeGetRequest(url) {
    return new Promise((resolve, reject)=>{
    let xhr;
    if (window.XMLHttpRequest) {
        xhr = new window.XMLHttpRequest();
    } else  {
        xhr = new window.ActiveXObject("Microsoft.XMLHTTP")
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            resolve(xhr.responseText)

        }
    };

    xhr.open('GET', url);
    xhr.send();
})
}
document.querySelector(`.cart-button`).addEventListener(`click`,() => {
    if (document.querySelector(`.cart`).style.display == `none`){
        document.querySelector(`.cart`).style.display = `block`
    } else {
        document.querySelector(`.cart`).style.display = `none`
    }
})

class GoodsItem {
    constructor(id, title = 'Без названия', price = 0, img = 'https://via.placeholder.com/180') {
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
    }
    initListeners() {}
    findGood(id) {
        return this.goods.find(good => good.id_product === id);
    }
    fetchGoods() {}
    totalSum() {
        let sum = 0;
        for (const good of this.goods) {
            if (good.price) {
                sum += good.price;
            }
        }
        return sum;
    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.id_product, good.product_name, good.price, good.img);
            listHtml += goodItem.render();
        });
        this.container.innerHTML = listHtml;
        this.initListeners();
    }
}

class GoodsPage extends GoodsList {
    initListeners() {
        const buttons = [...this.container.querySelectorAll('.btn-bye')];
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const goodId = event.target.parentElement.parentElement.getAttribute('data-id');
                console.log(goodId);
                this.addToCart(parseInt(goodId));
            })
        })
    }
    fetchGoods() {
        return new Promise((resolve,reject) => {
        makeGetRequest(`${API_URL}/catalogData.json`).then( (goods) => {
            this.goods = JSON.parse(goods);
            resolve();
        })
        })
    }
    addToCart(goodId) {
        const good = this.findGood(goodId);
        console.log(good);
    }
}

class Cart extends GoodsList {
    constructor(container){
        super();
        this.container=document.querySelector(container);
        this.amount=0;
        this.countGoods=0;
        this.contents=[];
    }
    fetchGoods() {
        return new Promise((resolve, reject) => {
            makeGetRequest(`${API_URL}/getBasket.json`).then( (goodsCart) => {
                const apiCart = JSON.parse(goodsCart);
                this.amount=apiCart.amount;
                this.countGoods=apiCart.countGoods;
                this.contents=apiCart.contents;
                resolve();          
            })
        })
    }
    removeFromCart(goodId) {

    }
    cleanCart() {
        this.amount=0;
        this.countGoods=0;
        this.contents=[];
        this.render();

    }
    updateCartItem(goodId, goods) {

    }
    render(){
        let listHtml = `<p class="cau">Всего товаров: ${this.countGoods}</p>`;
        this.contents.forEach(good => {
            const cartItem = new CartItem(good.quantity, good.id_product, good.product_name, good.price, good.img = "https://via.placeholder.com/100");
            listHtml += cartItem.render();
        });
        listHtml+=`<p class="sum">Общая сумма: ${this.amount}</p>`
        this.container.innerHTML = listHtml;
    }
}

class CartItem extends GoodsItem {
    constructor(quantity,...attrs ) {
        super(...attrs);
        this.quantity = quantity;
    }
    incCount() {

    }
    decCount() {

    }
    render(){
        return ` 
        <div class="cart-item" data-id="${this.id}">   
            <img src="${this.img}" alt="alt">
            <div class="wrapper_cart">
                <h3>${this.title}</h3>
                <p class="quantity">x${this.quantity}</p>
                <p class="price">${this.price}</p>
            </div>
        </div>
        `;
    }
}
const cart = new Cart(`.cart`);
cart.fetchGoods().then( () =>{
    cart.render();
})
const list = new GoodsPage('.goods-list');
list.fetchGoods().then( () => {
    list.render();
});



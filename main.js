const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

function debounce(callback, wait, immediate) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) callback.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            callback.apply(context, args)
        }
    }
}
Vue.component('search', {
    props:['value'],
    template: `
    <div class="search">
                <input type="text" :value="value"
                @input="$emit('input', $event.target.value)">
                <button @click="$emit('search-text')">Поиск</button>
            </div>
    `
})
Vue.component('goods-item', {
    props: ['good'],
    template: `
    <div  class="goods-item" >
        <img src="https://via.placeholder.com/180" alt="alt">
        <h3> {{ good.product_name }}</h3>
        <div class="wrapper">
            <p class="price"> {{ good.price }}</p>
            <button class="btn-bye">В корзину</button>
        </div>
    </div>
    `
});

Vue.component('goods-list', {
    props: ['goods'],
    computed: {
        isFilteredGoodsEmpty() {
            return this.goods.length === 0;
        },
    },
    template: `
        <div class="goods-list" v-if="!isFilteredGoodsEmpty">
            <goods-item v-for="good in goods"
                        :key="good.id_product" :good="good"></goods-item>
        </div>
        <div class="goods-list" v-else>
            <h3>Нет данных</h3>
        </div>
    `
});
Vue.component('cart-item', {
    props: ['good'],
    template: `
            <div>
                <img src="https://via.placeholder.com/100" alt="alt">
                <div class="wrapper_cart">
                    <h3> {{ good.product_name }} </h3>
                    <p class="quantity">x{{good.quantity}}</p>
                    <p class="price"> {{ good.price }} </p      
                </div>
            </div>
    `
});

Vue.component('cart-list', {
    props: ['carts','isVisible'],
    template: `
    <div v-if="isVisible" class="cart">
                <cart-item v-for="good in carts" class="cart-item" 
                :key="good.id_product" carts:="good">                      
                </cart-item>
            </div>
        
    `
});

const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        searchLine: '',
        isVisibleCart: false,
        cart: [],
    },
    methods: {
        makeGetRequest(url) {
            return new Promise((resolve, reject) => {
                let xhr;
                if (window.XMLHttpRequest) {
                    xhr = new window.XMLHttpRequest(); // readyState = 1
                } else  {
                    xhr = new window.ActiveXObject("Microsoft.XMLHTTP")
                }

                xhr.onreadystatechange = function () { // xhr changed
                    if (xhr.readyState === 4) {
                        if (xhr.status !== 200) {
                            reject(xhr.responseText);
                            return
                        }
                        const body = JSON.parse(xhr.responseText);
                        resolve(body)
                    }
                };

                xhr.onerror = function (err) {
                    reject(err)
                };

                xhr.open('GET', url);
                xhr.send(); // readyState 2
            });
        },
        async fetchGoods() {
            try {
                this.goods = await this.makeGetRequest(`${API_URL}/catalogData.json`)
                this.filteredGoods = [...this.goods];
            } catch (e) {
                console.error(e);
            }
        },
        search() {
            this.filteredGoods = this.searchGood;
        },
        
        addCart(key){
            const find =this.goods.find((el) => 
                el.id_product === key
            )
            if (this.cart.find((el) => el.product_name == find.product_name)){
                let goodCart = this.cart.find((el) => el.product_name == find.product_name)
                goodCart.quantity+=1
            }
            else { 
                this.cart.push({...find, quantity:1})
            }
            

        },
        visible(){
            this.isVisibleCart= !this.isVisibleCart
        },
        
        
    },
    computed: {
        searchGood(){
        
            if (this.searchLine.length == 0){
                return [...this.goods]
            }
            else {
                return  this.goods.filter(good => {
                    return good.product_name.toLowerCase().indexOf(this.searchLine.toLowerCase()) > -1
                })
            }
        },
        
       
    },
    mounted() {
        this.fetchGoods();
    }
});

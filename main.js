const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

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
            this.filteredGoods = this.searchGood
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

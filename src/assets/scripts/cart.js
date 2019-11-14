import Vue from 'vue/dist/vue.esm';
import axios from 'axios';
import { TweenLite } from 'gsap';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { logCheckoutError } from './error-log';

const cartEl = document.getElementById('cart');

const LineItemComponent = {
  name: 'line-item',
  props: ['item', 'loading'],
  data() {
    return {
      tweenedPrice: 0,
      tweenedOrigPrice: 0,
      animatePrice: false,
      animateOrigPrice: false,
    };
  },
  computed: {
    thumbnailImg() {
      const n = this.item.image.lastIndexOf('.');
      return `${this.item.image.substring(0, n)}_200x${this.item.image.substring(n)}`;
    },
    price() {
      return Number(this.item.line_price / 100);
    },
    animatedPrice() {
      return Number(this.tweenedPrice).toFixed(2);
    },
    origPrice() {
      return Number(this.item.original_line_price / 100);
    },
    animatedOrigPrice() {
      return Number(this.tweenedOrigPrice).toFixed(2);
    },
  },
  watch: {
    price: {
      immediate: true,
      handler(newVal) {
        if (this.animatePrice) {
          TweenLite.to(this.$data, 0.6, { tweenedPrice: newVal });
        } else {
          this.tweenedPrice = newVal;
          this.animatePrice = true;
        }
      },
    },
    origPrice: {
      immediate: true,
      handler(newVal) {
        if (this.animateOrigPrice) {
          TweenLite.to(this.$data, 0.6, { tweenedOrigPrice: newVal });
        } else {
          this.tweenedPrice = newVal;
          this.animateOrigPrice = true;
        }
      },
    },
  },
  methods: {
    changeLine(quantity) {
      this.$emit('change-line', this.item.key, quantity);
    },
  },
};

const vueCart = new Vue({
  el: cartEl,
  name: 'vueCart',
  delimiters: ['${', '}'],
  components: { 'line-item': LineItemComponent },
  data: {
    cartData: {},
    cartIsOpen: false,
    cartError: null,
    discountCode: sessionStorage.getItem('discountCode'),
    tweenedTotal: 0,
    tweenedFromFreeShip: 0,
    buttonDisabled: true,
    loadingKeys: [],
  },
  mounted() {
    this.attachToggleEvents();
    this.attachAddEvents();
    this.refreshCart();
  },
  updated() {

  },
  computed: {
    checkoutUrl() {
      return (this.discountCode) ? `/checkout?discount=${this.discountCode}` : '/checkout';
    },
    total() {
      return (Number(this.cartData.total_price) / 100).toFixed(2);
    },
    animatedTotal() {
      return Number(this.tweenedTotal).toFixed(2);
    },
    fromFreeShip() {
      let fromFreeShip = 150;
      if (Number(this.total) < 150) {
        fromFreeShip = (150 - this.total);
      } else {
        fromFreeShip = 0;
      }
      return Number(fromFreeShip).toFixed(2);
    },
    animatedFromFreeShip() {
      return Number(this.tweenedFromFreeShip).toFixed(2);
    },
  },
  watch: {
    total(newVal) {
      TweenLite.to(this.$data, 0.6, { tweenedTotal: newVal });
    },
    fromFreeShip(newVal) {
      TweenLite.to(this.$data, 0.6, { tweenedFromFreeShip: newVal });
    },
    cartIsOpen(newState) {
      if (newState) {
        disableBodyScroll(this.$el.querySelectorAll('.list')[0]);
      } else {
        enableBodyScroll(this.$el.querySelectorAll('.list')[0]);
      }
    },
  },
  methods: {
    attachToggleEvents() {
      const toggleEls = document.querySelectorAll('.cart-toggle');
      toggleEls.forEach((toggleEl) => {
        toggleEl.addEventListener('click', () => {
          this.toggleCart();
        });
      });
    },
    toggleCart() {
      this.cartIsOpen = !this.cartIsOpen;
    },
    refreshCart(lineItemKey) {
      axios.get('/cart.js')
        .then((response) => {
          console.log('Response from refreshCart');
          console.log(response);
          const newCart = response.data;
          this.cartData = newCart;
          this.updateCartCountEls();
          if (lineItemKey) {
            const index = this.loadingKeys.indexOf(lineItemKey);
            if (index > -1) {
              this.loadingKeys.splice(index, 1);
            }
          }
        })
        .catch(err => console.log(err));
    },
    updateCartCountEls() {
      const cartCountEls = document.querySelectorAll('.cart-toggle__count');
      cartCountEls.forEach((cartCountEl) => {
        cartCountEl.innerHTML = this.cartData.item_count;
        if (cartCountEl.classList.contains('hidden')) {
          cartCountEl.classList.remove('hidden');
        }
      });
    },
    attachAddEvents() {
      const addEls = document.querySelectorAll('.atc-button');
      addEls.forEach((addEl) => {
        const { variantId, quantity } = addEl.dataset;
        if (variantId && quantity) {
          addEl.addEventListener('click', () => {
            this.addToCart(variantId, quantity);
          });
        }
      });
    },
    addToCart(variantId, quantity = 1, properties) {
      this.cartIsOpen = true;
      const isInCart = this.cartData.items.find(item => Number(item.variant_id) === Number(variantId));
      if (isInCart) {
        this.changeCart(isInCart.key, (Number(isInCart.quantity) + Number(quantity)));
      } else {
        const body = {
          id: variantId,
          quantity,
          properties,
        };
        axios.post('/cart/add.js', body)
          .then((response) => {
            console.log('Response from addToCart');
            console.log(response);
            this.cartIsOpen = true;
            this.refreshCart();
          })
          .catch((err) => {
            // logCheckoutError({
            //   requestUrl: '/cart/add.js',
            //   requestBody: body,
            //   response: err,
            //   currentUserCart: this.cartData.items,
            // });
            console.log(err);
            this.setCartError();
          });
      }
    },
    changeCart(lineItemKey, quantity) {
      if (this.cartData && this.cartData.items.length > 0) {
        this.loadingKeys.push(lineItemKey);
        const body = {
          id: lineItemKey,
          quantity,
        };
        axios.post('/cart/change.js', body)
          .then((response) => {
            console.log('Response from changeCart');
            console.log(response);
            const newCart = response.data;
            const newItem = newCart.items.find(item => item.key.includes(lineItemKey));
            if (Number(quantity) !== 0 && Number(newItem.quantity) !== Number(quantity)) {
              this.setCartError('max qty');
            }
            this.refreshCart(lineItemKey);
          })
          .catch((err) => {
            // logCheckoutError({
            //   requestUrl: '/cart/change.js',
            //   requestBody: body,
            //   response: err,
            //   currentUserCart: this.cartState.cartData.items,
            // });
            console.log(err);
            this.setCartError();
          });
      } else {
        this.refreshCart();
      }
    },
    setCartError(error) {
      if (error === 'max qty') {
        this.cartError = 'The maximum quantity available is already in your cart.';
      } else {
        this.cartError = 'Sorry! That item is currently unavailable or an error has occurred. Please refresh the page.';
      }
      setTimeout(() => {
        this.cartError = null;
      }, 5000);
    },
  },
});

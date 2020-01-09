import Vue from 'vue/dist/vue.esm';
import axios from 'axios';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
// import { logCheckoutError } from '../utility/error-log';

const cartEl = document.getElementById('cart');

const LineItemComponent = {
  name: 'line-item',
  props: ['item', 'loading'],
  computed: {
    thumbnailImg() {
      const n = this.item.image.lastIndexOf('.');
      return `${this.item.image.substring(0, n)}_200x${this.item.image.substring(n)}`;
    },
    price() {
      return Number(this.item.line_price / 100).toFixed(2);
    },
    origPrice() {
      return Number(this.item.original_line_price / 100).toFixed(2);
    },
  },
  methods: {
    changeLine(quantity) {
      this.$emit('change-line', this.item.variant_id, quantity);
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
    freeShipRate: null,
    buttonDisabled: true,
    loadingIds: [],
  },
  mounted() {
    this.attachToggleEvent();
    this.setUpAddEvent();
    this.refreshCart();
  },
  computed: {
    checkoutUrl() {
      return (this.discountCode) ? `/checkout?step=contact_info&discount=${this.discountCode}` : '/checkout?step=contact_info';
    },
    total() {
      return (Number(this.cartData.total_price) / 100).toFixed(2);
    },
    fromFreeShip() {
      let fromFreeShip = this.freeShipRate;
      if (Number(this.total) < this.freeShipRate) {
        fromFreeShip = (this.freeShipRate - this.total);
      } else {
        fromFreeShip = 0;
      }
      return Number(fromFreeShip).toFixed(2);
    },
  },
  watch: {
    cartIsOpen(newState) {
      if (newState) {
        disableBodyScroll(this.$el.querySelectorAll('.list')[0]);
      } else {
        enableBodyScroll(this.$el.querySelectorAll('.list')[0]);
      }
    },
  },
  methods: {
    attachToggleEvent() {
      const toggleEls = document.querySelectorAll('.cart-toggle');
      toggleEls.forEach((toggleEl) => {
        toggleEl.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleCart(e.target);
        });
      });
    },
    toggleCart(target) {
      this.cartIsOpen = !this.cartIsOpen;
    },
    refreshCart(lineItemKey) {
      const config = {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      };
      axios.get('/cart.js', config)
        .then((response) => {
          const newCart = response.data;
          this.cartData = newCart;
          this.updateCartCountEls();
          if (lineItemKey) {
            const index = this.loadingIds.indexOf(lineItemKey);
            if (index > -1) {
              this.loadingIds.splice(index, 1);
            }
          }
        })
        .catch();
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
    setUpAddEvent() {
      const addEls = document.querySelectorAll('.atc-button');
      addEls.forEach((addEl) => {
        const { variantId, quantity } = addEl.dataset;
        if (variantId && quantity) {
          addEl.addEventListener('click', () => {
            this.cartIsOpen = true;
            this.addToCart(variantId, quantity);
          });
        }
      });
    },
    addToCart(variantId, quantity = 1, properties) {
      const isInCart = this.cartData.items.find(item => Number(item.variant_id) === Number(variantId));
      if (isInCart) {
        this.changeCart(isInCart.variant_id, (Number(isInCart.quantity) + Number(quantity)));
      } else {
        const config = {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        };
        const body = {
          id: variantId,
          quantity,
          properties,
        };
        axios.post('/cart/add.js', body, config)
          .then((response) => {
            this.refreshCart();
          })
          .catch((err) => {
            // logCheckoutError({
            //   requestUrl: '/cart/add.js',
            //   requestBody: body,
            //   response: err,
            //   currentUserCart: this.cartData.items,
            // });
            this.setCartError();
          });
      }
    },
    changeCart(lineItemVariantId, quantity) {
      if (this.cartData && this.cartData.items.length > 0) {
        this.loadingIds.push(lineItemVariantId);
        const config = {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        };
        const body = {
          id: lineItemVariantId.toString(),
          quantity,
        };
        axios.post('/cart/change.js', body, config, 'test')
          .then((response) => {
            console.log('/cart/change.js', response);
            const newCart = response.data;
            const newItem = newCart.items.find(item => item.variant_id === lineItemVariantId);
            if (Number(quantity) !== 0 && Number(newItem.quantity) !== Number(quantity)) {
              this.setCartError('max qty');
            }
            this.refreshCart(lineItemVariantId);
          })
          .catch((err) => {
            // logCheckoutError({
            //   requestUrl: '/cart/change.js',
            //   requestBody: body,
            //   response: err,
            //   currentUserCart: this.cartData.items,
            // });
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
      this.loadingIds = [];
      setTimeout(() => {
        this.cartError = null;
      }, 5000);
    },
  },
});

import Vue from 'vue/dist/vue.js'

const variantsEl = document.getElementById('variants-el');

const variantVue = new Vue ({
  el: variantsEl,
  name: "variants",
  data: function () {
    return {
      selected: []
    }
  },
  mounted: function() {
    let dataset = this.$el.dataset.defaultOptions;
    let initValues = dataset.split('|').slice(0, -1);
    this.selected = initValues;
  },
  computed: {
    trueSelect: function () { return document.getElementById('true-variant'); },
    trueOptions: function () { return document.querySelectorAll('#true-variant option'); },
  },
  methods: {
    selectOption: function (variantIndex, option) {
      let newValues = this.selected.slice(0);
      newValues[variantIndex - 1] = option;
      this.selected = newValues;
      let trueValue = this.selected.join(' / ');

      for (let i = 0; i < this.trueOptions.length; i++) {
        const trueOption = this.trueOptions[i];
        
        if (trueOption.value == trueValue) {
          this.trueSelect.selectedIndex = i;
        }
      }
    }
  }
})
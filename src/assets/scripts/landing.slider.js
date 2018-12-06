import Swiper from 'swiper/dist/js/swiper.js'

if (document.getElementById('landing-img-slider')) {
  const imgSwiper = new Swiper('#landing-img-slider', {
    loop: true
  })

  const txtSwiper = new Swiper('#landing-txt-slider', {
    loop: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: '#landing-txt-slider__pagination',
      type: 'bullets',
      clickable: true
    }
  })

  imgSwiper.controller.control = txtSwiper

  txtSwiper.controller.control = imgSwiper
}

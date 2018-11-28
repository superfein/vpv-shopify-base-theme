import anime from 'animejs'

// Load Animations
document.addEventListener('DOMContentLoaded', () => {
  anime({
    targets: '.fade-in--first--together',
    opacity: 1,
    duration: 500,
    delay: 100,
    easing: [0.25, 0.1, 0.25, 0.1]
  })

  anime({
    targets: '.fade-in--second--together',
    opacity: 1,
    duration: 500,
    delay: 600,
    easing: [0.25, 0.1, 0.25, 0.1]
  })

  anime({
    targets: '.fade-in--third--from-top',
    opacity: 1,
    duration: 500,
    delay: function (t, i) {
      if (i === 0) {
        return 1300
      } else {
        return (1300 + (i * 250))
      }
    },
    easing: [0.25, 0.1, 0.25, 0.1]
  })

  anime({
    targets: '.rise-in--third--from-top',
    translateY: -6,
    duration: 500,
    delay: function (t, i) {
      if (i === 0) {
        return 1300
      } else {
        return (1300 + (i * 250))
      }
    },
    easing: [0.25, 0.1, 0.25, 0.1]
  })
})

// Desktop Nav Collapse

document.addEventListener('DOMContentLoaded', function () {
  const promoBar = document.getElementById('promo-bar')
  const desktopNavWrapper = document.getElementById('desktop-nav-wrapper')
  const mobileNavWrapper = document.getElementById('mobile-nav-wrapper')

  let scrolling = false
  let collapsed = false
  let previousTop = 0
  let currentTop = 0
  let scrollDelta = 10
  let scrollOffset = 150

  var toggleHeader = function toggleHeader () {
    currentTop = window.scrollY
    if (previousTop - currentTop > scrollDelta) {
      desktopNavWrapper.classList.remove('collapsed')
      mobileNavWrapper.classList.remove('collapsed')
      promoBar.classList.remove('collapsed')
      collapsed = false
    } else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
      desktopNavWrapper.classList.add('collapsed')
      mobileNavWrapper.classList.add('collapsed')
      promoBar.classList.add('collapsed')
      collapsed = true
    }
    previousTop = currentTop
    scrolling = false
  }

  desktopNavWrapper.onclick = function (event) {
    if (collapsed) {
      desktopNavWrapper.classList.remove('collapsed')
      mobileNavWrapper.classList.remove('collapsed')
      promoBar.classList.remove('collapsed')
      collapsed = false
    }
  }

  document.onscroll = function (event) {
    if (!scrolling) {
      scrolling = true
      toggleHeader()
    }
  }
})

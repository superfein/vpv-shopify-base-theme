import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

// Desktop
const parentTriggers = Array.from(document.getElementsByClassName('parent-trigger'))
if (parentTriggers.length > 0) {
  parentTriggers.forEach(function (element) {
    element.addEventListener('mouseenter', function (event) {
      event.preventDefault()
      const parent = event.target
      const parentName = parent.dataset.name
      const childDiv = Array.from(document.querySelectorAll('[data-parent="' + parentName + '"]'))[0]
      if (Array.from(childDiv.classList).includes('active')) {
        return false
      } else {
        childDiv.classList.replace('hidden', 'active')
      };
      const arrowSvg = Array.from(document.querySelectorAll('[data-belongsto="' + parentName + '"]'))[0]
      arrowSvg.classList.toggle('flipped')
      const overlay = document.getElementById('lower-nav--desktop__overlay')
      overlay.classList.toggle('hidden')
    })
    element.addEventListener('mouseleave', function (event) {
      event.preventDefault()
      const parent = event.target
      const parentName = parent.dataset.name
      const childDiv = Array.from(document.querySelectorAll('[data-parent="' + parentName + '"]'))[0]
      if (Array.from(childDiv.classList).includes('active')) {
        childDiv.classList.replace('active', 'hidden')
      } else {
        return false
      }
      const arrowSvg = Array.from(document.querySelectorAll('[data-belongsto="' + parentName + '"]'))[0]
      arrowSvg.classList.toggle('flipped')
      const overlay = document.getElementById('lower-nav--desktop__overlay')
      overlay.classList.toggle('hidden')
    })
  })
}

const accountIcon = document.getElementById('account-icon')
const accountModal = document.getElementById('account-modal')
const toggleAccountModalShow = (e) => {
  accountModal.classList.remove('hidden')
}

const toggleAccountModalHide = (e) => {
  accountModal.classList.add('hidden')
}

accountIcon.addEventListener('mouseenter', toggleAccountModalShow)
accountIcon.addEventListener('mouseleave', toggleAccountModalHide)

const desktopSearchIcon = document.getElementById('desktop-search-icon')
const desktopSearchContainer = document.getElementById('desktop-search')
const desktopSearchOverlay = document.getElementById('desktop-search__overlay')
const desktopSearchX = document.getElementById('desktop-search__x')
const desktopSearchInput = document.getElementById('desktop-search__input')

const toggleDesktopSearchContainer = () => {
  desktopSearchContainer.classList.toggle('hidden')
  desktopSearchOverlay.classList.toggle('hidden')
  if (!desktopSearchContainer.classList.contains('hidden')) {
    setTimeout(function () {
      desktopSearchInput.focus()
    }, 400)
  }
}

desktopSearchIcon.addEventListener('click', toggleDesktopSearchContainer)
desktopSearchOverlay.addEventListener('click', toggleDesktopSearchContainer)
desktopSearchX.addEventListener('click', toggleDesktopSearchContainer)

// mobile
const togglemobileMenu = () => {
  const mobileMenu = document.getElementById('mobile-menu')
  mobileMenu.classList.toggle('hidden')
  if (mobileMenu.classList.contains('hidden')) {
    enableBodyScroll(mobileMenu)
  } else {
    disableBodyScroll(mobileMenu)
  }
}

document.getElementById('hamburger').addEventListener('click', togglemobileMenu)
document.getElementById('mobile-menu-x').addEventListener('click', togglemobileMenu)

let activeParent
let activeChild
let activeArrow

const mobileParentTriggers = Array.from(document.getElementsByClassName('mobile-parent-trigger'))
if (mobileParentTriggers.length > 0) {
  mobileParentTriggers.forEach(function (element) {
    element.addEventListener('click', function (event) {
      event.preventDefault()
      let target
      if (!event.target.classList.contains('mobile-parent-trigger')) {
        target = event.target.parentNode
      } else {
        target = event.target
      }
      const parent = target
      if (activeParent === undefined) {
        activeParent = parent
        const parentName = parent.dataset.mobileName
        const childDiv = Array.from(document.querySelectorAll('[data-mobile-parent="' + parentName + '"]'))[0]
        activeChild = childDiv
        const arrowSvg = Array.from(document.querySelectorAll('[data-mobile-belongsto="' + parentName + '"]'))[0]
        arrowSvg.classList.toggle('flipped')
        activeArrow = arrowSvg
        childDiv.classList.toggle('hidden')
        parent.classList.toggle('bold')
      } else if (activeParent === parent) {
        activeChild.classList.toggle('hidden')
        activeParent.classList.toggle('bold')
        activeArrow.classList.toggle('flipped')
        activeParent = undefined
        activeChild = undefined
      } else {
        activeChild.classList.toggle('hidden')
        activeParent.classList.toggle('bold')
        activeArrow.classList.toggle('flipped')
        activeParent = parent
        const parentName = parent.dataset.mobileName
        const childDiv = Array.from(document.querySelectorAll('[data-mobile-parent="' + parentName + '"]'))[0]
        activeChild = childDiv
        const arrowSvg = Array.from(document.querySelectorAll('[data-mobile-belongsto="' + parentName + '"]'))[0]
        arrowSvg.classList.toggle('flipped')
        activeArrow = arrowSvg
        childDiv.classList.toggle('hidden')
        parent.classList.toggle('bold')
      }
    })
  })
}

const mobileChildTriggers = Array.from(document.getElementsByClassName('mobile-child-trigger'))
if (mobileChildTriggers.length > 0) {
  mobileChildTriggers.forEach(function (element) {
    element.addEventListener('click', function (event) {
      event.preventDefault()
      let target
      if (!event.target.classList.contains('mobile-child-trigger')) {
        target = event.target.parentNode
      } else {
        target = event.target
      }
      const parent = target
      const parentName = parent.dataset.mobileChildName
      const childDiv = Array.from(document.querySelectorAll('[data-mobile-child-parent="' + parentName + '"]'))[0]
      childDiv.classList.toggle('hidden')
      const arrowSvg = Array.from(document.querySelectorAll('[data-mobile-child-belongsto="' + parentName + '"]'))[0]
      arrowSvg.classList.toggle('flipped')
    })
  })
}

const mobileSearchIcon = document.getElementById('mobile-search-icon')
const mobileSearchContainer = document.getElementById('mobile-search')
const mobileSearchOverlay = document.getElementById('mobile-search__overlay')
const mobileSearchX = document.getElementById('mobile-search__x')

const togglemobileSearchContainer = () => {
  mobileSearchContainer.classList.toggle('hidden')
  mobileSearchOverlay.classList.toggle('hidden')
}

mobileSearchIcon.addEventListener('click', togglemobileSearchContainer)
mobileSearchOverlay.addEventListener('click', togglemobileSearchContainer)
mobileSearchX.addEventListener('click', togglemobileSearchContainer)

const prodDetailsWrapper = document.getElementById('product-details-wrapper')

if (prodDetailsWrapper) {
  const prodDetailsArr = Array.from(prodDetailsWrapper.children)
  const prodDetailsButtons = Array.from(document.getElementById('product-details-buttons').children)
  const prodDetailsSelect = document.getElementById('product-details-select')

  let largestHeight = 0
  let currentSelected
  let lastPressed

  prodDetailsArr.forEach((prodDetail) => {
    if (prodDetail.offsetHeight > largestHeight) {
      largestHeight = prodDetail.offsetHeight
    }
  })

  prodDetailsArr.forEach((prodDetail) => {
    prodDetail.style.minHeight = largestHeight + 'px'
    if (prodDetail.id !== 'product-description') {
      prodDetail.classList.add('hidden')
    } else {
      currentSelected = prodDetail
    }
  })

  prodDetailsSelect.addEventListener('change', (e) => {
    if (e.target[e.target.selectedIndex].dataset.contentId !== currentSelected) {
      const selectedProdDetail = prodDetailsArr.find((prodDetail) => {
        return prodDetail.id === e.target[e.target.selectedIndex].dataset.contentId
      })
      currentSelected.classList.add('hidden')
      selectedProdDetail.classList.remove('hidden')
      currentSelected = selectedProdDetail
      lastPressed.classList.remove('active')
      const currentButton = prodDetailsButtons.find((button) => {
        return button.value === e.target.value
      })
      currentButton.classList.add('active')
      lastPressed = currentButton
    }
  })

  prodDetailsButtons.forEach((button) => {
    if (button.dataset.contentId === 'product-description') {
      lastPressed = button
      button.classList.add('active')
    }

    button.addEventListener('click', (e) => {
      if (e.target.dataset.contentId !== currentSelected) {
        const selectedProdDetail = prodDetailsArr.find((prodDetail) => {
          return prodDetail.id === e.target.dataset.contentId
        })
        currentSelected.classList.add('hidden')
        selectedProdDetail.classList.remove('hidden')
        currentSelected = selectedProdDetail
        lastPressed.classList.remove('active')
        e.target.classList.add('active')
        lastPressed = e.target
        prodDetailsSelect.value = e.target.value
        const span = Array.from(document.querySelectorAll('[data-belongs-to="product-details-select"]'))[0]
        span.innerHTML = e.target.value
      }
    })
  })
}

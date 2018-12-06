const selects = Array.from(document.getElementsByClassName('canadian-select'))

if (selects.length > 0) {
  selects.forEach((select) => {
    // select.addEventListener('click', (e) => {
    //   const arrow = Array.from(document.querySelectorAll('[data-arrow-for="' + e.target.id + '"]'))[0]
    //   if (!arrow.classList.contains('flipped')) {
    //     arrow.classList.toggle('flipped')
    //   }
    // })
    //
    // select.addEventListener('focusout', (e) => {
    //   const arrow = Array.from(document.querySelectorAll('[data-arrow-for="' + e.target.id + '"]'))[0]
    //   if (arrow.classList.contains('flipped')) {
    //     arrow.classList.toggle('flipped')
    //   }
    // })

    select.addEventListener('change', (e) => {
      const span = Array.from(document.querySelectorAll('[data-belongs-to="' + e.target.id + '"]'))[0]
      span.innerHTML = e.target.value
      // const arrow = Array.from(document.querySelectorAll('[data-arrow-for="' + e.target.id + '"]'))[0]
      // if (arrow.classList.contains('flipped')) {
      //   arrow.classList.toggle('flipped')
      // }
    })
  })
}

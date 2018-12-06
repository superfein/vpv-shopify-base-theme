const searchTermSpan = document.getElementById('search-term')

if (searchTermSpan) {
  searchTermSpan.innerHTML = window.location.search.replace('?q=', '')
}

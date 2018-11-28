const promoWrapper = document.getElementById('promo-wrapper')
const promoX = document.getElementById('promo-x')

if (promoWrapper) {
  function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  function getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  }

  if (!getCookie('sak-promo-shown')) {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(showPromo, 10000)
    })
  }

  const showPromo = () => {
    promoWrapper.classList.remove('hidden')
  }

  const hidePromo = () => {
    promoWrapper.classList.add('hidden')
  }

  promoX.addEventListener('click', () => {
    hidePromo()
    setCookie('sak-promo-shown', true, 7)
  })

  promoWrapper.addEventListener('click', (e) => {
    if (e.target === promoWrapper) {
      hidePromo()
    }
  })
}

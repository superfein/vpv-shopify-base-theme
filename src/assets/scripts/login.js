const loginPwToggle = document.getElementById('login-password-toggle')
const signupPwToggle = document.getElementById('signup-password-toggle')
const loginPwInput = document.getElementById('login-password')
const signupPwInput = document.getElementById('signup-password')

if (loginPwToggle) {
  loginPwToggle.addEventListener('click', () => {
    if (loginPwInput.type === 'password') {
      loginPwInput.type = 'text'
      loginPwToggle.innerHTML = `
        <svg>
          <use xlink:href="#dark--eye_open"/>
        </svg>
      `
    } else {
      loginPwInput.type = 'password'
      loginPwToggle.innerHTML = `
        <svg>
          <use xlink:href="#dark--eye_closed"/>
        </svg>
      `
    }
  })
}

if (signupPwToggle) {
  signupPwToggle.addEventListener('click', () => {
    if (signupPwInput.type === 'password') {
      signupPwInput.type = 'text'
      signupPwToggle.innerHTML = `
        <svg>
          <use xlink:href="#dark--eye_open"/>
        </svg>
      `
    } else {
      signupPwInput.type = 'password'
      signupPwToggle.innerHTML = `
        <svg>
          <use xlink:href="#dark--eye_closed"/>
        </svg>
      `
    }
  })
}

const loginContainer = document.getElementById('login-container')
const forgotContainer = document.getElementById('forgot-container')
const forgotAnchor = document.getElementById('forgot-anchor')
const cancelForgotAnchor = document.getElementById('cancel-forgot-anchor')

if (window.location.href.includes('#recover')) {
  loginContainer.classList.add('hidden')
  forgotContainer.classList.remove('hidden')
}

if (loginContainer) {
  forgotAnchor.addEventListener('click', () => {
    loginContainer.classList.toggle('hidden')
    setTimeout(() => {
      forgotContainer.classList.toggle('hidden')
    }, 300)
  })

  cancelForgotAnchor.addEventListener('click', () => {
    forgotContainer.classList.toggle('hidden')
    setTimeout(() => {
      loginContainer.classList.toggle('hidden')
    }, 300)
  })
}

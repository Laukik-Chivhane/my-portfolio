// NAV SCROLL EFFECT
const navItems = document.getElementById('navItems');

window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight * 0.6) {
    navItems.classList.add('shifted');
  } else {
    navItems.classList.remove('shifted');
  }
});

// CONTACT FORM SUBMISSION WITH SUCCESS MESSAGE
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            successMessage.textContent = '✅ Your message has been sent!';
            successMessage.style.color = 'orange';
            successMessage.style.display = 'block';
            form.reset();
          } else {
            successMessage.textContent = '❌ Something went wrong. Please try again.';
            successMessage.style.color = 'red';
            successMessage.style.display = 'block';
          }
        })
        .catch(() => {
          successMessage.textContent = '❌ Network error. Try again later.';
          successMessage.style.color = 'red';
          successMessage.style.display = 'block';
        });
    });
  }
});

const formForLogin = document.getElementById('loginForm') as HTMLFormElement | null;
const messageDivForLogin = document.getElementById('message') as HTMLDivElement | null;

if (formForLogin && messageDivForLogin) {
    formForLogin.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const email = (formForLogin.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (formForLogin.elements.namedItem('password') as HTMLInputElement)?.value;

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data: { message?: string; } = await response.json();

      if (response.ok) {
        //localStorage.setItem('token', data.token);
        window.location.href = '/account-page';
      } else {
        messageDivForLogin.style.color = 'red';
        messageDivForLogin.textContent = data.message || 'Login failed';
      }
    } catch (err) {
        messageDivForLogin.style.color = 'red';
        messageDivForLogin.textContent = 'Error submitting form';
    }
  });
} else {
  console.error("Login form or message element not found");
}

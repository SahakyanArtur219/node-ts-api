const form = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');
console.log("work")
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    messageDiv.style.color = response.ok ? 'green' : 'red';
    messageDiv.textContent = data.message;
  } catch (err) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Error submitting form';
  }
});

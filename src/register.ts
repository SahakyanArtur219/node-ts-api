const formForRegister = document.getElementById('registerForm') as HTMLFormElement | null;
const messageDivForRegister = document.getElementById('message') as HTMLDivElement | null;

console.log("work");

if (formForRegister && messageDivForRegister) {
    formForRegister.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const email = (formForRegister.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (formForRegister.elements.namedItem('password') as HTMLInputElement)?.value;

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data: { message: string } = await response.json();
      formForRegister.style.color = response.ok ? 'green' : 'red';
      formForRegister.textContent = data.message;
    } catch (err) {
        formForRegister.style.color = 'red';
        formForRegister.textContent = 'Error submitting form';
    }
  });
} else {
  console.error("Form or message element not found");
}

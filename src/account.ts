import { createApp, ref, onMounted } from 'vue';

createApp({
  setup() {
    const user = ref<any>(null);

    onMounted(async () => {
      const res = await fetch('/account', {
        method: 'GET',
        credentials: 'include', // or send token if using JWT
      });

      if (res.ok) {
        user.value = await res.json(); // e.g., { name: "Alice", email: "alice@example.com" }
      } else {
        window.location.href = 'login.html'; // not logged in
      }
    });

    return { user };
  },
}).mount('#app');

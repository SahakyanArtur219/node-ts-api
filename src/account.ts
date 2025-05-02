
async function fetchAccount(): Promise<void> {
  const token: string | null = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  try {
    const res: Response = await fetch('/account', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const data: { email?: string; message?: string } = await res.json();
    const div = document.getElementById('account-info') as HTMLDivElement | null;

    if (!div) {
      console.error('Could not find #account-info element');
      return;
    }

    if (res.ok && data.email) {
      div.innerHTML = `<h1>Hello, ${data.email}</h1>`;
    } else {
      div.innerHTML = '<h1>Failed to load account info. Redirecting to login...</h1>';
      setTimeout(() => window.location.href = '/login.html', 2000);
    }
  } catch (error) {
    console.error('Error fetching account:', error);
    const div = document.getElementById('account-info') as HTMLDivElement | null;
    if (div) {
      div.innerHTML = '<h1>Something went wrong. Redirecting...</h1>';
      setTimeout(() => window.location.href = '/login.html', 2000);
    }
  }
}

fetchAccount();

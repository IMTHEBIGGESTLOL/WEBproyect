async function showUserData() {
    try {
        const resp = await fetch('/api/users/search/me', { method: 'GET' });
        const data = await resp.json();

        console.log(data); // Imprime los datos en la consola

        document.getElementById('username').textContent = data.username;
        document.getElementById('name').textContent = data.name;
        document.getElementById('bio').textContent = data.bio;
    } catch (error) {
        console.error('Error obtaining user data:', error);
    }
}

showUserData();

const form = document.getElementById('emailLoginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:2137/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            
            window.location.href = '/email';
        } else {
            alert('Logowanie nieudane. Sprawdź dane.');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

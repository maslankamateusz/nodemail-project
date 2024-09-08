const form = document.getElementById('emailForm');

        async function logout() {
            try {
                const response = await fetch('http://localhost:2137/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    window.location.href = '/';
                } else {
                    alert('Błąd podczas wylogowywania');
                }
            } catch (error) {
                alert('Błąd: ' + error.message);
            }
        }

        window.onload = async () => {
            try {
                const response = await fetch('http://localhost:2137/user-email', {
                    method: 'GET'
                });
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('userEmailAddress').textContent = data.email;
                } else {
                    window.location.href = '/';
                }
            } catch (error) {
                alert('Błąd: ' + error.message);
            }
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const to = document.getElementById('to').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            try {
                const response = await fetch('http://localhost:2137/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ to, subject, text: message })
                });

                const result = await response.json();

                if (response.status === 200) {
                    alert('Email sent successfully!');
                } else {
                    alert('Error sending email: ' + result.message);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
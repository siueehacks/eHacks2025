const { apiURL } = await(await fetch('/JS/config.json')).json();


window.addEventListener('load', async () => {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const loginReq = await fetch(`${apiURL}/admin/login`, {
            method: 'POST',
            mode: 'cors',
            headers: { "Content-Type": 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            })
        });
        const loginRes = await loginReq.json();
        if (loginRes.success) {
            window.location.pathname = "/admin.html";
        }

    });
});
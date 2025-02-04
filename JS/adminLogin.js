// Disable right-click (context menu)
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

// Disable F12 key (Developer Tools)
document.addEventListener('keydown', function (event) {
    if (event.key === 'F12' || (event.key && (event.key.toLowerCase() === 'i' && event.ctrlKey || event.key?.toLowerCase() === "u" && event.ctrlKey))) {
        event.preventDefault();
    }
});

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
            sessionStorage.setItem("sessionId", loginRes.sessionId);
            window.location.pathname = "/admin.html";
        } else {
            alert(loginRes.error);
            return;
        }

    });
});
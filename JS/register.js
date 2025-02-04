// Disable right-click (context menu)
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

// Disable F12 key (Developer Tools)
document.addEventListener('keydown', function (event) {
    if (event.key === 'F12' || event.key.toLowerCase() === 'i' && event.ctrlKey || event.key.toLowerCase() === "u" && event.ctrlKey) {
        event.preventDefault();
    }
});

const { apiURL } = await(await fetch('/JS/config.json')).json();

window.addEventListener('load', async () => {
    const otherOption = document.getElementById('Other');
    const commentContainer = document.getElementById('comment-container');
    const commentText = document.getElementById('comment')
    const fileUpload = document.getElementById('fileupload');
    const fileBox = document.getElementById('registerForm-filebox');
    const form = document.getElementById('registerForm');
    otherOption.addEventListener('change', ({ target }) => {
        if (target.checked) {
            commentContainer.style.display = "block";
            commentText.value = "N/A";
        } else {
            commentContainer.style.display = "";
            commentText.value = "";
        }
    })
    fileBox.addEventListener('click', () => {
        fileUpload.click();
    });
    fileUpload.addEventListener('change', ({ target }) => {
        document.getElementById('registerForm-filebox-text').innerHTML = target.files[0].name;
    });
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const submitReq = await fetch(`${apiURL}/apply`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            // headers: { "Content-Type": 'application/json' },
            body: formData
        });
        const submitRes = await submitReq.json();
        if (submitRes.success) {
            alert("Your registration/update was successful. You should have recieved an email confirming this action. You will now be taken back to the home page. Make sure to try and find the easter eggs within this website for a chance to win exclusive eHacks 2025 merch.");
            window.location.pathname = "/";
        }
    })
});
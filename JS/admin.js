const { apiURL } = await(await fetch('/JS/config.json')).json();


window.addEventListener('load', async (event) => {
    event.preventDefault();
    const loginReq = await fetch(`${apiURL}/admin/isloggedin`, {
        method: "GET",
        credentials: 'include'
    });
    const loginRes = await loginReq.json();
    if (!loginRes.success) {
        window.location.pathname = "/";
        return;
    }
    if (loginRes.success == true) {
        const cover = document.getElementById('cover')
        cover.style.display = "none";
    }
    const logoutButton = document.getElementById('logoutButton');
    const attendeeTable = document.getElementById('attendees-table');
    const shirtForm = document.getElementById('shirt-form');

    logoutButton.addEventListener('click', async () => {
        const loginReq = await fetch(`${apiURL}/admin/logout`, {
            method: "GET",
            credentials: 'include'
        });
        const loginRes = await loginReq.json();
        if (!loginRes.success) {
            alert(loginRes.reason);
            return;
        }
        window.location.pathname = "/adminLogin.html";
    });
    // get attendees
    const attendeeReq = await fetch(`${apiURL}/admin/attendees`, {
        method: "GET",
        credentials: 'include'
    });
    const attendeeRes = await attendeeReq.json();
    if (!attendeeRes.success) {
        alert(attendeeRes.reason);
        return;
    }
    for (let attendee of attendeeRes.attendees) {
        const row = document.createElement('tr');
        attendeeTable.appendChild(row);
        const registered = document.createElement('td');
        const registeredImage = document.createElement('img');
        registeredImage.className = (attendee.registered) ? "greenFilter" : "redFilter";
        registeredImage.src = (attendee.registered) ? "/Media/circle-check-solid.svg" : "/Media/circle-xmark-solid.svg";
        registered.appendChild(registeredImage);
        row.appendChild(registered);
        const firstName = document.createElement('td');
        firstName.innerHTML = attendee.firstName;
        firstName.colSpan = 0;
        row.appendChild(firstName);
        const lastName = document.createElement('td');
        lastName.innerHTML = attendee.lastName;
        row.appendChild(lastName);
        const email = document.createElement('td');
        email.innerHTML = attendee.email;
        row.appendChild(email);
        const shirtSize = document.createElement('td');
        shirtSize.innerHTML = attendee.shirtSize;
        row.appendChild(shirtSize);
        const resume = document.createElement('td');
        resume.innerHTML = `<button class="tablebutton" onClick="downloadResume(${attendee.userId},'${attendee.resume.split("/")[2]}')">Download</button>`;
        row.appendChild(resume);
        const school = document.createElement('td');
        school.innerHTML = attendee.school;
        row.appendChild(school);
        const schoolYear = document.createElement('td');
        schoolYear.innerHTML = attendee.schoolYear;
        row.appendChild(schoolYear);
        const major = document.createElement('td');
        major.innerHTML = attendee.major;
        row.appendChild(major);
        const needsTransport = document.createElement('td');
        row.appendChild(needsTransport);
        const transportImage = document.createElement('img');
        transportImage.className = (attendee.needsTransport) ? "greenFilter" : "redFilter";
        transportImage.src = (attendee.needsTransport) ? "/Media/circle-check-solid.svg" : "/Media/circle-xmark-solid.svg";
        needsTransport.appendChild(transportImage);
    }

    // Get shirts
    const shirtReq = await fetch(`${apiURL}/admin/shirts`, {
        method: "GET",
        credentials: 'include'
    });
    const shirtRes = await shirtReq.json();
    if (!shirtRes.success) {
        alert(shirtRes.reason);
        return;
    }
    for (let shirt of shirtRes.shirts) {
        const div = document.createElement('div');
        div.className = "shirt-form-div";
        shirtForm.appendChild(div);
        const label = document.createElement('label');
        label.className = "shirt-form-label";
        label.innerHTML = shirt.sizeName;
        label.for = shirt.sizeName;
        div.appendChild(label);
        const input = document.createElement('input');
        input.className = "shirt-form-input";
        input.name = shirt.sizeId;
        input.type = "number";
        input.min = 0;
        input.value = shirt.sizeAmount;
        div.appendChild(input);
    }
    const shirtButton = document.createElement('button');
    shirtButton.className = "button shirt-form-button";
    shirtButton.innerHTML = "Submit";
    shirtForm.appendChild(shirtButton);
    shirtForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(shirtForm);

        const shortFormReq = await fetch(`${apiURL}/admin/shirts/update`, {
            method: "POST",
            credentials: 'include',
            mode: 'cors',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(
                {
                    shirts: [
                        {
                            sizeId: 1,
                            sizeAmount: formData.get("1")
                        },
                        {
                            sizeId: 2,
                            sizeAmount: formData.get("2")
                        },
                        {
                            sizeId: 3,
                            sizeAmount: formData.get("3")
                        },
                        {
                            sizeId: 4,
                            sizeAmount: formData.get("4")
                        },
                        {
                            sizeId: 5,
                            sizeAmount: formData.get("5")
                        }
                    ]
                }
            )
        });
        const shortFormRes = await shortFormReq.json();
        if (!shortFormRes.success) {
            alert(shortFormRes.reason);
            return;
        }
        alert("Shirts stock has been updated!");
    })
});
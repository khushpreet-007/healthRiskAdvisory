function registerDevice() {

    const ward = document.getElementById("ward").value;
    const role = document.getElementById("role").value;

    fetch("/api/register-device", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            token: fcmToken,
            ward,
            role

        })

    })
    .then(r => r.json())
    .then(() => {

        document.getElementById("status").innerHTML =
            `🟢 Registered for <b>${ward}</b> as <b>${role}</b>`;

    });

}
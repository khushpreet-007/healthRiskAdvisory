let fcmToken = null;
let latestAudio = null;


async function registerDevice(){

    if(!fcmToken){
        alert("Please wait, notification setup is not completed");
        return;
    }


    const ward =
        document.getElementById("ward").value;


    const role =
        document.getElementById("role").value;


    const response = await fetch(
        "/api/register-device",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                token:fcmToken,
                ward:ward,
                role:role
            })
        }
    );


    const data = await response.json();


    console.log(data);


    document.getElementById("status").innerHTML =
        "🟢 Registered for "+ward+" alerts";

}
const registerUser = async () => {

 await axios.post("http://localhost:1337/api/auth/local/register", {
    username: "NyAnvändare2",
    email:"user2@newuser.com",
    password:"Test1234"
 } )
}

const loginUser = async () => {
    let response = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: "user2@newuser.com",
        password: "Test1234"
    })
    if(response.status === 200){
        localStorage.setItem("token", response.data.jwt);
    }
}

const getStudents = async () => {
    let response = await axios.get("http://localhost:1337/api/students", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    console.log(response);
}

const isLoggedIn = async () => {
    const response = await axios.get("http://localhost:1337/api/users/me", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    } )
    console.log(response);
    if(response.status === 200){
        console.log("You are logged in! Welcome " + response.data.username)
    }
}

document.querySelector("#login").addEventListener("click", loginUser);
document.querySelector("#register").addEventListener("click", registerUser);
document.querySelector("#getStudents").addEventListener("click", getStudents);
document.querySelector("#getInfo").addEventListener("click", isLoggedIn);


//EFTERMIDDAG

async function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    let response = await axios.post("http://localhost:1337/api/auth/local/", {
        identifier:username,
        password:password
    })
    console.log(response);

    //Vid lyckad inloggning

    if(response.status === 200){
        sessionStorage.setItem("token", response.data.jwt);
        location.reload();
    }

  }

async function handleRegister() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    //Axios request mot /api/auth/local/register
    let response = await axios.post("http://localhost:1337/api/auth/local/register", {
        username:username,
        email:email,
        password:password
    })

    console.log(response);

}

async function renderPage(){
    //Kolla token i sessionStorage
    if(sessionStorage.getItem("token")){
        // Se om användare är inloggad (samt populera med relations)
        try {
        let response = await axios.get("http://localhost:1337/api/users/me?populate=*", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
        //Spara användaruppgifter i user (samt deras elever)
        let user = response.data;
        console.log(user)
        //Hämta alla elever

        // let studentsResponse = await axios.get("http://localhost:1337/api/students", {
        //     headers: {
        //         Authorization: `Bearer ${sessionStorage.getItem("token")}`
        //     }
        // });

        // let students = studentsResponse.data.data;

        user.students.forEach(student => {
            let div = document.createElement("div");

            div.style.border = "2px solid black";
            let name = document.createElement("h3");
            let age = document.createElement("h3");
            name.innerText = "Namn: " + student.name;
            age.innerText = "Ålder: " + student.age;
            div.append(name,age)
            document.body.append(div);
        })

        //Skriv ut hälsningsmeddelande + samtliga elever

        let h2 = document.createElement("h2");
        h2.innerText = "Welcome " + response.data.username + ", you are logged in!";

        //Uppdatera innehållet på sidan med formulär för att lägga till elever

        let nameInput = document.createElement("input");
        nameInput.placeholder = "Namn";
        
        let ageInput = document.createElement("input");
        ageInput.placeholder = "Ålder";

        let addStudentBtn = document.createElement("button");
        addStudentBtn.innerText = "Lägg till elev"

        addStudentBtn.addEventListener("click", async () => {
            await axios.post("http://localhost:1337/api/students", {
                data: {
                    name: nameInput.value,
                    age:ageInput.value,
                    teacher: user.documentId
                }
            }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
            })
            location.reload();
        })

        
        document.querySelector(".container").innerHTML = "";
        document.querySelector(".container").append(h2, nameInput,ageInput,addStudentBtn);

    } catch (err) {
        console.log("Error", err);
    }

    }

}

renderPage()
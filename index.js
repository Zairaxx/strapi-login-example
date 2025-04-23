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

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username === "admin" && password === "12345"){
        localStorage.setItem("adminLoggedIn", "true");
        window.location.href = "admin.html";
    } else {
        alert("Invalid Username or Password");
    }
}
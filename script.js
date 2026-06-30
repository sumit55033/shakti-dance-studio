document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("trialForm");

if(form){

form.addEventListener("submit", async (e) => {

e.preventDefault();

const data = {

name: document.getElementById("name").value,

mobile: document.getElementById("mobile").value,

course: document.getElementById("course").value

};

try{

const response = await fetch(
"http://localhost:5000/trial",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
}
);

const result = await response.json();

alert(result.message);

form.reset();

}catch(error){

alert("Server Error. Backend Running Hai Ya Nahi Check Karo.");

}

});

}

});
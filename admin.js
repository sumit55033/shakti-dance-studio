let allData = [];

if(localStorage.getItem("adminLoggedIn") !== "true"){
    window.location.href = "login.html";
}

async function loadData() {

    const response = await fetch("http://localhost:5000/trials");

    const data = await response.json();

    allData = data;

    document.getElementById("totalBookings").innerText = data.length;

    showTable(data);
    drawChart(data);
}

function showTable(data){

    let html = "";

    data.forEach((item) => {

        html += `
        <tr>

            <td>${item.name}</td>

            <td>${item.mobile}</td>

            <td>${item.course}</td>

            <td>${new Date(item.createdAt).toLocaleString()}</td>

            <td>

                <button
                class="whatsapp-btn"
                onclick="openWhatsApp('${item.mobile}')">
                    WhatsApp
                </button>

                <button
                class="edit-btn"
                onclick="editTrial('${item._id}', '${item.name}', '${item.mobile}', '${item.course}')">
                    Edit
                </button>

                <button
                class="delete-btn"
                onclick="deleteTrial('${item._id}')">
                    Delete
                </button>

            </td>

        </tr>
        `;
    });

    document.getElementById("tableData").innerHTML = html;
}

function searchData(){

    const search = document.getElementById("searchInput")
    .value.toLowerCase();

    const filteredData = allData.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.mobile.includes(search)
    );

    showTable(filteredData);
}

async function deleteTrial(id){

    if(confirm("Delete this booking?")){

        await fetch(
            "http://localhost:5000/trial/" + id,
            {
                method: "DELETE"
            }
        );

        loadData();
    }
}

function openWhatsApp(number){

    window.open(
        `https://wa.me/91${number}`,
        "_blank"
    );
}

function exportToExcel(){

    let csv = "Name,Mobile,Course,Date\n";

    allData.forEach((item) => {

        csv += `${item.name},${item.mobile},${item.course},${new Date(item.createdAt).toLocaleString()}\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "shakti-dance-bookings.csv";

    link.click();
}

function logout(){

    localStorage.removeItem("adminLoggedIn");

    window.location.href = "login.html";
}

loadData();
async function editTrial(id, oldName, oldMobile, oldCourse){

    const name = prompt("Enter new name:", oldName);
    const mobile = prompt("Enter new mobile:", oldMobile);
    const course = prompt("Enter new course:", oldCourse);

    if(name && mobile && course){

        const response = await fetch("http://localhost:5000/trial/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                mobile: mobile,
                course: course
            })
        });

        const result = await response.json();

        alert(result.message);

        loadData();
    }
}
function drawChart(data){

    const courseCount = {};

    data.forEach(item => {

        if(courseCount[item.course]){
            courseCount[item.course]++;
        }else{
            courseCount[item.course] = 1;
        }

    });

    const labels = Object.keys(courseCount);
    const values = Object.values(courseCount);

    const ctx = document.getElementById("courseChart");

    if(window.myChart){
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Students",
                data: values
            }]
        }
    });

}
function filterToday(){

    const today = new Date().toDateString();

    const filtered = allData.filter(item =>
        new Date(item.createdAt).toDateString() === today
    );

    showTable(filtered);
    drawChart(filtered);
}

function filterThisWeek(){

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const filtered = allData.filter(item => {
        const date = new Date(item.createdAt);
        return date >= sevenDaysAgo && date <= now;
    });

    showTable(filtered);
    drawChart(filtered);
}

function filterThisMonth(){

    const now = new Date();

    const filtered = allData.filter(item => {
        const date = new Date(item.createdAt);
        return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        );
    });

    showTable(filtered);
    drawChart(filtered);
}

function showAll(){
    showTable(allData);
    drawChart(allData);
}
const db = firebase.firestore();

let everyClientReports = [];
let client = [];
let clientReports = [];

let myChart = [];
let clientUID = 0;
let itemId = 0;
let actualYear = new Date().getFullYear();

// retrieve data from Firebase based on user's mail
function retrieveClientFromFirestore() {
    let user_email = firebase.auth().currentUser.email;
    let clientNumber = document.location.search.replace(/^.*?\=/,'');
    clientNumber = decodeURI(clientNumber);

    db.collection("clients").doc(user_email)
    .get()
    .then(function(doc) {
        if (doc.exists) {
            let recv_data = doc.data();
            let clientData = JSON.parse(recv_data['data']);
            let reportsData = recv_data['reports'];

            if (reportsData) {
                everyClientReports = JSON.parse(reportsData);
            }

            let reportsFound = everyClientReports.clients?.find(e => e.number === clientNumber);

            if (!reportsFound) {
                reportsFound = {number: clientNumber, reports: [{year: actualYear.toString()}, {year: (actualYear - 1).toString()}, {year: (actualYear - 2).toString()}, {year: (actualYear - 3).toString()}]};
                everyClientReports.clients = [];
                everyClientReports.clients.push(reportsFound);
            }

            clientReports = reportsFound.reports.sort((a, b) => a.year > b.year ? 1 : -1);

            client = clientData?.clients ? clientData.clients.find(e => e.number === clientNumber) : [];

            if (client) {
                document.getElementById('user_client').innerText = client.name;
                addClient(client);
            }
            triggerFullScreenPreloader();
        }
        else {
            triggerFullScreenPreloader();
            alert("Aucun client n'a été retrouvé. Veuillez en ajouter.");
        }
    })
    .catch(function(error) {
        triggerFullScreenPreloader();
        console.log(error);
        alert("Erreur lors du chargement des clients.");
    });
}

function addClient(client) {
    let number = "<p>" + client.number + "</p>";
    let name = "<p>" + client.name + "</p>";
    let tvaNumber = "<p>" + client.tvaNumber + "</p>";
    let activity = "<p>" + client.activity + "</p>";
    let bankStatement = "<p>" + client.bankStatement + "</p>";
    let email = "<p>" + client.email + "</p>";
    let phoneNumber = "<p>" + client.phoneNumber + "</p>";
    let mandate = "<p>" + client.mandate + "</p>";
    let uboRegister = "<p>" + client.uboRegister + "</p>";

    // let mandate = "<div class='switch'><label>Non<input disabled type='checkbox' " + (client.mandate === 'Oui' ? 'checked' : '') + "><span class=\"lever\"></span>Oui</label></div>";
    // let uboRegister = "<div class='switch'><label>Non<input disabled type='checkbox' " + (client.uboRegister === 'Oui' ? 'checked' : '') + "><span class=\"lever\"></span>Oui</label></div>";

    let secretary = "<p>" + client.secretary + "</p>";
    let importance = "<p>" + client.importance + "</p>";
    let appointmentMandate = "<p>" + new Date(client.appointmentMandate).toLocaleDateString() + ' - ' + new Date(client.appointmentMandate).toLocaleTimeString().substr(0, 5) + "</p>";
    let appointmentCODA = "<p>" + new Date(client.appointmentCODA).toLocaleDateString() + ' - ' + new Date(client.appointmentCODA).toLocaleTimeString().substr(0, 5) + "</p>";
    let appointmentBankStatement = "<p>" + new Date(client.appointmentBankStatement).toLocaleDateString() + ' - ' + new Date(client.appointmentBankStatement).toLocaleTimeString().substr( 0,5) + "</p>";
    let streetAndNumber = "<p>" + client.street + ' ' + client.streetNumber + "</p>";
    let postCodeAndCity = "<p>" + client.postCode + ' ' + client.city + "</p>";
    let language = "<p>" + client.language + "</p>";

    const identification = "<div style='grid-column: 1/3; grid-row: 1;'>" +
        "<div class='card' style='height: 100%'><div class='card-image' style='background-color: #FBAB7E;"+
                            "background-image: linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%);"+
                            "height: 30px;'><h5 style='text-align: center; color: white;'>Identification</h5></div>" +
        "<div class='card-content'>" +
        "<table class='highlight'>" +
        "<tr><th>Numéro du client</th><td>" + number + "</td></tr>" +
        "<tr><th>Nom</th><td>" + name + "</td></tr>" +
        "<tr><th>Adresse</th><td><span id='copyAdress' " + streetAndNumber + "</span><button type=\"button\" class=\"right btn-small bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded\" onclick=\"copyText('copyAdress')\"><i class='material-icons'>content_copy</i></button></td></tr>"+
        "<tr><th>Localité</th><td><span id='copyCity'>" + postCodeAndCity + "</span><button type=\"button\" class=\"right btn-small bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded\" onclick=\"copyText('copyCity')\"><i class='material-icons'>content_copy</i></button></td></tr>"+
        "<tr><th>Numéro de TVA (BE)</th><td class='row'><span id='copyTva'>" +
        tvaNumber + "</span><button type=\"button\" class=\"right btn-small bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded\" onclick=\"copyText('copyTva')\">" +
        "<i class='material-icons'>content_copy</i></button></td></tr>" +
        "<tr><th>Email</th><td class='row'><span id='copyEmail'>" + email + "</span><button type=\"button\" class=\"right btn-small bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded\" onclick=\"copyText('copyEmail')\">" +
        "<i class='material-icons'>content_copy</i></button></td></tr>" +
        "<tr><th>Téléphone</th><td class='row'><span id='copyPhone'>" + phoneNumber + "</span><button type=\"button\" class=\"right btn-small bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded\" onclick=\"copyText('copyPhone')\">" +
        "<i class='material-icons'>content_copy</i></button></td></tr>" +
        "<tr><th>Activité</th><td>" + activity + "</td></tr>" +
        "<tr><th>Documents financiers</th><td>" + bankStatement + "</td></tr>" +
        "<tr><th>Langue</th><td>" + language + "</td></tr>" +
        "</table>" +
        "</div>" +
        "</div>" +
        "</div>";

    const infos = "<div style='grid-column: 1; grid-row: 2;'><div class='card' style='height: 100%'><div class='card-image' style='background-color: #69a9fc;"+
                        "background-image: linear-gradient(62deg, #4040fc 0%, #69a9fc 100%);"+
                        "height: 30px;'><h5 style='text-align: center; color: white;'>Tâches</h5></div><div class='card-content'>" +
        "<table class='highlight'>" +
        "<tr><th>Mandat</th><td>" + mandate + "</td></tr>" +
        "<tr><th>Registre UBO</th><td>" + uboRegister + "</td></tr>" +
        "<tr><th>Secrétariat</th><td>" + secretary + "</td></tr>" +
        "<tr><th>Importance</th><td>" + importance + "</td</tr>" +
        "</table> </div></div></div>";

    const appointments = "<div style='grid-column: 2; grid-row: 2;'><div class='card' style='height: 100%'><div class='card-image' style='background-color: #69fcae;"+
                            "background-image: linear-gradient(62deg, #40fc8b 0%, #abfc69 100%);"+
                            "height: 30px;'><h5 style='text-align: center; color: white;'>Rendez-vous</h5></div><div class='card-content'><table class='highlight'><tr><th>Mandat</th><td>" + appointmentMandate + "</th></tr>" +
                            "<tr><th>CODA</th><td>" + appointmentCODA + "</th></tr>" +
                            "<tr><th>Extrait de banque</th><td>" + appointmentBankStatement + "</th></tr></table> </div></div></div>";

    const annualCard = "<div style='grid-column: 3; grid-row: 1/3;'><div class='card' style='height: 100%;'><div class='card-image' style='background-color: #505654;"+
                        "background-image: linear-gradient(62deg, #45524a 0%, #658051 100%);"+
                        "height: 30px;'><h5 style='text-align: center; color: white;'>Rapport annuel</h5></div>" +
                        "<div class='card-content' style='margin-bottom: 0'>" + getReportsYears() + "<div id='reportsDiv' class='row' style='margin-bottom: 0; padding-bottom: 0;'></div></div>";

    const innerHTML = document.getElementById('user_clients');
    innerHTML.style.display = 'grid';
    innerHTML.style.gridGap = '20px';
    innerHTML.innerHTML = identification + infos + appointments + annualCard;

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
}

function updateChartData() {
    const trimestre1 = document.getElementById('trimestre1').value;
    const trimestre2 = document.getElementById('trimestre2').value;
    const trimestre3 = document.getElementById('trimestre3').value;
    const trimestre4 = document.getElementById('trimestre4').value;

    myChart.data.datasets[0].data = [trimestre1, trimestre2, trimestre3, trimestre4];
    myChart.update();
}

function copyText(containerid) {
    // Create a new textarea element and give it id='temp_element'
    let textarea = document.createElement('textarea');
    textarea.id = 'temp_element';
    // Now append it to your page somewhere, I chose <body>
    document.body.appendChild(textarea);
    // Give our textarea a value of whatever inside the div of id=containerid
    textarea.value = document.getElementById(containerid).innerText;
    // Now copy whatever inside the textarea to clipboard
    let selector = document.querySelector('#temp_element');
    selector.select();
    document.execCommand('copy');
    // Remove the textarea
    document.body.removeChild(textarea)
}

function getReportsYears() {
    const selectYear = document.createElement('select');
    selectYear.id = 'yearChoosen';
    const defaultOption = document.createElement('option');
    defaultOption.text = "Choisissez l'année";

    defaultOption.selected = true;
    selectYear.append(defaultOption);

    clientReports.forEach(report => {
        const option = document.createElement('option');
        option.text = report.year;
        option.value = report.year;
        selectYear.append(option);
    });

    return "<div class='row' style='justify-content: center; display: flex;'><select id='yearChoosen' onchange='populateReports(this.value)'>" + selectYear.innerHTML + "</select></div>";
}

function populateReports(year) {
    if (!year) {
        document.getElementById('reportsDiv').innerHTML = '';
        return;
    }

    const reportsOfYear = clientReports.find(e => e.year === year);

    if (!reportsOfYear) {
        document.getElementById('reportsDiv').innerHTML = '';
        return;
    }

    const t1 = parseFloat(reportsOfYear.trimestre1) ? parseFloat(reportsOfYear.trimestre1) : 0;
    const t2= parseFloat(reportsOfYear.trimestre2) ? parseFloat(reportsOfYear.trimestre2) : 0;
    const t3 = parseFloat(reportsOfYear.trimestre3) ? parseFloat(reportsOfYear.trimestre3) : 0;
    const t4 = parseFloat(reportsOfYear.trimestre4) ? parseFloat(reportsOfYear.trimestre4) : 0;

    const banque = "<input id='banqueSwitch' type='checkbox' " + (reportsOfYear.bank === 'Terminé' ? 'checked' : '') + ">";
    const clients = "<input id='clientsSwitch'  type='checkbox' " + (reportsOfYear.clients === 'Terminé' ? 'checked' : '') + ">";
    const fournisseurs = "<input id='fournisseursSwitch'  type='checkbox' " + (reportsOfYear.suppliers === 'Terminé' ? 'checked' : '') + ">";
    const salaire = "<input id='salaireSwitch'  type='checkbox' " + (reportsOfYear.wage === 'Terminé' ? 'checked' : '') + ">";
    const code499000 = "<input id='code499000Switch'  type='checkbox' " + (reportsOfYear.code499000 === 'Terminé' ? 'checked' : '') + ">";

    const trimestre1 = "<input style='text-align: right' id='trimestre1' type='number' onchange='updateChartData()' value='" + t1 + "'>";
    const trimestre2 = "<input style='text-align: right' id='trimestre2' type='number' onchange='updateChartData()' value='" + t2 + "'>";
    const trimestre3 = "<input style='text-align: right' id='trimestre3' type='number' onchange='updateChartData()' value='" + t3 + "'>";
    const trimestre4 = "<input style='text-align: right' id='trimestre4' type='number' onchange='updateChartData()' value='" + t4 + "'>";

    document.getElementById('reportsDiv').innerHTML = "<div class='col s7'>" +
        "<div class='row'><span>Banque</span>" +
        "<div class='switch'><label>En attente" + banque + "<span class=\"lever\"></span>Terminé</label></div></div>" +

        "<div class='row'><span>Clients</span>" +
        "<div class='switch'><label>En attente" + clients + "<span class=\"lever\"></span>Terminé</label></div></div>" +

        "<div class='row'><span>Fournisseurs</span>" +
        "<div class='switch'><label>En attente" + fournisseurs + "<span class=\"lever\"></span>Terminé</label></div></div>" +

        "<div class='row'><span>Salaire</span>" +
        "<div class='switch'><label>En attente" + salaire + "<span class=\"lever\"></span>Terminé</label></div></div>" +

        "<div class='row'><span>499000</span>" +
        "<div class='switch'><label>En attente" + code499000 + "<span class=\"lever\"></span>Terminé</label></div></div>" +

        "</div><div class='col s5'>" +

        "<div class='row'>" +
        "<div>" +
        "<label for='trimestre1'>Trimestre 1</label>" +
        trimestre1 +
        "</div>" +
        "</div>" +

        "<div class='row'>" +
        "<div>" +
        "<label for='trimestre2'>Trimestre 2</label>" +
        trimestre2 +
        "</div></div>" +

        "<div class='row'>" +
        "<div>" +
        "<label for='trimestre3'>Trimestre 3</label>" +
        trimestre3 +
        "</div></div>" +

        "<div class='row'>" +
        "<div>" +
        "<label for='trimestre4'>Trimestre 4</label>" +
        trimestre4 +
        "</div>" +
        "</div>" +
        "</div></div>" +
        "<div class='row' style='max-width: 70%;'><canvas id='myChart'></canvas></div> " +
        "<div class='row'><button class='btn-small blue' onclick='saveTheReports()' style='position: fixed; bottom: 0; margin-bottom: 20px; right: 20px'>Sauvegarder le rapport</button>" +
        "</div>" +
        "</div>" +
        "</div></div>";

    const labels = [
        'Trimestre 1',
        'Trimestre 2',
        'Trimestre 3',
        'Trimestre 4',
    ];

    const data = {
        labels: labels,
        datasets: [{
            label: 'Rapports de l\'année : ' + year,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
            data: [],
        }]
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
            }
        }
    )

    updateChartData();
}

function saveTheReports() {
    triggerFullScreenPreloader();

    const user_email = firebase.auth().currentUser.email;
    const year = document.getElementById('yearChoosen').value;

    const trimestre1 = parseFloat(document.getElementById('trimestre1').value) ? parseFloat(document.getElementById('trimestre1').value) : 0;
    const trimestre2 = parseFloat(document.getElementById('trimestre2').value) ? parseFloat(document.getElementById('trimestre2').value) : 0;
    const trimestre3 = parseFloat(document.getElementById('trimestre3').value) ? parseFloat(document.getElementById('trimestre3').value) : 0;
    const trimestre4 = parseFloat(document.getElementById('trimestre4').value) ? parseFloat(document.getElementById('trimestre4').value) : 0;

    const bank = document.getElementById('banqueSwitch').checked ? 'Terminé' : 'En attente';
    const clients = document.getElementById('clientsSwitch').checked ? 'Terminé' : 'En attente';
    const suppliers = document.getElementById('fournisseursSwitch').checked ? 'Terminé' : 'En attente';
    const wage = document.getElementById('salaireSwitch').checked ? 'Terminé' : 'En attente';
    const code499000 = document.getElementById('code499000Switch').checked ? 'Terminé' : 'En attente';

    clientReports[clientReports.findIndex(e => e.year === year)] = {
        year: year,
        trimestre1: trimestre1,
        trimestre2: trimestre2,
        trimestre3: trimestre3,
        trimestre4: trimestre4,
        bank: bank,
        clients: clients,
        suppliers: suppliers,
        wage: wage,
        code499000: code499000
    };

    const reportsObject = {clients: everyClientReports.clients};

    db.collection('clients').doc(user_email).update({
        reports: JSON.stringify(reportsObject)
    })
        .then(async function(docRef) {
            displayAlertMessage(true, 'Rapport de l\'année ' + year + ' sauvegardé avec succès !');
            retrieveClientFromFirestore();
        })
        .catch(function(error) {
            triggerFullScreenPreloader();
            alert("Erreur lors de la sauvegarde des rapports.");
        });
}

function triggerFullScreenPreloader() {
    let mainLoader = $('.main-loader');

    if (mainLoader.css('display') === 'flex') {
        mainLoader.css('display', 'none');
    } else {
        mainLoader.css('display', 'flex');
    }
}

function displayAlertMessage(hasSucceeded, messageText) {
    const element = document.getElementById('alert_message');
    element.style.display = 'block';

    element.classList.remove('warning_success');
    element.classList.remove('warning_failure');
    $(element).text(messageText);

    if (hasSucceeded) element.classList.add('warning_success');
    else element.classList.add('warning_failure');

    let op = 50;  // initial opacity
    let timer = setInterval(function () {
        if (op <= 0.1){
            element.style.display = 'none';
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= 5;
    }, 250);
}

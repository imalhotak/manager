/**************************************************************************************************
 * Firebase methods to retrieve user clients data
 **************************************************************************************************/

let clients_list = [];
let compteur;
var db = firebase.firestore();

var clientUID = 0;

triggerFullScreenPreloader();

// retrieve data from Firebase based on user's mail
function retrieveUsersFromFirestore() {
    var user_email = firebase.auth().currentUser.email;
    db.collection("clients").doc(user_email)
    .get()
    .then(function(doc) {
        if (doc.exists) {
            var recv_data = doc.data();
            var data = JSON.parse(recv_data['data']);
            compteur = recv_data['compteur'];
            (!compteur) && (compteur = 1);

            var clients = data['clients'];
            clients_list = clients;

            var count = clients.length;

            for (var index = 0; index < count; index++) {
                var client = clients[index];
                addClient(client);
            }
        }
        else {
            compteur = 1;
        }


        setNewClientNumber();
        triggerFullScreenPreloader();
    })
    .catch(function(error) {
        console.log(error);
        alert("Erreur lors du chargement des clients.");

        triggerFullScreenPreloader();
    });
}

/**************************************************************************************************
 * methods to add/remove/save clients
 **************************************************************************************************/

function removeClient(clientNumber, clientName) {
    let confirmation = confirm("Confirmez-vous la suppression de ce client ?");

    if (confirmation === true){
        let resultat = prompt("Entrez le nom du client pour confirmer la suppression");

        if (resultat) {
            if (resultat.toLowerCase() === (clientName).toLowerCase()) {
                let user_email = document.getElementById('user_email').innerText;
                let filtered = clients_list.filter(function(el) { return el.number !== clientNumber});
                let new_data= {'clients' : filtered};

                db.collection('clients').doc(user_email).update({
                    data: JSON.stringify(new_data)
                })
                    .then(function(docRef) {
                        window.location.reload();
                    })
                    .catch(function(error) {
                        alert("Erreur lors de la suppression du client.");
                    });
            } else {
                alert('Le nom ne correspond pas. La suppression est annulée !');
            }
        }
    }
}

function addNewClient() {
    let clientId = 'client-' + clientUID;
    clientUID++;
    console.log("là");
    const getNumeroClient = document.getElementById('number').value;
    const getNom = document.getElementById('name').value;

    let number = "<td>" + getNumeroClient + "</td>";
    let name = "<td>" + getNom + "</td>";
    let street = "<td>" + document.getElementById('street').value + "</td>";
    let streetNumber = "<td>" + document.getElementById('streetNumber').value + "</td>";
    let city = "<td>" + document.getElementById('city').value + "</td>";
    let postCode = "<td>" + document.getElementById('postCode').value + "</td>";
    let tvaNumber = "<td>" + document.getElementById('tvaNumber').value + "</td>";
    let activity = "<td>" + document.getElementById('activity').value + "</td>";
    let bankStatement = "<td>" + document.getElementById('bankStatement').value + "</td>";
    let email = "<td>" + document.getElementById('email').value + "</td>";
    let phoneNumber = "<td>" + document.getElementById('phoneNumber').value + "</td>";
    let mandate = "<td>" + (document.getElementById('mandate').checked ? 'Oui' : 'Non') + "</td>";
    let uboRegister = "<td>" + (document.getElementById('uboRegister').checked ? 'Oui' : 'Non') + "</td>";
    let secretary = "<td>" + document.getElementById('secretary').value + "</td>";
    let importance = "<td>" + document.getElementById('importance').value + "</td>";
    let appointmentMandate = "<td>" + document.getElementById('appointmentMandate').value + "</td>";
    let appointmentCODA = "<td>" + document.getElementById('appointmentCODA').value + "</td>";
    let appointmentBankStatement = "<td>" + document.getElementById('appointmentBankStatement').value + "</td>";
    let language = "<td>" + document.getElementById('language').value + "</td>";

    let view_button = '<td><a title="Gestion des tâches" id="edt-' + getNumeroClient + '" class="btn-floating btn-small ' +
        'waves-effect waves-light green" href="./client.html?client=' + getNumeroClient + '">' +
        '<i class="material-icons left">visibility</i></a></td>';
    let edit_button = '<td><a class="btn-floating btn-small waves-effect waves-light modal-trigger" data-target="modal2" onclick="setEditInfosOnModal(\'' +
        getNumeroClient + '\')"><i class="material-icons left">edit</i></td>';
    let delete_button = '<td><a class="btn-floating btn-small waves-effect waves-light red" onclick="removeClient(\'' +
        getNumeroClient + '\', \'' + getNom + '\'); return false;"><i class="material-icons left">delete</i></td>';

    let entry_data = number + name + street + streetNumber + city + postCode + tvaNumber + activity + bankStatement + email +
        phoneNumber + mandate + uboRegister + secretary + importance + appointmentMandate + appointmentCODA +
        appointmentBankStatement + language + view_button + edit_button + delete_button ;

    let client_entry = document.createElement("tr");
    client_entry.id = clientId;
    client_entry.innerHTML = entry_data;

    document.getElementById('user_clients').append(client_entry);

    saveClients("added");
}

function addClient(client) {
    let number = "<td>" + client.number + "</td>";
    let name = "<td>" + client.name + "</td>";
    let street = "<td>" + client.street + "</td>";
    let streetNumber = "<td>" + client.streetNumber + "</td>";
    let city = "<td>" + client.city + "</td>";
    let postCode = "<td>" + client.postCode + "</td>";
    let tvaNumber = "<td>" + client.tvaNumber + "</td>";
    let activity = "<td>" + client.activity + "</td>";
    let bankStatement = "<td>" + client.bankStatement + "</td>";
    let email = "<td>" + client.email + "</td>";
    let phoneNumber = "<td>" + client.phoneNumber + "</td>";
    let mandate = "<td>" + (client.mandate === 'Oui' ? 'Oui' : 'Non') + "</td>";
    let uboRegister = "<td>" + (client.uboRegister === 'Oui' ? 'Oui' : 'Non') + "</td>";
    let secretary = "<td>" + client.secretary + "</td>";
    let importance = "<td>" + client.importance + "</td>";
    let appointmentMandate = "<td>" + new Date(client.appointmentMandate).toLocaleDateString() + ' - ' + new Date(client.appointmentMandate).toLocaleTimeString().substr(0, 5) + "</td>";
    let appointmentCODA = "<td>" + new Date(client.appointmentCODA).toLocaleDateString() + ' - ' + new Date(client.appointmentCODA).toLocaleTimeString().substr(0, 5) + "</td>";
    let appointmentBankStatement = "<td>" + new Date(client.appointmentBankStatement).toLocaleDateString() + ' - ' + new Date(client.appointmentBankStatement).toLocaleTimeString().substr(0, 5) + "</td>";
    let language = "<td>" + client.language + "</td>";

    let view_button = '<td><a title="Gestion des tâches" id="edt-' + client.number + '" class="btn-floating btn-small ' +
        'waves-effect waves-light green" href="./client.html?client=' + client.number + '">' +
        '<i class="material-icons left">visibility</i></a></td>';
    let edit_button = '<td><a title="Modifier le client" class="btn-floating btn-small waves-effect waves-light blue modal-trigger" data-target="modal2" onclick="setEditInfosOnModal(\'' +
        client.number + '\')"><i class="material-icons left">edit</i></td>';
    let delete_button = '<td><a title="Supprimer le client" class="btn-floating btn-small waves-effect waves-light red" onclick="removeClient(\'' +
        client.number + '\', \'' + client.name + '\'); return false;"><i class="material-icons left">delete</i></td>';

    let entry_data =  number + name + street + streetNumber + city + postCode + tvaNumber + activity + bankStatement + email +
        phoneNumber + mandate + uboRegister + secretary + importance + appointmentMandate + appointmentCODA +
        appointmentBankStatement + language + view_button + edit_button + delete_button ;

    let client_entry = document.createElement("tr");
    client_entry.classList.add('client_pointer')
    client_entry.id = client.number;
    client_entry.innerHTML = entry_data;
    
    document.getElementById('user_clients').append(client_entry);
}

function getClientsData() {
    let data = {};

    let clients_div = document.getElementById('user_clients');
    let clients = [];

    for (let i = 0; i < clients_div.children.length; i++) {
        let client = {};

        // clients div -> tr -> td -> input element
        client.number = clients_div.children[i].children[0].innerText;
        client.name = clients_div.children[i].children[1].innerText;
        client.street = clients_div.children[i].children[2].innerText;
        client.streetNumber = clients_div.children[i].children[3].innerText;
        client.city = clients_div.children[i].children[4].innerText;
        client.postCode = clients_div.children[i].children[5].innerText;
        client.tvaNumber = clients_div.children[i].children[6].innerText;
        client.activity = clients_div.children[i].children[7].innerText;
        client.bankStatement = clients_div.children[i].children[8].innerText;
        client.email = clients_div.children[i].children[9].innerText;
        client.phoneNumber = clients_div.children[i].children[10].innerText;
        client.mandate = clients_div.children[i].children[11].innerText;
        client.uboRegister = clients_div.children[i].children[12].innerText;
        client.secretary = clients_div.children[i].children[13].innerText;
        client.importance = clients_div.children[i].children[14].innerText;
        client.appointmentMandate = clients_div.children[i].children[15].innerText;
        client.appointmentCODA = clients_div.children[i].children[16].innerText;
        client.appointmentBankStatement = clients_div.children[i].children[17].innerText;
        client.language = clients_div.children[i].children[18].innerText;

        clients.push(client);
    }

    data['clients'] = clients;
    return JSON.stringify(data);
}

function saveClients(param) {
    var user_email = document.getElementById('user_email').innerText;
    var clients_data = getClientsData();

    if (clients_list.length === 0) {
        db.collection('clients').doc(user_email).set({
            mail: user_email,
            data: clients_data,
            compteur: (parseInt(compteur) + 1)
        })
            .then(function(docRef) {
                window.location.reload();
            })
            .catch(function(error) {
                console.log(error);
                alert("Erreur lors de la sauvegarde des clients.");
            });
    } else {
        db.collection('clients').doc(user_email).update({
            mail: user_email,
            data: clients_data,
            compteur: (parseInt(compteur) + 1)
        })
            .then(function(docRef) {
                window.location.reload();
            })
            .catch(function(error) {
                console.log(error);
                alert("Erreur lors de la sauvegarde des clients.");
            });
    }
}

function getTodayDate() {
    var newDate = new Date();

    return newDate.getDate() + "/" + newDate.getMonth() +  "/" + newDate.getFullYear();
}

function setNewClientNumber() {
    document.getElementById('number').value = compteur;
}

function setEditInfosOnModal(clientNumber) {
    let number = clientNumber;
    let name = document.getElementById(clientNumber).childNodes[1].innerText;
    let street = document.getElementById(clientNumber).childNodes[2].innerText;
    let streetNumber = document.getElementById(clientNumber).childNodes[3].innerText;
    let city = document.getElementById(clientNumber).childNodes[4].innerText;
    let postCode = document.getElementById(clientNumber).childNodes[5].innerText;
    let tvaNumber = document.getElementById(clientNumber).childNodes[6].innerText;
    let activity = document.getElementById(clientNumber).childNodes[7].innerText;
    let bankStatement = document.getElementById(clientNumber).childNodes[8].innerText;
    let email = document.getElementById(clientNumber).childNodes[9].innerText;
    let phoneNumber = document.getElementById(clientNumber).childNodes[10].innerText;
    let mandate = document.getElementById(clientNumber).childNodes[11].innerText;
    let uboRegister = document.getElementById(clientNumber).childNodes[12].innerText;
    let secretary = document.getElementById(clientNumber).childNodes[13].innerText;
    let importance = document.getElementById(clientNumber).childNodes[14].innerText;
    let appointmentMandate = document.getElementById(clientNumber).childNodes[15].innerText;
    let appointmentCODA = document.getElementById(clientNumber).childNodes[16].innerText;
    let appointmentBankStatement = document.getElementById(clientNumber).childNodes[17].innerText;
    let language = document.getElementById(clientNumber).childNodes[18].innerText;

    document.getElementById("edit_client_number").value = number;
    document.getElementById("edit_client_name").value = name;
    document.getElementById("edit_client_street").value = street;
    document.getElementById("edit_client_streetNumber").value = streetNumber;
    document.getElementById("edit_client_city").value = city;
    document.getElementById("edit_client_postCode").value = postCode;
    document.getElementById("edit_client_tvaNumber").value = tvaNumber;
    document.getElementById("edit_client_activity").value = activity;
    document.getElementById("edit_client_bankStatement").value = bankStatement;
    document.getElementById("edit_client_email").value = email;
    document.getElementById("edit_client_phoneNumber").value = phoneNumber;
    if (mandate === 'Oui') document.getElementById("edit_client_mandate").checked = true;
    if (uboRegister === 'Oui') document.getElementById("edit_client_uboRegister").checked = true;
    document.getElementById("edit_client_secretary").value = secretary;
    document.getElementById("edit_client_importance").value = importance;
    document.getElementById("edit_client_appointmentMandate").value = appointmentMandate;
    document.getElementById("edit_client_appointmentCODA").value = appointmentCODA;
    document.getElementById("edit_client_appointmentBankStatement").value = appointmentBankStatement;
    document.getElementById("edit_client_language").value = language;
    document.getElementById('edit_client_infos').value = number;
    M.FormSelect.init(document.querySelectorAll('select'));
}

function editClient(clientNumber) {
    let number = clientNumber;
    let user_email = document.getElementById('user_email').innerText;

    let name = document.getElementById("edit_client_name").value;
    let street = document.getElementById("edit_client_street").value;
    let streetNumber = document.getElementById("edit_client_streetNumber").value;
    let city = document.getElementById("edit_client_city").value;
    let postCode = document.getElementById("edit_client_postCode").value;
    let tvaNumber = document.getElementById("edit_client_tvaNumber").value;
    let activity = document.getElementById("edit_client_activity").value;
    let bankStatement = document.getElementById("edit_client_bankStatement").value;
    let email = document.getElementById("edit_client_email").value;
    let phoneNumber = document.getElementById("edit_client_phoneNumber").value;
    let mandate = (document.getElementById("edit_client_mandate").checked ? 'Oui' : 'Non');
    let uboRegister = (document.getElementById("edit_client_uboRegister").checked ? 'Oui' : 'Non');
    let secretary = document.getElementById("edit_client_secretary").value;
    let importance = document.getElementById("edit_client_importance").value;
    let appointmentMandate = document.getElementById("edit_client_appointmentMandate").value;
    let appointmentCODA= document.getElementById("edit_client_appointmentCODA").value;
    let appointmentBankStatement = document.getElementById("edit_client_appointmentBankStatement").value;
    let language = document.getElementById("edit_client_language").value;

    for (let index = 0; index < clients_list.length; index++) {
        if (clients_list[index].number === number) {
            clients_list[index].name = name;
            clients_list[index].street = street;
            clients_list[index].streetNumber = streetNumber;
            clients_list[index].city = city;
            clients_list[index].postCode = postCode;
            clients_list[index].tvaNumber = tvaNumber;
            clients_list[index].activity = activity;
            clients_list[index].bankStatement = bankStatement;
            clients_list[index].email = email;
            clients_list[index].phoneNumber = phoneNumber;
            clients_list[index].mandate = mandate;
            clients_list[index].uboRegister = uboRegister;
            clients_list[index].secretary = secretary;
            clients_list[index].importance = importance;
            clients_list[index].appointmentMandate = appointmentMandate;
            clients_list[index].appointmentCODA = appointmentCODA;
            clients_list[index].appointmentBankStatement = appointmentBankStatement;
            clients_list[index].language = language;
        }
    }

    let clients_json = {clients: clients_list};

    db.collection('clients').doc(user_email).update({
        data: JSON.stringify(clients_json)
    })
        .then(function(docRef) {
            window.location.reload();
        })
        .catch(function(error) {
            alert("Erreur lors de la sauvegarde des clients.");
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
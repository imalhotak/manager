/**************************************************************************************************
 * Firebase methods to retrieve user clients data
 **************************************************************************************************/

let clients_list;
let compteur;
var db = firebase.firestore();

var clientUID = 0;

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
            alert("Aucun client n'a été retrouvé. Veuillez en ajouter.");
        }

        // removing loading animation
        var element = document.getElementById('preloader');
        element.parentNode.removeChild(element);

        setNewClientNumber();
    })
    .catch(function(error) {
        alert("Erreur lors du chargement des clients.");

        // removing loading animation
        var element = document.getElementById('preloader');
        element.parentNode.removeChild(element)
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
                let filtered = clients_list.filter(function(el) { return el.client_number !== clientNumber});
                let new_data= {'clients' : filtered};

                db.collection("tasks").where("mail", "==", user_email).where("client_number", "==", clientNumber)
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            doc.ref.delete();
                        })
                    })
                    .catch(function(error) {
                        alert("Erreur lors de la suppression des tâches liées au client.");
                    });

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

    let getNumeroClient = document.getElementById('client_number').value;
    let getNom = document.getElementById('client_name').value;
    let getRue = document.getElementById('client_rue').value;
    let getCodePostal = document.getElementById('client_code_postal').value;
    let getLocalite = document.getElementById('client_localite').value;
    let getNumeroTel = document.getElementById('client_phone_number').value;
    let getNumeroTVA = document.getElementById('client_tva_number').value;
    let getEmail = document.getElementById('client_email').value;
    let getLanguage = document.getElementById('client_language').value;

    let client_number = "<td>" + getNumeroClient + "</td>";
    let client_name = "<td>" + getNom + "</td>";
    let client_rue = "<td>" + getRue + "</td>";
    let client_code_postal = "<td>" + getCodePostal + "</td>";
    let client_localite = "<td>" + getLocalite + "</td>";
    let client_phone_number = "<td>" + getNumeroTel + "</td>";
    let client_tva_number = "<td>" + getNumeroTVA + "</td>";
    let client_email = "<td>" + getEmail + "</td>";
    let client_language = "<td>" + getLanguage + "</td>";
    let manage_button = '<td><a title="Gérer" id="edt-' + getNumeroClient + '" class="btn-floating btn-small waves-effect waves-light green" href="./manage_client.html?client=' + getNumeroClient + '"><i class="material-icons left">task</i></a></td>';
    let edit_button = '<td><a class="btn-floating btn-small waves-effect waves-light modal-trigger" data-target="modal2" onclick="setEditInfosOnModal(\'' +
        getNumeroClient + '\')"><i class="material-icons left">edit</i></td>';
    let staff_button = '<td><a title="Gestion du personnel" id="staff-' + getNumeroClient + '" class="btn-floating btn-small waves-effect waves-light orange" href="./manage_staff.html?client=' + getNumeroClient + '"><i class="material-icons left">groups</i></a></td>';
    let delete_button = '<td><a class="btn-floating btn-small waves-effect waves-light red" onclick="removeClient(\'' +
        getNumeroClient + '\', \'' + getNom + '\'); return false;"><i class="material-icons left">delete</i></td>';

    let entry_data = client_number + client_name + client_rue + client_code_postal + client_localite + client_phone_number + client_tva_number + client_email + client_language + edit_button + manage_button + staff_button + delete_button ;

    let client_entry = document.createElement("tr");
    client_entry.id = clientId;
    client_entry.innerHTML = entry_data;

    document.getElementById('user_clients').append(client_entry);

    saveClients("added");
}

function addClient(client) {
    // var clientId = 'client-' + clientUID;
    // clientUID++;
    let client_number = "<td>" + client['client_number'] + "</td>";
    let client_name = "<td>" + client['client_name'].toUpperCase() + "</td>";
    let client_rue = "<td>" + client['client_rue'] + "</td>";
    let client_code_postal = "<td>" + client['client_code_postal'] + "</td>";
    let client_localite = "<td>" + client['client_localite'] + "</td>";
    let client_phone_number = "<td>" + client['client_phone_number'] + "</td>";
    let client_tva_number = "<td>" + client['client_tva_number'] + "</td>";
    let client_email = "<td>" + client['client_email'] + "</td>";
    let client_language = "<td>" + client['client_language'] + "</td>";
    let manage_button = '<td><a title="Gestion des tâches" id="edt-' + client['client_number'] + '" class="btn-floating btn-small waves-effect waves-light green" href="./manage_client.html?client=' + client['client_number'] + '"><i class="material-icons left">task</i></a></td>';
    let edit_button = '<td><a title="Modifier le client" class="btn-floating btn-small waves-effect waves-light blue modal-trigger" data-target="modal2" onclick="setEditInfosOnModal(\'' +
        client['client_number'] + '\')"><i class="material-icons left">edit</i></td>';
    let staff_button = '<td><a title="Gestion du personnel" id="staff-' + client['client_number'] + '" class="btn-floating btn-small waves-effect waves-light orange" href="./manage_staff.html?client=' + client['client_number'] + '"><i class="material-icons left">groups</i></a></td>';
    let delete_button = '<td><a title="Supprimer le client" class="btn-floating btn-small waves-effect waves-light red" onclick="removeClient(\'' +
        client['client_number'] + '\', \'' + client['client_name'] + '\'); return false;"><i class="material-icons left">delete</i></td>';

    let entry_data = client_number + client_name + client_rue + client_code_postal + client_localite + client_phone_number + client_tva_number + client_email + client_language + edit_button + manage_button + staff_button + delete_button;

    let client_entry = document.createElement("tr");
    client_entry.classList.add('client_pointer')
    client_entry.id = client['client_number'];
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
        client.client_number = clients_div.children[i].children[0].innerText;
        client.client_name = clients_div.children[i].children[1].innerText;
        client.client_rue = clients_div.children[i].children[2].innerText;
        client.client_code_postal = clients_div.children[i].children[3].innerText;
        client.client_localite = clients_div.children[i].children[4].innerText;
        client.client_phone_number= clients_div.children[i].children[5].innerText;
        client.client_tva_number = clients_div.children[i].children[6].innerText;
        client.client_email = clients_div.children[i].children[7].innerText;
        client.client_language = clients_div.children[i].children[8].innerText;

        clients.push(client);
    }

    data['clients'] = clients;
    return JSON.stringify(data);
}

function saveClients(param) {
    var user_email = document.getElementById('user_email').innerText;
    var clients_data = getClientsData();

    db.collection('clients').doc(user_email).set({
        mail: user_email,
        data: clients_data,
        compteur: (parseInt(compteur) + 1)
    })
    .then(function(docRef) {
        window.location.reload();
    })
    .catch(function(error) {
        alert("Erreur lors de la sauvegarde des clients.");
    });
}

function getTodayDate() {
    var newDate = new Date();

    return newDate.getDate() + "/" + newDate.getMonth() +  "/" + newDate.getFullYear();
}

function setNewClientNumber() {
    let numero_client;
    if (compteur < 10) {
        numero_client = 'CL00' + compteur;
    } else if (compteur < 100) {
        numero_client = 'CL0' + compteur;
    } else {
        numero_client = 'CL' + compteur;
    }

    document.getElementById('client_number').value = numero_client;
}

function setEditInfosOnModal(client_number) {
    let client_name = document.getElementById(client_number).childNodes[1].innerText;
    let client_rue = document.getElementById(client_number).childNodes[2].innerText;
    let client_code_postal = document.getElementById(client_number).childNodes[3].innerText;
    let client_localite = document.getElementById(client_number).childNodes[4].innerText;
    let client_phone_number = document.getElementById(client_number).childNodes[5].innerText;
    let client_tva_number = document.getElementById(client_number).childNodes[6].innerText;
    let client_email = document.getElementById(client_number).childNodes[7].innerText;
    let client_language = document.getElementById(client_number).childNodes[8].innerText;

    document.getElementById("edit_client_number").value = client_number;
    document.getElementById("edit_client_name").value = client_name;
    document.getElementById("edit_client_rue").value = client_rue;
    document.getElementById("edit_client_code_postal").value = client_code_postal;
    document.getElementById("edit_client_localite").value = client_localite;
    document.getElementById("edit_client_phone_number").value = client_phone_number;
    document.getElementById("edit_client_tva_number").value = client_tva_number;
    document.getElementById("edit_client_email").value = client_email;
    document.getElementById("edit_client_language").value = client_language;
    document.getElementById('edit_client_infos').value = client_number;
    M.FormSelect.init(document.querySelectorAll('select'));
}

function editClient(client_number) {
    let user_email = document.getElementById('user_email').innerText;
    let client_name = document.getElementById("edit_client_name").value;
    let client_rue = document.getElementById("edit_client_rue").value;
    let client_code_postal = document.getElementById("edit_client_code_postal").value;
    let client_localite = document.getElementById("edit_client_localite").value;
    let client_phone_number = document.getElementById("edit_client_phone_number").value;
    let client_tva_number = document.getElementById("edit_client_tva_number").value;
    let client_email = document.getElementById("edit_client_email").value;
    let client_language = document.getElementById("edit_client_language").value;

    for (let index = 0; index < clients_list.length; index++) {
        if (clients_list[index].client_number === client_number) {
            clients_list[index].client_name = client_name;
            clients_list[index].client_rue = client_rue;
            clients_list[index].client_code_postal = client_code_postal;
            clients_list[index].client_localite = client_localite;
            clients_list[index].client_phone_number = client_phone_number;
            clients_list[index].client_tva_number = client_tva_number;
            clients_list[index].client_email = client_email;
            clients_list[index].client_language = client_language;
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
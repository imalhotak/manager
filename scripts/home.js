let db = firebase.firestore();
let clients_map;

function retrieveAllRemainingTasksFromFirestore() {
    const filtered_map = new Map();
    const monthNames = ["JANVIER", "FEVRIER", "MARS", "AVRIL", "MAI", "JUIN",
        "JUILLET", "AOUT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DECEMBRE"];

    let user_email = firebase.auth().currentUser.email;

    db.collection("tasks").where("mail", "==", user_email)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                let docId = doc.id;
                let recv_data = doc.data();
                let task = JSON.parse(recv_data['data']);
                let client_name = recv_data['client_name'];
                let client_number = recv_data['client_number'];

                let date = new Date(task.date_ajout);
                let dd = date.getDate();
                let mm = date.getMonth() + 1;
                let yyyy = date.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }

                let date_ajout = dd + '/' + mm + '/' + yyyy;
                let description = task.description;
                let quantite = task.quantite;
                let prix_htva = task.prix_htva;
                let notes = task.notes;
                let statut = task.statut;

                let key = new Date(date.getFullYear(), date.getMonth(), 1).getTime() / 1000;
                let value = {date_ajout: date_ajout, description: description, quantite: quantite, prix_htva: prix_htva, notes: notes, statut: statut, identifiant: docId, client_name: client_name, client_number: client_number};

                if (filtered_map.has(key)) {
                    var arr1 = filtered_map.get(key);
                    arr1.push(value);
                    filtered_map.set(key, arr1);
                } else {
                    var arr2 = [];
                    arr2.push(value);
                    filtered_map.set(key, arr2);
                }
            });

            const reversed_map = new Map([...filtered_map.entries()].sort().reverse());

            for (let [key, value] of reversed_map) {
                var li_tag = document.createElement('li');
                var date_formatted = new Date(key * 1000);
                var newKey = monthNames[date_formatted.getMonth()] + ' ' + date_formatted.getFullYear();
                let headers = "<div class='collapsible-header'>" + newKey + "</div><div class='collapsible-body'><table class='striped centered'><thead><tr>" +
                    "<th>Client</th>" +
                    "<th>Date d'ajout</th>" +
                    "<th>Description</th>" +
                    "<th>Quantité</th>" +
                    "<th>Prix HTVA</th>" +
                    "<th>Notes</th>" +
                    "<th>Statut</th>" +
                    "<th>Actions</th></tr></thead>"

                let entry_data = "";
                let unfinished_tasks = false;

                for (let index = 0 ; index < value.length ; index++) {
                    let statut_icon = "";
                    let statut_trigger = "";
                    if (value[index].statut === 'false') {
                        unfinished_tasks = true;
                        statut_icon = "<p class='material-icons'>close</p>";
                        statut_trigger = '<a class="btn-floating btn-medium waves-effect waves-light green" onclick="statuerTache(\''+value[index].identifiant+'\', this)"><i class="material-icons">done</i></a>&ensp;';
                        entry_data += "<tr id='"+value[index].identifiant+"'><td>" + value[index].client_name + "</td><td>" + value[index].date_ajout + "</td><td>" + value[index].description + "<td>" + value[index].quantite + "</td><td>" + value[index].prix_htva + " €<td>"
                            + value[index].notes + "</td><td>" + statut_icon
                            + "</td><td><a href='./manage_client.html?client=" + value[index].client_number + "' class='btn-floating btn-medium waves-effect waves-light brown'><i class='material-icons'>visibility</i></a></td></tr>";
                    }
                }

                li_tag.innerHTML = headers + "<tbody>" + entry_data + "</tbody></table></div></li>";
                if (unfinished_tasks) document.getElementById('remaining_tasks').append(li_tag);
            }

            let div_add = document.createElement('div');
            div_add.style.padding = '10px';
            div_add.innerHTML = '<button class=\'waves-effect waves-light btn modal-trigger\' data-target="modal1">Tâches d\'un client</button>';
            document.getElementById('choose_client_tasks').append(div_add);

            let div_add2 = document.createElement('div');
            div_add2.style.padding = '10px';
            div_add2.innerHTML = '<button class=\'waves-effect waves-light btn purple modal-trigger\' data-target="modal2">Relevés d\'un client</button>';
            document.getElementById('choose_client_calendars').append(div_add2);

            // removing loading animation
            let element = document.getElementById('preloader');
            element.parentNode.removeChild(element);

            // removing loading animation
            let element2 = document.getElementById('preloader_shortcut_calendar');
            element2.parentNode.removeChild(element2);
        })
        .catch(function(error) {
            alert("Erreur lors du chargement des tâches.");

            // removing loading animation
            let element = document.getElementById('preloader');
            element.parentNode.removeChild(element);

            // removing loading animation
            let element2 = document.getElementById('preloader_shortcut_calendar');
            element2.parentNode.removeChild(element2);
        });
}

function retrieveFromFirestore() {
    var user_email = firebase.auth().currentUser.email;
    db.collection("data").where("mail", "==", user_email)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var recv_data = doc.data();
                var invoice = JSON.parse(recv_data['data']);
                var created_date = new Date(doc.data().time.seconds * 1000);
                var jour = created_date.getDate();
                var mois = (created_date.getMonth()+1);
                var annee = created_date.getFullYear();

                if (jour < 10) { jour = '0' + jour; }

                if (mois < 10) { mois = '0' + mois; }

                var created_date_formatted =  jour + '/' + mois + '/' + annee;

                var preview_button = '<a title="Prévisualiser" class="btn-floating btn-medium waves-effect waves-light black" onclick="previewInvoice(\'' + doc.id + '\')"><i class="material-icons left">visibility</i></a> ';
                var download_button = '<a title="Télécharger au format PDF" class="btn-floating btn-medium waves-effect waves-light black" onclick="downloadInvoice(\'' + doc.id + '\')"><i class="material-icons left">picture_as_pdf</i></a> ' ;
                // var export_button = '<a title="Exporter au format JSON" id="anc-' + doc.id + '" class="btn-floating btn-medium waves-effect waves-light black" onclick="exportHistoryInvoice(\'' + doc.id + '\')"><i class="material-icons left">note_add</i></a> ';
                var edit_button = '<a title="Modifier" id="edt-' + doc.id + '" class="btn-floating btn-medium waves-effect waves-light black" href="./edit_invoice.html?id=' + doc.id + '"><i class="material-icons left">edit</i></a> ';
                var send_button = '<a title="Envoyer par e-mail" id="ema-' + doc.id + '" class="btn-floating btn-medium waves-effect waves-light black" onclick="sendEmail(\'' + doc.id + '\')"><i class="material-icons left">email</i></a> ';
                var delete_button = '<a title="Supprimer" id="del-' + doc.id + '" class="btn-floating btn-medium waves-effect waves-light red" onclick="deleteInvoice(\'' + doc.id + '\')"><i class="material-icons left">delete</i></a>';

                var entry_data = "<td>" + invoice['invoice_number'] + "</td><td>" + invoice['emetteur_name'] + "</td><td>" + invoice['client_name'] + "</td><td>" + created_date_formatted + "</td><td>" + invoice["invoice_date"] + "</td><td>" + getPaymentStatus(invoice["invoice_balance"], doc.id) + "</td><td>" + preview_button + download_button + edit_button + send_button + delete_button + "</td>";

                var history_entry = document.createElement("tr");
                history_entry.innerHTML = entry_data;
                document.getElementById('user_data').append(history_entry);
            });

            // removing loading animation
            var element = document.getElementById('preloader');
            element.parentNode.removeChild(element);
        })
        .catch(function(error) {
            alert("Erreur durant le chargement des fichiers :(");
        });
}

function retrieveClientNamesFromFirestore() {
    let user_email = firebase.auth().currentUser.email;

    db.collection("clients").doc(user_email)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                let clients_map = new Map;
                var recv_data = doc.data();
                var data = JSON.parse(recv_data['data']);

                var clients = data['clients'];
                var count = clients.length;

                for (var index = 0; index < count; index++) {
                    let client_number = clients[index].client_number;
                    let client_name = clients[index].client_name;
                    clients_map.set(client_number, client_name);
                }

                if (clients_map.size !== 0) {
                    convertMapToSelect(clients_map);
                }

            }
            else {
                alert("Aucun client n'a été retrouvé. Veuillez en ajouter.");
            }
        })
        .catch(function(error) {
            alert("Erreur lors du chargement des clients.");
        });
}

function convertMapToSelect(map) {
    let div_tag = document.createElement('div');
    let div_tag2 = document.createElement('div');

    for (let [key, value] of map) {
        let a_tag = document.createElement('a');
        a_tag.classList.add('btn');
        a_tag.href = './manage_client.html?name=' + key;
        a_tag.innerHTML = value;

        let a_tag2 = document.createElement('a');
        a_tag2.classList.add('btn', 'purple');
        a_tag2.href = './manage_staff.html?client=' + key;
        a_tag2.innerHTML = value;

        div_tag.append(a_tag);
        div_tag2.append(a_tag2);
    }

    document.getElementById('select_clients').append(div_tag);
    document.getElementById('select_clients2').append(div_tag2);
    M.FormSelect.init(document.querySelectorAll('select'));
}

function checkUser() {
    const regionalFunctions = firebase.app().functions("europe-west1")
    const isAdmin = regionalFunctions.httpsCallable('isAdmin');
    isAdmin()
        .then(isAdmin => {
           if (!isAdmin.data) logOutUser();
    }).catch((error) => {});
}

function triggerFullScreenPreloader() {
    let mainLoader = $('.main-loader');

    if (mainLoader.css('display') === 'flex') {
        mainLoader.css('display', 'none');
    } else {
        mainLoader.css('display', 'flex');
    }
}
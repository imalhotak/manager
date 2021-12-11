/**************************************************************************************************
 * Firebase methods
 **************************************************************************************************/

var db = firebase.firestore();

// store the json as string and reconstruct pdf when user wants to download
function sendToFirestore(data) {
    var user_email = document.getElementById('user_email').innerText;

    db.collection('data').add({
        mail: user_email,
        data: data,
        time: firebase.firestore.Timestamp.fromDate(new Date())
    })
    .then(function(docRef) {
        alert("Facture ajoutée au cloud avec succès ! \nConsulter les à partir de l'Historique des Factures.");
        window.location = './history.html';
    })
    .catch(function(error) {
        alert("Erreur lors de l'ajout au cloud.");
    });
}

function retrieveUserItemsData() {
    var user_email = firebase.auth().currentUser.email;

    db.collection("items").doc(user_email)
    .get()
    .then(function(doc) {
        if (doc.exists) {
            var recv_data = doc.data();
            var data = JSON.parse(recv_data['data']);

            var items = data['items'];
            var count = items.length;

            for (var index = 0; index < count; index++) {
                var item = items[index];
                item.Qty = 1;

                var key = item['Name'];
                itemData[key] = item;
                itemTerms.push(key);
            }
        }
        else {

        }
    })
    .catch(function(error) {
        // alert("Error fetching your items data.");
    });
}

function retrieveUserClientsData() {
    var user_email = firebase.auth().currentUser.email;

    db.collection("clients").doc(user_email)
    .get()
    .then(function(doc) {
        if (doc.exists) {
            var recv_data = doc.data();
            var data = JSON.parse(recv_data['data']);

            var clients = data['clients'];
            var count = clients.length;

            for (var index = 0; index < count; index++) {
                var client = clients[index];

                var key = client['client_name'];
                clientData[key] = client;
                clientTerms.push(key);
            }
        }
        else {

        }
    })
    .catch(function(error) {
        // alert("Error fetching your clients data.");
    });
}

function retrieveUserEmetteursData() {
    var user_email = firebase.auth().currentUser.email;

    db.collection("emetteurs").doc(user_email)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                var recv_data = doc.data();
                var data = JSON.parse(recv_data['data']);

                var emetteurs = data['emetteurs'];
                var count = emetteurs.length;

                for (var index = 0; index < count; index++) {
                    var emetteur = emetteurs[index];

                    var key = emetteur['emetteur_name'];
                    emetteurData[key] = emetteur;
                    emetteurTerms.push(key);
                }
            }
            else {

            }
        })
        .catch(function(error) {
            // alert("Error fetching your clients data.");
        });
}

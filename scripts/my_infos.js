/**************************************************************************************************
 * Firebase methods to retrieve user clients data
 **************************************************************************************************/

let clients_list;
var db = firebase.firestore();

var clientUID = 0;

// retrieve data from Firebase based on user's mail
function retrieveInfosFromFirestore() {
    let user_email = firebase.auth().currentUser.email;
    db.collection("infos").doc(user_email)
    .get()
    .then(function(doc) {
        if (doc.exists) {
            let recv_data = doc.data();
            let data = JSON.parse(recv_data['data']);
            let infos = data['infos'];

            displayInfos(infos);
        }
        else {
            alert("Pas de coordonnées retrouvées. Veuillez en ajouter.");
            displayEmptyInfos();
        }

        // removing loading animation
        var element = document.getElementById('preloader');
        element.parentNode.removeChild(element);

    })
    .catch(function(error) {
        alert("Erreur lors du chargement des coordonnées.");

        // removing loading animation
        var element = document.getElementById('preloader');
        element.parentNode.removeChild(element)
    });
}

/**************************************************************************************************
 * methods to add/remove/save clients
 **************************************************************************************************/
function displayInfos(infos) {
    let bic_banque = "<td><input onchange='availableForSave()' type='text' value='"+ infos[0].bic_banque + "'></td>";
    let code_postal = "<td><input onchange='availableForSave()' type='text' value='"+ infos[0].code_postal + "'></td>";
    let compte_iban = "<td><input onchange='availableForSave()' type='text' value='"+ infos[0].compte_iban + "'></td>";
    let conditions_paiement = "<td><input onchange='availableForSave()' type='text' value='"+ infos[0].conditions_paiement + "'></td>";
    let localite = "<td><input onchange='availableForSave()' type='text' value='"+ infos[0].localite + "'></td>";
    let moyens_paiement = "<td><input onchange='availableForSave()' type='text' value='"+ infos[0].moyens_paiement + "'></td>";
    let nom_banque = "<td><input onchange='availableForSave()' type='text' value='"+ infos[0].nom_banque + "'></td>";
    let nom_numero_rue = "<td><input onchange='availableForSave()' type='text' value='"+ infos[0].nom_numero_rue + "'></td>";
    let nom_societe = "<td><input onchange='availableForSave()' type='text' value='"+ infos[0].nom_societe + "'></td>";
    let numero_telephone = "<td><input onchange='availableForSave()' type='text' value='"+ infos[0].numero_telephone + "'></td>";
    let numero_tva = "<td><input onchange='availableForSave()' type='text' value='"+ infos[0].numero_tva + "'></td>";

    var entry_data = nom_societe + nom_numero_rue + code_postal + localite + numero_tva + numero_telephone;

    var infos_entry = document.createElement("tr");
    infos_entry.innerHTML = entry_data;

    var entry_data2 = nom_banque + bic_banque + compte_iban + conditions_paiement + moyens_paiement;

    var infos_entry2 = document.createElement("tr");
    infos_entry2.innerHTML = entry_data2;

    document.getElementById('user_infos').append(infos_entry);
    document.getElementById('user_bank_infos').append(infos_entry2);
}

function displayEmptyInfos() {
    let bic_banque = "<td><input onchange='availableForSave()' type='text'></td>";
    let code_postal = "<td><input onchange='availableForSave()' type='text'></td>";
    let compte_iban = "<td><input onchange='availableForSave()' type='text'></td>";
    let conditions_paiement = "<td><input onchange='availableForSave()' type='text'></td>";
    let localite = "<td><input onchange='availableForSave()' type='text'></td>";
    let moyens_paiement = "<td><input onchange='availableForSave()' type='text'></td>";
    let nom_banque = "<td><input onchange='availableForSave()' type='text'></td>";
    let nom_numero_rue = "<td><input onchange='availableForSave()' type='text'></td>";
    let nom_societe = "<td><input onchange='availableForSave()' type='text'></td>";
    let numero_telephone = "<td><input onchange='availableForSave()' type='text'></td>";
    let numero_tva = "<td><input onchange='availableForSave()' type='text'></td>";

    var entry_data = nom_societe + nom_numero_rue + code_postal + localite + numero_tva + numero_telephone;

    var infos_entry = document.createElement("tr");
    infos_entry.innerHTML = entry_data;

    var entry_data2 = nom_banque + bic_banque + compte_iban + conditions_paiement + moyens_paiement;

    var infos_entry2 = document.createElement("tr");
    infos_entry2.innerHTML = entry_data2;

    document.getElementById('user_infos').append(infos_entry);
    document.getElementById('user_bank_infos').append(infos_entry2);
}

function getInfosData() {
    var data = {};

    var infos_div = document.getElementById('user_infos');
    let infos_bank_div = document.getElementById('user_bank_infos');
    let infos_array = [];
    let infos = {};

    for (var i = 0; i < infos_div.children.length; i++) {
        // let bic_banque = recv_data['bic_banque'];
        // let code_postal = recv_data['code_postal'];
        // let compte_iban = recv_data['compte_iban'];
        // let conditions_paiement = recv_data['conditions_paiement'];
        // let localite = recv_data['localite'];
        // let moyens_paiement = recv_data['moyens_paiement'];
        // let nom_banque = recv_data['nom_banque'];
        // let nom_numero_rue = recv_data['nom_numero_rue'];
        // let nom_societe = recv_data['nom_societe'];
        // let numero_telephone = recv_data['numero_telephone'];
        // let numero_tva = recv_data['numero_tva'];

        // clients div -> tr -> td -> input element
        infos.nom_societe = infos_div.children[i].children[0].children[0].value;
        infos.nom_numero_rue = infos_div.children[i].children[1].children[0].value;
        infos.code_postal = infos_div.children[i].children[2].children[0].value;
        infos.localite = infos_div.children[i].children[3].children[0].value;
        infos.numero_tva = infos_div.children[i].children[4].children[0].value;
        infos.numero_telephone = infos_div.children[i].children[5].children[0].value;
    }

    for (let j = 0; j < infos_bank_div.children.length; j++) {
        // let bic_banque = recv_data['bic_banque'];
        // let code_postal = recv_data['code_postal'];
        // let compte_iban = recv_data['compte_iban'];
        // let conditions_paiement = recv_data['conditions_paiement'];
        // let localite = recv_data['localite'];
        // let moyens_paiement = recv_data['moyens_paiement'];
        // let nom_banque = recv_data['nom_banque'];
        // let nom_numero_rue = recv_data['nom_numero_rue'];
        // let nom_societe = recv_data['nom_societe'];
        // let numero_telephone = recv_data['numero_telephone'];
        // let numero_tva = recv_data['numero_tva'];

        // clients div -> tr -> td -> input element
        infos.nom_banque = infos_bank_div.children[j].children[0].children[0].value;
        infos.bic_banque = infos_bank_div.children[j].children[1].children[0].value;
        infos.compte_iban = infos_bank_div.children[j].children[2].children[0].value;
        infos.conditions_paiement = infos_bank_div.children[j].children[3].children[0].value;
        infos.moyens_paiement = infos_bank_div.children[j].children[4].children[0].value;
    }

    infos_array.push(infos);

    data['infos'] = infos_array;

    return JSON.stringify(data);
}

function saveInfos() {
    var user_email = document.getElementById('user_email').innerText;
    var infos_data = getInfosData();

    db.collection('infos').doc(user_email).set({
        data: infos_data
    })
    .then(function(docRef) {
        window.location.reload();
    })
    .catch(function(error) {
        alert("Erreur lors de la sauvegarde des coordonnées.");
    });
}

function availableForSave(){
    if (document.getElementById("save").classList.contains('disabled')) document.getElementById("save").classList.replace('disabled','available');
}
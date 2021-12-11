/**************************************************************************************************
 * Firebase methods to retrieve user items data
 **************************************************************************************************/

var db = firebase.firestore();

var itemUID = 0;

// retrieve data from Firebase based on user's mail
function retrieveItemsFromFirestore() {
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
                    addItem(item);
                }
            }
            else {
                alert("Aucun article n'a été retrouvé. Veuillez en ajouter.");
            }

            // removing loading animation
            var element = document.getElementById('preloader');
            element.parentNode.removeChild(element);
        })
        .catch(function(error) {
            alert("Erreur lors du chargement des articles.");
            // removing loading animation
            var element = document.getElementById('preloader');
            element.parentNode.removeChild(element)
        });
}

/**************************************************************************************************
 * methods to add/remove/save items
 **************************************************************************************************/

function removeItem(itemId) {
    var confirmation = confirm("Confirmez-vous la suppression de ce article ?");
    if (confirmation === true){
        var element = document.getElementById(itemId);
        element.parentNode.removeChild(element);

        availableForSave();
    }
}

function addNewItem() {
    var itemId = 'item-' + itemUID;
    itemUID++;

    var item_name = "<td style='width: 30rem;'><input onchange='availableForSave()' type='text' placeholder='Nom de l&#39;article'></td>";
    var item_cost = "<td><input onchange='availableForSave()' type='number' placeholder='Prix Unitaire'></td>";
    var item_tax = "<td><input onchange='availableForSave()' type='number' placeholder='TVA'></td>";
    var item_desc = "<td><input onchange='availableForSave()' type='text' placeholder='Description personnelle'></td>";
    var actions = '<td><a class="btn-floating btn-medium waves-effect waves-light red" onclick="javascript:removeItem(\'' +
        itemId + '\'); return false;"><i class="material-icons left">delete</i></td>';

    var entry_data = item_name + item_cost + item_tax + item_desc + actions;

    var item_entry = document.createElement("tr");
    item_entry.id = itemId;
    item_entry.innerHTML = entry_data;

    document.getElementById('user_items').append(item_entry);
    availableForSave();
}

function addItem(item) {
    var itemId = 'item-' + itemUID;
    itemUID++;

    var item_name = "<td style='width: 30rem;'><input onchange='availableForSave()' type='text' value='"+ item['Name'].replace(/'/igm,"&apos;") + "'></td>";
    var item_cost = "<td><input onchange='availableForSave()' type='number' value="+ item['Cost'] + "></td>";
    var item_tax = "<td><input onchange='availableForSave()' type='number' value="+ item['Tax'] + "></td>";
    var item_desc = "<td><input onchange='availableForSave()' type='text' value='"+ item['Desc'].replace(/'/igm, "&apos;") + "'></td>";
    var actions = '<td><a class="btn-floating btn-medium waves-effect waves-light red" onclick="javascript:removeItem(\'' +
        itemId + '\'); return false;"><i class="material-icons left">delete</i></td>';

    var entry_data = item_name + item_cost + item_tax + item_desc + actions;

    var item_entry = document.createElement("tr");
    item_entry.id = itemId;
    item_entry.innerHTML = entry_data;

    document.getElementById('user_items').append(item_entry);
}

function getItemsData() {
    var data = {};

    var items_div = document.getElementById('user_items');
    var items = [];

    for (var i = 0; i < items_div.children.length; i++) {
        var item = new Object();

        // items div -> tr -> td -> input element
        item.Name = items_div.children[i].children[0].children[0].value;
        item.Cost = items_div.children[i].children[1].children[0].value;
        item.Tax = items_div.children[i].children[2].children[0].value;
        item.Desc = items_div.children[i].children[3].children[0].value;

        items.push(item);
    }

    data['items'] = items;
    return JSON.stringify(data);
}

function saveItems() {
    var user_email = document.getElementById('user_email').innerText;
    var items_data = getItemsData();
    var items_check = JSON.parse(items_data);
    var data_items_check = items_check['items'];
    var count = data_items_check.length;
    var names_data_items_check = []; // array of names of the items

    for (var index = 0; index < count; index++) {
        var item = data_items_check[index];
        var key = item['Name'];
        names_data_items_check.push(key);
    }

    var resultat = findDuplicates(names_data_items_check);

    if (resultat.length > 0) {
        alert("Erreur, vous essayez de réintroduire des articles existants : " + resultat);
        return;
    }

    db.collection('items').doc(user_email).set({
        mail: user_email,
        data: items_data,
    })
        .then(function(docRef) {
            document.getElementById("save").classList.add('disabled');
            $( "div.saved" ).fadeIn( 300 ).delay( 800 ).fadeOut( 500 );
        })
        .catch(function(error) {
            alert("Erreur lors de la mise à jour des articles.");
        });
}

function availableForSave(){
    if (document.getElementById("save").classList.contains('disabled')) document.getElementById("save").classList.replace('disabled','available');
}

function findDuplicates(arrayItems) {
    var count = {}
    var result = []

    arrayItems.forEach(item => {
        if (count[item]) {
            count[item] +=1
            return
        }
        count[item] = 1
    })

    for (let prop in count){
        if (count[prop] >=2){
            result.push(prop)
        }
    }

    return result;
}
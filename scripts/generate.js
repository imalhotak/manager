/**************************************************************************************************
 * Methods to generate the invoice pdf
 **************************************************************************************************/
let g_invoice_date = getTodayDate();

// driver function for creating the invoice pdf from a json object
function generatePDF(data, communication, save_to_device) {
    let checkDate = prompt("Veuillez entrer une date de facture :", g_invoice_date);

    if (checkDate !== null && checkDate !== "") {
        g_invoice_date = checkDate;
        var doc = new jsPDF();
        doc.addFileToVFS("Amiri-Regular.ttf", demoUsingTTFFont());
        doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");

        generateInvoice(doc, data, communication);

        if (save_to_device) {
            var nom_client = "";
            var numero_facture = "";
            let type = 'FACTURE';

            if (client_actuel['client_name']) nom_client = client_actuel['client_name'].toUpperCase();
            if (communication) numero_facture = communication;

            var nom = numero_facture + ' - ' + nom_client + ".pdf";
            doc.save(nom);
        } else {
            window.open(doc.output('bloburl'));
        }
    }
}

// function to generate lower part of the invoice
function generateInvoice(doc, data, communication) {
    generatePurchaseList(doc, data, communication);
}

function financial(x) {
    return Number.parseFloat(x).toFixed(2);
}

function round2Decimals(x){
    return Math.round((x + 0.00001) * 100.00) / 100.00;
}

// function to generate the purchases table in the invoice
function generatePurchaseList(doc, data, communication) {

    var y_pos = 100;
    var sousTotalHT = 0.00;
    let total_ttc = 0.00;
    var tot6p = 0.00;
    var tot12p = 0.00;
    var tot21p = 0.00;
    var items_array = data;
    let numero_facture = communication;

    if (items_array.length < 1) {
        return;
    }

    var items = [];
    y_pos += 10;
    for (var i = 0; i < items_array.length; i++) {
        item = items_array[i];
        
        items.push([item.description, item.quantite, item.prix_htva + "   ", '21%', financial((item.quantite * item.prix_htva)) + "   ", item.date_ajout]);


        // if (item.Tax === "6") {
        //     tot6p += ((item.Qty * item.Cost) * 6 / 100.00);
        // }
        // if (item.Tax === "12") {
        //     tot12p += ((item.Qty * item.Cost) * 12 / 100.00);
        // }
        // if (item.Tax === "21") {
        //     tot21p += ((item.Qty * item.Cost) * 21 / 100.00);
        // }
        tot21p += ((item.quantite * item.prix_htva) * 21 / 100.00);
        sousTotalHT += round2Decimals (((item.quantite * item.prix_htva)));
    }

    total_ttc = financial((sousTotalHT + tot21p));

    // item = purchase_list[purchase_list.length - 1];

    var totalPagesExp = '{total_pages_count_string}';

    doc.autoTable({
        startY: 100,
        halign: 'center',
        head: [[ {content: "Description", styles: {halign: 'left'}},  "Qté", "Prix Unitaire", "T.V.A.", "Montant H.T."]],
        headStyles: {halign: 'right', fillColor: [211, 211, 211], textColor: [0, 0, 0]},

        body: items,
        theme: 'grid',
        showHead: 'everyPage',
        columnStyles: { 1: {halign: 'right'}, 2: {halign: 'right', cellWidth: 30}, 3: {halign: 'right', cellWidth: 30}, 4: {halign: 'right', cellWidth: 35}},
        margin: {top: 100, bottom: 30},

        didDrawPage: function () {
            genererHeaderEtFooter(doc, data, numero_facture);

        },

        didDrawCell: function(data){
            if(data.column.index === 2 && data.cell.section === 'body'){
                var textPos = data.cell.textPos;
                doc.setFont("Amiri", "normal");
                doc.text(textPos.x-1.3, textPos.y+2.85, "€");
                doc.setFont('helvetica', 'normal');
            }

            if(data.column.index === 4 && data.cell.section === 'body'){
                var textPos = data.cell.textPos;
                doc.setFont("Amiri", "normal");
                doc.text(textPos.x-1.3, textPos.y+2.85, "€");
                doc.setFont('helvetica', 'normal');
            }
        }

    });

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp)
    }

    var numPage = doc.internal.getNumberOfPages();


    var results = [];


    results.push(['Sous-total H.T.', financial(sousTotalHT) + "   "]);
    // if (tot6p !== 0) results.push([' 6 %', financial(tot6p) + "   "]);
    // if (tot12p !== 0) results.push(['12 %', financial(tot12p) + "   "]);
    if (tot21p !== 0) results.push(['21 %', financial(tot21p) + "   "]);
    results.push(['Total TTC', total_ttc + "   "]);

    y_pos = doc.autoTable.previous.finalY + 10;

    doc.autoTable({
        startY: y_pos,
        halign: 'center',
        head: [[ "", ""]],
        body: results,
        theme: 'grid',
        showHead: 'never',
        columnStyles: { 0: {halign: 'right', cellWidth: 30, fontStyle: 'bold'}, 1: {halign: 'right', cellWidth: 35, fontStyle: 'bold'}},
        margin: {left: 130, top: 100},
        //tableLineWidth: 0.3,
        tableLineColor: [0, 0, 0],

        didDrawCell: function(data){
            if(data.column.index === 1 && data.cell.section === 'body'){
                var dim = data.cell.height - data.cell.padding('vertical') - 2;
                var textPos = data.cell.textPos;
                doc.setFont("Amiri", "normal");
                doc.text(textPos.x-1.3, textPos.y+2.85, "€");
                doc.setFont('helvetica', 'normal');
            }
        },


        pageBreak: 'avoid'

        });



    generateMethods(doc, data, numPage, communication);
}

function generateMethods(doc, data, numPage, communication){

    // var emetteur_banque = data['emetteur_banque'];
    // var emetteur_bic = data['emetteur_bic'];
    // var emetteur_iban = data['emetteur_iban'];
    //
    // var conditions = data['conditions'];
    // var moyens = data['moyens'];
    // var texte_libre = data['texte_libre'];
    let numero_facture = communication;
    var emetteur_banque = my_infos.nom_banque;
    var emetteur_bic = my_infos.bic_banque;
    var emetteur_iban = my_infos.compte_iban;

    var conditions = my_infos.conditions_paiement;
    var moyens = my_infos.moyens_paiement;
    var texte_libre = '';

    var y_pos = doc.autoTable.previous.finalY + 10;

    y_pos += 5;
    var paiements = [];

    let split = g_invoice_date.split('/');
    let echeance_date = new Date(split[1] + "/" + split[0] + "/" + split[2]);
    echeance_date.setDate(echeance_date.getDate() + parseInt(conditions));
    echeance_date = echeance_date.toLocaleDateString();

    if (emetteur_banque){
        paiements.push(['Banque : ', emetteur_banque]);
        paiements.push(['IBAN : ', emetteur_iban]);
        paiements.push(['BIC : ', emetteur_bic]);
        paiements.push(['Communication : ', numero_facture]);
    }

    paiements.push(['Moyens de paiement : ', moyens]);
    paiements.push(['Date d\'échéance : ', echeance_date]);

    if (texte_libre){
        paiements.push(['', texte_libre]);
    }

    var totalPagesExp = '{total_pages_count_string}';

    doc.autoTable({
        startY: y_pos,
        halign: 'center',
        head: [[ "", ""]],
        body: paiements,
        theme: 'plain',
        showHead: 'never',
        columnStyles: { 0: {halign: 'right', cellWidth: 90, cellPadding: 0.7, fontStyle: 'bold', fontSize: '9'}, 1: {halign: 'left', cellPadding: 0.7, fontSize: '9'}},
        margin: { top: 110},

        // didParseCell(data) {
        //     if (data.row.index === 2){
        //         // data.cell.styles.textColor = [180, 180, 180];
        //         // data.cell.styles.fillColor = [255, 255, 255];
        //     }
        //
        // },

        didDrawPage: function () {
            if (numPage !== doc.internal.getNumberOfPages()){
                genererHeaderEtFooter(doc, data, numero_facture);
            }
            else{}

        },

        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.2,

        pageBreak: 'avoid',
    });

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp)
    }

    generatePageNumbers(doc, data);

}

function genererHeaderEtFooter(doc, data, numero_facture){

    var totalPagesExp = '{total_pages_count_string}';

    var emetteur_name = my_infos.nom_societe.toUpperCase();
    var emetteur_rue = my_infos.nom_numero_rue;
    var emetteur_code_postal = my_infos.code_postal;
    var emetteur_localite = my_infos.localite;
    var emetteur_number = my_infos.numero_telephone;
    var emetteur_tva_number = my_infos.numero_tva;

    let split = g_invoice_date.split('/');
    var today = new Date(split[1] + "/" + split[0] + "/" + split[2]);
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '/' + mm + '/' + yyyy;

    var invoice_date = today;
    var invoice_number = numero_facture;
    var invoice_msg = '';

    var invoice_type = numero_facture[1].includes('F') ? 'FACTURE' : 'FACTURE';

    var client_name = client_actuel['client_name'].toUpperCase();
    var client_rue = client_actuel['client_rue'];
    var client_code_postal = client_actuel['client_code_postal'];
    var client_localite = client_actuel['client_localite'];
    var client_phone_number = client_actuel['client_phone_number'];
    var client_tva_number = client_actuel['client_tva_number'];

    // Header
    var x_pos = 10;
    var y_pos = 15;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    //doc.setTextColor(65, 160, 240);

    y_pos += 7;
    doc.text(x_pos, y_pos, emetteur_name);

    doc.text(200, y_pos, invoice_type, {align: 'right'});

    doc.setTextColor(0,0,0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    y_pos += 7;
    doc.text(x_pos, y_pos, emetteur_rue);
    y_pos += 5;
    doc.text(x_pos, y_pos, emetteur_code_postal + " " + emetteur_localite);
    y_pos += 5;
    if (emetteur_tva_number){
        doc.text(x_pos, y_pos, "N° de TVA : " + emetteur_tva_number);
    }
    y_pos += 5;
    if (emetteur_number){
        doc.text(x_pos, y_pos, "Tél. : " + emetteur_number);
    }

    y_pos += 6;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.rect(x_pos, y_pos, 190, 0);

    y_pos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(150, y_pos, "Facture n° : ");
    doc.text(200, y_pos, invoice_number, {align: 'right'});
    doc.text(160, (y_pos+5), "Date : ");
    doc.text(200, (y_pos+5), invoice_date, {align: 'right'});
    if (invoice_msg){
        doc.text(x_pos, y_pos, "Objet : ");
        doc.setFont('helvetica', 'normal');
        doc.text((x_pos+14), y_pos, invoice_msg);
        y_pos += 8;
        doc.setFont('helvetica', 'bold');
    }

    doc.text(x_pos, y_pos, "Adressée à : ");
    y_pos += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(x_pos, y_pos, client_name);

    y_pos += 5;
    doc.text(x_pos, y_pos, client_rue);

    y_pos += 5;
    doc.text(x_pos, y_pos, client_code_postal + " " + client_localite);

    y_pos += 5;
    if (client_tva_number){
        doc.text(x_pos, y_pos, "N° de TVA : " + client_tva_number);
    }

    y_pos += 5;
    if (client_phone_number){
        doc.text(x_pos, y_pos, "Tél. : " + client_phone_number);
    }


    // Footer
    var numPage = doc.internal.getNumberOfPages();
    var cpn = emetteur_name;
    var infosFooter = "\n" + emetteur_rue + "\n" + emetteur_code_postal + " " + emetteur_localite;
    if (emetteur_tva_number) infosFooter += "\n" + "N° de TVA : " + emetteur_tva_number;
    if (emetteur_number) infosFooter += "\n" + "Tél. : " + emetteur_number;
    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
        /* numPage = numPage + '/' + totalPagesExp */
    }
    doc.setFontSize(8);

    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
    var pageSize = doc.internal.pageSize;
    var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.rect(10, doc.internal.pageSize.getHeight() - 25, 190, 0);
    //doc.text(numPage, 195, pageHeight - 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(cpn, 10, pageHeight - 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(infosFooter, 10, pageHeight - 20);

}

function generatePageNumbers(doc, data){
    var pageSize = doc.internal.pageSize;
    var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    var pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    for(i=0; i < pageCount; i++){
        doc.setPage(i);
        doc.text(doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount, 200, pageHeight - 8, {align: 'right'});
    }
}

function getTodayDate() {
    var newDate = new Date();
    let dd = newDate.getDate();
    let mm = newDate.getMonth() + 1;
    let yyyy = newDate.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    return dd + '/' + mm + '/' + yyyy;
}



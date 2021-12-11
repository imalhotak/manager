/**************************************************************************************************
 * Methods to generate the invoice pdf
 **************************************************************************************************/
let g_invoice_date = getTodayDate();

// driver function for creating the invoice pdf from a json object
function generatePDF(data, communication, save_to_device) {
    g_invoice_date = data['invoice_date'];
    var doc = new jsPDF();
    doc.addFileToVFS("Amiri-Regular.ttf", demoUsingTTFFont());
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");

    generateInvoice(doc, data, communication);

    if (save_to_device) {
        let nom_client = "";

        if (data['client_name']) nom_client = data['client_name'].toUpperCase();

        const nom = nom_client + ' - ' + g_invoice_date + ' - ONSS' + ".pdf";
        doc.save(nom);
    } else {
        window.open(doc.output('bloburl'));
    }
}

// function to generate lower part of the invoice
function generateInvoice(doc, data, communication) {
    generateMethods(doc, data, communication);
}

function financial(x) {
    return Number.parseFloat(x).toFixed(2);
}

function round2Decimals(x){
    return Math.round((x + 0.00001) * 100.00) / 100.00;
}

function generateMethods(doc, data, communication){
    doc.setFontSize(10);
    doc.setFont('courier', 'normal');

    let num_tva = data['client_tva_number'];
    num_tva = num_tva.replaceAll('.', '');

    let communic        = num_tva + '/' + data['trimestre'];
    var emetteur_banque = data['compte_bancaire'];
    var emetteur_bic    = data['bic_onss'];
    var emetteur_iban   = data['compte_onss'];
    var montant         = data['montant'].replaceAll('.', ',') + "   ";

    var paiements = [];

    let echeance_date = data['invoice_date_echeance'];

    paiements.push(['Solde trimestre : ' + echeance_date, montant, communic]);

    let totalPagesExp = '{total_pages_count_string}';

    doc.autoTable({
        styles: {lineColor: [0, 0, 0], lineWidth: 0.1},
        startY: 150,
        halign: 'center',
        head: [[ {content: "Date ultime memo virement", styles: {halign: 'left'}},  "Montant à payer", "Communication obligatoire"]],
        headStyles: {halign: 'center', font: 'courier'},

        body: paiements,
        theme: 'plain',
        showHead: 'everyPage',
        columnStyles: { 0: {halign: 'left', cellWidth: 70, font: 'courier'}, 1: {halign: 'right', cellWidth: 45, font: 'courier'}, 2: {halign: 'right', cellWidth: 65, font: 'courier'}},
        margin: {top: 100, bottom: 30},

        didDrawPage: function () {
            genererHeaderEtFooter(doc, data);
        },

        didDrawCell: function(data){
            if(data.column.index === 1 && data.cell.section === 'body'){
                var textPos = data.cell.textPos;
                doc.setFont("Amiri", "normal");
                doc.text(textPos.x-1.3, textPos.y+2.85, "€");
                doc.setFont('courier', 'normal');
            }
        }

    });

    let x_pos = 15;
    let y_pos = doc.autoTable.previous.finalY + 10;

    doc.text(x_pos, y_pos, 'Compte bancaire : ');
    doc.text(x_pos, y_pos+5, 'IBAN : ');
    doc.text(x_pos, y_pos+10, 'BIC : ');
    doc.text(x_pos, y_pos+45, "Nous vous prions d'agréer, Cher Client, nos meilleures salutations");
    doc.text(130, y_pos+60, "Pour  ");
    doc.setFont('courier', 'bold');
    doc.text(140, y_pos+60, "HTKGROUP SRL");
    doc.text(140, y_pos+65, "HOTAK ATAL");
    doc.text(140, y_pos+70, "GERANT");

    doc.text(x_pos+40, y_pos, emetteur_banque);
    doc.text(x_pos+40, y_pos+5, emetteur_iban);
    doc.text(x_pos+40, y_pos+10, emetteur_bic);
    doc.setFont('courier', 'normal');

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp)
    }

    generatePageNumbers(doc, data);
}

function genererHeaderEtFooter(doc, data){

    var totalPagesExp = '{total_pages_count_string}';

    var emetteur_name = infos.nom_societe.toUpperCase();
    var emetteur_rue = infos.nom_numero_rue;
    var emetteur_code_postal = infos.code_postal;
    var emetteur_localite = infos.localite;
    var emetteur_number = infos.numero_telephone;
    var emetteur_tva_number = infos.numero_tva;

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
    var invoice_number = data['invoice_number'];
    var invoice_msg = '';

    var invoice_type = data['invoice_type'];

    var client_name = data['client_name'].toUpperCase();
    var client_rue = data['client_rue'];
    var client_code_postal = data['client_code_postal'];
    var client_localite = data['client_localite'];
    var client_phone_number = data['client_phone_number'];
    var client_tva_number = data['client_tva_number'];

    // Header
    var x_pos = 15;
    var y_pos = 15;

    doc.setFontSize(12);
    doc.setFont('courier', 'bold');
    //doc.setTextColor(65, 160, 240);

    y_pos += 7;
    doc.text(x_pos, y_pos, emetteur_name);

    doc.setTextColor(0,0,0);
    doc.setFontSize(10);
    doc.setFont('courier', 'normal');

    y_pos += 5;
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

    // doc.setDrawColor(0, 0, 0);
    // doc.setLineWidth(0.4);
    // doc.rect(x_pos, y_pos, 190, 0);

    y_pos += 8;
    doc.setFontSize(10);
    doc.setFont('courier', 'bold');
    doc.text(x_pos, y_pos, "Dossier n° : ");
    doc.text(x_pos+35, y_pos, invoice_number);
    doc.setFontSize(12);
    doc.setFont('courier', 'bold');
    doc.text(120, y_pos, client_name);
    doc.setFontSize(10);
    doc.setFont('courier', 'normal');
    doc.text(120, y_pos+5, client_rue);
    doc.text(120, y_pos+10, client_code_postal + " " + client_localite);
    doc.text(120, y_pos+15, "N° de TVA : " + client_tva_number);

    doc.setFont('courier', 'bold');
    doc.text(120, y_pos+25, "LA LOUVIÈRE, le " + data['invoice_date']);

    y_pos += 50;
    doc.setFont('courier', 'normal');
    doc.text(x_pos, y_pos, "Cher Client,");

    y_pos += 15;
    doc.setFont('courier', 'bold');
    doc.text(x_pos, y_pos, "Concerne : " + invoice_type);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.rect(15, y_pos+1, 81, 0);
    doc.setFont('courier', 'normal');

    y_pos += 15;
    doc.text(x_pos, y_pos, "Nous vous prions de bien vouloir, afin de respecter vos échéances ONSS,");
    doc.text(x_pos, y_pos+5, "effectuer les paiements suivants :");

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

    // doc.setDrawColor(0, 0, 0);
    // doc.setLineWidth(0.4);
    // doc.rect(10, doc.internal.pageSize.getHeight() - 25, 190, 0);
    // //doc.text(numPage, 195, pageHeight - 20);
    // doc.setFont('courier', 'bold');
    // doc.setFontSize(10);
    // doc.text(cpn, 10, pageHeight - 20);
    // doc.setFont('courier', 'normal');
    // doc.setFontSize(8);
    // doc.text(infosFooter, 10, pageHeight - 20);

}

function generatePageNumbers(doc, data){
    var pageSize = doc.internal.pageSize;
    var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    var pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    // for(i=0; i < pageCount; i++){
    //     doc.setPage(i);
    //     doc.text(doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount, 200, pageHeight - 8, {align: 'right'});
    // }
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



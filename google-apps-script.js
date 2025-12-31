const CONFIG = {
    SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE', // Replace with your Google Sheet ID
    EMAIL_TO: 'yuMycookiesgfdf@gmail.com',
    EMAIL_SUBJECT: 'New Cookie Order Received'
};


function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);

        writeToSheet(data);

        sendEmailNotification(data);

        return ContentService.createTextOutput(JSON.stringify({
            status: 'success',
            message: 'Order received successfully'
        }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // Log error
        Logger.log('Error processing form: ' + error.toString());

        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: error.toString()
        }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function writeToSheet(data) {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();

    if (sheet.getLastRow() === 0) {
        const headers = [
            'Timestamp',
            'Name',
            'Phone',
            'Email',
            'ZIP Code',
            'Address',
            'Pickup',
            'Miles',
            'Delivery Fee',
            'Quantity',
            'Order Details',
            'Notes'
        ];
        sheet.appendRow(headers);

        const headerRange = sheet.getRange(1, 1, 1, headers.length);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#E61F93');
        headerRange.setFontColor('#FFFFFF');
    }

    const rowData = [
        new Date(data.timestamp),
        data.name,
        data.phone,
        data.email,
        data.zip,
        data.address,
        data.pickup ? 'Yes' : 'No',
        data.miles,
        data.deliveryFee,
        data.quantity,
        data.orderDetails,
        data.notes
    ];

    sheet.appendRow(rowData);

    sheet.autoResizeColumns(1, rowData.length);
}


function sendEmailNotification(data) {
    const pickupText = data.pickup ? 'Yes (Customer will pick up)' : 'No (Delivery required)';
    const deliveryInfo = data.pickup
        ? 'Customer will pick up the order'
        : `Delivery Address: ${data.address}\nEstimated Miles: ${data.miles}\nEstimated Delivery Fee: ${data.deliveryFee}`;

    const emailBody = `
New Cookie Order Received
========================

ORDER DETAILS:
--------------
Quantity: ${data.quantity} cookies
Order Details: ${data.orderDetails}

CUSTOMER INFORMATION:
--------------------
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
ZIP Code: ${data.zip}

DELIVERY INFORMATION:
--------------------
Pickup: ${pickupText}
${deliveryInfo}

ADDITIONAL NOTES:
----------------
${data.notes}

ORDER TIMESTAMP:
---------------
${new Date(data.timestamp).toLocaleString('en-US', {
        timeZone: 'America/Chicago',
        dateStyle: 'full',
        timeStyle: 'long'
    })}

========================
Please confirm this order with the customer within 24 hours.

View all orders in your Google Sheet:
https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}
  `.trim();

    // Send the email
    MailApp.sendEmail({
        to: CONFIG.EMAIL_TO,
        subject: CONFIG.EMAIL_SUBJECT,
        body: emailBody
    });
}


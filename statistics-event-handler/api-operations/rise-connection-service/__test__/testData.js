let validInput = {
    headers: {
        correlationId: 'd4a6sas324asdasddad4asda6955495d5'
    },
    body: {
        'source':
        {
            'organization': 'Travelex',
            'region': 'APAC',
            'branch': 'B-1',
            'country': 'Turkey',
            'applicationId': 'RTS-ERECEIPT-ADAPTER',
            'source': 'RTS-01'
        },
        'transaction': {
            'id': 'GIB2021000099999',
            'uuid': 'GIB2021000099999',
            'documentDateTime': '2009-03-13T22:16:00',
            'notes': ['Note 1', 'Note 2'],
           // 'branchCode': '1234',
            // 'paymentCode': 94,
            'receiptTypeCode': 'DOVIZALIMBELGESI',
            'exchangeCode': 'USD',
            'rate': {
                'usdRate': 1.0,
                'exchangeRate': 9.72,
                'taxRate': 0.2
            },
            'taxAmt': 1.94,
            'exchangeAmt': 100.0

        },
        'company': {
            'id': '4690567186',
            'title': 'İce Bilişim teknolojileri A.Şç',
            'firstName': 'a',
            'middleName': 'a',
            'lastName': 'a',
            'address': {
                'line1': 'Fevzi Çakmak Cad. No:1',
                'line2': '',
                'country': 'Türkiye',
                'city': 'İstanbul',
                'district': 'Maltepe'
            },
            'contact': {
                'webSite': '',
                'phoneNo': '',
                'faxNo': '',
                'email': ''
            },
            'taxAdmin': '',
            'tradeRegNo': '11111111111111',
            'accCode': ''
        },
        'customer': {
            'id': '11111111111',
            'passportNumber' : '12345678902',
            'title': 'ALİ BİLİR',
            'type': '',
            'firstName': 'a',
            'middleName': 'a',
            'lastName': 'a',
            'nationality': 'Turkish',
            'address': {
                'line1': 'Hasanpaşa Mah. Erdem Sok. No:1',
                'line2': '',
                'country': 'Türkiye',
                'city': 'İstanbul',
                'district': 'Kadıköy'
            },
            'contact': {
                'webSite': '',
                'phoneNo': '',
                'fax': '',
                'email': ''
            },
            'taxAdmin': '',
            'tradeRegNo': '',
            // 'accCode': ''
        },
        "paymentInfo": {
            "paymentMethod": "KREDIKARTIBANKAKARTI",
            "lastPaymentDate": "2009-03-13T22:16:00",
            "explanation": "money",
            "paymentMakerAccount": {
              "authorizedMuesseseFileNumber": "12345",
              "branchCode": "1234",
              "paymentDescription": "money transfer"
            },
            "paymentMadeAccount": {
              "authorizedMuesseseFileNumber": "3456",
              "branchCode": "1234",
              "paymentDescription": "money transfer"
            }
          },
        'additionalInfo': [
            { 'name': 'statisticsNo', 'value': 'A12345' },
            { 'name': 'nationality', 'value': 'Almanya' },
            { 'name': 'arrivalReason', 'value': 'Yabancı Sermaye' },
            { 'name': 'exportForeignCapital', 'value': true },
            { 'name': 'customsDeclarationDate', 'value': '2009-03-13T22:16:00' },
            { 'name': 'customsDeclarationNo', 'value': '12345' },
            { 'name': 'dbtDate', 'value': '2009-03-13T22:16:00' },
            { 'name': 'dbtNo', 'value': '12345' },
            { 'name': 'gmtyDate', 'value': '2009-03-13T22:16:00' },
            { 'name': 'gmtyNo', 'value': '12345' },
            {'name' : 'teller', 'value' : '1234'}
        ]
    },
    queryStringParameters: { 'id': 'ice', 'operationName': 'send_edoviz_basic' }
};
let validInput2 = {
    headers: {
        correlationId: 'd4a6sas324asdasddad4asda6955495d5'
    },
    body: {
        'source':
        {
            'organization': 'Travelex',
            'region': 'APAC',
            'branch': 'B-1',
            'country': 'Turkey',
            'applicationId': 'RTS-ERECEIPT-ADAPTER',
            'source': 'RTS-01'
        },
        'transaction': {
            'id': 'GIB2021000099999',
            'uuid': 'GIB2021000099999',
            'documentDateTime': '2009-03-13T22:16:00',
            'notes': ['Note 1', 'Note 2'],
            'branchCode': '1234',
            'paymentCode': 94,
            'receiptTypeCode': 'DOVIZALIMBELGESI',
            'exchangeCode': 'USD',
            'rate': {
                'usdRate': 1.0,
                'exchangeRate': 9.72,
                'taxRate': 0.2
            },
            'taxAmt': 1.94,
            'exchangeAmt': 100.0

        },
        'company': {
            'id': '4690567186',
            'title': 'İce Bilişim teknolojileri A.Şç',
            'firstName': 'a',
            'middleName': 'a',
            'lastName': 'a',
            'address': {
                'line1': 'Fevzi Çakmak Cad. No:1',
                'line2': '',
                'country': 'Türkiye',
                'city': 'İstanbul',
                'district': 'Maltepe'
            },
            'contact': {
                'webSite': 'webSite',
                'phoneNo': 'phoneNo',
                'faxNo': 'faxNo',
                'email': 'email'
            },
            'taxAdmin': '',
            'tradeRegNo': '11111111111111',
            'accCode': ''
        },
        'customer': {
            'id': '11111111111',
            'title': 'ALİ BİLİR',
            'type': '',
            'firstName': 'a',
            'middleName': 'a',
            'lastName': 'a',
            'nationality': 'Turkish',
            'address': {
                'line1': 'Hasanpaşa Mah. Erdem Sok. No:1',
                'line2': '',
                'country': 'Türkiye',
                'city': 'İstanbul',
                'district': 'Kadıköy'
            },
            'contact': {
                'webSite': 'webSite',
                'phoneNo': 'phoneNo',
                'faxNo': 'faxNo',
                'email': 'email'
            },
            'taxAdmin': '',
            'tradeRegNo': '',
            'accCode': ''
        },
        'additionalInfo': [
            { 'name': 'statisticsNo', 'value': 'A12345' },
            { 'name': 'nationality', 'value': 'Almanya' },
            { 'name': 'arrivalReason', 'value': 'Yabancı Sermaye' },
            { 'name': 'exportForeignCapital', 'value': true },
            { 'name': 'customsDeclarationDate', 'value': '2009-03-13T22:16:00' },
            { 'name': 'customsDeclarationNo', 'value': '12345' },
            { 'name': 'dbtDate', 'value': '2009-03-13T22:16:00' },
            { 'name': 'dbtNo', 'value': '12345' },
            { 'name': 'gmtyDate', 'value': '2009-03-13T22:16:00' },
            { 'name': 'gmtyNo', 'value': '12345' }
        ]
    },
    queryStringParameters: { 'id': 'ice', 'operationName': 'send_edoviz_basic' }
};

let previewEdovizBasic = {
    headers: {
        correlationId: 'd4a6sas324asdasddad4asda6955495d5'
    },
    body: {
        'source':
        {
            'organization': 'Travelex',
            'region': 'APAC',
            'branch': 'B-1',
            'country': 'Turkey',
            'applicationId': 'RTS-ERECEIPT-ADAPTER',
            'source': 'RTS-01'
        },
        'transaction': {
            'id': 'GIB2021000099999',
            'uuid': 'GIB2021000099999',
            'documentDateTime': '2009-03-13T22:16:00',
            'notes': ['Note 1', 'Note 2'],
            'branchCode': '1234',
            'paymentCode': 94,
            'receiptTypeCode': 'DOVIZALIMBELGESI',
            'exchangeCode': 'USD',
            'rate': {
                'usdRate': 1.0,
                'exchangeRate': 9.72,
                'taxRate': 0.2
            },
            'taxAmt': 1.94,
            'exchangeAmt': 100.0

        },
        'company': {
            'id': '4690567186',
            'title': 'İce Bilişim teknolojileri A.Şç',
            'firstName': 'a',
            'middleName': 'a',
            'lastName': 'a',
            'address': {
                'line1': 'Fevzi Çakmak Cad. No:1',
                'line2': '',
                'country': 'Türkiye',
                'city': 'İstanbul',
                'district': 'Maltepe'
            },
            'contact': {
                'webSite': '',
                'phoneNo': '',
                'faxNo': '',
                'email': ''
            },
            'taxAdmin': '',
            'tradeRegNo': '11111111111111',
            'accCode': ''
        },
        'customer': {
            'id': '11111111111',
            'title': 'ALİ BİLİR',
            'type': '',
            'firstName': 'a',
            'middleName': 'a',
            'lastName': 'a',
            'nationality': 'Turkish',
            'address': {
                'line1': 'Hasanpaşa Mah. Erdem Sok. No:1',
                'line2': '',
                'country': 'Türkiye',
                'city': 'İstanbul',
                'district': 'Kadıköy'
            },
            'contact': {
                'webSite': '',
                'phoneNo': '',
                'fax': '',
                'email': ''
            },
            'taxAdmin': '',
            'tradeRegNo': '',
            'accCode': ''
        },
        'additionalInfo': [
            { 'name': 'statisticsNo', 'value': 'A12345' },
            { 'name': 'nationality', 'value': 'Almanya' },
            { 'name': 'arrivalReason', 'value': 'Yabancı Sermaye' },
            { 'name': 'exportForeignCapital', 'value': true },
            { 'name': 'customsDeclarationDate', 'value': '2009-03-13T22:16:00' },
            { 'name': 'customsDeclarationNo', 'value': '12345' },
            { 'name': 'dbtDate', 'value': '2009-03-13T22:16:00' },
            { 'name': 'dbtNo', 'value': '12345' },
            { 'name': 'gmtyDate', 'value': '2009-03-13T22:16:00' },
            { 'name': 'gmtyNo', 'value': '12345' }
        ]
    },
    queryStringParameters: { 'id': 'ice', 'operationName': 'preview_edoviz_basic' }
};

let getInvoicePdf = {
    headers: {
        correlationId: 'd4a6sas324asdasddad4asda6955495d5'
    },
    body: {
        'source':
        {
            'organization': 'Travelex',
            'region': 'APAC',
            'branch': 'B-1',
            'country': 'Turkey',
            'applicationId': 'RTS-ERECEIPT-ADAPTER',
            'source': 'RTS-01'
        },
        'transaction': {
            'id': 'GIB2021000099999',
            'uuid': 'GIB2021000099999',
            'documentDateTime': '2009-03-13T22:16:00',
            'notes': ['Note 1', 'Note 2'],
            'branchCode': '1234',
            'paymentCode': 94,
            'receiptTypeCode': 'DOVIZALIMBELGESI',
            'exchangeCode': 'USD',
            'rate': {
                'usdRate': 1.0,
                'exchangeRate': 9.72,
                'taxRate': 0.2
            },
            'taxAmt': 1.94,
            'exchangeAmt': 100.0

        },
        'company': {
            'id': '4690567186',
            'title': 'İce Bilişim teknolojileri A.Şç',
            'firstName': 'a',
            'middleName': 'a',
            'lastName': 'a',
            'address': {
                'line1': 'Fevzi Çakmak Cad. No:1',
                'line2': '',
                'country': 'Türkiye',
                'city': 'İstanbul',
                'district': 'Maltepe'
            },
            'contact': {
                'webSite': '',
                'phoneNo': '',
                'faxNo': '',
                'email': ''
            },
            'taxAdmin': '',
            'tradeRegNo': '11111111111111',
            'accCode': ''
        },
        'customer': {
            'id': '11111111111',
            'title': 'ALİ BİLİR',
            'type': '',
            'firstName': 'a',
            'middleName': 'a',
            'lastName': 'a',
            'nationality': 'Turkish',
            'address': {
                'line1': 'Hasanpaşa Mah. Erdem Sok. No:1',
                'line2': '',
                'country': 'Türkiye',
                'city': 'İstanbul',
                'district': 'Kadıköy'
            },
            'contact': {
                'webSite': '',
                'phoneNo': '',
                'fax': '',
                'email': ''
            },
            'taxAdmin': '',
            'tradeRegNo': '',
            'accCode': ''
        },
        'additionalInfo': [
            { 'name': 'statisticsNo', 'value': 'A12345' },
            { 'name': 'nationality', 'value': 'Almanya' },
            { 'name': 'arrivalReason', 'value': 'Yabancı Sermaye' },
            { 'name': 'exportForeignCapital', 'value': true },
            { 'name': 'customsDeclarationDate', 'value': '2009-03-13T22:16:00' },
            { 'name': 'customsDeclarationNo', 'value': '12345' },
            { 'name': 'dbtDate', 'value': '2009-03-13T22:16:00' },
            { 'name': 'dbtNo', 'value': '12345' },
            { 'name': 'gmtyDate', 'value': '2009-03-13T22:16:00' },
            { 'name': 'gmtyNo', 'value': '12345' }
        ]
    },
    queryStringParameters: { 'id': 'ice', 'operationName': 'send_edoviz_basic,GetInvoice_PDF' }
};
module.exports = {
    validInput,
    validInput2,
    previewEdovizBasic,
    getInvoicePdf
};
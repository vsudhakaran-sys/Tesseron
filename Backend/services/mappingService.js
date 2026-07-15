const countryMappings = require('../config/countryMappings.json');

// ─── Field definitions for the fleetsync table ───────────────────────────────
const FLEETSYNC_FIELD_DEFINITIONS = {
    station_name:                      { type: 'string',  description: 'Name of the fuel station',                       commonVariations: ['stationname', 'station', 'tankstelle', 'stationnaam'] },
    service_station_location:          { type: 'string',  description: 'Location of the service station',                commonVariations: ['station_location', 'stationlocation', 'standort', 'locatie_servicestation', 'gas_station_location', 'standort tankstelle', 'tank_station', 'fuel_station_location', 'location_of_fuel_station', 'locatie_tankstation'] },
    station_number:                    { type: 'string',  description: 'Station identifier number',                      commonVariations: ['stationnumber', 'station_id', 'stationno', 'stationsnummer', 'stationnummer'] },
    transaction_number:                { type: 'string',  description: 'Unique transaction reference',                   commonVariations: ['transactionnumber', 'transaction_id', 'transno', 'transaktionsnummer', 'transactienummer'] },
    service_country:                   { type: 'string',  description: 'Country where service occurred',                 commonVariations: ['servicecountry', 'country', 'land', 'serviceland'] },
    cost_group:                        { type: 'string',  description: 'Cost group category',                            commonVariations: ['costgroup', 'cost_category', 'kostengruppe', 'kostengroep'] },
    product_group:                     { type: 'string',  description: 'Product group category',                         commonVariations: ['productgroup', 'product_category', 'produktgruppe', 'productgroep'] },
    product_type:                      { type: 'string',  description: 'Type of product or goods',                      commonVariations: ['producttype', 'type_of_goods', 'warenart', 'produktart', 'typeofgoods'] },
    product_code:                      { type: 'string',  description: 'Product or goods code',                         commonVariations: ['productcode', 'goods_code', 'warencode', 'produktcode'] },
    payment_currency:                  { type: 'string',  description: 'Currency used for payment',                     commonVariations: ['paymentcurrency', 'currency', 'zahlungswaehrung', 'betalingsvaluta'] },
    unit:                              { type: 'string',  description: 'Unit of measurement (e.g. Liter)',              commonVariations: ['units', 'einheit', 'eenheid', 'measure'] },
    quantity:                          { type: 'number',  description: 'Quantity of product dispensed',                  commonVariations: ['qty', 'menge', 'hoeveelheid', 'amount', 'volume', 'liter', 'liters'] },
    price_per_unit:                    { type: 'number',  description: 'Net price per unit',                            commonVariations: ['priceperunit', 'unit_price', 'unitprice', 'preis', 'prijs', 'unit_price_net', 'price_per_unit'] },
    net_base_value:                    { type: 'number',  description: 'Net base value of transaction',                 commonVariations: ['netbasevalue', 'base_value_net', 'nettobasiswert', 'nettobasiswaarde', 'net_base_amount'] },
    net_service_value:                 { type: 'number',  description: 'Net service fee value',                         commonVariations: ['netservicevalue', 'service_fee_net', 'nettodienstleistungswert', 'nettodienstwaarde', 'net_service_amount'] },
    net_purchase_value:                { type: 'number',  description: 'Net purchase value',                            commonVariations: ['netpurchasevalue', 'purchase_value_net', 'nettoeinkaufswert', 'netto_aankoopwaarde', 'net_purchase_amount'] },
    currency_of_service:               { type: 'string',  description: 'Currency of the service country',              commonVariations: ['currencyofservice', 'service_currency', 'dienstleistungswaehrung', 'servicevaluta'] },
    value_in_payment_currency:         { type: 'number',  description: 'Value expressed in payment currency',           commonVariations: ['valueinpaymentcurrency', 'payment_value', 'wert_zahlungswaehrung', 'waarde_betalingsvaluta'] },
    value_in_service_country_currency: { type: 'number',  description: 'Value in service country local currency',       commonVariations: ['valueinservicecountrycurrency', 'local_value', 'wert_landeswaehrung', 'waarde_landvaluta', 'value_local_currency', 'local_currency_value'] },
    vat:                               { type: 'number',  description: 'VAT / tax amount',                             commonVariations: ['tax', 'mwst', 'btw', 'gst', 'mehrwertsteuer', 'omzetbelasting', 'vat', 'value_added_tax'] },
    price_per_unit_gross:              { type: 'number',  description: 'Gross price per unit including tax',            commonVariations: ['grosspriceperunit', 'gross_price', 'bruttopreis', 'bruttoprijs', 'unit_price_gross', 'unit_price'] },
    net_discount:                      { type: 'number',  description: 'Net discount amount',                           commonVariations: ['netdiscount', 'discount_net', 'nettorabatt', 'nettokorting', 'rabatt'] },
    vehicle_number:                    { type: 'string',  description: 'Vehicle license plate or identifier',           commonVariations: ['vehiclenumber', 'license_plate', 'plate', 'kennzeichen', 'fahrzeugnummer', 'voertuignummer', 'licenseplate', 'kenteken', 'nummernschild'] },
    billing_date:                      { type: 'date',    description: 'Invoice or billing date',                       commonVariations: ['billingdate', 'invoice_date', 'abrechnungsdatum', 'factuurdatum', 'rechnungsdatum'] },
    bill_number:                       { type: 'string',  description: 'Bill or invoice number',                        commonVariations: ['billnumber', 'bill_no', 'rechnungsnummer', 'factuurnummer'] },
    invoice_number:                    { type: 'string',  description: 'DKV invoice number',                           commonVariations: ['invoicenumber', 'invoice_no', 'rechnungsnummer_dkv', 'external_invoice_number'] },
    ticket_number_dkv:                 { type: 'string',  description: 'DKV ticket number',                            commonVariations: ['ticketnumberdkv', 'dkv_ticket', 'ticketnummer_dkv', 'ticketnummer'] },
    postcode_of_station:               { type: 'string',  description: 'Postal code of the fuel station',              commonVariations: ['postcodeofstation', 'station_postcode', 'zip', 'plz', 'postleitzahl', 'postcode_station', 'gas_station_postalcode', 'postcode', 'station_postalcode', 'gas_station_zip_code', 'zip_code'] },
    gross_base_value:                  { type: 'number',  description: 'Gross base value',                             commonVariations: ['grossbasevalue', 'base_value_gross', 'bruttobasiswert', 'bruttobasiswaarde', 'total_base_value', 'total_base_amount'] },
    kostenstelle_1:                    { type: 'string',  description: 'Cost center 1',                                commonVariations: ['costcenter1', 'cost_center_1', 'kostenplaats1', 'costcentre1'] },
    kostenstelle_2:                    { type: 'string',  description: 'Cost center 2',                                commonVariations: ['costcenter2', 'cost_center_2', 'kostenplaats2', 'costcentre2'] },
    abrechnungsobjekt_nummer:          { type: 'string',  description: 'Billing object number',                        commonVariations: ['billingobjectnumber', 'abrechnungsobjektnummer', 'facturatieobjectnummer', 'settlement_object_number'] },
    country_of_invoice:                { type: 'string',  description: 'Country where invoice was issued',             commonVariations: ['countryofinvoice', 'invoice_country', 'rechnungsland', 'factuurland', 'billing_country'] },
    odometer:                          { type: 'number',  description: 'Odometer reading in km',                       commonVariations: ['mileage', 'km', 'kilometerstand', 'odo', 'kilometrage', 'kilometerteller'] },
    gross_discount:                    { type: 'number',  description: 'Gross discount amount',                        commonVariations: ['grossdiscount', 'discount_gross', 'bruttorabatt', 'bruttokorting', 'total_discount', 'total_korting'] },
    alter_terminal:                    { type: 'string',  description: 'Old / previous terminal identifier',           commonVariations: ['altterminal', 'terminal', 'old_terminal', 'altes_terminal', 'oud_terminal'] },
    client_number:                     { type: 'string',  description: 'Client or customer number',                    commonVariations: ['clientnumber', 'customer_number', 'kundennummer', 'klantnummer'] },
    transaction_date:                  { type: 'date',    description: 'Date of the transaction',                      commonVariations: ['transactiondate', 'date', 'datum', 'transaktionsdatum', 'transactiedatum', 'txdate'] },
    transaction_time:                  { type: 'string',  description: 'Time of the transaction',                      commonVariations: ['transactiontime', 'time', 'uhrzeit', 'transaktionsuhrzeit', 'transactietijd', 'txtime'] },
    distance_since_last_fill:          { type: 'number',  description: 'Distance driven since last refuel',            commonVariations: ['distancesincelastfill', 'since_last_fill', 'distanz_tankung', 'afstand_tankbeurt', 'distance_since_last_refuel', 'distance_since_last_refueling', 'abstand_seit'] },
    year_month:                        { type: 'string',  description: 'Year and month (YYYY-MM), auto-derived',       commonVariations: ['yearmonth', 'year_month', 'month', 'period', 'monat', 'periode'] },
    energy_type:                       { type: 'string',  description: 'Type of energy or fuel',                      commonVariations: ['energytype', 'fuel_type', 'energieart', 'energietype', 'kraftstoff', 'brandstoftype'] },
};

// ─── Generic scoring ─────────────────────────────────────────────────────────

function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

function scoreHeader(header, translatedHeader) {
    const norm = normalize(header);
    let bestField = null;
    let bestScore = 0;

    for (const [fieldName, fieldDef] of Object.entries(FLEETSYNC_FIELD_DEFINITIONS)) {
        const normField = normalize(fieldName);

        // 1. Direct exact match
        if (norm === normField || header.toLowerCase() === fieldName.toLowerCase()) {
            return { field: fieldName, score: 95, viaTranslation: false };
        }

        // 2. Variation exact match
        for (const v of fieldDef.commonVariations) {
            const normV = normalize(v);
            if (norm === normV || header.toLowerCase() === v.toLowerCase()) {
                if (92 > bestScore) { bestField = fieldName; bestScore = 92; }
            } else if (norm.includes(normV) || normV.includes(norm)) {
                if (75 > bestScore) { bestField = fieldName; bestScore = 75; }
            }
        }
    }

    // 3. Check translated header for additional boost
    if (translatedHeader && translatedHeader !== header) {
        const tNorm = normalize(translatedHeader);
        for (const [fieldName, fieldDef] of Object.entries(FLEETSYNC_FIELD_DEFINITIONS)) {
            const normField = normalize(fieldName);
            if (tNorm === normField) {
                const boosted = Math.min(95, 92 + 3);
                if (boosted > bestScore) { bestField = fieldName; bestScore = boosted; }
            }
            for (const v of fieldDef.commonVariations) {
                if (tNorm === normalize(v)) {
                    const boosted = Math.min(95, 90 + 3);
                    if (boosted > bestScore) { bestField = fieldName; bestScore = boosted; }
                }
            }
        }
    }

    return bestField && bestScore >= 70
        ? { field: bestField, score: bestScore, viaTranslation: false }
        : null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Suggest DB field mappings for each header in the file structure.
 * @param {Object} fileStructure  { sheetName: { headers, sampleData, rowCount } }
 * @param {Object} translatedHeaderMap  { originalHeader: translatedHeader }
 * @param {string} detectedLang  e.g. 'de', 'nl', 'ja', 'en'
 * @returns {Object}  { sheetName: { originalHeader: { suggestedField, confidence, description, isForeignHeader } } }
 */
function suggestMappings(fileStructure, translatedHeaderMap = {}, detectedLang = 'en') {
    const langMap = countryMappings[detectedLang] || {};
    const suggestions = {};

    for (const [sheetName, sheetData] of Object.entries(fileStructure)) {
        suggestions[sheetName] = {};

        for (const header of sheetData.headers) {
            const translated = translatedHeaderMap[header] || header;
            let suggestedField = null;
            let confidence = 0;

            // Priority 1: exact country mapping lookup
            if (langMap[header]) {
                suggestedField = langMap[header];
                confidence = 100;
            }
            // Priority 2: partial country mapping
            else {
                for (const [mappedHeader, dbField] of Object.entries(langMap)) {
                    const h = header.toLowerCase();
                    const m = mappedHeader.toLowerCase();
                    if (h.includes(m) || m.includes(h)) {
                        suggestedField = dbField;
                        confidence = 85;
                        break;
                    }
                }
            }

            // Priority 3: translated header country lookup (with +3% boost)
            if (!suggestedField && translated !== header && langMap[translated]) {
                suggestedField = langMap[translated];
                confidence = 88; // 85 + 3
            }

            // Priority 4: generic scoring algorithm
            if (!suggestedField) {
                const result = scoreHeader(header, translated);
                if (result) {
                    suggestedField = result.field;
                    confidence = result.score;
                }
            }

            if (suggestedField) {
                const fieldDef = FLEETSYNC_FIELD_DEFINITIONS[suggestedField];
                suggestions[sheetName][header] = {
                    suggestedField,
                    confidence,
                    description: fieldDef ? fieldDef.description : '',
                    fieldType: fieldDef ? fieldDef.type : 'string',
                    isForeignHeader: translated !== header,
                    translatedHeader: translated !== header ? translated : null,
                };
            } else {
                suggestions[sheetName][header] = {
                    suggestedField: null,
                    confidence: 0,
                    description: 'No match found — please select manually',
                    fieldType: 'string',
                    isForeignHeader: translated !== header,
                    translatedHeader: translated !== header ? translated : null,
                };
            }
        }
    }

    return suggestions;
}

module.exports = { suggestMappings, FLEETSYNC_FIELD_DEFINITIONS };

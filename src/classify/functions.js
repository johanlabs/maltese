const validator = require('validator');
const nlp = require('compromise');

const _ = require('lodash');
const citiesData = require('cities.json');

const knownCities = _.map(_.filter(citiesData), 'name');

function identifyNames(text) {
    const nameRegex = /\b[A-ZÀ-ÿ][a-zà-ÿ]+(?:\s[A-ZÀ-ÿ][a-zà-ÿ]+)+\b/g;
    const names = [];
    const doc = nlp(text);
    const nlpNames = doc.people().out('array');

    const nameList = [...(text.match(nameRegex) || []), ...nlpNames]
        .filter(name => /^[A-Za-zÀ-ÿ\s]+$/.test(name) && name.length > 1)
        .flatMap(name => name.toLowerCase().includes(' e ') ? name.split(' e ').map(n => n.trim()) : [name]);

    nameList.forEach(name => {
        if (!names.includes(name)) {
            names.push(name);
        }
    });

    return names;
}

function identifyDates(text) {
    const dateRegex = /(\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b)|(\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b)|(\b\d{1,2}\s+de\s+(?:Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez)\b)|(\b(?:Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro)\s+de\s\d{4}\b)/gi;
    const dates = [];
    (text.match(dateRegex) || []).forEach(date => {
        if (!dates.includes(date)) {
            dates.push(date);
        }
    });
    return dates;
}

function identifyTimes(text) {
    const timeRegex = /\b(?:\d{1,2}:\d{2}(?::\d{2})?(?:\s?[ap]m)?)/gi;
    const times = [];
    (text.match(timeRegex) || []).forEach(time => {
        if (!times.includes(time)) {
            times.push(time);
        }
    });
    return times;
}

function identifyAddresses(text) {
    const addressRegex = /\b(?:Rua|Avenida|AV\.|Alameda|Travessa|Praça)\s+[\w\s\d.-]+/gi;
    const addresses = [];
    (text.match(addressRegex) || []).forEach(addr => {
        if (!addresses.includes(addr.trim())) {
            addresses.push( addr.trim() );
        }
    });
    return addresses;
}

function identifyCities(text) {
    const places = nlp(text).places().out('array');
    const cities = [];
    
    places.forEach(place => {
        if (knownCities.includes(place) || !/\b(para|de|em)\b/i.test(place)) {
            if (!cities.includes(place)) {
                cities.push(place);
            }
        }
    });

    // retorna cities sem caracteres especiais
    return cities.map(city => city.replace(/[^\w\s]/g, ''));
}

function identifyEmails(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = [];
    (text.match(emailRegex) || []).forEach(email => {
        if (validator.isEmail(email) && !emails.includes(email)) {
            emails.push(email);
        }
    });
    return emails;
}

function identifyNumbers(text) {
    const numberRegex = /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
    const numbers = [];
    (text.match(numberRegex) || []).forEach(number => {
        if (!numbers.includes(number)) {
            numbers.push(number);
        }
    });
    return numbers;
}

function identifyPasswords(text) {
    const passwordRegex = /\b(?=[A-Za-z0-9@#$%^&+=]*[A-Z])(?=[A-Za-z0-9@#$%^&+=]*[a-z])(?=[A-Za-z0-9@#$%^&+=]*\d)[A-Za-z0-9@#$%^&+=]{8,}\b/g;
    const passwords = [];
    (text.match(passwordRegex) || []).forEach(password => {
        if (!passwords.includes(password)) {
            passwords.push(password);
        }
    });
    return passwords;
}

function identifyNationalIds(text) {
    const nationalIdRegex = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b|\b\d{2}\.\d{3}\.\d{3}\/?\d{4}-?\d{2}\b|\b\d{1,2}\.\d{3}\.\d{3}-?\d\b/g;
    const nationalIds = [];
    (text.match(nationalIdRegex) || []).forEach(id => {
        if (!nationalIds.includes(id)) {
            nationalIds.push(id);
        }
    });
    return nationalIds;
}

function identifyPassports(text) {
    const passportRegex = /\b[A-Z]{1,2}\d{6,8}\b/g;
    const passports = [];
    (text.match(passportRegex) || []).forEach(passport => {
        if (!passports.includes(passport)) {
            passports.push(passport);
        }
    });
    return passports;
}

function identifyDrivingLicenses(text) {
    const drivingLicenseRegex = /\b[A-Z]{3}-?\d{4}\b|\b[A-Z]{3}\d[A-Z]\d{2}\b/g;
    const drivingLicenses = [];
    (text.match(drivingLicenseRegex) || []).forEach(license => {
        if (!drivingLicenses.includes(license)) {
            drivingLicenses.push(license);
        }
    });
    return drivingLicenses;
}

function identifyTaxIds(text) {
    const taxIdRegex = /\b\d{2}\.\d{3}\.\d{3}\/?\d{4}-?\d{2}\b/g;
    const taxIds = [];
    (text.match(taxIdRegex) || []).forEach(taxId => {
        if (!taxIds.includes(taxId)) {
            taxIds.push(taxId);
        }
    });
    return taxIds;
}

function identifyHealthIds(text) {
    const healthIdRegex = /\b\d{10,12}\b/g;
    const healthIds = [];
    (text.match(healthIdRegex) || []).forEach(healthId => {
        if (!healthIds.includes(healthId)) {
            healthIds.push(healthId);
        }
    });
    return healthIds;
}

function identifyOtherDocuments(text) {
    const otherDocumentRegex = /\b[A-Za-z]{2,3}\d{6,10}\b/g;
    const otherDocuments = [];
    (text.match(otherDocumentRegex) || []).forEach(doc => {
        if (!otherDocuments.includes(doc)) {
            otherDocuments.push(doc);
        }
    });
    return otherDocuments;
}

function identifySensitiveDocuments(text) {
    return {
        nationalId: identifyNationalIds(text),
        passports: identifyPassports(text),
        drivingLicenses: identifyDrivingLicenses(text),
        taxIds: identifyTaxIds(text),
        healthIds: identifyHealthIds(text),
        otherDocuments: identifyOtherDocuments(text)
    };
}

module.exports = {
    identifyNames,
    identifyDates,
    identifyTimes,
    identifyAddresses,
    identifyCities,
    identifyEmails,
    identifyNumbers,
    identifyPasswords,
    identifyNationalIds,
    identifyPassports,
    identifyDrivingLicenses,
    identifyTaxIds,
    identifyHealthIds,
    identifyOtherDocuments,
    identifySensitiveDocuments
};
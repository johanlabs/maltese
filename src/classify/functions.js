const validator = require('validator');
const nlp = require('compromise');
const _ = require('lodash');
const citiesData = require('cities.json');

const knownCities = _.map(_.filter(citiesData), 'name');

/**
 * Helpers
 */
function uniquePush(arr, value) {
    if (!arr.includes(value)) {
        arr.push(value);
    }
}

function matchUnique(text, regex, validateFn) {
    const results = [];
    const matches = text.match(regex) || [];

    matches.forEach(value => {
        if (!validateFn || validateFn(value)) {
            uniquePush(results, value);
        }
    });

    return results;
}

/**
 * Identifiers
 */
function identifyNames(text) {
    const nameRegex = /\b[A-ZÀ-ÿ][a-zà-ÿ]+(?:\s[A-ZÀ-ÿ][a-zà-ÿ]+)+\b/g;
    const doc = nlp(text);
    const nlpNames = doc.people().out('array');
    const names = [];

    const candidates = [
        ...(text.match(nameRegex) || []),
        ...nlpNames
    ]
        .filter(name =>
            /^[A-Za-zÀ-ÿ\s]+$/.test(name) &&
            name.length > 1
        )
        .flatMap(name =>
            name.toLowerCase().includes(' e ')
                ? name.split(' e ').map(n => n.trim())
                : [name]
        );

    candidates.forEach(name => uniquePush(names, name));

    return names;
}

function identifyDates(text) {
    const dateRegex = /(\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b)|(\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b)|(\b\d{1,2}\s+de\s+(?:Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez)\b)|(\b(?:Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro)\s+de\s\d{4}\b)/gi;
    return matchUnique(text, dateRegex);
}

function identifyTimes(text) {
    const timeRegex = /\b(?:\d{1,2}:\d{2}(?::\d{2})?(?:\s?[ap]m)?)/gi;
    return matchUnique(text, timeRegex);
}

function identifyAddresses(text) {
    const addressRegex = /\b(?:Rua|Avenida|AV\.|Alameda|Travessa|Praça)\s+[\w\s\d.-]+/gi;
    return matchUnique(text, addressRegex).map(addr => addr.trim());
}

function identifyCities(text) {
    const places = nlp(text).places().out('array');
    const cities = [];

    places.forEach(place => {
        if (
            knownCities.includes(place) ||
            !/\b(para|de|em)\b/i.test(place)
        ) {
            uniquePush(cities, place);
        }
    });

    return cities.map(city => city.replace(/[^\w\s]/g, ''));
}

function identifyEmails(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return matchUnique(text, emailRegex, validator.isEmail);
}

function identifyNumbers(text) {
    const numberRegex = /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
    return matchUnique(text, numberRegex);
}

function identifyPasswords(text) {
    const passwordRegex = /\b(?=[A-Za-z0-9@#$%^&+=]*[A-Z])(?=[A-Za-z0-9@#$%^&+=]*[a-z])(?=[A-Za-z0-9@#$%^&+=]*\d)[A-Za-z0-9@#$%^&+=]{8,}\b/g;
    return matchUnique(text, passwordRegex);
}

function identifyNationalIds(text) {
    const nationalIdRegex = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b|\b\d{2}\.\d{3}\.\d{3}\/?\d{4}-?\d{2}\b|\b\d{1,2}\.\d{3}\.\d{3}-?\d\b/g;
    return matchUnique(text, nationalIdRegex);
}

function identifyPassports(text) {
    const passportRegex = /\b[A-Z]{1,2}\d{6,8}\b/g;
    return matchUnique(text, passportRegex);
}

function identifyDrivingLicenses(text) {
    const drivingLicenseRegex = /\b[A-Z]{3}-?\d{4}\b|\b[A-Z]{3}\d[A-Z]\d{2}\b/g;
    return matchUnique(text, drivingLicenseRegex);
}

function identifyTaxIds(text) {
    const taxIdRegex = /\b\d{2}\.\d{3}\.\d{3}\/?\d{4}-?\d{2}\b/g;
    return matchUnique(text, taxIdRegex);
}

function identifyHealthIds(text) {
    const healthIdRegex = /\b\d{10,12}\b/g;
    return matchUnique(text, healthIdRegex);
}

function identifyOtherDocuments(text) {
    const otherDocumentRegex = /\b[A-Za-z]{2,3}\d{6,10}\b/g;
    return matchUnique(text, otherDocumentRegex);
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

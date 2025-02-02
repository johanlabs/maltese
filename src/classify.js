const functions = require('./classify/functions');
const { classifyTokens, restoreOriginalTokens } = require('./classify/tokens');

function classifySensitive(text) {
    if (typeof text !== 'string') {
        throw new Error('Param {text} not is String.');
    }

    const { tokenizedText, tokenMap } = classifyTokens(text);

    const result = {
        names: functions.identifyNames(tokenizedText),
        dates: functions.identifyDates(tokenizedText),
        times: functions.identifyTimes(tokenizedText),
        addresses: functions.identifyAddresses(tokenizedText),
        cities: functions.identifyCities(tokenizedText),
        personalData: {
            emails: functions.identifyEmails(tokenizedText),
            numbers: functions.identifyNumbers(tokenizedText)
        },
        credentials: {
            passwords: functions.identifyPasswords(tokenizedText)
        },
        sensitiveDocuments: functions.identifySensitiveDocuments(tokenizedText)
    };

    return JSON.parse(
        restoreOriginalTokens(JSON.stringify(result), tokenMap)
    );
}

module.exports = classifySensitive;
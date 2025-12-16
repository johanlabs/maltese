const functions = require('./classify/functions');
const {
  classifyTokens,
  restoreOriginalTokens
} = require('./classify/tokens');

function classifySensitive(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new TypeError('Param {text} must be a non-empty string.');
  }

  const { tokenizedText, tokenMap } = classifyTokens(text);

  const classified = {
    names: [],
    dates: [],
    times: [],
    addresses: [],
    cities: [],
    personalData: {
      emails: [],
      numbers: []
    },
    credentials: {
      passwords: []
    },
    sensitiveDocuments: {}
  };

  classified.names = functions.identifyNames(tokenizedText);
  classified.dates = functions.identifyDates(tokenizedText);
  classified.times = functions.identifyTimes(tokenizedText);
  classified.addresses = functions.identifyAddresses(tokenizedText);
  classified.cities = functions.identifyCities(tokenizedText);

  classified.personalData.emails =
    functions.identifyEmails(tokenizedText);

  classified.personalData.numbers =
    functions.identifyNumbers(tokenizedText);

  classified.credentials.passwords =
    functions.identifyPasswords(tokenizedText);

  classified.sensitiveDocuments =
    functions.identifySensitiveDocuments(tokenizedText);

  return JSON.parse(
    restoreOriginalTokens(JSON.stringify(classified), tokenMap)
  );
}

module.exports = classifySensitive;

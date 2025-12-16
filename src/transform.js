const fakerLib = require('faker');

function tag(value) {
  return value;
}

function replaceNumbersInString(input) {
  return input.replace(/\d+/g, (match) => {
    const randomNumber = fakerLib.datatype.number({ min: 1000000000, max: 9999999999 }).toString().slice(0, match.length);
    return randomNumber;
  });
}

function randomizeSensitive(inputData, mode = 'pseudo') {
  const isAnon = mode === 'anon';

  return {
    names: inputData?.names?.map(() => isAnon ? '[NOME]' : fakerLib.name.firstName()),

    dates: inputData?.dates?.map(() => isAnon ? '[DATA]' : generateFakeDate()),

    times: inputData?.times?.map(() => isAnon ? '[HORA]' : undefined),

    addresses: inputData?.addresses?.map(() => isAnon ? '[ENDERECO]' : fakerLib.address.streetName()),

    cities: inputData?.cities?.map(() => isAnon ? '[CIDADE]' : fakerLib.address.city()),

    credentials: {
      passwords: inputData?.credentials?.passwords?.map(() => isAnon ? '[SENHA]' : fakerLib.internet.password())
    },

    personalData: {
      emails: inputData?.personalData?.emails?.map(() => isAnon ? '[EMAIL]' : fakerLib.internet.email()),
      numbers: inputData?.personalData?.numbers?.map(() => isAnon ? '[NUMERO]' : replaceNumbersInString('[NUMERO]'))
    },

    sensitiveDocuments: {
      nationalId: inputData?.sensitiveDocuments?.nationalId?.map(() => '[CPF]'),
      passports: inputData?.sensitiveDocuments?.passports?.map(() => '[PASSAPORTE]'),
      drivingLicenses: inputData?.sensitiveDocuments?.drivingLicenses?.map(() => '[CNH]'),
      taxIds: inputData?.sensitiveDocuments?.taxIds?.map(() => '[CNPJ]'),
      healthIds: inputData?.sensitiveDocuments?.healthIds?.map(() => '[SAUDE]'),
      otherDocuments: inputData?.sensitiveDocuments?.otherDocuments?.map(() => '[DOCUMENTO]')
    }
  };
}

function generateFakeDate() {
  const date = fakerLib.date.past();
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

module.exports = randomizeSensitive;
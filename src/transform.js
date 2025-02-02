const faker = require('faker');

function replaceNumbersInString(input) {
  return input.replace(/\d+/g, (match) => {
    const randomNumber = faker.datatype.number({ min: 1000000000, max: 9999999999 }).toString().slice(0, match.length);
    return randomNumber;
  });
}

function randomizeSensitive(inputData) {
  const transformedData = {
    names: inputData?.names?.map(name => faker.name.firstName()),

    dates: inputData?.dates?.map(date => generateFakeDate(date)),

    times: inputData?.times,

    addresses: inputData?.addresses?.map(address => faker.address.streetName()),

    cities: inputData?.cities?.map(() => faker.address.city()),

    credentials: {
      passwords: inputData?.credentials?.passwords?.map(() => faker.internet.password()),
      creditCards: inputData?.credentials?.creditCards?.map(() => faker.finance.creditCardNumber())
    },

    personalData: {
      emails: inputData?.personalData?.emails?.map(() => faker.internet.email()),
      numbers: inputData?.personalData?.numbers?.map((num) => {
        return replaceNumbersInString(num);
      })
    },

    sensitiveDocuments: {
      nationalId: inputData?.sensitiveDocuments?.nationalId?.map((id) => replaceNumbersInString(id)),
      passports: inputData?.sensitiveDocuments?.passports?.map((passport) => replaceNumbersInString(passport)),
      drivingLicenses: inputData?.sensitiveDocuments?.drivingLicenses?.map((license) => replaceNumbersInString(license)),
      taxIds: inputData?.sensitiveDocuments?.taxIds?.map((taxId) => replaceNumbersInString(taxId)),
      healthIds: [],
      otherDocuments: inputData?.sensitiveDocuments?.otherDocuments?.map((doc) => replaceNumbersInString(doc))
    }
  };

  return transformedData;
}

function generateFakeDate(date) {
  const regex = /(\d{2})\/(\d{2})\/(\d{4})/;
  if (regex.test(date)) {
    const newDate = faker.date.past();
    return `${newDate.getDate() < 10 ? '0' : ''}${newDate.getDate()}/${newDate.getMonth() + 1 < 10 ? '0' : ''}${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
  } else {
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const newMonth = monthNames[Math.floor(Math.random() * monthNames.length)];
    const newYear = faker.date.past().getFullYear();
    return `${newMonth} de ${newYear}`;
  }
}

module.exports = randomizeSensitive;

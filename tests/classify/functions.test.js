const {
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
} = require("../../src/classify/functions");

describe('identifyNames', () => {
    test('should identify names correctly', () => {
        const text = "John Doe went to the store with Jane Doe and Maria Silva.";
        const expected = ["John Doe", "Jane Doe", "Maria Silva"];
        const result = identifyNames(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length); // Check for exact match
    });

    test('should handle names with "e" correctly', () => {
        const text = "Eduardo e Mônica went to the park.";
        const expected = ["Eduardo", "Mônica"];
        const result = identifyNames(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });

    test('should not identify single capital letters as names', () => {
      const text = "A went to the store.";
      const result = identifyNames(text);
      expect(result).toEqual([]);
    });

    test('should handle names with special characters', () => {
        const text = "Renée e François went to the café.";
        const expected = ["Renée", "François"];
        const result = identifyNames(text);
        expect(result).toEqual(expect.arrayContaining(expected));
    });
    
    test('should handle empty input', () => {
        const text = "";
        const expected = [];
        const result = identifyNames(text);
        expect(result).toEqual(expected);
    });
});

describe('identifyDates', () => {
    test('should identify dates in various formats', () => {
        const text = "The meeting is on 12/25/2023, 25-12-2023 e Janeiro de 2024.";
        const expected = ["12/25/2023", "25-12-2023", "Janeiro de 2024"];
        const result = identifyDates(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });
});

describe('identifyTimes', () => {
    test('should identify times', () => {
        const text = "The time is 10:30, 14:00, 1:00pm, and 2:30 AM.";
        const expected = ["10:30", "14:00", "1:00pm", "2:30 AM"];
        const result = identifyTimes(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });
});

describe('identifyAddresses', () => {
    test('should identify addresses', () => {
        const text = "I live on Rua das Flores, 123 and Avenida Paulista, 456.";
        const expected = [ "Rua das Flores" , "Avenida Paulista" ];
        const result = identifyAddresses(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });
});

describe('identifyCities', () => {
    test('should identify cities', () => {
        const text = "I went to New York and then to London.  I also visited a place called 'Paraíso'.";
        const expected = ["New York", "London"]; // "Paraíso" should not be included
        const result = identifyCities(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });
});

describe('identifyEmails', () => {
    test('should identify emails', () => {
        const text = "My email is test@example.com and another one is invalid@test.";
        const expected = ["test@example.com"];
        const result = identifyEmails(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });
});

describe('identifyNumbers', () => {
    test('should identify numbers', () => {
        const text = "My phone number is +1-555-123-4567 and another number is 123.456.7890.";
        const expected = ["+1-555-123-4567", "123.456.7890"];
        const result = identifyNumbers(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });
});


describe('identifyPasswords', () => {
    test('should identify passwords', () => {
      const text = "My password is StrongPassword123 and another one is weak.";
      const expected = ["StrongPassword123"];
      const result = identifyPasswords(text);
      expect(result).toEqual(expect.arrayContaining(expected));
      expect(result.length).toEqual(expected.length);
    });
});

describe('identifyNationalIds', () => {
    test('should identify national IDs', () => {
        const text = "My ID is 123.456.789-01 and another one is 98.765.432-1.";
        const expected = ["123.456.789-01", "98.765.432-1"];
        const result = identifyNationalIds(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });
});

describe('identifyPassports', () => {
    test('should identify passports', () => {
        const text = "My passport is AB123456 and another one is XY98765432.";
        const expected = ["AB123456", "XY98765432"];
        const result = identifyPassports(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });
});

describe('identifyDrivingLicenses', () => {
    test('should identify driving licenses', () => {
        const text = "My license is ABC-1234 and another one is XYZ1A23.";
        const expected = ["ABC-1234", "XYZ1A23"];
        const result = identifyDrivingLicenses(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });
});

describe('identifyTaxIds', () => {
    test('should identify tax IDs', () => {
        const text = "My tax ID is 12.345.678/9012-34 and another one is 56.789.012/3456-78.";
        const expected = ["12.345.678/9012-34", "56.789.012/3456-78"];
        const result = identifyTaxIds(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });
});

describe('identifyHealthIds', () => {
    test('should identify health IDs', () => {
        const text = "My health ID is 1234567890 and another one is 987654321012.";
        const expected = ["1234567890", "987654321012"];
        const result = identifyHealthIds(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });
});

describe('identifyOtherDocuments', () => {
    test('should identify other documents', () => {
        const text = "My document is AB12345678 and another one is XYZ9876543210.";
        const expected = ["AB12345678", "XYZ9876543210"];
        const result = identifyOtherDocuments(text);
        expect(result).toEqual(expect.arrayContaining(expected));
        expect(result.length).toEqual(expected.length);
    });
});

describe('identifySensitiveDocuments', () => {
    it('should identify sensitive documents correctly', () => {
        const text = `
            Nome: João da Silva e Maria Silva, Data: 01/01/2023, 10:00 AM, 
            Endereço: Rua das Flores, 123, São Paulo, SP, email@example.com, 
            Telefone: +55 (11) 98765-4321, Senha: SecurePassword123, 
            CPF: 123.456.789-01, RG: 98.765.432-1, Passaporte: AB1234567, 
            CNH: ABC-1234, Título de Eleitor: 123456789012, 
            Cartão SUS: 98765432101, Outro Documento: XY12345678
        `;

        const expected = {
            nationalId: ['123.456.789-01', '98.765.432-1'],
            passports: ['AB1234567', 'XY12345678'],
            drivingLicenses: ['ABC-1234'],
            taxIds: [],
            healthIds: ['123456789012', '98765432101'],
            otherDocuments: ['AB1234567', 'XY12345678']
        };

        const result = identifySensitiveDocuments(text);
        expect(result).toEqual(expected); 
    });

    it('should handle empty input', () => {
        const text = "";
        const expected = {
            nationalId: [],
            passports: [],
            drivingLicenses: [],
            taxIds: [],
            healthIds: [],
            otherDocuments: []
        };
        const result = identifySensitiveDocuments(text);
        expect(result).toEqual(expected);
    });

    it('should handle text with no sensitive data', () => {
        const text = "This text contains no sensitive information.";
        const expected = {
            nationalId: [],
            passports: [],
            drivingLicenses: [],
            taxIds: [],
            healthIds: [],
            otherDocuments: []
        };
        const result = identifySensitiveDocuments(text);
        expect(result).toEqual(expected);
    });

    it('should not identify valid documents', () => {
        const text = "CPF: 123.456.789-00, Passport: A123456, CNH: 123-ABCD, Tax ID: 12.345.678/9012-34, Health ID: 1234567890, Other Doc: X1234567";
        const expected = {
            drivingLicenses: [],
            nationalId: ['123.456.789-00', '12.345.678/9012-34'],
            passports: ['A123456', 'X1234567'],
            taxIds: ['12.345.678/9012-34'],
            healthIds: ['1234567890'],
            otherDocuments: []
        };
        const result = identifySensitiveDocuments(text);
        expect(result).toEqual(expected);
    });

    describe('identifyOtherDocuments', () => {
        it('should identify other documents', () => {
            const text = "My document is AB12345678 and another one is XYZ9876543210.";
            const expected = ["AB12345678", "XYZ9876543210"];
            const result = identifyOtherDocuments(text);
            expect(result).toEqual(expect.arrayContaining(expected));
            expect(result.length).toEqual(expected.length);
        });

        it('should handle empty input for other documents', () => {
            const text = "";
            const expected = [];
            const result = identifyOtherDocuments(text);
            expect(result).toEqual(expected);
        });

        it('should handle no other documents in text', () => {
            const text = "This text has no other documents.";
            const expected = [];
            const result = identifyOtherDocuments(text);
            expect(result).toEqual(expected);
        });
    });
});
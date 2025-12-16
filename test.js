const obfuscate = require('./src/obfuscate');

const sampleText = `
João Silva nasceu em 12/03/1990.
CPF: 123.456.789-09
Email: joao.silva@email.com
Telefone: (11) 91234-5678
Endereço: Rua das Flores, 123 - São Paulo
Senha: minhaSenhaSuperSecreta
`;

console.log(obfuscate(sampleText, { mode: 'anon' }).obfuscated)
console.log(obfuscate(sampleText, { mode: 'pseudo' }).obfuscated)
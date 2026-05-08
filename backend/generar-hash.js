const bcrypt = require('bcrypt');
const pass = '123456';
const hash = bcrypt.hashSync(pass, 10);
console.log('Hash generado:', hash);
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function createAdmin() {
  const passwordPlain = 'admin123'; // Cambia si quieres otra contraseña
  const hash = await bcrypt.hash(passwordPlain, 10);
  
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // tu contraseña de MySQL
    database: 'medisys'
  });
  
  // Verificar si ya existe un admin
  const [rows] = await connection.execute('SELECT id FROM user WHERE rol = ?', ['admin']);
  if (rows.length > 0) {
    console.log('Ya existe un administrador. No se creará otro.');
    await connection.end();
    return;
  }
  
  const [result] = await connection.execute(
    `INSERT INTO user 
     (nombre, apellidoPaterno, apellidoMaterno, ci, fechaNacimiento, sexo, direccion, telefono, login, pass, rol) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'Admin',
      'Principal',
      '',
      '0',
      '2000-01-01',
      'M',
      'Direccion Admin',
      '00000000',
      'admin',
      hash,
      'admin'
    ]
  );
  
  console.log('Usuario administrador creado con éxito');
  await connection.end();
}

createAdmin().catch(console.error);
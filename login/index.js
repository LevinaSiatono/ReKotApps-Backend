/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtCertificate = process.env.JWT_CERTIFICATE.toString();

const handleCompareHashPassword = async (plainPassword, hashPassword) => {
  const result = await bcrypt.compare(plainPassword, hashPassword);
  return result;
}

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const connection = mysql.createConnection({
    host: process.env.database_host.toString(),
    user: process.env.database_username.toString(),
    password: process.env.database_password.toString(),
    database: process.env.database.toString(),
  });

  connection.connect();

  connection.query(`select * from RekotUser where email = '${email}'`, async function (error, results, fields) {
    if (error) {
      res.send({
        success: false,
        error: JSON.stringify(error),
      })
    }
    try {
      const isPasswordValid = await handleCompareHashPassword(password, results[0].UserPassword);
      if(isPasswordValid) {
        const token = jwt.sign({ isSuccessLogin: true, data: { FullName: results[0].FullName, Email: results[0].Email, NIK: results[0].NIK } }, jwtCertificate);
        res.send({
          success: true,
          message: 'login success',
          token,
        });
      } else if(!isPasswordValid) {
        res.send({
          success: false,
          message: 'login failed',
        });
      }
    } catch (err) {
      res.send({
        success: false,
        error: JSON.stringify(err),
      });
    }
  });

  connection.end();
};

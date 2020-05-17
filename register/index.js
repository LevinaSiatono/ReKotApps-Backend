/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const mysql = require('mysql');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const fullName = req.body.fullName; //ktp fullname
  const NIK = req.body.NIK; //ktp nik
  const email = req.body.email;
  const password = req.body.password;

  const saltRounds = Number(process.env.salt_rounds);

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const connection = mysql.createConnection({
    host: process.env.database_host.toString(),
    user: process.env.database_username.toString(),
    password: process.env.database_password.toString(),
    database: process.env.database.toString(),
  });

  connection.connect();

  connection.query("INSERT INTO `RekotUser` (`NIK`, `FullName`, `Email`, `UserPassword`) VALUES" + `('${NIK}', '${fullName}', '${email}', '${passwordHash}');`, function (error, results, fields) {
    if (error) {
      res.send({
        success: false,
        error: JSON.stringify(error),
      })
    }
    res.send({
      success: true,
      data: results,
    });
  });

  connection.end();
};

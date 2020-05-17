/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const host = process.env.database_host.toString();
const user = process.env.database_username.toString();
const password = process.env.database_password.toString();
const database = process.env.database.toString();
const jwtCertificate = process.env.JWT_CERTIFICATE.toString();

const jwt = require('jsonwebtoken');
const mysql = require('mysql');

exports.submitReport = async (req, res) => {
  const token = req.body.token;
  const reportDescription = req.body.reportDescription;
  const reportCategory = req.body.reportCategory;

  const connection = mysql.createConnection({
    host,
    user,
    password,
    database,
  });

  try {
    const { isSuccessLogin, data } = await jwt.verify(token, jwtCertificate);
    if (isSuccessLogin) {
      const { NIK } = data;
      connection.connect();
      connection.query("INSERT INTO `RekotReports` (`ReportID`, `ReportCategory`, `ReportDescription`, `ReportAttachmentUrl`, `NIK`) VALUES " + `(NULL, '${reportCategory}', '${reportDescription}', 'https://google.com', '${NIK}');`, async function (error, results, fields) {
        if (error) {
          res.send({
            success: false,
            error: JSON.stringify(error),
          })
        }
        res.send({
          success: true,
          message: 'report submited',
        });
      });
      connection.end();
    }
  } catch (err) {
    res.send({
      success: false,
      error: JSON.stringify(err) || 'token failed',
    });
  }
};

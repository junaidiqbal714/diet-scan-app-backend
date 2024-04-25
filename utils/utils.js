const postmark = require("postmark");
const { v1: uuidv4 } = require("uuid");
const s3 = require("../config/s3_config");
const upload = require("../config/multer_config");
let admin = require("firebase-admin");
let serviceAccount = require("./dietscanapp-674b4-firebase-adminsdk-vd52m-13178e5bf1.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const CATCH_BAD_REQUEST = async (res, error) => {
  console.log(error);
  if (error.message) {
    res.status(400).json({
      message: error.message,
    });
  } else {
    res.status(400).send(error);
  }
};

const UPLOAD_FILE_ON_S3 = async (
  file,
  file_path,
  file_extension,
  content_type = "image/jpeg"
) => {
  const upload_promise = new Promise(async (resolve, reject) => {
    let path = file_path + uuidv4() + file_extension;
    upload.single("file");
    const s3Client = s3.s3Client;
    const params = s3.uploadParams;
    params.Key = path;
    params.Body = file.data;
    params.ContentType = content_type;
    try {
      const result = await s3Client.upload(params).promise();
      console.log("result: ", result);
    } catch (err) {
      console.log("err: ", err.message);
      reject(err.message);
    }
    resolve(path);
  });
  return upload_promise;
};

const DELETE_FILES_FROM_S3 = async (file_url) => {
  const delete_promise = new Promise(async (resolve, reject) => {
    const s3Client = s3.s3Client;
    let params = {
      Bucket: s3.uploadParams.Bucket,
      Key: file_url,
    };
    try {
      s3Client.deleteObject(params, function (err, data) {
        if (err) {
          reject(err.message);
        } else {
          console.log("File deleted from S3 successfully");
          resolve(file_url);
        }
      });
    } catch (err) {
      reject(err.message);
    }
  });
  return delete_promise;
};

const SEND_EMAIL_FROM_POSTMARK = async (send_to, subject, text) => {
  console.log("POSTMARK_API_KEY: ", process.env.POSTMARK_API_KEY);
  console.log("send_to: ", send_to);
  console.log("subject: ", subject);
  console.log("text: ", text);
  let client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

  const result = await client.sendEmail({
    From: "support@dietscan.online",
    To: send_to,
    Subject: subject,
    TextBody: text,
  });

  console.log("OTP sent successfully: ", result.MessageID);
};

module.exports = {
  CATCH_BAD_REQUEST,
  UPLOAD_FILE_ON_S3,
  DELETE_FILES_FROM_S3,
  SEND_EMAIL_FROM_POSTMARK,
};

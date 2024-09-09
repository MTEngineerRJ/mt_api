require("dotenv").config();

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const BUCKET = process.env.AWS_BUCKET_NAME;
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    bucket: BUCKET,
    s3: s3,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB (adjust as needed)
  },
});


upload.singleWithLogging = function (field) {
  return (req, res, next) => {
    upload.single(field)(req, res, (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return next(err);
      }
      console.log('File uploaded successfully:', req.file);
      next();
    });
  };
};


module.exports = upload
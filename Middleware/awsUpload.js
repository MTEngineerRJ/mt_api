const AWS = require('aws-sdk');
const { promisify } = require('util');

AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadToAWS = (yourImageData, name) => {
    // Decode the base64 image data
    const base64Data = yourImageData.replace(/^data:image\/\w+;base64,/, '');
    const decodedImage = Buffer.from(base64Data, 'base64');

    // Specify S3 bucket name and file name
    const bucketName = process.env.AWS_BUCKET_NAME;
    const fileName = name; // Include file extension

    // Configure the S3 parameters
    const params = {
        Bucket: "mydocsforcms",
        Key: fileName,
        Body: decodedImage,
        ContentType: 'image/jpeg', // Adjust content type based on your image format
        ACL: 'public-read', // Make the object publicly readable
    };

    // Wrap the upload operation in a Promise
    return new Promise((resolve, reject) => {
        const uploadToS3 = promisify(s3.upload.bind(s3));

        uploadToS3(params)
            .then(({ Location }) => {
                resolve(Location);
            })
            .catch((error) => {
                console.error('Error uploading image to S3:', error);
                reject(error); // Reject the Promise with the error
            });
    });
};

module.exports = uploadToAWS;

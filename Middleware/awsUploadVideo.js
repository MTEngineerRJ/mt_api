const AWS = require('aws-sdk');
const { promisify } = require('util');

AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadToAWSVideo = (yourVideoBase64Data, name) => {
    // Decode the base64 video data
    const buffer = Buffer.from(yourVideoBase64Data, 'base64');
    // Specify S3 bucket name and file name
    const bucketName = process.env.AWS_BUCKET_NAME;
    const fileName = name; // Include file extension, e.g., 'example.mp4'

    // Adjust content type based on your video format
    const contentType = 'video/webm'; // Change this to match your video format

    // Configure the S3 parameters
    const params = {
        Bucket: "mydocsforcms",
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read', // Make the object publicly readable
    };

    // Wrap the upload operation in a Promise
    const uploadToS3 = promisify(s3.upload.bind(s3));

    return uploadToS3(params)
        .then(({ Location }) => Location)
        .catch((error) => {
            console.error('Error uploading video to S3:', error);
            throw error; // Throw the error for the caller to handle
        });
};

module.exports = uploadToAWSVideo;

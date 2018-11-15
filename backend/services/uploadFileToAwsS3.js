import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

aws.config.update({
  accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
  secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
  region: process.env['AWS_REGION']
});

const awsS3 = new aws.S3();

const uploadFileToAwsS3 = multer({
  storage: multerS3({
    s3: awsS3,
    bucket: process.env['AWS_BUCKET_NAME'],
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    // we are making a timestamp of a current time and saving this file under this name.
    key: (req, file, cb) => {
      cb(null, Date.now().toString());
    }
  })
});

export default uploadFileToAwsS3;

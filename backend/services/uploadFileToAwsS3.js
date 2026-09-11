import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

const awsS3 = new S3Client({
  region: process.env['AWS_REGION'],
  credentials: {
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']
  }
});

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

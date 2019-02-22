import express from 'express';
const router = express.Router();

import uploadFileToAwsS3 from '~/services/uploadFileToAwsS3';

router.post('/upload', uploadFileToAwsS3.single('file'), (request, response) =>
  response.status(200).json({ url: request.file.location })
);

export default router;

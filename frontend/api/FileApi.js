import fetchWrapper from './services/fetchWrapper';

const upload = (dispatch, file) => {
  const formData = new FormData();
  // 'file' string can be anything, it just has to correspond to uploadFileToAwsS3.single('file')
  formData.append('file', file);

  return fetchWrapper(
    dispatch,
    fetch('/api/files/upload', {
      method: 'POST',
      body: formData
    })
  );
};

export default {
  upload
};

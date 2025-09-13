const uploadAvatar = (dispatch, file) => {
  const formData = new FormData();
  formData.append('file', file);

  // Return a promise that wraps the SPE pattern
  return new Promise((resolve, reject) => {
    dispatch({ status: 'request' });
    
    fetch('/api/files/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      return response.json();
    })
    .then(data => {
      dispatch({ status: 'success', payload: data });
      resolve(data.url);
    })
    .catch(error => {
      dispatch({ status: 'failure', payload: error.message });
      reject(error);
    });
  });
};

export default uploadAvatar;
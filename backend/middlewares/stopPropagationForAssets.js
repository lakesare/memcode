// https://github.com/jaredhanson/passport/issues/14#issuecomment-21863553
const stopPropagationForAssets = (req, res, next) => {
  if (req.url != '/favicon.ico' && req.url != '/styles.css') {
    return next();
  } else {
    res.status(200);
    res.header('Cache-Control', 'max-age=4294880896');
    res.end();
  }
}

export { stopPropagationForAssets };
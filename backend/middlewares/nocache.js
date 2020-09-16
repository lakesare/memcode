// See (https://github.com/vuejs-templates/pwa/issues/70#issuecomment-369494375)
const nocache = () => {
  return (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  };
};

export default nocache;

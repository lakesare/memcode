// Taken from http://www.senchalabs.org/connect/vhost.html
function vhost(hostname, server){
  if (!hostname) throw new Error('vhost hostname required');
  if (!server) throw new Error('vhost server required');
  var regexp = new RegExp('^' + hostname.replace(/[^*\w]/g, '\\$&').replace(/[*]/g, '(?:.*?)')  + '$', 'i');
  console.log('VHOST: Created vhost for hostname:', hostname, 'with regex:', regexp.toString());
  if (server.onvhost) server.onvhost(hostname);
  return function vhost(req, res, next){
    if (!req.headers.host) {
      console.log('VHOST: No host header, calling next()');
      return next();
    }
    var host = req.headers.host.split(':')[0];
    console.log('VHOST: Testing host:', host, 'against hostname:', hostname, 'regex:', regexp.toString());
    var matches = regexp.test(host);
    console.log('VHOST: Match result:', matches);
    if (!matches) {
      console.log('VHOST: No match, calling next()');
      return next();
    }
    console.log('VHOST: Match found! Routing to server');
    if ('function' == typeof server) return server(req, res, next);
    server.emit('request', req, res);
  };
};

export default vhost;

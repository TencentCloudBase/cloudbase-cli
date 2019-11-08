const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

module.exports = (url, options) => {
  const instanceOptions = {
    ...options
  };

  const proxy = process.env.http_proxy || process.env.HTTP_PROXY

  if (!options.agent && proxy) {
    instanceOptions.agent = new HttpsProxyAgent(proxy);
  }

  return fetch(url, instanceOptions);
};
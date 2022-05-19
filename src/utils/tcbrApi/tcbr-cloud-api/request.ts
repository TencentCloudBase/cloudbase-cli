import { URL } from 'url';
import _fetch, { RequestInit } from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';

export const nodeFetch = _fetch;

// 使用 fetch + 代理
export async function fetch(url: string, config: RequestInit = {}, proxy = '') {
  if (proxy) {
    config.agent = new HttpsProxyAgent(proxy);
  }

  // 解决中文编码问题
  const escapeUrl = new URL(url).toString();

  const res = await _fetch(escapeUrl, config);
  return res.json();
}

export async function fetchStream(url: string, config: RequestInit = {}, proxy = '') {
  if (proxy) {
    config.agent = new HttpsProxyAgent(proxy);
  }

  const escapeUrl = new URL(url).toString();

  return _fetch(escapeUrl, config);
}

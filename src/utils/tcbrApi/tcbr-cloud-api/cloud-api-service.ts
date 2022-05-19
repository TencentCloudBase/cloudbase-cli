import crypto from 'crypto';
import { URL } from 'url';
import QueryString from 'query-string';

import { fetch as _fetch, fetchStream as _fetchStream, nodeFetch as _nodeFetch } from './request';
import { CloudBaseError } from './error';

function isObject(x) {
  return typeof x === 'object' && !Array.isArray(x) && x !== null;
}

// 移除对象中的空值，防止调用云 API 失败
function deepRemoveVoid(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepRemoveVoid);
  } else if (isObject(obj)) {
    let result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (typeof value !== 'undefined' && value !== null) {
          result[key] = deepRemoveVoid(value);
        }
      }
    }
    return result;
  } else {
    return obj;
  }
}

type HexBase64Latin1Encoding = 'latin1' | 'hex' | 'base64';

function sha256(message: string, secret: string, encoding?: HexBase64Latin1Encoding) {
  const hmac = crypto.createHmac('sha256', secret);
  return hmac.update(message).digest(encoding);
}

function getHash(message: string): string {
  const hash = crypto.createHash('sha256');
  return hash.update(message).digest('hex');
}

function getDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const year = date.getUTCFullYear();
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
  // UTC 日期，非本地时间
  const day = ('0' + date.getUTCDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

const ServiceVersionMap = {
  tcb: '2018-06-08',
  scf: '2018-04-16',
  flexdb: '2018-11-27',
  cam: '2019-01-16',
  vpc: '2017-03-12',
  ssl: '2019-12-05',
  tcbr: '2022-02-17',
};

export interface ServiceOptions {
    service: string;
    version?: string;
    proxy?: string;
    timeout?: number;
    region?: string;
    baseParams?: Record<string, any>;
    credential?: Credential;
    getCredential?: () => Promise<Credential> | Credential;
}

export interface Credential {
    secretId: string;
    secretKey: string;
    token?: string;
    tokenExpired?: number;
}

export interface RequestOptions {
    action: string;
    data?: Record<string, any>;
    method?: 'POST' | 'GET';
    region?: string;
}

export const fetch = _fetch;
export const fetchStream = _fetchStream;
export const nodeFetch = _nodeFetch;

// token 将在 n 分钟内过期
const isTokenExpired = (credential: Credential, gap = 120) =>
  credential.tokenExpired && Number(credential.tokenExpired) < Date.now() + gap * 1000;

export class CloudApiService {
    // 缓存请求实例
    static serviceCacheMap: Record<string, CloudApiService> = {};

    static getInstance(options: ServiceOptions) {
      const { service } = options;
      if (CloudApiService.serviceCacheMap?.[service]) {
        return CloudApiService.serviceCacheMap[service];
      }
      const apiService = new CloudApiService(options);
      // 预防 serviceCacheMap 被置空导致的错误
      CloudApiService.serviceCacheMap = {
        ...CloudApiService.serviceCacheMap
      };
      CloudApiService.serviceCacheMap[service] = apiService;
      return apiService;
    }

    service: string;
    version: string;
    proxy: string;
    timeout: number;
    region: string;
    credential: Credential;
    baseParams: Record<string, any>;
    getCredential: () => Promise<Credential> | Credential;

    url: string;
    host: string;
    action: string;
    method: 'POST' | 'GET';
    data: Record<string, any>;
    payload: Record<string, any>;

    constructor(options: ServiceOptions) {
      if (!options) {
        throw new CloudBaseError('Options cloud not be empty!');
      }
      const {
        service,
        baseParams,
        version,
        proxy,
        region,
        credential,
        getCredential,
        timeout = 60000
      } = options;

      this.service = service;
      this.timeout = timeout;

      if (this.service === 'tcb' && process.env.CLOUDBASE_TCB_CLOUDAPI_PROXY) {
        this.proxy = process.env.CLOUDBASE_TCB_CLOUDAPI_PROXY;
      } else {
        this.proxy = proxy;
      }

      if (this.service === 'tcb' && process.env.CLOUDBASE_TCB_CLOUDAPI_REGION) {
        this.region = process.env.CLOUDBASE_TCB_CLOUDAPI_REGION;
      } else {
        this.region = region || process.env.TENCENTCLOUD_REGION || 'ap-shanghai';
      }

      this.credential = credential;
      this.baseParams = baseParams || {};
      this.getCredential = getCredential;
      this.version = ServiceVersionMap[service] || version;
    }

    get baseUrl() {
      const urlMap = {
        tcb: 'https://tcb.tencentcloudapi.com',
        flexdb: 'https://flexdb.tencentcloudapi.com',
        lowcode: `${process.env.CLOUDBASE_LOWCODE_ENDPOINT || 'https://lcap.cloud.tencent.com' }/api/v1/cliapi`,
        tcbr: 'https://tcbr.tencentcloudapi.com',
      };

      if (this.service === 'tcb' && process.env.CLOUDBASE_TCB_CLOUDAPI_HOST) {
        return `http://${process.env.CLOUDBASE_TCB_CLOUDAPI_HOST}`;
      }

      if (urlMap[this.service]) {
        return urlMap[this.service];
      } else {
        return `https://${this.service}.tencentcloudapi.com`;
      }
    }

    // overload
    async request(options: RequestOptions);
    async request(action: string, data?: Record<string, any>, method?: 'POST' | 'GET');

    async request(
      actionOrOptions: string | RequestOptions,
      assignData: Record<string, any> = {},
      assignMethod: 'POST' | 'GET' = 'POST'
    ) {
      // 增加 region 参数，兼容之前的入参形式
      let action;
      let data;
      let method;
      let region;
      if (typeof actionOrOptions === 'string') {
        action = actionOrOptions;
        data = assignData;
        method = assignMethod;
      } else {
        action = actionOrOptions?.action;
        data = actionOrOptions?.data || {};
        method = actionOrOptions?.method || 'POST';
        region = actionOrOptions?.region;
      }

      this.action = action;
      this.data = deepRemoveVoid({ ...data, ...this.baseParams });
      this.method = method;

      this.url = this.baseUrl;

      // 不存在密钥，或临时密钥过期
      if (!this.credential?.secretId || isTokenExpired(this.credential)) {
        if (!this.getCredential) {
          throw new CloudBaseError('You must provide credential info!');
        }

        if (typeof this.getCredential !== 'function') {
          throw new CloudBaseError('The getCredential option must be a function!');
        }

        const credential = await this.getCredential();

        if (!credential) {
          throw new CloudBaseError('Calling getCredential function get no credential info!');
        }
        this.credential = credential;
      }

      try {
        const data: Record<string, any> = await this.requestWithSign(region);
        if (data.Response.Error) {
          const tcError = new CloudBaseError(data.Response.Error.Message, {
            action,
            requestId: data.Response.RequestId,
            code: data.Response.Error.Code,
            original: data.Response.Error
          });
          throw tcError;
        } else {
          return data.Response;
        }
      } catch (e) {
        // throw e
        if (e.name === 'CloudBaseError') {
          throw e;
        } else {
          throw new CloudBaseError(e.message, {
            action,
            code: e.code,
            type: e.type
          });
        }
      }
    }

    async requestWithSign(region) {
      // data 中可能带有 readStream，由于需要计算整个 body 的 hash，
      // 所以这里把 readStream 转为 Buffer
      // await convertReadStreamToBuffer(data)
      const timestamp = Math.floor(Date.now() / 1000);

      const { method, timeout, data } = this;

      if (method === 'GET') {
        this.url += '?' + QueryString.stringify(data);
      }

      if (method === 'POST') {
        this.payload = data;
      }

      const { CLOUDBASE_TCB_CLOUDAPI_HOST } = process.env;

      if (this.service === 'tcb' && CLOUDBASE_TCB_CLOUDAPI_HOST) {
        this.host = CLOUDBASE_TCB_CLOUDAPI_HOST;
      } else {
        this.host = new URL(this.url).host;
      }

      const config: any = {
        method,
        timeout,
        headers: {
          Host: this.host,
          'X-TC-Action': this.action,
          'X-TC-Region': region || this.region,
          'X-TC-Timestamp': timestamp,
          'X-TC-Version': this.version
        }
      };

      if (this.credential.token) {
        config.headers['X-TC-Token'] = this.credential.token;
      }

      if (method === 'GET') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
      if (method === 'POST') {
        config.body = JSON.stringify(data);
        config.headers['Content-Type'] = 'application/json';
      }

      const sign = this.getRequestSign(timestamp);

      config.headers['Authorization'] = sign;
      return fetch(this.url, config, this.proxy);
    }

    getRequestSign(timestamp: number) {
      const { method, url, service } = this;
      const { secretId, secretKey } = this.credential;
      const urlObj = new URL(url);

      // 通用头部
      let headers = '';
      const signedHeaders = 'content-type;host';
      if (method === 'GET') {
        headers = 'content-type:application/x-www-form-urlencoded\n';
      }

      if (method === 'POST') {
        headers = 'content-type:application/json\n';
      }

      let path = urlObj.pathname;
      if (path === '/api/v1/cliapi' && service === 'lowcode') {
        path = '//lcap.cloud.tencent.com/api/v1/cliapi';
        headers += `host:lcap.cloud.tencent.com\n`;
      } else {
        headers += `host:${this.host}\n`;
      }

        
      const querystring = urlObj.search.slice(1);

      const payloadHash = this.payload ? getHash(JSON.stringify(this.payload)) : getHash('');

      const canonicalRequest = `${method}\n${path}\n${querystring}\n${headers}\n${signedHeaders}\n${payloadHash}`;

      const date = getDate(timestamp);

      const StringToSign = `TC3-HMAC-SHA256\n${timestamp}\n${date}/${service}/tc3_request\n${getHash(
        canonicalRequest
      )}`;

      const kDate = sha256(date, `TC3${secretKey}`);
      const kService = sha256(service, kDate);
      const kSigning = sha256('tc3_request', kService);
      const signature = sha256(StringToSign, kSigning, 'hex');

      return `TC3-HMAC-SHA256 Credential=${secretId}/${date}/${service}/tc3_request, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    }

    clearCredentialCache() {
      this.credential = null;
    }
}

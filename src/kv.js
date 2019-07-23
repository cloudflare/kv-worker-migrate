const fetch = require("node-fetch");
const utils = require("./utils");

const API_BASE_URL = "https://api.cloudflare.com/client/v4";

class Client {
  constructor(email, apiKey, acctTag) {
    this.email = email;
    this.apiKey = apiKey;
    this.acctTag = acctTag;
  }

  async getNamespaceIDByName(name) {
    const namespaces = await this.listNamespaces();
    for (let namespace of namespaces) {
      if (namespace.title === name) {
        return namespace.id;
      }
    }
    throw new Error(`namespace ${name} not found`);
  }

  async listNamespaces() {
    const url = `${API_BASE_URL}/accounts/${
      this.acctTag
    }/storage/kv/namespaces`;
    const resp = await this.requestJson(url, "GET");
    return resp.result;
  }

  async listKeys(namespace, cursor, limit = 1000) {
    let params = {
      limit: limit
    };
    if (cursor) {
      params["cursor"] = cursor;
    }
    const url = `${API_BASE_URL}/accounts/${
      this.acctTag
    }/storage/kv/namespaces/${namespace}/keys`;
    const resp = await this.requestJson(url, "GET", params);
    const keys = resp.result;
    const curs = resp.result_info.cursor;
    const count = resp.result_info.count;
    return {
      keys: keys,
      cursor: curs,
      count: count
    };
  }

  async request(url, method, params, headers, body) {
    if (params) {
      url = utils.addParams(url, params);
    }
    const defaultHeaders = {
      "X-Auth-Email": this.email,
      "X-Auth-Key": this.apiKey
    };
    let fetchOptions = {
      method: method,
      headers: defaultHeaders
    };

    if (headers) {
      Object.assign(fetchOptions.headers, headers);
    }
    if (body) {
      fetchOptions["body"] = body;
    }
    const resp = await fetch(url, fetchOptions);
    throwForStatus(resp, url, method);
    return resp;
  }

  async requestJson(url, method, params, headers, body) {
    const resp = await this.request(url, method, params, headers, body);
    const respData = await resp.json();

    if (respData.success) {
      return respData;
    } else {
      throw new CFError(respData.errors, respData.messages);
    }
  }
}

async function throwForStatus(resp, url, method) {
  if (resp.ok) {
    return;
  } else {
    let body;
    try {
      body = await resp.json();
      if ("errors" in body && "messages" in body) {
        throw new CFError(body.errors, body.messages);
      }
    } catch (ignore) {
      // we want to just fall through to throwing a HTTPError
    }
    try {
      body = await resp.text();
    } catch (e) {
      body = resp.statusText;
    }
    throw new HTTPError(resp.status, body, url, method);
  }
}

class CFError extends Error {
  constructor(errors, messages) {
    super(`Errors returned: ${errors}, messages: ${messages}`);
    this.errors = errors;
    this.messages = messages;
  }
}

class HTTPError extends Error {
  constructor(statusCode, body, requestUrl, requestMethod) {
    super(
      `${statusCode}: ${body}\nurl: ${requestUrl}\nmethod: ${requestMethod}`
    );
    this.statusCode = statusCode;
    this.body = body;
    this.requestUrl = requestUrl;
    this.requestMethod = requestMethod;
  }
}

module.exports = {
  Client: Client
};

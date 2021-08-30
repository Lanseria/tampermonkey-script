// ==UserScript==
// @name         Fetch test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://juejin.cn/*
// @icon         https://www.google.com/s2/favicons?domain=juejin.cn
// @grant        none
// ==/UserScript==
(() => {
  const originFetch = window.fetch;
  const recordListUrl = "author/recommend";
  // 拦截fetch请求
  Object.defineProperty(window, "fetch", {
    configurable: true,
    enumerable: true,
    get() {
      return function (url, options) {
        return originFetch(url, options).then(async (response) => {
          // 只处理指定的url
          if (url.includes(recordListUrl)) {
            if (response.clone) {
              const cloneRes = response.clone();
              const data = await cloneRes.json();
              return new Promise((resolve, reject) => {
                resolve({
                  json: () => {
                    return {
                      count: 99,
                      cursor: "20",
                      err_msg: "success",
                      err_no: 0,
                      has_more: true,
                      data: data.data,
                    };
                  },
                });
              });
            }
          }

          return response;
        });
      };
    },
  });
})();

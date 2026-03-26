"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/webextension-polyfill/dist/browser-polyfill.js
  var require_browser_polyfill = __commonJS({
    "node_modules/webextension-polyfill/dist/browser-polyfill.js"(exports, module) {
      (function(global, factory) {
        if (typeof define === "function" && define.amd) {
          define("webextension-polyfill", ["module"], factory);
        } else if (typeof exports !== "undefined") {
          factory(module);
        } else {
          var mod = {
            exports: {}
          };
          factory(mod);
          global.browser = mod.exports;
        }
      })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports, function(module2) {
        "use strict";
        if (!globalThis.chrome?.runtime?.id) {
          throw new Error("This script should only be loaded in a browser extension.");
        }
        if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
          const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
          const wrapAPIs = (extensionAPIs) => {
            const apiMetadata = {
              "alarms": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "clearAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "bookmarks": {
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getChildren": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getRecent": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getSubTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTree": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "browserAction": {
                "disable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "enable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "getBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "openPopup": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "browsingData": {
                "remove": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "removeCache": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCookies": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeDownloads": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFormData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeHistory": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeLocalStorage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePasswords": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePluginData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "settings": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "commands": {
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "contextMenus": {
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "cookies": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAllCookieStores": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "devtools": {
                "inspectedWindow": {
                  "eval": {
                    "minArgs": 1,
                    "maxArgs": 2,
                    "singleCallbackArg": false
                  }
                },
                "panels": {
                  "create": {
                    "minArgs": 3,
                    "maxArgs": 3,
                    "singleCallbackArg": true
                  },
                  "elements": {
                    "createSidebarPane": {
                      "minArgs": 1,
                      "maxArgs": 1
                    }
                  }
                }
              },
              "downloads": {
                "cancel": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "download": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "erase": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFileIcon": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "open": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "pause": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFile": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "resume": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "extension": {
                "isAllowedFileSchemeAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "isAllowedIncognitoAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "history": {
                "addUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "deleteRange": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getVisits": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "i18n": {
                "detectLanguage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAcceptLanguages": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "identity": {
                "launchWebAuthFlow": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "idle": {
                "queryState": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "management": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getSelf": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setEnabled": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "uninstallSelf": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "notifications": {
                "clear": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPermissionLevel": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "pageAction": {
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "hide": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "permissions": {
                "contains": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "request": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "runtime": {
                "getBackgroundPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPlatformInfo": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "openOptionsPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "requestUpdateCheck": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "sendMessage": {
                  "minArgs": 1,
                  "maxArgs": 3
                },
                "sendNativeMessage": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "setUninstallURL": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "sessions": {
                "getDevices": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getRecentlyClosed": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "restore": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "storage": {
                "local": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                },
                "managed": {
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  }
                },
                "sync": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              },
              "tabs": {
                "captureVisibleTab": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "detectLanguage": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "discard": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "duplicate": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "executeScript": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getZoom": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getZoomSettings": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goBack": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goForward": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "highlight": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "insertCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "query": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "reload": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "sendMessage": {
                  "minArgs": 2,
                  "maxArgs": 3
                },
                "setZoom": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "setZoomSettings": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "update": {
                  "minArgs": 1,
                  "maxArgs": 2
                }
              },
              "topSites": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "webNavigation": {
                "getAllFrames": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFrame": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "webRequest": {
                "handlerBehaviorChanged": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "windows": {
                "create": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getLastFocused": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              }
            };
            if (Object.keys(apiMetadata).length === 0) {
              throw new Error("api-metadata.json has not been included in browser-polyfill");
            }
            class DefaultWeakMap extends WeakMap {
              constructor(createItem, items = void 0) {
                super(items);
                this.createItem = createItem;
              }
              get(key) {
                if (!this.has(key)) {
                  this.set(key, this.createItem(key));
                }
                return super.get(key);
              }
            }
            const isThenable = (value) => {
              return value && typeof value === "object" && typeof value.then === "function";
            };
            const makeCallback = (promise, metadata) => {
              return (...callbackArgs) => {
                if (extensionAPIs.runtime.lastError) {
                  promise.reject(new Error(extensionAPIs.runtime.lastError.message));
                } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                  promise.resolve(callbackArgs[0]);
                } else {
                  promise.resolve(callbackArgs);
                }
              };
            };
            const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
            const wrapAsyncFunction = (name, metadata) => {
              return function asyncFunctionWrapper(target, ...args) {
                if (args.length < metadata.minArgs) {
                  throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
                }
                if (args.length > metadata.maxArgs) {
                  throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
                }
                return new Promise((resolve, reject) => {
                  if (metadata.fallbackToNoCallback) {
                    try {
                      target[name](...args, makeCallback({
                        resolve,
                        reject
                      }, metadata));
                    } catch (cbError) {
                      console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                      target[name](...args);
                      metadata.fallbackToNoCallback = false;
                      metadata.noCallback = true;
                      resolve();
                    }
                  } else if (metadata.noCallback) {
                    target[name](...args);
                    resolve();
                  } else {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  }
                });
              };
            };
            const wrapMethod = (target, method, wrapper) => {
              return new Proxy(method, {
                apply(targetMethod, thisObj, args) {
                  return wrapper.call(thisObj, target, ...args);
                }
              });
            };
            let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
            const wrapObject = (target, wrappers = {}, metadata = {}) => {
              let cache = /* @__PURE__ */ Object.create(null);
              let handlers = {
                has(proxyTarget2, prop) {
                  return prop in target || prop in cache;
                },
                get(proxyTarget2, prop, receiver) {
                  if (prop in cache) {
                    return cache[prop];
                  }
                  if (!(prop in target)) {
                    return void 0;
                  }
                  let value = target[prop];
                  if (typeof value === "function") {
                    if (typeof wrappers[prop] === "function") {
                      value = wrapMethod(target, target[prop], wrappers[prop]);
                    } else if (hasOwnProperty(metadata, prop)) {
                      let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                      value = wrapMethod(target, target[prop], wrapper);
                    } else {
                      value = value.bind(target);
                    }
                  } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                    value = wrapObject(value, wrappers[prop], metadata[prop]);
                  } else if (hasOwnProperty(metadata, "*")) {
                    value = wrapObject(value, wrappers[prop], metadata["*"]);
                  } else {
                    Object.defineProperty(cache, prop, {
                      configurable: true,
                      enumerable: true,
                      get() {
                        return target[prop];
                      },
                      set(value2) {
                        target[prop] = value2;
                      }
                    });
                    return value;
                  }
                  cache[prop] = value;
                  return value;
                },
                set(proxyTarget2, prop, value, receiver) {
                  if (prop in cache) {
                    cache[prop] = value;
                  } else {
                    target[prop] = value;
                  }
                  return true;
                },
                defineProperty(proxyTarget2, prop, desc) {
                  return Reflect.defineProperty(cache, prop, desc);
                },
                deleteProperty(proxyTarget2, prop) {
                  return Reflect.deleteProperty(cache, prop);
                }
              };
              let proxyTarget = Object.create(target);
              return new Proxy(proxyTarget, handlers);
            };
            const wrapEvent = (wrapperMap) => ({
              addListener(target, listener, ...args) {
                target.addListener(wrapperMap.get(listener), ...args);
              },
              hasListener(target, listener) {
                return target.hasListener(wrapperMap.get(listener));
              },
              removeListener(target, listener) {
                target.removeListener(wrapperMap.get(listener));
              }
            });
            const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onRequestFinished(req) {
                const wrappedReq = wrapObject(
                  req,
                  {},
                  {
                    getContent: {
                      minArgs: 0,
                      maxArgs: 0
                    }
                  }
                );
                listener(wrappedReq);
              };
            });
            const onMessageWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onMessage(message, sender, sendResponse) {
                let didCallSendResponse = false;
                let wrappedSendResponse;
                let sendResponsePromise = new Promise((resolve) => {
                  wrappedSendResponse = function(response) {
                    didCallSendResponse = true;
                    resolve(response);
                  };
                });
                let result;
                try {
                  result = listener(message, sender, wrappedSendResponse);
                } catch (err) {
                  result = Promise.reject(err);
                }
                const isResultThenable = result !== true && isThenable(result);
                if (result !== true && !isResultThenable && !didCallSendResponse) {
                  return false;
                }
                const sendPromisedResult = (promise) => {
                  promise.then((msg) => {
                    sendResponse(msg);
                  }, (error) => {
                    let message2;
                    if (error && (error instanceof Error || typeof error.message === "string")) {
                      message2 = error.message;
                    } else {
                      message2 = "An unexpected error occurred";
                    }
                    sendResponse({
                      __mozWebExtensionPolyfillReject__: true,
                      message: message2
                    });
                  }).catch((err) => {
                    console.error("Failed to send onMessage rejected reply", err);
                  });
                };
                if (isResultThenable) {
                  sendPromisedResult(result);
                } else {
                  sendPromisedResult(sendResponsePromise);
                }
                return true;
              };
            });
            const wrappedSendMessageCallback = ({
              reject,
              resolve
            }, reply) => {
              if (extensionAPIs.runtime.lastError) {
                if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                  resolve();
                } else {
                  reject(new Error(extensionAPIs.runtime.lastError.message));
                }
              } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
                reject(new Error(reply.message));
              } else {
                resolve(reply);
              }
            };
            const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                const wrappedCb = wrappedSendMessageCallback.bind(null, {
                  resolve,
                  reject
                });
                args.push(wrappedCb);
                apiNamespaceObj.sendMessage(...args);
              });
            };
            const staticWrappers = {
              devtools: {
                network: {
                  onRequestFinished: wrapEvent(onRequestFinishedWrappers)
                }
              },
              runtime: {
                onMessage: wrapEvent(onMessageWrappers),
                onMessageExternal: wrapEvent(onMessageWrappers),
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 1,
                  maxArgs: 3
                })
              },
              tabs: {
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 2,
                  maxArgs: 3
                })
              }
            };
            const settingMetadata = {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            };
            apiMetadata.privacy = {
              network: {
                "*": settingMetadata
              },
              services: {
                "*": settingMetadata
              },
              websites: {
                "*": settingMetadata
              }
            };
            return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
          };
          module2.exports = wrapAPIs(chrome);
        } else {
          module2.exports = globalThis.browser;
        }
      });
    }
  });

  // src/options.ts
  var import_webextension_polyfill2 = __toESM(require_browser_polyfill());

  // src/filters.ts
  var import_webextension_polyfill = __toESM(require_browser_polyfill());
  var BUILTIN_RULES = [
    // Opera
    { id: "opera-pinboard", label: "Pinboard", source: "Opera", type: "folderName", pattern: "pinboard", enabledByDefault: true },
    { id: "opera-speeddials", label: "Speed Dials", source: "Opera", type: "folderName", pattern: "speed dials", enabledByDefault: true },
    { id: "opera-trash", label: "Kosz", source: "Opera", type: "folderName", pattern: "kosz", enabledByDefault: true },
    { id: "opera-trash-en", label: "Trash", source: "Opera", type: "folderName", pattern: "trash", enabledByDefault: true },
    { id: "opera-unsorted", label: "Nieuporz\u0105dkowane", source: "Opera", type: "folderName", pattern: "nieuporz\u0105dkowane", enabledByDefault: true },
    { id: "opera-unsorted2", label: "Unsynchronized Pinboard", source: "Opera", type: "folderName", pattern: "unsynchronized pinboard", enabledByDefault: true },
    { id: "opera-urls", label: "opera:// adresy", source: "Opera", type: "urlPrefix", pattern: "opera:", enabledByDefault: true },
    // Firefox
    { id: "firefox-mobile", label: "Zak\u0142adki na kom\xF3rce", source: "Firefox", type: "folderName", pattern: "zak\u0142adki na kom\xF3rce", enabledByDefault: true },
    { id: "firefox-mobile2", label: "Zak\u0142adki z telefonu", source: "Firefox", type: "folderName", pattern: "zak\u0142adki z telefonu", enabledByDefault: true },
    { id: "firefox-mobile-en", label: "Mobile Bookmarks", source: "Firefox", type: "folderName", pattern: "mobile bookmarks", enabledByDefault: true },
    { id: "firefox-about", label: "about:// adresy", source: "Firefox", type: "urlPrefix", pattern: "about:", enabledByDefault: true },
    { id: "firefox-moz", label: "moz-extension:// adresy", source: "Firefox", type: "urlPrefix", pattern: "moz-extension:", enabledByDefault: true },
    // Chrome / Edge / Brave
    { id: "chrome-urls", label: "chrome:// adresy", source: "Chrome", type: "urlPrefix", pattern: "chrome:", enabledByDefault: true },
    { id: "edge-urls", label: "edge:// adresy", source: "Edge", type: "urlPrefix", pattern: "edge:", enabledByDefault: true },
    { id: "brave-urls", label: "brave:// adresy", source: "Brave", type: "urlPrefix", pattern: "brave:", enabledByDefault: true },
    { id: "chrome-other", label: "Inne zak\u0142adki", source: "Chrome", type: "folderName", pattern: "inne zak\u0142adki", enabledByDefault: true },
    { id: "chrome-other-en", label: "Other bookmarks", source: "Chrome", type: "folderName", pattern: "other bookmarks", enabledByDefault: true },
    { id: "edge-other", label: "Inne ulubione", source: "Edge", type: "folderName", pattern: "inne ulubione", enabledByDefault: true },
    { id: "edge-other-en", label: "Other favorites", source: "Edge", type: "folderName", pattern: "other favorites", enabledByDefault: true },
    // Vivaldi
    { id: "vivaldi-urls", label: "vivaldi:// adresy", source: "Vivaldi", type: "urlPrefix", pattern: "vivaldi:", enabledByDefault: true }
  ];
  function defaultFilterConfig() {
    const builtinEnabled = {};
    for (const rule of BUILTIN_RULES) {
      builtinEnabled[rule.id] = rule.enabledByDefault;
    }
    return { builtinEnabled, manualExclusions: [] };
  }
  async function loadFilterConfig() {
    const data = await import_webextension_polyfill.default.storage.local.get("filterConfig");
    if (data.filterConfig)
      return data.filterConfig;
    return defaultFilterConfig();
  }
  async function saveFilterConfig(config) {
    await import_webextension_polyfill.default.storage.local.set({ filterConfig: config });
  }

  // src/types.ts
  var DEFAULT_PORT = 51062;

  // src/options.ts
  var filterConfig = defaultFilterConfig();
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`page-${page}`).classList.add("active");
    });
  });
  function showStatus(msg, type) {
    const bar = document.getElementById("status-bar");
    bar.textContent = msg;
    bar.className = `status-bar status-bar--${type} show`;
    setTimeout(() => bar.classList.remove("show"), 3e3);
  }
  function renderBuiltinRules() {
    const container = document.getElementById("builtin-rules-list");
    container.innerHTML = "";
    const groups = /* @__PURE__ */ new Map();
    for (const rule of BUILTIN_RULES) {
      if (!groups.has(rule.source))
        groups.set(rule.source, []);
      groups.get(rule.source).push(rule);
    }
    for (const [source, rules] of groups) {
      const groupEl = document.createElement("div");
      groupEl.style.cssText = "margin-bottom:4px";
      const header = document.createElement("div");
      header.style.cssText = "font-size:11px;color:var(--muted);margin:10px 0 4px;font-weight:600;text-transform:uppercase;letter-spacing:.06em";
      header.textContent = source;
      groupEl.appendChild(header);
      for (const rule of rules) {
        const isEnabled = filterConfig.builtinEnabled[rule.id] !== false;
        const row = document.createElement("div");
        row.className = "toggle-row";
        row.innerHTML = `
        <div class="toggle-info">
          <div class="toggle-label">${rule.label}</div>
          <div class="toggle-sub">${rule.type === "folderName" ? "\u{1F4C1} Folder" : "\u{1F517} Prefix URL"}: <code>${rule.pattern}</code></div>
        </div>
        <label class="toggle">
          <input type="checkbox" data-rule-id="${rule.id}" ${isEnabled ? "checked" : ""} />
          <span class="toggle-slider"></span>
        </label>`;
        groupEl.appendChild(row);
      }
      container.appendChild(groupEl);
    }
    container.querySelectorAll("input[data-rule-id]").forEach((input) => {
      input.addEventListener("change", (e) => {
        const id = e.target.dataset.ruleId;
        const checked = e.target.checked;
        filterConfig.builtinEnabled[id] = checked;
      });
    });
  }
  function renderManualExclusions() {
    const list = document.getElementById("manual-excl-list");
    list.innerHTML = "";
    if (filterConfig.manualExclusions.length === 0) {
      list.innerHTML = '<div class="empty">Brak r\u0119cznych wyklucze\u0144</div>';
      return;
    }
    for (const excl of filterConfig.manualExclusions) {
      const icon = excl.type === "folder" ? "\u{1F4C1}" : excl.type === "urlPattern" ? "\u{1F524}" : "\u{1F517}";
      const typeLabel = excl.type === "folder" ? "Folder" : excl.type === "urlPattern" ? "Wzorzec URL" : "URL";
      const item = document.createElement("div");
      item.className = "excl-item";
      item.innerHTML = `
      <span class="excl-icon">${icon}</span>
      <div class="excl-info">
        <div class="excl-label">${escapeHtml(excl.label)}</div>
        <div class="excl-type">${typeLabel}</div>
      </div>
      <button class="excl-remove" data-excl-id="${excl.id}" title="Usu\u0144">\u{1F5D1}</button>`;
      list.appendChild(item);
    }
    list.querySelectorAll(".excl-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.exclId;
        filterConfig.manualExclusions = filterConfig.manualExclusions.filter((ex) => ex.id !== id);
        renderManualExclusions();
      });
    });
  }
  document.getElementById("btn-add-url").addEventListener("click", () => {
    const input = document.getElementById("excl-url-input");
    const value = input.value.trim();
    if (!value)
      return;
    addManualExclusion({ id: crypto.randomUUID(), type: "url", value, label: value });
    input.value = "";
  });
  document.getElementById("btn-add-pattern").addEventListener("click", () => {
    const input = document.getElementById("excl-url-input");
    const value = input.value.trim();
    if (!value)
      return;
    addManualExclusion({ id: crypto.randomUUID(), type: "urlPattern", value, label: value });
    input.value = "";
  });
  function addManualExclusion(excl) {
    if (filterConfig.manualExclusions.some((e) => e.value === excl.value && e.type === excl.type))
      return;
    filterConfig.manualExclusions.push(excl);
    renderManualExclusions();
  }
  document.getElementById("btn-open-tree").addEventListener("click", async () => {
    const modal = document.getElementById("tree-modal");
    modal.style.display = "flex";
    const container = document.getElementById("tree-container");
    container.innerHTML = '<div style="color:var(--muted);padding:20px">\u0141adowanie...</div>';
    const resp = await import_webextension_polyfill2.default.runtime.sendMessage({ type: "GET_BOOKMARKS_TREE" });
    if (!resp.success) {
      container.innerHTML = '<div style="color:var(--err)">B\u0142\u0105d wczytywania zak\u0142adek</div>';
      return;
    }
    container.innerHTML = "";
    for (const root of resp.tree) {
      renderTreeNode(root, container, 0);
    }
  });
  document.getElementById("btn-close-tree").addEventListener("click", () => {
    document.getElementById("tree-modal").style.display = "none";
  });
  function renderTreeNode(node, parent, depth) {
    const isFolder = !node.url;
    const hasChildren = node.children && node.children.length > 0;
    const nodeEl = document.createElement("div");
    nodeEl.className = "tree-node";
    const row = document.createElement("div");
    row.className = "tree-row";
    const toggleEl = document.createElement("span");
    toggleEl.className = "tree-toggle";
    toggleEl.textContent = hasChildren ? "\u25B6" : "";
    const iconEl = document.createElement("span");
    iconEl.className = "tree-icon";
    iconEl.textContent = isFolder ? "\u{1F4C1}" : "\u{1F516}";
    const labelEl = document.createElement("span");
    labelEl.className = "tree-label";
    labelEl.textContent = node.title || "(bez nazwy)";
    if (!isFolder && node.url) {
      const urlEl = document.createElement("span");
      urlEl.className = "tree-url";
      urlEl.textContent = node.url;
      row.appendChild(toggleEl);
      row.appendChild(iconEl);
      row.appendChild(labelEl);
      row.appendChild(urlEl);
    } else {
      row.appendChild(toggleEl);
      row.appendChild(iconEl);
      row.appendChild(labelEl);
    }
    const addBtn = document.createElement("button");
    addBtn.className = "tree-add-btn";
    addBtn.textContent = "+ Wyklucz";
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addManualExclusion({
        id: crypto.randomUUID(),
        type: "folder",
        value: node.id,
        label: node.title || node.url || "(bez nazwy)"
      });
      addBtn.textContent = "\u2713 Dodano";
      addBtn.style.color = "var(--ok)";
      setTimeout(() => {
        addBtn.textContent = "+ Wyklucz";
        addBtn.style.color = "";
      }, 2e3);
    });
    row.appendChild(addBtn);
    nodeEl.appendChild(row);
    if (hasChildren) {
      const childrenEl = document.createElement("div");
      childrenEl.className = "tree-children collapsed";
      toggleEl.addEventListener("click", (e) => {
        e.stopPropagation();
        const collapsed = childrenEl.classList.toggle("collapsed");
        toggleEl.textContent = collapsed ? "\u25B6" : "\u25BC";
      });
      row.addEventListener("click", () => {
        const collapsed = childrenEl.classList.toggle("collapsed");
        toggleEl.textContent = collapsed ? "\u25B6" : "\u25BC";
      });
      for (const child of node.children) {
        renderTreeNode(child, childrenEl, depth + 1);
      }
      nodeEl.appendChild(childrenEl);
    }
    parent.appendChild(nodeEl);
  }
  document.getElementById("btn-save-filters").addEventListener("click", async () => {
    await saveFilterConfig(filterConfig);
    showStatus("\u2713 Filtry zapisane", "success");
  });
  document.getElementById("btn-test-conn").addEventListener("click", async () => {
    const port = parseInt(document.getElementById("conn-port").value);
    const status = document.getElementById("conn-status");
    status.textContent = "Testuj\u0119...";
    try {
      const resp = await fetch(`http://localhost:${port}/status`, { signal: AbortSignal.timeout(2e3) });
      const data = await resp.json();
      status.textContent = data.success ? "\u{1F7E2} Po\u0142\u0105czono z hostem" : "\u{1F534} Host odpowiedzia\u0142 b\u0142\u0119dem";
      status.style.color = data.success ? "var(--ok)" : "var(--err)";
    } catch {
      status.textContent = "\u{1F534} Brak po\u0142\u0105czenia z hostem";
      status.style.color = "var(--err)";
    }
  });
  document.getElementById("btn-save-conn").addEventListener("click", async () => {
    const port = parseInt(document.getElementById("conn-port").value);
    await import_webextension_polyfill2.default.storage.local.set({ hostPort: port });
    showStatus("\u2713 Zapisano", "success");
  });
  document.getElementById("btn-save-hist-cfg").addEventListener("click", async () => {
    const maxFiles = parseInt(document.getElementById("hist-max-files").value);
    await import_webextension_polyfill2.default.storage.local.set({ histMaxFiles: maxFiles });
    showStatus("\u2713 Zapisano", "success");
  });
  async function init() {
    filterConfig = await loadFilterConfig();
    renderBuiltinRules();
    renderManualExclusions();
    const data = await import_webextension_polyfill2.default.storage.local.get(["hostPort", "histMaxFiles"]);
    document.getElementById("conn-port").value = String(data.hostPort ?? DEFAULT_PORT);
    document.getElementById("hist-max-files").value = String(data.histMaxFiles ?? 50);
  }
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  document.addEventListener("DOMContentLoaded", init);
})();

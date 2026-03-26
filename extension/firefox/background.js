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

  // src/background.ts
  var import_webextension_polyfill2 = __toESM(require_browser_polyfill());

  // src/types.ts
  var DEFAULT_SCHEDULE = {
    mode: "manual",
    intervalMinutes: 5,
    syncOnStartup: true,
    autoSyncMode: "full_sync"
  };
  var ALARM_NAME = "bookmark-sync-scheduled";
  var DEFAULT_PORT = 51062;

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
  function filterBookmarkTree(node, config, excludedFolderIds) {
    if (excludedFolderIds.has(node.id))
      return null;
    if (node.url) {
      if (isUrlExcluded(node.url, config))
        return null;
      if (isManuallyExcluded(node.url, node.id, config))
        return null;
      return node;
    }
    if (isFolderExcluded(node.title, config))
      return null;
    if (node.children) {
      const filteredChildren = node.children.map((child) => filterBookmarkTree(child, config, excludedFolderIds)).filter((child) => child !== null);
      return { ...node, children: filteredChildren };
    }
    return node;
  }
  function isFolderExcluded(title, config) {
    const lower = title.toLowerCase().trim();
    for (const rule of BUILTIN_RULES) {
      if (rule.type === "folderName" && config.builtinEnabled[rule.id] !== false && lower === rule.pattern) {
        return true;
      }
    }
    return false;
  }
  function isUrlExcluded(url, config) {
    const lower = url.toLowerCase();
    for (const rule of BUILTIN_RULES) {
      if (rule.type === "urlPrefix" && config.builtinEnabled[rule.id] !== false && lower.startsWith(rule.pattern)) {
        return true;
      }
    }
    return false;
  }
  function isManuallyExcluded(url, id, config) {
    for (const excl of config.manualExclusions) {
      if (excl.type === "url" && excl.value === url)
        return true;
      if (excl.type === "folder" && excl.value === id)
        return true;
      if (excl.type === "urlPattern" && matchesPattern(url, excl.value))
        return true;
    }
    return false;
  }
  function matchesPattern(url, pattern) {
    const regex = new RegExp(
      "^" + pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$",
      "i"
    );
    return regex.test(url);
  }
  function getExcludedFolderIds(config) {
    const ids = /* @__PURE__ */ new Set();
    for (const excl of config.manualExclusions) {
      if (excl.type === "folder")
        ids.add(excl.value);
    }
    return ids;
  }

  // src/background.ts
  var POLL_ALARM = "bookmark-sync-poll";
  var DEBOUNCE_MS = 5e3;
  var debounceTimer = null;
  var isImporting = false;
  async function getInstanceId() {
    const data = await import_webextension_polyfill2.default.storage.local.get("instanceId");
    if (data.instanceId)
      return data.instanceId;
    const id = crypto.randomUUID();
    await import_webextension_polyfill2.default.storage.local.set({ instanceId: id });
    return id;
  }
  async function getSettings() {
    const data = await import_webextension_polyfill2.default.storage.local.get([
      "syncDirectory",
      "hostPort",
      "instanceId",
      "lastSaveTime",
      "lastSaveCount",
      "schedule",
      "lastSyncTime"
    ]);
    return {
      syncDirectory: data.syncDirectory ?? "",
      hostPort: data.hostPort ?? DEFAULT_PORT,
      instanceId: data.instanceId ?? await getInstanceId(),
      lastSaveTime: data.lastSaveTime,
      lastSaveCount: data.lastSaveCount,
      lastSyncTime: data.lastSyncTime,
      schedule: data.schedule ?? DEFAULT_SCHEDULE
    };
  }
  function getBrowserName() {
    return navigator.userAgent.includes("Firefox") ? "Firefox" : "Chrome";
  }
  async function pingHost(port, instanceId) {
    try {
      const resp = await fetch(`http://localhost:${port}/ping`, {
        method: "GET",
        headers: { "X-Instance-Id": instanceId, "X-Browser": getBrowserName() },
        signal: AbortSignal.timeout(3e3)
      });
      const data = await resp.json();
      if (data.success)
        return "ok";
      if (data.error === "PENDING_APPROVAL")
        return "pending";
      if (data.error === "NO_PROFILES")
        return "no_profiles";
      return "not_allowed";
    } catch {
      return "no_host";
    }
  }
  async function getCloudLastModified(port, instanceId) {
    try {
      const resp = await fetch(`http://localhost:${port}/status`, {
        headers: { "X-Instance-Id": instanceId },
        signal: AbortSignal.timeout(3e3)
      });
      const raw = await resp.json();
      if (!raw.success)
        return null;
      if (raw.path) {
        try {
          const parsed = JSON.parse(raw.path);
          return parsed.lastModified ?? null;
        } catch {
        }
      }
      return raw.lastModified ?? null;
    } catch {
      return null;
    }
  }
  function drawIcon(state) {
    const size = 128;
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#7c6af7";
    ctx.beginPath();
    ctx.roundRect(4, 4, size - 8, size - 8, 20);
    ctx.fill();
    const colors = {
      green: "#50fa7b",
      yellow: "#f1fa8c",
      red: "#ff5555",
      gray: "#aaaaaa"
    };
    ctx.fillStyle = colors[state];
    ctx.font = `bold ${size * 0.65}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("B", size / 2, size / 2 + 4);
    return ctx.getImageData(0, 0, size, size);
  }
  async function setIconState(state) {
    try {
      const imageData = drawIcon(state);
      await import_webextension_polyfill2.default.action.setIcon({ imageData });
    } catch {
    }
  }
  function convertTree(nodes) {
    const specialMap = {
      "root________": "root",
      "toolbar_____": "toolbar",
      "menu________": "menu",
      "unfiled_____": "unsorted",
      "mobile______": "mobile",
      "0": "root",
      "1": "toolbar",
      "2": "unsorted",
      "3": "mobile"
    };
    return nodes.map((node) => {
      const result = {
        id: node.id,
        title: node.title ?? "",
        dateAdded: node.dateAdded,
        dateModified: node.dateGroupModified ?? node.dateModified
      };
      if (specialMap[node.id])
        result.specialFolder = specialMap[node.id];
      if (node.url)
        result.url = node.url;
      if (node.children?.length)
        result.children = convertTree(node.children);
      return result;
    });
  }
  function countBookmarks(nodes) {
    return nodes.reduce((acc, n) => {
      if (n.url)
        acc++;
      if (n.children)
        acc += countBookmarks(n.children);
      return acc;
    }, 0);
  }
  async function saveBookmarks() {
    const settings = await getSettings();
    const instanceId = settings.instanceId || await getInstanceId();
    const port = settings.hostPort || DEFAULT_PORT;
    const pingResult = await pingHost(port, instanceId);
    if (pingResult === "no_host") {
      await setIconState("red");
      return { success: false, error: "NO_HOST" };
    }
    if (pingResult === "no_profiles") {
      await setIconState("yellow");
      return { success: false, error: "NO_PROFILES" };
    }
    if (pingResult === "pending")
      return { success: false, error: "PENDING_APPROVAL" };
    if (pingResult === "not_allowed")
      return { success: false, error: "NOT_ALLOWED" };
    try {
      const tree = await import_webextension_polyfill2.default.bookmarks.getTree();
      const converted = convertTree(tree);
      const root = converted[0];
      const filterConfig = await loadFilterConfig();
      const excludedFolderIds = getExcludedFolderIds(filterConfig);
      const filtered = filterBookmarkTree(root, filterConfig, excludedFolderIds);
      if (!filtered)
        return { success: false, error: "ALL_FILTERED" };
      const count = countBookmarks(filtered.children ?? []);
      const resp = await fetch(`http://localhost:${port}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Instance-Id": instanceId,
          "X-Browser": getBrowserName()
        },
        body: JSON.stringify({
          bookmarks: filtered,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          browser: getBrowserName(),
          instanceId
        }),
        signal: AbortSignal.timeout(15e3)
      });
      const data = await resp.json();
      if (data.success) {
        const now = (/* @__PURE__ */ new Date()).toISOString();
        await import_webextension_polyfill2.default.storage.local.set({
          lastSaveTime: now,
          lastSyncTime: now,
          lastSaveCount: count
        });
        await setIconState("green");
        return { success: true, count, path: data.path };
      }
      return { success: false, error: data.error ?? "Unknown" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        await setIconState("red");
        return { success: false, error: "NO_HOST" };
      }
      return { success: false, error: msg };
    }
  }
  async function importBookmarks(mode, historyFile) {
    const settings = await getSettings();
    const instanceId = settings.instanceId || await getInstanceId();
    const port = settings.hostPort || DEFAULT_PORT;
    const pingResult = await pingHost(port, instanceId);
    if (pingResult === "no_host")
      return { success: false, error: "NO_HOST" };
    if (pingResult === "pending")
      return { success: false, error: "PENDING_APPROVAL" };
    if (pingResult === "not_allowed")
      return { success: false, error: "NOT_ALLOWED" };
    try {
      const url = historyFile ? `http://localhost:${port}/history/get?file=${encodeURIComponent(historyFile)}` : `http://localhost:${port}/import`;
      const resp = await fetch(url, {
        method: "GET",
        headers: { "X-Instance-Id": instanceId, "X-Browser": getBrowserName() },
        signal: AbortSignal.timeout(15e3)
      });
      const data = await resp.json();
      if (!data.success)
        return { success: false, error: data.error ?? "B\u0142\u0105d serwera" };
      if (!data.path)
        return { success: false, error: "Brak danych z serwera" };
      let bookmarksFile;
      try {
        bookmarksFile = JSON.parse(data.path);
      } catch (e) {
        return { success: false, error: "B\u0142\u0105d parsowania danych" };
      }
      isImporting = true;
      try {
        if (mode === "replace") {
          await importReplace(bookmarksFile.bookmarks);
        } else {
          await importMerge(bookmarksFile.bookmarks, settings.lastSyncTime, bookmarksFile.index);
        }
      } finally {
        isImporting = false;
      }
      const now = (/* @__PURE__ */ new Date()).toISOString();
      await import_webextension_polyfill2.default.storage.local.set({ lastSyncTime: now });
      await setIconState("green");
      return { success: true };
    } catch (err) {
      isImporting = false;
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }
  async function importReplace(cloudRoot) {
    const localTree = await import_webextension_polyfill2.default.bookmarks.getTree();
    for (const rootNode of localTree) {
      for (const child of rootNode.children ?? []) {
        for (const item of child.children ?? []) {
          await removeBookmarkTree(item.id);
        }
      }
    }
    await importNode(cloudRoot, void 0);
  }
  async function importMerge(cloudRoot, lastSyncTime, cloudIndex) {
    const localTree = await import_webextension_polyfill2.default.bookmarks.getTree();
    const localFlat = flattenLocalTree(localTree);
    const cloudFlat = /* @__PURE__ */ new Map();
    flattenCloudTree(cloudRoot, cloudFlat);
    for (const [url, node] of cloudFlat) {
      if (!localFlat.has(url)) {
        const folderPath = cloudIndex ? Object.values(cloudIndex).find((e) => e.url === url)?.folder ?? "" : "";
        await addBookmarkToFolder(node, folderPath, localTree);
      }
    }
  }
  async function importFullSync(cloudRoot, cloudIndex) {
    const localTree = await import_webextension_polyfill2.default.bookmarks.getTree();
    const localFlat = flattenLocalTree(localTree);
    const cloudFlat = /* @__PURE__ */ new Map();
    flattenCloudTree(cloudRoot, cloudFlat);
    for (const [url, node] of cloudFlat) {
      if (!localFlat.has(url)) {
        const folderPath = cloudIndex ? Object.values(cloudIndex).find((e) => e.url === url)?.folder ?? "" : "";
        await addBookmarkToFolder(node, folderPath, localTree);
      }
    }
    for (const [url, localNode] of localFlat) {
      if (!cloudFlat.has(url)) {
        try {
          await import_webextension_polyfill2.default.bookmarks.remove(localNode.id);
        } catch {
        }
      }
    }
  }
  async function autoSyncFromCloud() {
    if (isImporting)
      return;
    const settings = await getSettings();
    const instanceId = settings.instanceId || await getInstanceId();
    const port = settings.hostPort || DEFAULT_PORT;
    const pingResult = await pingHost(port, instanceId);
    if (pingResult !== "ok") {
      if (pingResult === "no_host")
        await setIconState("red");
      return;
    }
    const cloudLastModified = await getCloudLastModified(port, instanceId);
    if (!cloudLastModified)
      return;
    const lastSync = settings.lastSyncTime ? new Date(settings.lastSyncTime).getTime() : 0;
    const cloudTime = new Date(cloudLastModified).getTime();
    if (cloudTime <= lastSync) {
      await setIconState("green");
      return;
    }
    await setIconState("yellow");
    try {
      const resp = await fetch(`http://localhost:${port}/import`, {
        headers: { "X-Instance-Id": instanceId, "X-Browser": getBrowserName() },
        signal: AbortSignal.timeout(15e3)
      });
      const data = await resp.json();
      if (!data.success || !data.path)
        return;
      const bookmarksFile = JSON.parse(data.path);
      isImporting = true;
      try {
        const autoMode = settings.schedule.autoSyncMode ?? "full_sync";
        if (autoMode === "full_sync") {
          await importFullSync(bookmarksFile.bookmarks, bookmarksFile.index);
        } else {
          await importMerge(bookmarksFile.bookmarks, settings.lastSyncTime, bookmarksFile.index);
        }
      } finally {
        isImporting = false;
      }
      await import_webextension_polyfill2.default.storage.local.set({ lastSyncTime: (/* @__PURE__ */ new Date()).toISOString() });
      await setIconState("green");
    } catch {
      isImporting = false;
    }
  }
  function scheduleBookmarkSave() {
    if (isImporting)
      return;
    if (debounceTimer)
      clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      debounceTimer = null;
      await saveBookmarks();
    }, DEBOUNCE_MS);
  }
  import_webextension_polyfill2.default.bookmarks.onCreated.addListener(() => scheduleBookmarkSave());
  import_webextension_polyfill2.default.bookmarks.onRemoved.addListener(() => scheduleBookmarkSave());
  import_webextension_polyfill2.default.bookmarks.onChanged.addListener(() => scheduleBookmarkSave());
  import_webextension_polyfill2.default.bookmarks.onMoved.addListener(() => scheduleBookmarkSave());
  var ICON_ALARM = "bookmark-sync-icon";
  import_webextension_polyfill2.default.alarms.create(ICON_ALARM, { periodInMinutes: 0.5 });
  import_webextension_polyfill2.default.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === ICON_ALARM) {
      const settings = await getSettings();
      const instanceId = settings.instanceId || await getInstanceId();
      const port = settings.hostPort || DEFAULT_PORT;
      const ping = await pingHost(port, instanceId);
      if (ping === "no_host")
        await setIconState("red");
      else if (ping === "ok") {
        const cloudModified = await getCloudLastModified(port, instanceId);
        const lastSync = settings.lastSyncTime ? new Date(settings.lastSyncTime).getTime() : 0;
        const cloudTime = cloudModified ? new Date(cloudModified).getTime() : 0;
        if (cloudTime > lastSync)
          await setIconState("yellow");
        else
          await setIconState("green");
      }
    }
  });
  async function applySchedule(schedule) {
    await import_webextension_polyfill2.default.alarms.clear(ALARM_NAME);
    await import_webextension_polyfill2.default.alarms.clear(POLL_ALARM);
    if (schedule.mode === "scheduled" && schedule.intervalMinutes > 0) {
      import_webextension_polyfill2.default.alarms.create(POLL_ALARM, {
        delayInMinutes: schedule.intervalMinutes,
        periodInMinutes: schedule.intervalMinutes
      });
    }
  }
  import_webextension_polyfill2.default.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === POLL_ALARM) {
      await autoSyncFromCloud();
    }
  });
  import_webextension_polyfill2.default.runtime.onStartup.addListener(async () => {
    const settings = await getSettings();
    const instanceId = settings.instanceId || await getInstanceId();
    const port = settings.hostPort || DEFAULT_PORT;
    await applySchedule(settings.schedule);
    const pingResult = await pingHost(port, instanceId);
    if (pingResult === "no_host") {
      await setIconState("red");
    } else {
      await autoSyncFromCloud();
    }
  });
  import_webextension_polyfill2.default.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason === "install") {
      await import_webextension_polyfill2.default.storage.local.set({
        schedule: DEFAULT_SCHEDULE,
        hostPort: DEFAULT_PORT,
        instanceId: crypto.randomUUID()
      });
    }
    const settings = await getSettings();
    await applySchedule(settings.schedule);
    await setIconState("gray");
  });
  async function importNode(node, parentId) {
    if (node.specialFolder === "root") {
      for (const child of node.children ?? [])
        await importNode(child, void 0);
      return;
    }
    if (node.url) {
      const localTree = await import_webextension_polyfill2.default.bookmarks.getTree();
      const target = findSpecialFolder(localTree, "toolbar") ?? localTree[0]?.children?.[0];
      if (target) {
        try {
          await import_webextension_polyfill2.default.bookmarks.create({ parentId: parentId ?? target.id, title: node.title, url: node.url });
        } catch {
        }
      }
    } else if (node.specialFolder === "toolbar" || node.specialFolder === "menu" || node.specialFolder === "unsorted") {
      const localTree = await import_webextension_polyfill2.default.bookmarks.getTree();
      const target = findSpecialFolder(localTree, node.specialFolder);
      if (target) {
        for (const child of node.children ?? [])
          await importSubtree(child, target.id);
      }
    } else {
      if (isBrowserSpecificFolder(node.title))
        return;
      const localTree = await import_webextension_polyfill2.default.bookmarks.getTree();
      const toolbar = findSpecialFolder(localTree, "toolbar");
      if (toolbar) {
        const folder = await import_webextension_polyfill2.default.bookmarks.create({ parentId: parentId ?? toolbar.id, title: node.title });
        for (const child of node.children ?? [])
          await importSubtree(child, folder.id);
      }
    }
  }
  async function importSubtree(node, parentId) {
    if (isBrowserSpecificFolder(node.title))
      return;
    if (node.url) {
      try {
        await import_webextension_polyfill2.default.bookmarks.create({ parentId, title: node.title, url: node.url });
      } catch {
      }
    } else {
      try {
        const folder = await import_webextension_polyfill2.default.bookmarks.create({ parentId, title: node.title });
        for (const child of node.children ?? [])
          await importSubtree(child, folder.id);
      } catch {
      }
    }
  }
  async function addBookmarkToFolder(node, folderPath, localTree) {
    if (!node.url)
      return;
    try {
      const parts = folderPath ? folderPath.split(" > ") : [];
      let parentId;
      if (parts.length > 0) {
        const rootName = parts[0].toLowerCase();
        if (rootName.includes("pasek") || rootName.includes("toolbar")) {
          parentId = findSpecialFolder(localTree, "toolbar")?.id;
        } else if (rootName.includes("menu")) {
          parentId = findSpecialFolder(localTree, "menu")?.id;
        } else if (rootName.includes("pozosta") || rootName.includes("other") || rootName.includes("unfiled")) {
          parentId = findSpecialFolder(localTree, "unsorted")?.id;
        }
      }
      if (!parentId) {
        parentId = findSpecialFolder(localTree, "toolbar")?.id ?? findSpecialFolder(localTree, "unsorted")?.id;
      }
      if (!parentId)
        return;
      for (let i = 1; i < parts.length; i++) {
        parentId = await findOrCreateFolder(parentId, parts[i]);
      }
      await import_webextension_polyfill2.default.bookmarks.create({ parentId, title: node.title, url: node.url });
    } catch {
      await addBookmarkToUnsorted(node);
    }
  }
  async function findOrCreateFolder(parentId, name) {
    const children = await import_webextension_polyfill2.default.bookmarks.getChildren(parentId);
    const existing = children.find((c) => !c.url && c.title === name);
    if (existing)
      return existing.id;
    const newFolder = await import_webextension_polyfill2.default.bookmarks.create({ parentId, title: name });
    return newFolder.id;
  }
  async function addBookmarkToUnsorted(node) {
    const localTree = await import_webextension_polyfill2.default.bookmarks.getTree();
    const unsorted = findSpecialFolder(localTree, "unsorted");
    if (unsorted && node.url) {
      try {
        await import_webextension_polyfill2.default.bookmarks.create({ parentId: unsorted.id, title: node.title, url: node.url });
      } catch {
      }
    }
  }
  async function removeBookmarkTree(id) {
    try {
      await import_webextension_polyfill2.default.bookmarks.removeTree(id);
    } catch {
      try {
        await import_webextension_polyfill2.default.bookmarks.remove(id);
      } catch {
      }
    }
  }
  function findSpecialFolder(tree, type) {
    const ids = {
      toolbar: ["1", "toolbar_____"],
      menu: ["2", "menu________"],
      unsorted: ["3", "unfiled_____", "2"]
    };
    const targetIds = ids[type] ?? [];
    for (const root of tree) {
      for (const child of root.children ?? []) {
        if (targetIds.includes(child.id))
          return child;
      }
    }
    for (const root of tree) {
      for (const child of root.children ?? []) {
        if (type === "toolbar" && child.title.toLowerCase().includes("pasek"))
          return child;
        if (type === "unsorted" && (child.title.toLowerCase().includes("pozosta") || child.title.toLowerCase().includes("other")))
          return child;
      }
    }
    return void 0;
  }
  function isBrowserSpecificFolder(title) {
    const SKIP = /* @__PURE__ */ new Set([
      "pinboard",
      "speed dials",
      "kosz",
      "trash",
      "nieuporz\u0105dkowane",
      "unsynchronized pinboard",
      "mobile bookmarks",
      "zak\u0142adki na kom\xF3rce",
      "zak\u0142adki z telefonu"
    ]);
    return SKIP.has(title.toLowerCase().trim());
  }
  function flattenLocalTree(tree) {
    const map = /* @__PURE__ */ new Map();
    function walk(node) {
      if (node.url)
        map.set(node.url, node);
      for (const child of node.children ?? [])
        walk(child);
    }
    for (const root of tree)
      walk(root);
    return map;
  }
  function flattenCloudTree(node, map) {
    if (node.url)
      map.set(node.url, node);
    for (const child of node.children ?? [])
      flattenCloudTree(child, map);
  }
  import_webextension_polyfill2.default.runtime.onMessage.addListener((rawMsg, _sender, sendResponse) => {
    const message = rawMsg;
    if (message.type === "SAVE_BOOKMARKS") {
      saveBookmarks().then(sendResponse).catch((err) => sendResponse({ success: false, error: String(err) }));
      return true;
    }
    if (message.type === "IMPORT_BOOKMARKS") {
      const mode = message.mode;
      if (mode === "full_sync") {
        (async () => {
          const settings = await getSettings();
          const instanceId = settings.instanceId || await getInstanceId();
          const port = settings.hostPort || DEFAULT_PORT;
          const pingResult = await pingHost(port, instanceId);
          if (pingResult !== "ok") {
            sendResponse({ success: false, error: "NO_HOST" });
            return;
          }
          try {
            const resp = await fetch(`http://localhost:${port}/import`, {
              headers: { "X-Instance-Id": instanceId, "X-Browser": getBrowserName() },
              signal: AbortSignal.timeout(15e3)
            });
            const data = await resp.json();
            if (!data.success || !data.path) {
              sendResponse({ success: false, error: "NO_DATA" });
              return;
            }
            const bookmarksFile = JSON.parse(data.path);
            isImporting = true;
            try {
              await importFullSync(bookmarksFile.bookmarks, bookmarksFile.index);
            } finally {
              isImporting = false;
            }
            await import_webextension_polyfill2.default.storage.local.set({ lastSyncTime: (/* @__PURE__ */ new Date()).toISOString() });
            await setIconState("green");
            sendResponse({ success: true });
          } catch (e) {
            isImporting = false;
            sendResponse({ success: false, error: String(e) });
          }
        })();
      } else {
        importBookmarks(message.mode, message.historyFile).then(sendResponse).catch((err) => sendResponse({ success: false, error: String(err) }));
      }
      return true;
    }
    if (message.type === "UPDATE_SETTINGS") {
      import_webextension_polyfill2.default.storage.local.set(message.settings).then(async () => {
        if (message.settings.schedule)
          await applySchedule(message.settings.schedule);
        const alarm = await import_webextension_polyfill2.default.alarms.get(POLL_ALARM);
        sendResponse({ success: true, nextAlarmTime: alarm?.scheduledTime });
      }).catch((err) => sendResponse({ success: false, error: String(err) }));
      return true;
    }
    if (message.type === "GET_STATUS") {
      Promise.all([
        import_webextension_polyfill2.default.storage.local.get(["lastSaveTime", "lastSaveCount", "schedule", "hostPort", "instanceId"]),
        import_webextension_polyfill2.default.alarms.get(POLL_ALARM)
      ]).then(async ([data, alarm]) => {
        const port = data.hostPort ?? DEFAULT_PORT;
        const instanceId = data.instanceId ?? await getInstanceId();
        const ping = await pingHost(port, instanceId);
        if (ping === "no_host")
          await setIconState("red");
        else if (ping === "ok")
          await setIconState("green");
        const response = {
          lastSaveTime: data.lastSaveTime,
          lastSaveCount: data.lastSaveCount,
          schedule: data.schedule ?? DEFAULT_SCHEDULE,
          nextAlarmTime: alarm?.scheduledTime,
          hostReachable: ping === "ok" || ping === "pending"
        };
        sendResponse(response);
      }).catch((err) => sendResponse({ error: String(err) }));
      return true;
    }
    if (message.type === "GET_BOOKMARKS_TREE") {
      import_webextension_polyfill2.default.bookmarks.getTree().then((tree) => {
        sendResponse({ success: true, tree });
      }).catch((err) => sendResponse({ success: false, error: String(err) }));
      return true;
    }
    if (message.type === "REFRESH_FAVICONS") {
      const opts = message;
      refreshFavicons(opts.concurrency ?? 5, opts.timeoutMs ?? 1e4).then((result) => sendResponse(result)).catch((err) => sendResponse({ success: false, error: String(err) }));
      return true;
    }
    if (message.type === "CANCEL_FAVICON_REFRESH") {
      faviconRefreshCancelled = true;
      sendResponse({ success: true });
      return true;
    }
    if (message.type === "GET_FAVICON_STATUS") {
      sendResponse(faviconStatus);
      return true;
    }
  });
  var faviconRefreshCancelled = false;
  var faviconStatus = { running: false, done: 0, total: 0, current: "" };
  async function refreshFavicons(concurrency, timeoutMs) {
    faviconRefreshCancelled = false;
    faviconStatus = { running: true, done: 0, total: 0, current: "" };
    const tree = await import_webextension_polyfill2.default.bookmarks.getTree();
    const urls = [];
    function collect(nodes) {
      for (const n of nodes) {
        if (n.url && (n.url.startsWith("http://") || n.url.startsWith("https://"))) {
          urls.push(n.url);
        }
        if (n.children)
          collect(n.children);
      }
    }
    collect(tree);
    faviconStatus.total = urls.length;
    const chunks = [];
    for (let i = 0; i < urls.length; i += concurrency) {
      chunks.push(urls.slice(i, i + concurrency));
    }
    for (const chunk of chunks) {
      if (faviconRefreshCancelled)
        break;
      await Promise.all(chunk.map((url) => loadTabAndClose(url, timeoutMs)));
      faviconStatus.done += chunk.length;
    }
    faviconStatus.running = false;
    return { success: true, done: faviconStatus.done, total: faviconStatus.total };
  }
  async function loadTabAndClose(url, timeoutMs) {
    let tabId;
    try {
      faviconStatus.current = url;
      const tab = await import_webextension_polyfill2.default.tabs.create({ url, active: false });
      tabId = tab.id;
      await Promise.race([
        waitForTabLoad(tabId),
        new Promise((resolve) => setTimeout(resolve, timeoutMs))
      ]);
    } catch {
    } finally {
      if (tabId !== void 0) {
        try {
          await import_webextension_polyfill2.default.tabs.remove(tabId);
        } catch {
        }
      }
    }
  }
  function waitForTabLoad(tabId) {
    return new Promise((resolve) => {
      function listener(id, info) {
        if (id === tabId && info.status === "complete") {
          import_webextension_polyfill2.default.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      }
      import_webextension_polyfill2.default.tabs.onUpdated.addListener(listener);
    });
  }
})();

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

  // src/popup.ts
  var import_webextension_polyfill2 = __toESM(require_browser_polyfill());

  // src/types.ts
  var DEFAULT_SCHEDULE = {
    mode: "manual",
    intervalMinutes: 5,
    syncOnStartup: true,
    autoSyncMode: "full_sync"
  };
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

  // src/popup.ts
  var i18n = (key, ...subs) => import_webextension_polyfill2.default.i18n.getMessage(key, subs) || key;
  var $ = (id) => document.getElementById(id);
  var portInput = $("port");
  var saveSettingsBtn = $("save-settings");
  var saveNowBtn = $("save-now");
  var importMergeBtn = $("import-merge");
  var importReplaceBtn = $("import-replace");
  var statusEl = $("status");
  var hostIndicator = $("host-indicator");
  var lastSaveEl = $("last-save");
  var countEl = $("bookmarks-count");
  var nextSaveEl = $("next-save");
  var modeManualRadio = $("mode-manual");
  var modeScheduledRadio = $("mode-scheduled");
  var schedulePanel = $("schedule-panel");
  var intervalRange = $("interval-range");
  var intervalVal = $("interval-val");
  var startupCheckbox = $("sync-startup");
  var autoFullRadio = $("auto-full");
  var importSyncBtn = $("import-sync");
  var syncDot = $("sync-dot");
  var syncStatusText = $("sync-status-text");
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      $(`tab-${tab}`).classList.add("active");
      if (tab === "history")
        loadHistory();
    });
  });
  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = `status status--${type}`;
    if (type === "success" || type === "error")
      setTimeout(() => {
        statusEl.className = "status status--idle";
        statusEl.textContent = "";
      }, 5e3);
  }
  function setSyncStatus(state, text) {
    syncDot.className = `sync-status-dot ${state}`;
    syncStatusText.textContent = text;
    const colors = { green: "var(--ok)", yellow: "var(--warn)", red: "var(--err)", gray: "var(--muted)" };
    syncStatusText.style.color = colors[state];
  }
  function setAllButtons(disabled) {
    [saveNowBtn, importMergeBtn, importReplaceBtn, importSyncBtn, saveSettingsBtn].forEach((b) => b.disabled = disabled);
  }
  function toggleSchedulePanel(show) {
    schedulePanel.style.display = show ? "block" : "none";
  }
  function formatNextAlarm(ts) {
    if (!ts)
      return "";
    const diff = ts - Date.now();
    if (diff <= 0)
      return "za chwil\u0119";
    const mins = Math.floor(diff / 6e4);
    const h = Math.floor(mins / 60), m = mins % 60;
    return `za ${h > 0 ? `${h}h ${m}min` : `${mins} min`}`;
  }
  intervalRange.addEventListener("input", () => {
    intervalVal.textContent = `${intervalRange.value} min`;
  });
  async function refresh() {
    const s = await import_webextension_polyfill2.default.runtime.sendMessage({ type: "GET_STATUS" });
    if (s.hostReachable) {
      hostIndicator.textContent = "\u{1F7E2}";
      hostIndicator.title = "Host dzia\u0142a";
    } else {
      hostIndicator.textContent = "\u{1F534}";
      hostIndicator.title = "Host nie dzia\u0142a";
    }
    if (!s.hostReachable) {
      setSyncStatus("red", "Brak po\u0142\u0105czenia z hostem");
    } else if (s.schedule?.mode === "scheduled") {
      setSyncStatus("green", `Automatyczna sync aktywna \xB7 nast\u0119pna ${formatNextAlarm(s.nextAlarmTime)}`);
    } else {
      setSyncStatus("gray", "Synchronizacja r\u0119czna");
    }
    lastSaveEl.textContent = s.lastSaveTime ? `Ostatni zapis: ${new Date(s.lastSaveTime).toLocaleString()}` : "Jeszcze nie zapisywano";
    if (s.lastSaveCount !== void 0)
      countEl.textContent = `Zak\u0142adek: ${s.lastSaveCount}`;
    if (s.schedule?.mode === "scheduled" && s.nextAlarmTime) {
      nextSaveEl.textContent = `Nast\u0119pna sync: ${formatNextAlarm(s.nextAlarmTime)}`;
      nextSaveEl.style.display = "block";
    } else {
      nextSaveEl.style.display = "none";
    }
    const sc = s.schedule ?? DEFAULT_SCHEDULE;
    (sc.mode === "scheduled" ? modeScheduledRadio : modeManualRadio).checked = true;
    toggleSchedulePanel(sc.mode === "scheduled");
    intervalRange.value = String(sc.intervalMinutes);
    intervalVal.textContent = `${sc.intervalMinutes} min`;
    startupCheckbox.checked = sc.syncOnStartup;
    if (sc.autoSyncMode === "add_missing") {
      $("auto-add").checked = true;
    } else {
      autoFullRadio.checked = true;
    }
  }
  async function loadPort() {
    const data = await import_webextension_polyfill2.default.storage.local.get("hostPort");
    portInput.value = String(data.hostPort ?? DEFAULT_PORT);
  }
  modeManualRadio.addEventListener("change", () => toggleSchedulePanel(false));
  modeScheduledRadio.addEventListener("change", () => toggleSchedulePanel(true));
  saveSettingsBtn.addEventListener("click", async () => {
    const port = parseInt(portInput.value, 10) || DEFAULT_PORT;
    const mode = modeScheduledRadio.checked ? "scheduled" : "manual";
    const schedule = {
      mode,
      intervalMinutes: parseInt(intervalRange.value, 10),
      syncOnStartup: startupCheckbox.checked,
      autoSyncMode: autoFullRadio.checked ? "full_sync" : "add_missing"
    };
    const r = await import_webextension_polyfill2.default.runtime.sendMessage({
      type: "UPDATE_SETTINGS",
      settings: { hostPort: port, schedule }
    });
    if (r?.success) {
      showStatus("\u2713 Ustawienia zapisane", "success");
      await refresh();
    } else
      showStatus(`\u2717 B\u0142\u0105d: ${r?.error}`, "error");
  });
  saveNowBtn.addEventListener("click", async () => {
    setAllButtons(true);
    showStatus("Wysy\u0142am...", "saving");
    try {
      const r = await import_webextension_polyfill2.default.runtime.sendMessage({ type: "SAVE_BOOKMARKS" });
      if (r.success) {
        showStatus("\u2713 Wys\u0142ano pomy\u015Blnie", "success");
        countEl.textContent = `Zak\u0142adek: ${r.count ?? 0}`;
        lastSaveEl.textContent = `Ostatni zapis: ${(/* @__PURE__ */ new Date()).toLocaleString()}`;
        setSyncStatus("green", "Zsynchronizowano");
      } else {
        showStatus(r.error === "NO_HOST" ? "\u2717 Host nie dzia\u0142a" : `\u2717 B\u0142\u0105d: ${r.error ?? "nieznany"}`, "error");
      }
    } catch (e) {
      showStatus(`\u2717 B\u0142\u0105d: ${String(e)}`, "error");
    } finally {
      setAllButtons(false);
    }
  });
  importMergeBtn.addEventListener("click", async () => {
    setAllButtons(true);
    showStatus("Dodaj\u0119 brakuj\u0105ce...", "info");
    try {
      const r = await import_webextension_polyfill2.default.runtime.sendMessage({ type: "IMPORT_BOOKMARKS", mode: "merge" });
      if (!r) {
        showStatus("\u2717 Brak odpowiedzi", "error");
        return;
      }
      showStatus(r.success ? "\u2713 Dodano brakuj\u0105ce zak\u0142adki" : r.error === "NO_HOST" ? "\u2717 Host nie dzia\u0142a" : `\u2717 B\u0142\u0105d: ${r.error ?? "nieznany"}`, r.success ? "success" : "error");
    } catch (e) {
      showStatus(`\u2717 B\u0142\u0105d: ${String(e)}`, "error");
    } finally {
      setAllButtons(false);
    }
  });
  importReplaceBtn.addEventListener("click", async () => {
    if (!confirm("Zast\u0105pi\u0107 WSZYSTKIE lokalne zak\u0142adki zak\u0142adkami z chmury?\nTej operacji nie mo\u017Cna cofn\u0105\u0107!"))
      return;
    setAllButtons(true);
    showStatus("Importuj\u0119...", "info");
    try {
      const r = await import_webextension_polyfill2.default.runtime.sendMessage({ type: "IMPORT_BOOKMARKS", mode: "replace" });
      if (!r) {
        showStatus("\u2717 Brak odpowiedzi", "error");
        return;
      }
      showStatus(r.success ? "\u2713 Zaimportowano pomy\u015Blnie" : r.error === "NO_HOST" ? "\u2717 Host nie dzia\u0142a" : `\u2717 B\u0142\u0105d: ${r.error ?? "nieznany"}`, r.success ? "success" : "error");
    } catch (e) {
      showStatus(`\u2717 B\u0142\u0105d: ${String(e)}`, "error");
    } finally {
      setAllButtons(false);
    }
  });
  var historyData = [];
  var selectedEntry = null;
  async function getPort() {
    const data = await import_webextension_polyfill2.default.storage.local.get("hostPort");
    return data.hostPort ?? DEFAULT_PORT;
  }
  async function getInstanceId() {
    const data = await import_webextension_polyfill2.default.storage.local.get("instanceId");
    return data.instanceId ?? "";
  }
  async function loadHistory() {
    const list = $("history-list");
    list.innerHTML = '<div style="color:var(--muted);padding:12px;font-size:12px">\u0141adowanie...</div>';
    hideHistoryActions();
    try {
      const port = await getPort();
      const instanceId = await getInstanceId();
      const resp = await fetch(`http://localhost:${port}/history/list`, {
        headers: { "X-Instance-Id": instanceId, "X-Browser": "popup" },
        signal: AbortSignal.timeout(3e3)
      });
      const raw = await resp.json();
      if (!raw.success) {
        list.innerHTML = `<div style="color:var(--err);padding:12px">B\u0142\u0105d: ${raw.error ?? "brak danych"}</div>`;
        return;
      }
      let entries = [];
      if (raw.path) {
        try {
          const parsed = JSON.parse(raw.path);
          entries = Array.isArray(parsed) ? parsed : parsed.entries ?? [];
        } catch {
          entries = [];
        }
      }
      if (entries.length === 0) {
        list.innerHTML = '<div style="color:var(--muted);padding:12px;font-size:12px">Brak plik\xF3w historii</div>';
        return;
      }
      historyData = entries;
      renderHistoryList();
    } catch {
      list.innerHTML = '<div style="color:var(--err);padding:12px;font-size:12px">Brak po\u0142\u0105czenia z hostem</div>';
    }
  }
  function renderHistoryList() {
    const list = $("history-list");
    list.innerHTML = "";
    for (const entry of historyData) {
      const date = new Date(entry.timestamp);
      const item = document.createElement("div");
      item.className = "history-item";
      item.innerHTML = `
      <div class="history-date">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div>
      <div class="history-meta">${entry.browser} \xB7 ${entry.count} zak\u0142. \xB7 ${entry.sizeKb} KB</div>`;
      item.addEventListener("click", () => {
        document.querySelectorAll(".history-item").forEach((i) => i.classList.remove("selected"));
        item.classList.add("selected");
        selectedEntry = entry;
        showHistoryActions(entry);
      });
      list.appendChild(item);
    }
  }
  function showHistoryActions(entry) {
    $("history-actions").style.display = "block";
    const date = new Date(entry.timestamp);
    $("history-selected-info").textContent = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} \xB7 ${entry.browser} \xB7 ${entry.count} zak\u0142adek`;
  }
  function hideHistoryActions() {
    $("history-actions").style.display = "none";
    selectedEntry = null;
  }
  $("btn-history-import").addEventListener("click", async () => {
    if (!selectedEntry)
      return;
    if (!confirm(`Zast\u0105pi\u0107 zak\u0142adki w przegl\u0105darce kopi\u0105 z ${new Date(selectedEntry.timestamp).toLocaleString()}?`))
      return;
    const r = await import_webextension_polyfill2.default.runtime.sendMessage({
      type: "IMPORT_BOOKMARKS",
      mode: "replace",
      historyFile: selectedEntry.filename
    });
    const histStatus = $("status-history");
    histStatus.textContent = r.success ? "\u2713 Zaimportowano" : `\u2717 B\u0142\u0105d: ${r.error}`;
    histStatus.className = `status status--${r.success ? "success" : "error"}`;
  });
  $("btn-history-restore").addEventListener("click", async () => {
    if (!selectedEntry)
      return;
    if (!confirm("Przywr\xF3ci\u0107 t\u0119 kopi\u0119 jako aktualn\u0105 i zast\u0105pi\u0107 bookmarks.json?\n\nAktualna wersja zostanie zapisana w historii."))
      return;
    try {
      const port = await getPort();
      const instanceId = await getInstanceId();
      const resp = await fetch(`http://localhost:${port}/history/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Instance-Id": instanceId },
        body: JSON.stringify({ filename: selectedEntry.filename }),
        signal: AbortSignal.timeout(5e3)
      });
      const data = await resp.json();
      const histStatus = $("status-history");
      if (data.success) {
        histStatus.textContent = "\u2713 Przywr\xF3cono. Mo\u017Cesz teraz zaimportowa\u0107 do przegl\u0105darki.";
        histStatus.className = "status status--success";
        await loadHistory();
      } else {
        histStatus.textContent = `\u2717 B\u0142\u0105d: ${data.error}`;
        histStatus.className = "status status--error";
      }
    } catch {
      const histStatus = $("status-history");
      histStatus.textContent = "\u2717 Brak po\u0142\u0105czenia z hostem";
      histStatus.className = "status status--error";
    }
  });
  $("btn-history-refresh").addEventListener("click", loadHistory);
  importSyncBtn.addEventListener("click", async () => {
    if (!confirm("Synchronizowa\u0107 z chmur\u0105? Dodane zak\u0142adki zostan\u0105 dodane, usuni\u0119te - usuni\u0119te."))
      return;
    setAllButtons(true);
    showStatus("Synchronizuj\u0119...", "info");
    try {
      const r = await import_webextension_polyfill2.default.runtime.sendMessage({
        type: "IMPORT_BOOKMARKS",
        mode: "full_sync"
      });
      if (!r) {
        showStatus("\u2717 Brak odpowiedzi", "error");
        return;
      }
      showStatus(r.success ? "\u2713 Zsynchronizowano" : r.error === "NO_HOST" ? "\u2717 Host nie dzia\u0142a" : `\u2717 B\u0142\u0105d: ${r.error ?? "nieznany"}`, r.success ? "success" : "error");
    } catch (e) {
      showStatus(`\u2717 B\u0142\u0105d: ${String(e)}`, "error");
    } finally {
      setAllButtons(false);
    }
  });
  async function getFilteredUrls() {
    const tree = await import_webextension_polyfill2.default.bookmarks.getTree();
    const filterConfig = await loadFilterConfig();
    const excludedIds = getExcludedFolderIds(filterConfig);
    function toNode(n) {
      return { id: n.id, title: n.title ?? "", url: n.url, dateAdded: n.dateAdded, children: n.children?.map(toNode) };
    }
    const root = toNode(tree[0]);
    const filtered = filterBookmarkTree(root, filterConfig, excludedIds);
    const urls = /* @__PURE__ */ new Set();
    function collect(n) {
      if (n.url)
        urls.add(n.url);
      n.children?.forEach(collect);
    }
    if (filtered)
      collect(filtered);
    return { tree, filteredUrls: urls };
  }
  $("btn-export-chrome").addEventListener("click", async () => {
    try {
      const { tree, filteredUrls } = await getFilteredUrls();
      const html = buildBookmarkHtml(tree[0], filteredUrls, "chrome");
      downloadFile(html, `bookmarks_chrome_${today()}.html`, "text/html;charset=utf-8");
      showStatus("\u2713 Wyeksportowano dla Chrome/Opera/Edge", "success");
    } catch (e) {
      showStatus("\u2717 B\u0142\u0105d: " + String(e), "error");
    }
  });
  $("btn-export-firefox").addEventListener("click", async () => {
    try {
      const { tree, filteredUrls } = await getFilteredUrls();
      const json = buildFirefoxJson(tree[0], filteredUrls);
      downloadFile(JSON.stringify(json, null, 2), `bookmarks_firefox_${today()}.json`, "application/json;charset=utf-8");
      showStatus("\u2713 Wyeksportowano dla Firefox (JSON)", "success");
    } catch (e) {
      showStatus("\u2717 B\u0142\u0105d: " + String(e), "error");
    }
  });
  function today() {
    return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  }
  function downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  function buildFirefoxJson(root, filteredUrls) {
    const GUID_MAP = {
      "0": "root________",
      "root________": "root________",
      "1": "toolbar_____",
      "toolbar_____": "toolbar_____",
      "2": "menu________",
      "menu________": "menu________",
      "3": "unfiled_____",
      "unfiled_____": "unfiled_____",
      "mobile______": "mobile______"
    };
    const ROOT_MAP = {
      "root________": "placesRoot",
      "toolbar_____": "toolbarFolder",
      "menu________": "bookmarksMenuFolder",
      "unfiled_____": "unfiledBookmarksFolder",
      "mobile______": "mobileFolder"
    };
    const now = Date.now() * 1e3;
    function walkNode(n, idx) {
      const guid = GUID_MAP[n.id] ?? crypto.randomUUID().replace(/-/g, "").slice(0, 12);
      const tsAdd = (n.dateAdded ?? 0) * 1e3;
      if (n.url) {
        if (!filteredUrls.has(n.url))
          return null;
        return {
          guid,
          title: n.title ?? "",
          index: idx,
          dateAdded: tsAdd || now,
          lastModified: now,
          id: 0,
          typeCode: 1,
          type: "text/x-moz-place",
          uri: n.url
        };
      }
      const rawChildren = n.children ?? [];
      const children = [];
      let childIdx = 0;
      for (const child of rawChildren) {
        const c = walkNode(child, childIdx);
        if (c !== null) {
          children.push(c);
          childIdx++;
        }
      }
      const isSpecial = guid in ROOT_MAP;
      if (!isSpecial && children.length === 0)
        return null;
      const base = {
        guid,
        title: n.title ?? "",
        index: idx,
        dateAdded: tsAdd || now,
        lastModified: now,
        id: 0,
        typeCode: 2,
        type: "text/x-moz-place-container",
        children
      };
      if (guid in ROOT_MAP)
        base.root = ROOT_MAP[guid];
      return base;
    }
    const SPECIAL_ORDER = ["menu________", "toolbar_____", "unfiled_____", "mobile______"];
    const specialMap = /* @__PURE__ */ new Map();
    function findSpecials(n) {
      const guid = GUID_MAP[n.id];
      if (guid && guid !== "root________")
        specialMap.set(guid, n);
      for (const c of n.children ?? [])
        findSpecials(c);
    }
    findSpecials(root);
    const rootChildren = [];
    for (const guid of SPECIAL_ORDER) {
      const node = specialMap.get(guid);
      if (node) {
        const built = walkNode(node, rootChildren.length);
        if (built)
          rootChildren.push(built);
      } else {
        rootChildren.push({
          guid,
          title: guid.replace(/_/g, ""),
          index: rootChildren.length,
          dateAdded: now,
          lastModified: now,
          id: 0,
          typeCode: 2,
          type: "text/x-moz-place-container",
          root: ROOT_MAP[guid],
          children: []
        });
      }
    }
    return {
      guid: "root________",
      title: "",
      index: 0,
      dateAdded: now,
      lastModified: now,
      id: 1,
      typeCode: 2,
      type: "text/x-moz-place-container",
      root: "placesRoot",
      children: rootChildren
    };
  }
  $("btn-import-html").addEventListener("click", () => {
    $("file-import-html").click();
  });
  $("file-import-html").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file)
      return;
    setAllButtons(true);
    try {
      const text = await file.text();
      if (file.name.endsWith(".json") || text.trimStart().startsWith("{")) {
        await importFirefoxJson(text);
      } else {
        await importFromHtml(text);
      }
    } catch (e2) {
      showStatus("\u2717 B\u0142\u0105d importu: " + String(e2), "error");
    } finally {
      setAllButtons(false);
      e.target.value = "";
    }
  });
  async function importFirefoxJson(text) {
    const data = JSON.parse(text);
    const TOOLBAR_ROOTS = /* @__PURE__ */ new Set(["toolbarFolder"]);
    const MENU_ROOTS = /* @__PURE__ */ new Set(["bookmarksMenuFolder"]);
    const SKIP_ROOTS = /* @__PURE__ */ new Set(["unfiledBookmarksFolder", "mobileFolder", "placesRoot"]);
    const localTree = await import_webextension_polyfill2.default.bookmarks.getTree();
    function findFolder(type) {
      const ids = type === "toolbar" ? ["1", "toolbar_____"] : ["2", "menu________"];
      for (const root of localTree) {
        for (const child of root.children ?? []) {
          if (ids.includes(child.id))
            return child.id;
        }
      }
      return localTree[0]?.children?.[0]?.id;
    }
    async function walkImport(node, parentId) {
      let count2 = 0;
      if (node.type === "text/x-moz-place" && node.uri) {
        try {
          await import_webextension_polyfill2.default.bookmarks.create({ parentId, title: node.title ?? "", url: node.uri });
          count2++;
        } catch {
        }
      } else if (node.type === "text/x-moz-place-container") {
        if (SKIP_ROOTS.has(node.root ?? ""))
          return 0;
        let folderId = parentId;
        if (TOOLBAR_ROOTS.has(node.root ?? "")) {
          folderId = findFolder("toolbar") ?? parentId;
        } else if (MENU_ROOTS.has(node.root ?? "")) {
          folderId = findFolder("menu") ?? parentId;
        } else if (node.root !== "placesRoot") {
          const f = await import_webextension_polyfill2.default.bookmarks.create({ parentId, title: node.title ?? "" });
          folderId = f.id;
        }
        for (const child of node.children ?? []) {
          count2 += await walkImport(child, folderId);
        }
      }
      return count2;
    }
    const rootParent = localTree[0]?.children?.[0]?.id ?? "";
    const count = await walkImport(data, rootParent);
    showStatus(`\u2713 Zaimportowano ${count} zak\u0142adek z JSON Firefox`, "success");
  }
  async function importFromHtml(text) {
    const nodes = parseBookmarkHtml(text);
    if (nodes.length === 0) {
      showStatus("\u2717 Brak zak\u0142adek w pliku", "error");
      return;
    }
    showStatus(`Importuj\u0119 ${nodes.length} zak\u0142adek...`, "info");
    const localTree = await import_webextension_polyfill2.default.bookmarks.getTree();
    let parentId = localTree[0]?.children?.find(
      (c) => c.id === "2" || c.id === "unfiled_____" || c.title.toLowerCase().includes("inne") || c.title.toLowerCase().includes("other")
    )?.id ?? localTree[0]?.children?.[0]?.id;
    if (!parentId) {
      showStatus("\u2717 Nie znaleziono folderu docelowego", "error");
      return;
    }
    const folder = await import_webextension_polyfill2.default.bookmarks.create({ parentId, title: `Import ${(/* @__PURE__ */ new Date()).toLocaleDateString()}` });
    await importHtmlNodes(nodes, folder.id);
    showStatus(`\u2713 Zaimportowano ${nodes.length} zak\u0142adek`, "success");
  }
  function buildBookmarkHtml(root, filteredUrls = null, browserType = "chrome") {
    const lines = [
      "<!DOCTYPE NETSCAPE-Bookmark-file-1>",
      "<!-- This is an automatically generated file. -->",
      '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
      "<TITLE>Bookmarks</TITLE>",
      "<H1>Bookmarks</H1>",
      "<DL><p>"
    ];
    const SKIP_IDS = /* @__PURE__ */ new Set(["0", "root________"]);
    const TOOLBAR_IDS = /* @__PURE__ */ new Set(["1", "toolbar_____"]);
    const MENU_IDS = /* @__PURE__ */ new Set(["2", "menu________"]);
    const SKIP_CHILD = /* @__PURE__ */ new Set(["3", "unfiled_____", "mobile______", "5"]);
    const toolbarName = browserType === "firefox" ? "Pasek zak\u0142adek" : "Bookmarks bar";
    const menuName = browserType === "firefox" ? "Menu zak\u0142adek" : "Other bookmarks";
    function walk(node, indent) {
      const pad = "    ".repeat(indent);
      if (node.url) {
        if (filteredUrls !== null && !filteredUrls.has(node.url))
          return;
        const ts2 = node.dateAdded ? Math.floor(node.dateAdded / 1e3) : 0;
        lines.push(`${pad}<DT><A HREF="${escAttr(node.url)}" ADD_DATE="${ts2}">${escHtml(node.title)}</A>`);
        return;
      }
      if (!node.children)
        return;
      if (SKIP_IDS.has(node.id)) {
        for (const child of node.children)
          walk(child, indent);
        return;
      }
      if (SKIP_CHILD.has(node.id)) {
        return;
      }
      const ts = node.dateAdded ? Math.floor(node.dateAdded / 1e3) : 0;
      if (TOOLBAR_IDS.has(node.id)) {
        lines.push(`${pad}<DT><H3 ADD_DATE="${ts}" PERSONAL_TOOLBAR_FOLDER="true">${escHtml(toolbarName)}</H3>`);
      } else if (MENU_IDS.has(node.id)) {
        lines.push(`${pad}<DT><H3 ADD_DATE="${ts}" PERSONAL_MENU_FOLDER="true">${escHtml(menuName)}</H3>`);
      } else {
        lines.push(`${pad}<DT><H3 ADD_DATE="${ts}">${escHtml(node.title)}</H3>`);
      }
      lines.push(`${pad}<DL><p>`);
      for (const child of node.children)
        walk(child, indent + 1);
      lines.push(`${pad}</DL><p>`);
    }
    walk(root, 1);
    lines.push("</DL><p>");
    return lines.join("\n");
  }
  function parseBookmarkHtml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const result = [];
    function walkDl(dl, out) {
      for (const dt of dl.querySelectorAll(":scope > dt")) {
        const a = dt.querySelector(":scope > a");
        const h3 = dt.querySelector(":scope > h3");
        if (a) {
          out.push({ title: a.textContent?.trim() ?? "", url: a.getAttribute("href") ?? "" });
        } else if (h3) {
          const subDl = dt.querySelector(":scope > dl");
          const children = [];
          if (subDl)
            walkDl(subDl, children);
          out.push({ title: h3.textContent?.trim() ?? "", children });
        }
      }
    }
    const topDl = doc.querySelector("dl");
    if (topDl)
      walkDl(topDl, result);
    return result;
  }
  async function importHtmlNodes(nodes, parentId) {
    for (const node of nodes) {
      if (node.url) {
        try {
          await import_webextension_polyfill2.default.bookmarks.create({ parentId, title: node.title, url: node.url });
        } catch {
        }
      } else if (node.children) {
        const folder = await import_webextension_polyfill2.default.bookmarks.create({ parentId, title: node.title });
        await importHtmlNodes(node.children, folder.id);
      }
    }
  }
  function escAttr(s) {
    return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  var faviconPolling = null;
  $("btn-refresh-fav").addEventListener("click", async () => {
    const concurrency = parseInt($("fav-concurrency").value) || 5;
    const timeoutSec = parseInt($("fav-timeout").value) || 10;
    $("btn-refresh-fav").setAttribute("disabled", "");
    $("btn-cancel-fav").style.display = "inline-block";
    $("fav-progress").style.display = "block";
    $("fav-progress").textContent = "Uruchamianie...";
    faviconPolling = setInterval(async () => {
      const status = await import_webextension_polyfill2.default.runtime.sendMessage({ type: "GET_FAVICON_STATUS" });
      if (status?.running) {
        $("fav-progress").textContent = `${status.done} / ${status.total} \u2014 ${status.current.slice(0, 50)}`;
      }
    }, 1e3);
    try {
      const r = await import_webextension_polyfill2.default.runtime.sendMessage({
        type: "REFRESH_FAVICONS",
        concurrency,
        timeoutMs: timeoutSec * 1e3
      });
      showStatus(`\u2713 Od\u015Bwie\u017Cono ${r.done} / ${r.total} favicon`, "success");
    } catch (e) {
      showStatus("\u2717 B\u0142\u0105d: " + String(e), "error");
    } finally {
      if (faviconPolling)
        clearInterval(faviconPolling);
      $("btn-refresh-fav").removeAttribute("disabled");
      $("btn-cancel-fav").style.display = "none";
      $("fav-progress").style.display = "none";
    }
  });
  $("btn-cancel-fav").addEventListener("click", async () => {
    await import_webextension_polyfill2.default.runtime.sendMessage({ type: "CANCEL_FAVICON_REFRESH" });
    if (faviconPolling)
      clearInterval(faviconPolling);
    $("btn-cancel-fav").style.display = "none";
    $("btn-refresh-fav").removeAttribute("disabled");
    $("fav-progress").style.display = "none";
    showStatus("Od\u015Bwie\u017Canie przerwane", "info");
  });
  $("open-options").addEventListener("click", async () => {
    try {
      await import_webextension_polyfill2.default.runtime.openOptionsPage();
    } catch {
      const url = import_webextension_polyfill2.default.runtime.getURL("options.html");
      await import_webextension_polyfill2.default.tabs.create({ url });
    }
  });
  document.addEventListener("DOMContentLoaded", async () => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (k)
        el.textContent = i18n(k);
    });
    await loadPort();
    await refresh();
  });
})();

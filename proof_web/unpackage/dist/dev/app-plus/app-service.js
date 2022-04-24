var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
(function(vue) {
  "use strict";
  function _interopNamespace(e) {
    if (e && e.__esModule)
      return e;
    var n2 = { __proto__: null, [Symbol.toStringTag]: "Module" };
    if (e) {
      Object.keys(e).forEach(function(k2) {
        if (k2 !== "default") {
          var d = Object.getOwnPropertyDescriptor(e, k2);
          Object.defineProperty(n2, k2, d.get ? d : {
            enumerable: true,
            get: function() {
              return e[k2];
            }
          });
        }
      });
    }
    n2["default"] = e;
    return Object.freeze(n2);
  }
  var vue__namespace = /* @__PURE__ */ _interopNamespace(vue);
  Object.freeze({});
  Object.freeze([]);
  const isString = (val) => typeof val === "string";
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  function isDebugMode() {
    return typeof __channelId__ === "string" && __channelId__;
  }
  function jsonStringifyReplacer(k2, p2) {
    switch (toRawType(p2)) {
      case "Function":
        return "function() { [native code] }";
      default:
        return p2;
    }
  }
  function normalizeLog(type, filename, args) {
    if (isDebugMode()) {
      args.push(filename.replace("at ", "uni-app:///"));
      return console[type].apply(console, args);
    }
    const msgs = args.map(function(v2) {
      const type2 = toTypeString(v2).toLowerCase();
      if (type2 === "[object object]" || type2 === "[object array]") {
        try {
          v2 = "---BEGIN:JSON---" + JSON.stringify(v2, jsonStringifyReplacer) + "---END:JSON---";
        } catch (e) {
          v2 = type2;
        }
      } else {
        if (v2 === null) {
          v2 = "---NULL---";
        } else if (v2 === void 0) {
          v2 = "---UNDEFINED---";
        } else {
          const vType = toRawType(v2).toUpperCase();
          if (vType === "NUMBER" || vType === "BOOLEAN") {
            v2 = "---BEGIN:" + vType + "---" + v2 + "---END:" + vType + "---";
          } else {
            v2 = String(v2);
          }
        }
      }
      return v2;
    });
    return msgs.join("---COMMA---") + " " + filename;
  }
  function formatAppLog(type, filename, ...args) {
    const res = normalizeLog(type, filename, args);
    res && console[type](res);
  }
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$g = {
    name: "control_panel",
    props: ["r", "bt", "config", "mode", "onSwitchLight", "onShutDown", "onStartUp", "onSwitchMode"],
    data() {
      return {};
    },
    methods: {
      from_sec_to_str(s2) {
        var h2 = Math.floor(s2 / 3600);
        var m2 = Math.floor((s2 - h2 * 3600) / 60);
        var sl = s2 - h2 * 3600 - m2 * 60;
        var ret = "";
        if (h2 > 0) {
          ret = ret + h2 + "\u5C0F\u65F6" + m2 + "\u5206";
        } else {
          if (m2 > 0) {
            ret = ret + m2 + "\u5206";
          }
        }
        ret = ret + sl + "\u79D2";
        return ret;
      },
      openConfig() {
        uni.switchTab({
          url: "../../pages/config/config"
        });
      }
    },
    computed: {
      is_running() {
        return this.r;
      },
      current_status() {
        let m2 = "";
        for (let i2 = 0; i2 < this.config["functions"].length; i2++) {
          if (this.config["functions"][i2][0] === this.mode) {
            m2 = this.config["functions"][i2][1];
          }
        }
        return m2 + "\u5DF2\u5DE5\u4F5C\uFF1A" + this.from_sec_to_str(this.bt);
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "control_display" }, [
      vue.createElementVNode("text", { class: "title_text" }, " \u72B6\u6001\uFF1A "),
      $options.is_running ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "on_pan"
      }, [
        vue.createElementVNode("text", { class: "label_text status_text" }, vue.toDisplayString($options.current_status), 1),
        vue.createElementVNode("button", {
          onClick: _cache[0] || (_cache[0] = (...args) => $props.onSwitchLight && $props.onSwitchLight(...args)),
          class: "action_button button_light"
        }, "\u5F00\u706F/\u5173\u706F"),
        vue.createElementVNode("button", {
          onClick: _cache[1] || (_cache[1] = (...args) => $props.onShutDown && $props.onShutDown(...args)),
          class: "action_button"
        }, "\u5173\u673A")
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "off_pan"
      }, [
        $props.config ? (vue.openBlock(), vue.createElementBlock("radio-group", {
          key: 0,
          class: "mode_select",
          onChange: _cache[2] || (_cache[2] = (...args) => $props.onSwitchMode && $props.onSwitchMode(...args))
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.config["functions"], (v2) => {
            return vue.openBlock(), vue.createElementBlock("label", {
              class: "label_text",
              key: "label_" + v2[0]
            }, [
              vue.createElementVNode("radio", {
                value: v2[0],
                checked: v2[0] === $props.mode
              }, null, 8, ["value", "checked"]),
              vue.createTextVNode(vue.toDisplayString(v2[1]), 1)
            ]);
          }), 128))
        ], 32)) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("button", {
          class: "action_button",
          onClick: _cache[3] || (_cache[3] = (...args) => $props.onStartUp && $props.onStartUp(...args))
        }, "\u542F\u52A8"),
        vue.createElementVNode("image", {
          class: "button_setup",
          src: "/static/setup.png",
          mode: "aspectFit",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.openConfig && $options.openConfig(...args))
        })
      ]))
    ]);
  }
  var __easycom_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-035e80ec"]]);
  function resolveEasycom(component, easycom) {
    return isString(component) ? easycom : component;
  }
  const _sfc_main$f = {
    name: "UniNumberBox",
    emits: ["change", "input", "update:modelValue", "blur", "focus"],
    props: {
      value: {
        type: [Number, String],
        default: 1
      },
      modelValue: {
        type: [Number, String],
        default: 1
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      step: {
        type: Number,
        default: 1
      },
      background: {
        type: String,
        default: "#f5f5f5"
      },
      color: {
        type: String,
        default: "#333"
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        inputValue: 0
      };
    },
    watch: {
      value(val) {
        this.inputValue = +val;
      },
      modelValue(val) {
        this.inputValue = +val;
      }
    },
    created() {
      if (this.value === 1) {
        this.inputValue = +this.modelValue;
      }
      if (this.modelValue === 1) {
        this.inputValue = +this.value;
      }
    },
    methods: {
      _calcValue(type) {
        if (this.disabled) {
          return;
        }
        const scale = this._getDecimalScale();
        let value = this.inputValue * scale;
        let step = this.step * scale;
        if (type === "minus") {
          value -= step;
          if (value < this.min * scale) {
            return;
          }
          if (value > this.max * scale) {
            value = this.max * scale;
          }
        }
        if (type === "plus") {
          value += step;
          if (value > this.max * scale) {
            return;
          }
          if (value < this.min * scale) {
            value = this.min * scale;
          }
        }
        this.inputValue = (value / scale).toFixed(String(scale).length - 1);
        this.$emit("change", +this.inputValue);
        this.$emit("input", +this.inputValue);
        this.$emit("update:modelValue", +this.inputValue);
      },
      _getDecimalScale() {
        let scale = 1;
        if (~~this.step !== this.step) {
          scale = Math.pow(10, String(this.step).split(".")[1].length);
        }
        return scale;
      },
      _onBlur(event) {
        this.$emit("blur", event);
        let value = event.detail.value;
        if (!value) {
          return;
        }
        value = +value;
        if (value > this.max) {
          value = this.max;
        } else if (value < this.min) {
          value = this.min;
        }
        const scale = this._getDecimalScale();
        this.inputValue = value.toFixed(String(scale).length - 1);
        this.$emit("change", +this.inputValue);
        this.$emit("input", +this.inputValue);
      },
      _onFocus(event) {
        this.$emit("focus", event);
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-numbox" }, [
      vue.createElementVNode("view", {
        onClick: _cache[0] || (_cache[0] = ($event) => $options._calcValue("minus")),
        class: "uni-numbox__minus uni-numbox-btns",
        style: vue.normalizeStyle({ background: $props.background })
      }, [
        vue.createElementVNode("text", {
          class: vue.normalizeClass(["uni-numbox--text", { "uni-numbox--disabled": $data.inputValue <= $props.min || $props.disabled }]),
          style: vue.normalizeStyle({ color: $props.color })
        }, "-", 6)
      ], 4),
      vue.withDirectives(vue.createElementVNode("input", {
        disabled: $props.disabled,
        onFocus: _cache[1] || (_cache[1] = (...args) => $options._onFocus && $options._onFocus(...args)),
        onBlur: _cache[2] || (_cache[2] = (...args) => $options._onBlur && $options._onBlur(...args)),
        class: "uni-numbox__value",
        type: "number",
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.inputValue = $event),
        style: vue.normalizeStyle({ background: $props.background, color: $props.color })
      }, null, 44, ["disabled"]), [
        [vue.vModelText, $data.inputValue]
      ]),
      vue.createElementVNode("view", {
        onClick: _cache[4] || (_cache[4] = ($event) => $options._calcValue("plus")),
        class: "uni-numbox__plus uni-numbox-btns",
        style: vue.normalizeStyle({ background: $props.background })
      }, [
        vue.createElementVNode("text", {
          class: vue.normalizeClass(["uni-numbox--text", { "uni-numbox--disabled": $data.inputValue >= $props.max || $props.disabled }]),
          style: vue.normalizeStyle({ color: $props.color })
        }, "+", 6)
      ], 4)
    ]);
  }
  var __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-dd94a2a8"]]);
  const _sfc_main$e = {
    name: "setup_panel",
    props: ["tt", "th", "measure", "r", "mode", "onTempSetup", "onHumiSetup"],
    data() {
      return {
        local_tt: this.tt,
        local_th: this.th,
        target_temp: this.tt,
        target_humi: this.th
      };
    },
    beforeUpdate() {
      if (this.local_th != this.th) {
        this.local_th = this.th;
        this.target_temp = this.th;
      }
      if (this.local_tt != this.tt) {
        this.local_tt = this.tt;
        this.target_temp = this.tt;
      }
    },
    computed: {
      is_running() {
        return this.r;
      },
      is_cooling() {
        return this.mode === "COOLER";
      },
      ts() {
        let r2 = "";
        if (this.measure) {
          this.measure.forEach((v2) => {
            r2 = r2 + v2[1] + "/";
          });
          r2 = r2.substring(0, r2.length - 1);
        }
        return r2;
      },
      hs() {
        let r2 = "";
        if (this.measure) {
          this.measure.forEach((v2) => {
            r2 = r2 + v2[2] + "/";
          });
          r2 = r2.substring(0, r2.length - 1);
        }
        return r2;
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_number_box = resolveEasycom(vue.resolveDynamicComponent("uni-number-box"), __easycom_0$3);
    return vue.openBlock(), vue.createElementBlock("view", { class: "setup_pan" }, [
      vue.createElementVNode("view", { class: "setup_view" }, [
        vue.createElementVNode("text", { class: "label_text" }, "\u6E29\u5EA6\uFF1A"),
        vue.createElementVNode("text", { class: "value_text" }, vue.toDisplayString($options.ts), 1),
        vue.createVNode(_component_uni_number_box, {
          min: $options.is_cooling ? -18 : 25,
          max: $options.is_cooling ? 10 : 40,
          step: 1,
          modelValue: $data.target_temp,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.target_temp = $event)
        }, null, 8, ["min", "max", "modelValue"]),
        vue.createElementVNode("button", {
          class: "action_button",
          onClick: _cache[1] || (_cache[1] = ($event) => $props.onTempSetup($data.target_temp))
        }, "\u8BBE\u7F6E")
      ]),
      vue.createElementVNode("view", { class: "setup_view" }, [
        vue.createElementVNode("text", { class: "label_text" }, "\u6E7F\u5EA6\uFF1A"),
        vue.createElementVNode("text", { class: "value_text" }, vue.toDisplayString($options.hs), 1),
        vue.createVNode(_component_uni_number_box, {
          min: 60,
          max: 100,
          step: 1,
          modelValue: $data.target_humi,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.target_humi = $event),
          disabled: $options.is_cooling
        }, null, 8, ["modelValue", "disabled"]),
        vue.createElementVNode("button", {
          class: "action_button",
          onClick: _cache[3] || (_cache[3] = ($event) => $props.onHumiSetup($data.target_humi)),
          disabled: $options.is_cooling
        }, "\u8BBE\u7F6E", 8, ["disabled"])
      ])
    ]);
  }
  var __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-ce43edec"]]);
  const _sfc_main$d = {
    name: "status_panel",
    props: ["status", "r", "config"],
    data() {
      return {};
    },
    computed: {
      is_running() {
        return this.r;
      },
      heater() {
        let r2 = 0;
        if (this.status) {
          this.status.forEach((c2) => {
            if (c2[0].indexOf("heater") >= 0) {
              r2 = r2 + c2[1];
            }
          });
          if (this.config["heaters"]) {
            r2 = r2 / this.config["heaters"].length;
          }
        }
        return r2;
      },
      humi() {
        let r2 = 0;
        if (this.status) {
          this.status.forEach((c2) => {
            if (c2[0].indexOf("humi") >= 0) {
              r2 = c2[1];
            }
          });
        }
        return r2;
      },
      frig() {
        let r2 = 0;
        if (this.status) {
          this.status.forEach((c2) => {
            if (c2[0].indexOf("frig") >= 0) {
              r2 = c2[1];
            }
          });
        }
        return r2;
      },
      fan() {
        let r2 = 0;
        if (this.status) {
          this.status.forEach((c2) => {
            if (c2[0].indexOf("fan") >= 0) {
              r2 = r2 + c2[1];
            }
          });
          if (this.config["fans"]) {
            r2 = r2 / this.config["fans"].length;
          }
        }
        return r2;
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "status_pan" }, [
      vue.createElementVNode("view", { class: "status_view" }, [
        vue.createElementVNode("text", { class: "label_text" }, "\u52A0\u70ED\uFF1A"),
        vue.createElementVNode("text", { class: "value_text" }, vue.toDisplayString($options.heater), 1)
      ]),
      vue.createElementVNode("view", { class: "status_view" }, [
        vue.createElementVNode("text", { class: "label_text" }, "\u52A0\u6E7F\uFF1A"),
        vue.createElementVNode("text", { class: "value_text" }, vue.toDisplayString($options.humi), 1)
      ]),
      vue.createElementVNode("view", { class: "status_view" }, [
        vue.createElementVNode("text", { class: "label_text" }, "\u5236\u51B7\uFF1A"),
        vue.createElementVNode("text", { class: "value_text" }, vue.toDisplayString($options.frig), 1)
      ]),
      vue.createElementVNode("view", { class: "status_view" }, [
        vue.createElementVNode("text", { class: "label_text" }, "\u98CE\u6247\uFF1A"),
        vue.createElementVNode("text", { class: "value_text" }, vue.toDisplayString($options.fan), 1)
      ])
    ]);
  }
  var __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-7174b6e4"]]);
  const isArray = Array.isArray;
  const isObject$1 = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format.length) {
      let char = format[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = isArray(values) ? "list" : isObject$1(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages && messages[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    const lang = startsWith(locale, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
    if (lang) {
      return lang;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages, watcher, formater }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater || defaultFormatter;
      this.messages = messages || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn) {
      const index = this.watchers.push(fn) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      [locale, messages] = [
        messages,
        locale
      ];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale,
      fallbackLocale,
      messages,
      watcher
    });
    let t2 = (key, values) => {
      if (typeof getApp !== "function") {
        t2 = function(key2, values2) {
          return i18n.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t2 = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n);
            }
          }
          return i18n.t(key2, values2);
        };
      }
      return t2(key, values);
    };
    return {
      i18n,
      f(message, values, delimiters) {
        return i18n.f(message, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message, override = true) {
        return i18n.add(locale2, message, override);
      },
      watch(fn) {
        return i18n.watchLocale(fn);
      },
      getLocale() {
        return i18n.getLocale();
      },
      setLocale(newLocale) {
        return i18n.setLocale(newLocale);
      }
    };
  }
  function t(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
  }
  function n(e, t2, n2) {
    return e(n2 = { path: t2, exports: {}, require: function(e2, t3) {
      return function() {
        throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
      }(t3 == null && n2.path);
    } }, n2.exports), n2.exports;
  }
  var s = n(function(e, t2) {
    var n2;
    e.exports = (n2 = n2 || function(e2, t3) {
      var n3 = Object.create || function() {
        function e3() {
        }
        return function(t4) {
          var n4;
          return e3.prototype = t4, n4 = new e3(), e3.prototype = null, n4;
        };
      }(), s2 = {}, r2 = s2.lib = {}, o2 = r2.Base = { extend: function(e3) {
        var t4 = n3(this);
        return e3 && t4.mixIn(e3), t4.hasOwnProperty("init") && this.init !== t4.init || (t4.init = function() {
          t4.$super.init.apply(this, arguments);
        }), t4.init.prototype = t4, t4.$super = this, t4;
      }, create: function() {
        var e3 = this.extend();
        return e3.init.apply(e3, arguments), e3;
      }, init: function() {
      }, mixIn: function(e3) {
        for (var t4 in e3)
          e3.hasOwnProperty(t4) && (this[t4] = e3[t4]);
        e3.hasOwnProperty("toString") && (this.toString = e3.toString);
      }, clone: function() {
        return this.init.prototype.extend(this);
      } }, i2 = r2.WordArray = o2.extend({ init: function(e3, n4) {
        e3 = this.words = e3 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e3.length;
      }, toString: function(e3) {
        return (e3 || c2).stringify(this);
      }, concat: function(e3) {
        var t4 = this.words, n4 = e3.words, s3 = this.sigBytes, r3 = e3.sigBytes;
        if (this.clamp(), s3 % 4)
          for (var o3 = 0; o3 < r3; o3++) {
            var i3 = n4[o3 >>> 2] >>> 24 - o3 % 4 * 8 & 255;
            t4[s3 + o3 >>> 2] |= i3 << 24 - (s3 + o3) % 4 * 8;
          }
        else
          for (o3 = 0; o3 < r3; o3 += 4)
            t4[s3 + o3 >>> 2] = n4[o3 >>> 2];
        return this.sigBytes += r3, this;
      }, clamp: function() {
        var t4 = this.words, n4 = this.sigBytes;
        t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e2.ceil(n4 / 4);
      }, clone: function() {
        var e3 = o2.clone.call(this);
        return e3.words = this.words.slice(0), e3;
      }, random: function(t4) {
        for (var n4, s3 = [], r3 = function(t5) {
          t5 = t5;
          var n5 = 987654321, s4 = 4294967295;
          return function() {
            var r4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
            return r4 /= 4294967296, (r4 += 0.5) * (e2.random() > 0.5 ? 1 : -1);
          };
        }, o3 = 0; o3 < t4; o3 += 4) {
          var a3 = r3(4294967296 * (n4 || e2.random()));
          n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
        }
        return new i2.init(s3, t4);
      } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e3) {
        for (var t4 = e3.words, n4 = e3.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var o3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push((o3 >>> 4).toString(16)), s3.push((15 & o3).toString(16));
        }
        return s3.join("");
      }, parse: function(e3) {
        for (var t4 = e3.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
          n4[s3 >>> 3] |= parseInt(e3.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
        return new i2.init(n4, t4 / 2);
      } }, u2 = a2.Latin1 = { stringify: function(e3) {
        for (var t4 = e3.words, n4 = e3.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var o3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push(String.fromCharCode(o3));
        }
        return s3.join("");
      }, parse: function(e3) {
        for (var t4 = e3.length, n4 = [], s3 = 0; s3 < t4; s3++)
          n4[s3 >>> 2] |= (255 & e3.charCodeAt(s3)) << 24 - s3 % 4 * 8;
        return new i2.init(n4, t4);
      } }, h2 = a2.Utf8 = { stringify: function(e3) {
        try {
          return decodeURIComponent(escape(u2.stringify(e3)));
        } catch (e4) {
          throw new Error("Malformed UTF-8 data");
        }
      }, parse: function(e3) {
        return u2.parse(unescape(encodeURIComponent(e3)));
      } }, l2 = r2.BufferedBlockAlgorithm = o2.extend({ reset: function() {
        this._data = new i2.init(), this._nDataBytes = 0;
      }, _append: function(e3) {
        typeof e3 == "string" && (e3 = h2.parse(e3)), this._data.concat(e3), this._nDataBytes += e3.sigBytes;
      }, _process: function(t4) {
        var n4 = this._data, s3 = n4.words, r3 = n4.sigBytes, o3 = this.blockSize, a3 = r3 / (4 * o3), c3 = (a3 = t4 ? e2.ceil(a3) : e2.max((0 | a3) - this._minBufferSize, 0)) * o3, u3 = e2.min(4 * c3, r3);
        if (c3) {
          for (var h3 = 0; h3 < c3; h3 += o3)
            this._doProcessBlock(s3, h3);
          var l3 = s3.splice(0, c3);
          n4.sigBytes -= u3;
        }
        return new i2.init(l3, u3);
      }, clone: function() {
        var e3 = o2.clone.call(this);
        return e3._data = this._data.clone(), e3;
      }, _minBufferSize: 0 });
      r2.Hasher = l2.extend({ cfg: o2.extend(), init: function(e3) {
        this.cfg = this.cfg.extend(e3), this.reset();
      }, reset: function() {
        l2.reset.call(this), this._doReset();
      }, update: function(e3) {
        return this._append(e3), this._process(), this;
      }, finalize: function(e3) {
        return e3 && this._append(e3), this._doFinalize();
      }, blockSize: 16, _createHelper: function(e3) {
        return function(t4, n4) {
          return new e3.init(n4).finalize(t4);
        };
      }, _createHmacHelper: function(e3) {
        return function(t4, n4) {
          return new d.HMAC.init(e3, n4).finalize(t4);
        };
      } });
      var d = s2.algo = {};
      return s2;
    }(Math), n2);
  }), r = (n(function(e, t2) {
    var n2;
    e.exports = (n2 = s, function(e2) {
      var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, o2 = s2.Hasher, i2 = t3.algo, a2 = [];
      !function() {
        for (var t4 = 0; t4 < 64; t4++)
          a2[t4] = 4294967296 * e2.abs(e2.sin(t4 + 1)) | 0;
      }();
      var c2 = i2.MD5 = o2.extend({ _doReset: function() {
        this._hash = new r2.init([1732584193, 4023233417, 2562383102, 271733878]);
      }, _doProcessBlock: function(e3, t4) {
        for (var n3 = 0; n3 < 16; n3++) {
          var s3 = t4 + n3, r3 = e3[s3];
          e3[s3] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8);
        }
        var o3 = this._hash.words, i3 = e3[t4 + 0], c3 = e3[t4 + 1], f2 = e3[t4 + 2], p2 = e3[t4 + 3], g2 = e3[t4 + 4], m2 = e3[t4 + 5], y2 = e3[t4 + 6], _2 = e3[t4 + 7], w2 = e3[t4 + 8], k2 = e3[t4 + 9], v2 = e3[t4 + 10], S2 = e3[t4 + 11], T2 = e3[t4 + 12], A2 = e3[t4 + 13], P2 = e3[t4 + 14], I2 = e3[t4 + 15], b2 = o3[0], E2 = o3[1], O2 = o3[2], C2 = o3[3];
        b2 = u2(b2, E2, O2, C2, i3, 7, a2[0]), C2 = u2(C2, b2, E2, O2, c3, 12, a2[1]), O2 = u2(O2, C2, b2, E2, f2, 17, a2[2]), E2 = u2(E2, O2, C2, b2, p2, 22, a2[3]), b2 = u2(b2, E2, O2, C2, g2, 7, a2[4]), C2 = u2(C2, b2, E2, O2, m2, 12, a2[5]), O2 = u2(O2, C2, b2, E2, y2, 17, a2[6]), E2 = u2(E2, O2, C2, b2, _2, 22, a2[7]), b2 = u2(b2, E2, O2, C2, w2, 7, a2[8]), C2 = u2(C2, b2, E2, O2, k2, 12, a2[9]), O2 = u2(O2, C2, b2, E2, v2, 17, a2[10]), E2 = u2(E2, O2, C2, b2, S2, 22, a2[11]), b2 = u2(b2, E2, O2, C2, T2, 7, a2[12]), C2 = u2(C2, b2, E2, O2, A2, 12, a2[13]), O2 = u2(O2, C2, b2, E2, P2, 17, a2[14]), b2 = h2(b2, E2 = u2(E2, O2, C2, b2, I2, 22, a2[15]), O2, C2, c3, 5, a2[16]), C2 = h2(C2, b2, E2, O2, y2, 9, a2[17]), O2 = h2(O2, C2, b2, E2, S2, 14, a2[18]), E2 = h2(E2, O2, C2, b2, i3, 20, a2[19]), b2 = h2(b2, E2, O2, C2, m2, 5, a2[20]), C2 = h2(C2, b2, E2, O2, v2, 9, a2[21]), O2 = h2(O2, C2, b2, E2, I2, 14, a2[22]), E2 = h2(E2, O2, C2, b2, g2, 20, a2[23]), b2 = h2(b2, E2, O2, C2, k2, 5, a2[24]), C2 = h2(C2, b2, E2, O2, P2, 9, a2[25]), O2 = h2(O2, C2, b2, E2, p2, 14, a2[26]), E2 = h2(E2, O2, C2, b2, w2, 20, a2[27]), b2 = h2(b2, E2, O2, C2, A2, 5, a2[28]), C2 = h2(C2, b2, E2, O2, f2, 9, a2[29]), O2 = h2(O2, C2, b2, E2, _2, 14, a2[30]), b2 = l2(b2, E2 = h2(E2, O2, C2, b2, T2, 20, a2[31]), O2, C2, m2, 4, a2[32]), C2 = l2(C2, b2, E2, O2, w2, 11, a2[33]), O2 = l2(O2, C2, b2, E2, S2, 16, a2[34]), E2 = l2(E2, O2, C2, b2, P2, 23, a2[35]), b2 = l2(b2, E2, O2, C2, c3, 4, a2[36]), C2 = l2(C2, b2, E2, O2, g2, 11, a2[37]), O2 = l2(O2, C2, b2, E2, _2, 16, a2[38]), E2 = l2(E2, O2, C2, b2, v2, 23, a2[39]), b2 = l2(b2, E2, O2, C2, A2, 4, a2[40]), C2 = l2(C2, b2, E2, O2, i3, 11, a2[41]), O2 = l2(O2, C2, b2, E2, p2, 16, a2[42]), E2 = l2(E2, O2, C2, b2, y2, 23, a2[43]), b2 = l2(b2, E2, O2, C2, k2, 4, a2[44]), C2 = l2(C2, b2, E2, O2, T2, 11, a2[45]), O2 = l2(O2, C2, b2, E2, I2, 16, a2[46]), b2 = d(b2, E2 = l2(E2, O2, C2, b2, f2, 23, a2[47]), O2, C2, i3, 6, a2[48]), C2 = d(C2, b2, E2, O2, _2, 10, a2[49]), O2 = d(O2, C2, b2, E2, P2, 15, a2[50]), E2 = d(E2, O2, C2, b2, m2, 21, a2[51]), b2 = d(b2, E2, O2, C2, T2, 6, a2[52]), C2 = d(C2, b2, E2, O2, p2, 10, a2[53]), O2 = d(O2, C2, b2, E2, v2, 15, a2[54]), E2 = d(E2, O2, C2, b2, c3, 21, a2[55]), b2 = d(b2, E2, O2, C2, w2, 6, a2[56]), C2 = d(C2, b2, E2, O2, I2, 10, a2[57]), O2 = d(O2, C2, b2, E2, y2, 15, a2[58]), E2 = d(E2, O2, C2, b2, A2, 21, a2[59]), b2 = d(b2, E2, O2, C2, g2, 6, a2[60]), C2 = d(C2, b2, E2, O2, S2, 10, a2[61]), O2 = d(O2, C2, b2, E2, f2, 15, a2[62]), E2 = d(E2, O2, C2, b2, k2, 21, a2[63]), o3[0] = o3[0] + b2 | 0, o3[1] = o3[1] + E2 | 0, o3[2] = o3[2] + O2 | 0, o3[3] = o3[3] + C2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
        n3[r3 >>> 5] |= 128 << 24 - r3 % 32;
        var o3 = e2.floor(s3 / 4294967296), i3 = s3;
        n3[15 + (r3 + 64 >>> 9 << 4)] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8), n3[14 + (r3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
        for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
          var h3 = c3[u3];
          c3[u3] = 16711935 & (h3 << 8 | h3 >>> 24) | 4278255360 & (h3 << 24 | h3 >>> 8);
        }
        return a3;
      }, clone: function() {
        var e3 = o2.clone.call(this);
        return e3._hash = this._hash.clone(), e3;
      } });
      function u2(e3, t4, n3, s3, r3, o3, i3) {
        var a3 = e3 + (t4 & n3 | ~t4 & s3) + r3 + i3;
        return (a3 << o3 | a3 >>> 32 - o3) + t4;
      }
      function h2(e3, t4, n3, s3, r3, o3, i3) {
        var a3 = e3 + (t4 & s3 | n3 & ~s3) + r3 + i3;
        return (a3 << o3 | a3 >>> 32 - o3) + t4;
      }
      function l2(e3, t4, n3, s3, r3, o3, i3) {
        var a3 = e3 + (t4 ^ n3 ^ s3) + r3 + i3;
        return (a3 << o3 | a3 >>> 32 - o3) + t4;
      }
      function d(e3, t4, n3, s3, r3, o3, i3) {
        var a3 = e3 + (n3 ^ (t4 | ~s3)) + r3 + i3;
        return (a3 << o3 | a3 >>> 32 - o3) + t4;
      }
      t3.MD5 = o2._createHelper(c2), t3.HmacMD5 = o2._createHmacHelper(c2);
    }(Math), n2.MD5);
  }), n(function(e, t2) {
    var n2, r2, o2;
    e.exports = (r2 = (n2 = s).lib.Base, o2 = n2.enc.Utf8, void (n2.algo.HMAC = r2.extend({ init: function(e2, t3) {
      e2 = this._hasher = new e2.init(), typeof t3 == "string" && (t3 = o2.parse(t3));
      var n3 = e2.blockSize, s2 = 4 * n3;
      t3.sigBytes > s2 && (t3 = e2.finalize(t3)), t3.clamp();
      for (var r3 = this._oKey = t3.clone(), i2 = this._iKey = t3.clone(), a2 = r3.words, c2 = i2.words, u2 = 0; u2 < n3; u2++)
        a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
      r3.sigBytes = i2.sigBytes = s2, this.reset();
    }, reset: function() {
      var e2 = this._hasher;
      e2.reset(), e2.update(this._iKey);
    }, update: function(e2) {
      return this._hasher.update(e2), this;
    }, finalize: function(e2) {
      var t3 = this._hasher, n3 = t3.finalize(e2);
      return t3.reset(), t3.finalize(this._oKey.clone().concat(n3));
    } })));
  }), n(function(e, t2) {
    e.exports = s.HmacMD5;
  }));
  function o(e) {
    return Object.prototype.toString.call(e).slice(8, -1).toLowerCase();
  }
  function i(e) {
    return o(e) === "object";
  }
  function a(e) {
    return e && typeof e == "string" ? JSON.parse(e) : e;
  }
  const c = true, u = "app", h = a({}.UNICLOUD_DEBUG), l = a("[]");
  let f = "";
  try {
    f = "__UNI__7A2368B";
  } catch (e) {
  }
  let p = {};
  function g(e, t2 = {}) {
    var n2, s2;
    return n2 = p, s2 = e, Object.prototype.hasOwnProperty.call(n2, s2) || (p[e] = t2), p[e];
  }
  const m = ["invoke", "success", "fail", "complete"], y = g("_globalUniCloudInterceptor");
  function _(e, t2) {
    y[e] || (y[e] = {}), i(t2) && Object.keys(t2).forEach((n2) => {
      m.indexOf(n2) > -1 && function(e2, t3, n3) {
        let s2 = y[e2][t3];
        s2 || (s2 = y[e2][t3] = []), s2.indexOf(n3) === -1 && typeof n3 == "function" && s2.push(n3);
      }(e, n2, t2[n2]);
    });
  }
  function w(e, t2) {
    y[e] || (y[e] = {}), i(t2) ? Object.keys(t2).forEach((n2) => {
      m.indexOf(n2) > -1 && function(e2, t3, n3) {
        const s2 = y[e2][t3];
        if (!s2)
          return;
        const r2 = s2.indexOf(n3);
        r2 > -1 && s2.splice(r2, 1);
      }(e, n2, t2[n2]);
    }) : delete y[e];
  }
  function k(e, t2) {
    return e && e.length !== 0 ? e.reduce((e2, n2) => e2.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
  }
  function v(e, t2) {
    return y[e] && y[e][t2] || [];
  }
  function S(e, t2) {
    return t2 ? function(n2) {
      const s2 = t2 === "callFunction" && (n2 && n2.name) === "DCloud-clientDB";
      let r2;
      r2 = this.isReady ? Promise.resolve() : this.initUniCloud, n2 = n2 || {};
      const o2 = r2.then(() => s2 ? Promise.resolve() : k(v(t2, "invoke"), n2)).then(() => e.call(this, n2)).then((e2) => s2 ? Promise.resolve(e2) : k(v(t2, "success"), e2).then(() => k(v(t2, "complete"), e2)).then(() => Promise.resolve(e2)), (e2) => s2 ? Promise.reject(e2) : k(v(t2, "fail"), e2).then(() => k(v(t2, "complete"), e2)).then(() => Promise.reject(e2)));
      if (!(n2.success || n2.fail || n2.complete))
        return o2;
      o2.then((e2) => {
        n2.success && n2.success(e2), n2.complete && n2.complete(e2);
      }, (e2) => {
        n2.fail && n2.fail(e2), n2.complete && n2.complete(e2);
      });
    } : function(t3) {
      if (!((t3 = t3 || {}).success || t3.fail || t3.complete))
        return e.call(this, t3);
      e.call(this, t3).then((e2) => {
        t3.success && t3.success(e2), t3.complete && t3.complete(e2);
      }, (e2) => {
        t3.fail && t3.fail(e2), t3.complete && t3.complete(e2);
      });
    };
  }
  class T extends Error {
    constructor(e) {
      super(e.message), this.errMsg = e.message || "", Object.defineProperties(this, { code: { get: () => e.code }, errCode: { get: () => e.code }, requestId: { get: () => e.requestId }, message: { get() {
        return this.errMsg;
      }, set(e2) {
        this.errMsg = e2;
      } } });
    }
  }
  let A;
  function P() {
    const e = uni.getLocale && uni.getLocale() || "en";
    if (A)
      return __spreadProps(__spreadValues({}, A), { LOCALE: e });
    const { deviceId: t2, platform: n2 } = uni.getSystemInfoSync();
    return A = { PLATFORM: u, OS: n2, APPID: f, DEVICEID: t2, CLIENT_SDK_VERSION: "1.0.23" }, __spreadProps(__spreadValues({}, A), { LOCALE: e });
  }
  var I = { sign: function(e, t2) {
    let n2 = "";
    return Object.keys(e).sort().forEach(function(t3) {
      e[t3] && (n2 = n2 + "&" + t3 + "=" + e[t3]);
    }), n2 = n2.slice(1), r(n2, t2).toString();
  }, wrappedRequest: function(e, t2) {
    return new Promise((n2, s2) => {
      t2(Object.assign(e, { complete(e2) {
        e2 || (e2 = {});
        const t3 = e2.data && e2.data.header && e2.data.header["x-serverless-request-id"] || e2.header && e2.header["request-id"];
        if (!e2.statusCode || e2.statusCode >= 400)
          return s2(new T({ code: "SYS_ERR", message: e2.errMsg || "request:fail", requestId: t3 }));
        const r2 = e2.data;
        if (r2.error)
          return s2(new T({ code: r2.error.code, message: r2.error.message, requestId: t3 }));
        r2.result = r2.data, r2.requestId = t3, delete r2.data, n2(r2);
      } }));
    });
  } };
  var b = { request: (e) => uni.request(e), uploadFile: (e) => uni.uploadFile(e), setStorageSync: (e, t2) => uni.setStorageSync(e, t2), getStorageSync: (e) => uni.getStorageSync(e), removeStorageSync: (e) => uni.removeStorageSync(e), clearStorageSync: () => uni.clearStorageSync() }, E = { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" };
  const { t: O } = initVueI18n({ "zh-Hans": { "uniCloud.init.paramRequired": "\u7F3A\u5C11\u53C2\u6570\uFF1A{param}", "uniCloud.uploadFile.fileError": "filePath\u5E94\u4E3AFile\u5BF9\u8C61" }, "zh-Hant": { "uniCloud.init.paramRequired": "\u7F3A\u5C11\u53C2\u6570\uFF1A{param}", "uniCloud.uploadFile.fileError": "filePath\u5E94\u4E3AFile\u5BF9\u8C61" }, en: E, fr: { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" }, es: { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" }, ja: E }, "zh-Hans");
  var C = class {
    constructor(e) {
      ["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e, t2))
          throw new Error(O("uniCloud.init.paramRequired", { param: t2 }));
      }), this.config = Object.assign({}, { endpoint: "https://api.bspapp.com" }, e), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = b, this._getAccessTokenPromise = null, this._getAccessTokenPromiseStatus = null;
    }
    get hasAccessToken() {
      return !!this.accessToken;
    }
    setAccessToken(e) {
      this.accessToken = e;
    }
    requestWrapped(e) {
      return I.wrappedRequest(e, this.adapter.request);
    }
    requestAuth(e) {
      return this.requestWrapped(e);
    }
    request(e, t2) {
      return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e) : this.requestWrapped(e).catch((t3) => new Promise((e2, n2) => {
        !t3 || t3.code !== "GATEWAY_INVALID_TOKEN" && t3.code !== "InvalidParameter.InvalidToken" ? n2(t3) : e2();
      }).then(() => this.getAccessToken()).then(() => {
        const t4 = this.rebuildRequest(e);
        return this.request(t4, true);
      })) : this.getAccessToken().then(() => {
        const t3 = this.rebuildRequest(e);
        return this.request(t3, true);
      }));
    }
    rebuildRequest(e) {
      const t2 = Object.assign({}, e);
      return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = I.sign(t2.data, this.config.clientSecret), t2;
    }
    setupRequest(e, t2) {
      const n2 = Object.assign({}, e, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      return t2 !== "auth" && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = I.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
    }
    getAccessToken() {
      if (this._getAccessTokenPromiseStatus === "pending")
        return this._getAccessTokenPromise;
      this._getAccessTokenPromiseStatus = "pending";
      return this._getAccessTokenPromise = this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e) => new Promise((t2, n2) => {
        e.result && e.result.accessToken ? (this.setAccessToken(e.result.accessToken), this._getAccessTokenPromiseStatus = "fulfilled", t2(this.accessToken)) : (this._getAccessTokenPromiseStatus = "rejected", n2(new T({ code: "AUTH_FAILED", message: "\u83B7\u53D6accessToken\u5931\u8D25" })));
      }), (e) => (this._getAccessTokenPromiseStatus = "rejected", Promise.reject(e))), this._getAccessTokenPromise;
    }
    authorize() {
      this.getAccessToken();
    }
    callFunction(e) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e.name, functionArgs: e.data || {} }) };
      return this.request(this.setupRequest(t2));
    }
    getOSSUploadOptionsFromPath(e) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e) };
      return this.request(this.setupRequest(t2));
    }
    uploadFileToOSS({ url: e, formData: t2, name: n2, filePath: s2, fileType: r2, onUploadProgress: o2 }) {
      return new Promise((i2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e, formData: t2, name: n2, filePath: s2, fileType: r2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e2) {
          e2 && e2.statusCode < 400 ? i2(e2) : a2(new T({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        }, fail(e2) {
          a2(new T({ code: e2.code || "UPLOAD_FAILED", message: e2.message || e2.errMsg || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        } });
        typeof o2 == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((e2) => {
          o2({ loaded: e2.totalBytesSent, total: e2.totalBytesExpectedToSend });
        });
      });
    }
    reportOSSUpload(e) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e) };
      return this.request(this.setupRequest(t2));
    }
    uploadFile({ filePath: e, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2, config: r2 }) {
      if (o(t2) !== "string")
        throw new T({ code: "INVALID_PARAM", message: "cloudPath\u5FC5\u987B\u4E3A\u5B57\u7B26\u4E32\u7C7B\u578B" });
      if (!(t2 = t2.trim()))
        throw new T({ code: "CLOUDPATH_REQUIRED", message: "cloudPath\u4E0D\u53EF\u4E3A\u7A7A" });
      if (/:\/\//.test(t2))
        throw new T({ code: "INVALID_PARAM", message: "cloudPath\u4E0D\u5408\u6CD5" });
      const i2 = r2 && r2.envType || this.config.envType;
      let a2, c2;
      return this.getOSSUploadOptionsFromPath({ env: i2, filename: t2 }).then((t3) => {
        const r3 = t3.result;
        a2 = r3.id, c2 = "https://" + r3.cdnDomain + "/" + r3.ossPath;
        const o2 = { url: "https://" + r3.host, formData: { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: r3.accessKeyId, Signature: r3.signature, host: r3.host, id: a2, key: r3.ossPath, policy: r3.policy, success_action_status: 200 }, fileName: "file", name: "file", filePath: e, fileType: n2 };
        return this.uploadFileToOSS(Object.assign({}, o2, { onUploadProgress: s2 }));
      }).then(() => this.reportOSSUpload({ id: a2 })).then((t3) => new Promise((n3, s3) => {
        t3.success ? n3({ success: true, filePath: e, fileID: c2 }) : s3(new T({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      }));
    }
    deleteFile({ fileList: e }) {
      const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ id: e[0] }) };
      return this.request(this.setupRequest(t2));
    }
    getTempFileURL({ fileList: e } = {}) {
      return new Promise((t2, n2) => {
        Array.isArray(e) && e.length !== 0 || n2(new T({ code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" })), t2({ fileList: e.map((e2) => ({ fileID: e2, tempFileURL: e2 })) });
      });
    }
  };
  var U = { init(e) {
    const t2 = new C(e), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  const x = typeof location != "undefined" && location.protocol === "http:" ? "http:" : "https:";
  var D;
  !function(e) {
    e.local = "local", e.none = "none", e.session = "session";
  }(D || (D = {}));
  var q = function() {
  };
  const R = () => {
    let e;
    if (!Promise) {
      e = () => {
      }, e.promise = {};
      const t3 = () => {
        throw new Error('Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.');
      };
      return Object.defineProperty(e.promise, "then", { get: t3 }), Object.defineProperty(e.promise, "catch", { get: t3 }), e;
    }
    const t2 = new Promise((t3, n2) => {
      e = (e2, s2) => e2 ? n2(e2) : t3(s2);
    });
    return e.promise = t2, e;
  };
  function F(e) {
    return e === void 0;
  }
  function L(e) {
    return Object.prototype.toString.call(e) === "[object Null]";
  }
  var N;
  function $(e) {
    const t2 = (n2 = e, Object.prototype.toString.call(n2) === "[object Array]" ? e : [e]);
    var n2;
    for (const e2 of t2) {
      const { isMatch: t3, genAdapter: n3, runtime: s2 } = e2;
      if (t3())
        return { adapter: n3(), runtime: s2 };
    }
  }
  !function(e) {
    e.WEB = "web", e.WX_MP = "wx_mp";
  }(N || (N = {}));
  const M = { adapter: null, runtime: void 0 }, j = ["anonymousUuidKey"];
  class B extends q {
    constructor() {
      super(), M.adapter.root.tcbObject || (M.adapter.root.tcbObject = {});
    }
    setItem(e, t2) {
      M.adapter.root.tcbObject[e] = t2;
    }
    getItem(e) {
      return M.adapter.root.tcbObject[e];
    }
    removeItem(e) {
      delete M.adapter.root.tcbObject[e];
    }
    clear() {
      delete M.adapter.root.tcbObject;
    }
  }
  function K(e, t2) {
    switch (e) {
      case "local":
        return t2.localStorage || new B();
      case "none":
        return new B();
      default:
        return t2.sessionStorage || new B();
    }
  }
  class H {
    constructor(e) {
      if (!this._storage) {
        this._persistence = M.adapter.primaryStorage || e.persistence, this._storage = K(this._persistence, M.adapter);
        const t2 = `access_token_${e.env}`, n2 = `access_token_expire_${e.env}`, s2 = `refresh_token_${e.env}`, r2 = `anonymous_uuid_${e.env}`, o2 = `login_type_${e.env}`, i2 = `user_info_${e.env}`;
        this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: r2, loginTypeKey: o2, userInfoKey: i2 };
      }
    }
    updatePersistence(e) {
      if (e === this._persistence)
        return;
      const t2 = this._persistence === "local";
      this._persistence = e;
      const n2 = K(e, M.adapter);
      for (const e2 in this.keys) {
        const s2 = this.keys[e2];
        if (t2 && j.includes(e2))
          continue;
        const r2 = this._storage.getItem(s2);
        F(r2) || L(r2) || (n2.setItem(s2, r2), this._storage.removeItem(s2));
      }
      this._storage = n2;
    }
    setStore(e, t2, n2) {
      if (!this._storage)
        return;
      const s2 = { version: n2 || "localCachev1", content: t2 }, r2 = JSON.stringify(s2);
      try {
        this._storage.setItem(e, r2);
      } catch (e2) {
        throw e2;
      }
    }
    getStore(e, t2) {
      try {
        if (!this._storage)
          return;
      } catch (e2) {
        return "";
      }
      t2 = t2 || "localCachev1";
      const n2 = this._storage.getItem(e);
      if (!n2)
        return "";
      if (n2.indexOf(t2) >= 0) {
        return JSON.parse(n2).content;
      }
      return "";
    }
    removeStore(e) {
      this._storage.removeItem(e);
    }
  }
  const W = {}, z = {};
  function J(e) {
    return W[e];
  }
  class V {
    constructor(e, t2) {
      this.data = t2 || null, this.name = e;
    }
  }
  class Y extends V {
    constructor(e, t2) {
      super("error", { error: e, data: t2 }), this.error = e;
    }
  }
  const X = new class {
    constructor() {
      this._listeners = {};
    }
    on(e, t2) {
      return function(e2, t3, n2) {
        n2[e2] = n2[e2] || [], n2[e2].push(t3);
      }(e, t2, this._listeners), this;
    }
    off(e, t2) {
      return function(e2, t3, n2) {
        if (n2 && n2[e2]) {
          const s2 = n2[e2].indexOf(t3);
          s2 !== -1 && n2[e2].splice(s2, 1);
        }
      }(e, t2, this._listeners), this;
    }
    fire(e, t2) {
      if (e instanceof Y)
        return console.error(e.error), this;
      const n2 = typeof e == "string" ? new V(e, t2 || {}) : e;
      const s2 = n2.name;
      if (this._listens(s2)) {
        n2.target = this;
        const e2 = this._listeners[s2] ? [...this._listeners[s2]] : [];
        for (const t3 of e2)
          t3.call(this, n2);
      }
      return this;
    }
    _listens(e) {
      return this._listeners[e] && this._listeners[e].length > 0;
    }
  }();
  function G(e, t2) {
    X.on(e, t2);
  }
  function Q(e, t2 = {}) {
    X.fire(e, t2);
  }
  function Z(e, t2) {
    X.off(e, t2);
  }
  const ee = "loginStateChanged", te = "loginStateExpire", ne = "loginTypeChanged", se = "anonymousConverted", re = "refreshAccessToken";
  var oe;
  !function(e) {
    e.ANONYMOUS = "ANONYMOUS", e.WECHAT = "WECHAT", e.WECHAT_PUBLIC = "WECHAT-PUBLIC", e.WECHAT_OPEN = "WECHAT-OPEN", e.CUSTOM = "CUSTOM", e.EMAIL = "EMAIL", e.USERNAME = "USERNAME", e.NULL = "NULL";
  }(oe || (oe = {}));
  const ie = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], ae = { "X-SDK-Version": "1.3.5" };
  function ce(e, t2, n2) {
    const s2 = e[t2];
    e[t2] = function(t3) {
      const r2 = {}, o2 = {};
      n2.forEach((n3) => {
        const { data: s3, headers: i3 } = n3.call(e, t3);
        Object.assign(r2, s3), Object.assign(o2, i3);
      });
      const i2 = t3.data;
      return i2 && (() => {
        var e2;
        if (e2 = i2, Object.prototype.toString.call(e2) !== "[object FormData]")
          t3.data = __spreadValues(__spreadValues({}, i2), r2);
        else
          for (const e3 in r2)
            i2.append(e3, r2[e3]);
      })(), t3.headers = __spreadValues(__spreadValues({}, t3.headers || {}), o2), s2.call(e, t3);
    };
  }
  function ue() {
    const e = Math.random().toString(16).slice(2);
    return { data: { seqId: e }, headers: __spreadProps(__spreadValues({}, ae), { "x-seqid": e }) };
  }
  class he {
    constructor(e = {}) {
      var t2;
      this.config = e, this._reqClass = new M.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `\u8BF7\u6C42\u5728${this.config.timeout / 1e3}s\u5185\u672A\u5B8C\u6210\uFF0C\u5DF2\u4E2D\u65AD`, restrictedMethods: ["post"] }), this._cache = J(this.config.env), this._localCache = (t2 = this.config.env, z[t2]), ce(this._reqClass, "post", [ue]), ce(this._reqClass, "upload", [ue]), ce(this._reqClass, "download", [ue]);
    }
    async post(e) {
      return await this._reqClass.post(e);
    }
    async upload(e) {
      return await this._reqClass.upload(e);
    }
    async download(e) {
      return await this._reqClass.download(e);
    }
    async refreshAccessToken() {
      let e, t2;
      this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
      try {
        e = await this._refreshAccessTokenPromise;
      } catch (e2) {
        t2 = e2;
      }
      if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t2)
        throw t2;
      return e;
    }
    async _refreshAccessToken() {
      const { accessTokenKey: e, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: r2 } = this._cache.keys;
      this._cache.removeStore(e), this._cache.removeStore(t2);
      let o2 = this._cache.getStore(n2);
      if (!o2)
        throw new Error("\u672A\u767B\u5F55CloudBase");
      const i2 = { refresh_token: o2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", i2);
      if (a2.data.code) {
        const { code: e2 } = a2.data;
        if (e2 === "SIGN_PARAM_INVALID" || e2 === "REFRESH_TOKEN_EXPIRED" || e2 === "INVALID_REFRESH_TOKEN") {
          if (this._cache.getStore(s2) === oe.ANONYMOUS && e2 === "INVALID_REFRESH_TOKEN") {
            const e3 = this._cache.getStore(r2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e3, refresh_token: t3 });
            return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
          }
          Q(te), this._cache.removeStore(n2);
        }
        throw new Error(`\u5237\u65B0access token\u5931\u8D25\uFF1A${a2.data.code}`);
      }
      if (a2.data.access_token)
        return Q(re), this._cache.setStore(e, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
      a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
    }
    async getAccessToken() {
      const { accessTokenKey: e, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
      if (!this._cache.getStore(n2))
        throw new Error("refresh token\u4E0D\u5B58\u5728\uFF0C\u767B\u5F55\u72B6\u6001\u5F02\u5E38");
      let s2 = this._cache.getStore(e), r2 = this._cache.getStore(t2), o2 = true;
      return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, r2) && (o2 = false), (!s2 || !r2 || r2 < Date.now()) && o2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: r2 };
    }
    async request(e, t2, n2) {
      const s2 = `x-tcb-trace_${this.config.env}`;
      let r2 = "application/x-www-form-urlencoded";
      const o2 = __spreadValues({ action: e, env: this.config.env, dataVersion: "2019-08-16" }, t2);
      if (ie.indexOf(e) === -1) {
        const { refreshTokenKey: e2 } = this._cache.keys;
        this._cache.getStore(e2) && (o2.access_token = (await this.getAccessToken()).accessToken);
      }
      let i2;
      if (e === "storage.uploadFile") {
        i2 = new FormData();
        for (let e2 in i2)
          i2.hasOwnProperty(e2) && i2[e2] !== void 0 && i2.append(e2, o2[e2]);
        r2 = "multipart/form-data";
      } else {
        r2 = "application/json", i2 = {};
        for (let e2 in o2)
          o2[e2] !== void 0 && (i2[e2] = o2[e2]);
      }
      let a2 = { headers: { "content-type": r2 } };
      n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
      const c2 = this._localCache.getStore(s2);
      c2 && (a2.headers["X-TCB-Trace"] = c2);
      const { parse: u2, inQuery: h2, search: l2 } = t2;
      let d = { env: this.config.env };
      u2 && (d.parse = true), h2 && (d = __spreadValues(__spreadValues({}, h2), d));
      let f2 = function(e2, t3, n3 = {}) {
        const s3 = /\?/.test(t3);
        let r3 = "";
        for (let e3 in n3)
          r3 === "" ? !s3 && (t3 += "?") : r3 += "&", r3 += `${e3}=${encodeURIComponent(n3[e3])}`;
        return /^http(s)?\:\/\//.test(t3 += r3) ? t3 : `${e2}${t3}`;
      }(x, "//tcb-api.tencentcloudapi.com/web", d);
      l2 && (f2 += l2);
      const p2 = await this.post(__spreadValues({ url: f2, data: i2 }, a2)), g2 = p2.header && p2.header["x-tcb-trace"];
      if (g2 && this._localCache.setStore(s2, g2), Number(p2.status) !== 200 && Number(p2.statusCode) !== 200 || !p2.data)
        throw new Error("network request error");
      return p2;
    }
    async send(e, t2 = {}) {
      const n2 = await this.request(e, t2, { onUploadProgress: t2.onUploadProgress });
      if (n2.data.code === "ACCESS_TOKEN_EXPIRED" && ie.indexOf(e) === -1) {
        await this.refreshAccessToken();
        const n3 = await this.request(e, t2, { onUploadProgress: t2.onUploadProgress });
        if (n3.data.code)
          throw new Error(`[${n3.data.code}] ${n3.data.message}`);
        return n3.data;
      }
      if (n2.data.code)
        throw new Error(`[${n2.data.code}] ${n2.data.message}`);
      return n2.data;
    }
    setRefreshToken(e) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e);
    }
  }
  const le = {};
  function de(e) {
    return le[e];
  }
  class fe {
    constructor(e) {
      this.config = e, this._cache = J(e.env), this._request = de(e.env);
    }
    setRefreshToken(e) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e);
    }
    setAccessToken(e, t2) {
      const { accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys;
      this._cache.setStore(n2, e), this._cache.setStore(s2, t2);
    }
    async refreshUserInfo() {
      const { data: e } = await this._request.send("auth.getUserInfo", {});
      return this.setLocalUserInfo(e), e;
    }
    setLocalUserInfo(e) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e);
    }
  }
  class pe {
    constructor(e) {
      if (!e)
        throw new Error("envId is not defined");
      this._envId = e, this._cache = J(this._envId), this._request = de(this._envId), this.setUserInfo();
    }
    linkWithTicket(e) {
      if (typeof e != "string")
        throw new Error("ticket must be string");
      return this._request.send("auth.linkWithTicket", { ticket: e });
    }
    linkWithRedirect(e) {
      e.signInWithRedirect();
    }
    updatePassword(e, t2) {
      return this._request.send("auth.updatePassword", { oldPassword: t2, newPassword: e });
    }
    updateEmail(e) {
      return this._request.send("auth.updateEmail", { newEmail: e });
    }
    updateUsername(e) {
      if (typeof e != "string")
        throw new Error("username must be a string");
      return this._request.send("auth.updateUsername", { username: e });
    }
    async getLinkedUidList() {
      const { data: e } = await this._request.send("auth.getLinkedUidList", {});
      let t2 = false;
      const { users: n2 } = e;
      return n2.forEach((e2) => {
        e2.wxOpenId && e2.wxPublicId && (t2 = true);
      }), { users: n2, hasPrimaryUid: t2 };
    }
    setPrimaryUid(e) {
      return this._request.send("auth.setPrimaryUid", { uid: e });
    }
    unlink(e) {
      return this._request.send("auth.unlink", { platform: e });
    }
    async update(e) {
      const { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: o2, city: i2 } = e, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: o2, city: i2 });
      this.setLocalUserInfo(a2);
    }
    async refresh() {
      const { data: e } = await this._request.send("auth.getUserInfo", {});
      return this.setLocalUserInfo(e), e;
    }
    setUserInfo() {
      const { userInfoKey: e } = this._cache.keys, t2 = this._cache.getStore(e);
      ["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword", "customUserId", "nickName", "gender", "avatarUrl"].forEach((e2) => {
        this[e2] = t2[e2];
      }), this.location = { country: t2.country, province: t2.province, city: t2.city };
    }
    setLocalUserInfo(e) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e), this.setUserInfo();
    }
  }
  class ge {
    constructor(e) {
      if (!e)
        throw new Error("envId is not defined");
      this._cache = J(e);
      const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, r2 = this._cache.getStore(t2), o2 = this._cache.getStore(n2), i2 = this._cache.getStore(s2);
      this.credential = { refreshToken: r2, accessToken: o2, accessTokenExpire: i2 }, this.user = new pe(e);
    }
    get isAnonymousAuth() {
      return this.loginType === oe.ANONYMOUS;
    }
    get isCustomAuth() {
      return this.loginType === oe.CUSTOM;
    }
    get isWeixinAuth() {
      return this.loginType === oe.WECHAT || this.loginType === oe.WECHAT_OPEN || this.loginType === oe.WECHAT_PUBLIC;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
  }
  class me extends fe {
    async signIn() {
      this._cache.updatePersistence("local");
      const { anonymousUuidKey: e, refreshTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e) || void 0, s2 = this._cache.getStore(t2) || void 0, r2 = await this._request.send("auth.signInAnonymously", { anonymous_uuid: n2, refresh_token: s2 });
      if (r2.uuid && r2.refresh_token) {
        this._setAnonymousUUID(r2.uuid), this.setRefreshToken(r2.refresh_token), await this._request.refreshAccessToken(), Q(ee), Q(ne, { env: this.config.env, loginType: oe.ANONYMOUS, persistence: "local" });
        const e2 = new ge(this.config.env);
        return await e2.user.refresh(), e2;
      }
      throw new Error("\u533F\u540D\u767B\u5F55\u5931\u8D25");
    }
    async linkAndRetrieveDataWithTicket(e) {
      const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), o2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: r2, ticket: e });
      if (o2.refresh_token)
        return this._clearAnonymousUUID(), this.setRefreshToken(o2.refresh_token), await this._request.refreshAccessToken(), Q(se, { env: this.config.env }), Q(ne, { loginType: oe.CUSTOM, persistence: "local" }), { credential: { refreshToken: o2.refresh_token } };
      throw new Error("\u533F\u540D\u8F6C\u5316\u5931\u8D25");
    }
    _setAnonymousUUID(e) {
      const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.setStore(t2, e), this._cache.setStore(n2, oe.ANONYMOUS);
    }
    _clearAnonymousUUID() {
      this._cache.removeStore(this._cache.keys.anonymousUuidKey);
    }
  }
  class ye extends fe {
    async signIn(e) {
      if (typeof e != "string")
        throw new Error("ticket must be a string");
      const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e, refresh_token: this._cache.getStore(t2) || "" });
      if (n2.refresh_token)
        return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), Q(ee), Q(ne, { env: this.config.env, loginType: oe.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new ge(this.config.env);
      throw new Error("\u81EA\u5B9A\u4E49\u767B\u5F55\u5931\u8D25");
    }
  }
  class _e extends fe {
    async signIn(e, t2) {
      if (typeof e != "string")
        throw new Error("email must be a string");
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token: o2, access_token_expire: i2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), o2 && i2 ? this.setAccessToken(o2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), Q(ee), Q(ne, { env: this.config.env, loginType: oe.EMAIL, persistence: this.config.persistence }), new ge(this.config.env);
      throw s2.code ? new Error(`\u90AE\u7BB1\u767B\u5F55\u5931\u8D25: [${s2.code}] ${s2.message}`) : new Error("\u90AE\u7BB1\u767B\u5F55\u5931\u8D25");
    }
    async activate(e) {
      return this._request.send("auth.activateEndUserMail", { token: e });
    }
    async resetPasswordWithToken(e, t2) {
      return this._request.send("auth.resetPasswordWithToken", { token: e, newPassword: t2 });
    }
  }
  class we extends fe {
    async signIn(e, t2) {
      if (typeof e != "string")
        throw new Error("username must be a string");
      typeof t2 != "string" && (t2 = "", console.warn("password is empty"));
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: oe.USERNAME, username: e, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token_expire: o2, access_token: i2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), i2 && o2 ? this.setAccessToken(i2, o2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), Q(ee), Q(ne, { env: this.config.env, loginType: oe.USERNAME, persistence: this.config.persistence }), new ge(this.config.env);
      throw s2.code ? new Error(`\u7528\u6237\u540D\u5BC6\u7801\u767B\u5F55\u5931\u8D25: [${s2.code}] ${s2.message}`) : new Error("\u7528\u6237\u540D\u5BC6\u7801\u767B\u5F55\u5931\u8D25");
    }
  }
  class ke {
    constructor(e) {
      this.config = e, this._cache = J(e.env), this._request = de(e.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), G(ne, this._onLoginTypeChanged);
    }
    get currentUser() {
      const e = this.hasLoginState();
      return e && e.user || null;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
    anonymousAuthProvider() {
      return new me(this.config);
    }
    customAuthProvider() {
      return new ye(this.config);
    }
    emailAuthProvider() {
      return new _e(this.config);
    }
    usernameAuthProvider() {
      return new we(this.config);
    }
    async signInAnonymously() {
      return new me(this.config).signIn();
    }
    async signInWithEmailAndPassword(e, t2) {
      return new _e(this.config).signIn(e, t2);
    }
    signInWithUsernameAndPassword(e, t2) {
      return new we(this.config).signIn(e, t2);
    }
    async linkAndRetrieveDataWithTicket(e) {
      this._anonymousAuthProvider || (this._anonymousAuthProvider = new me(this.config)), G(se, this._onAnonymousConverted);
      return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e);
    }
    async signOut() {
      if (this.loginType === oe.ANONYMOUS)
        throw new Error("\u533F\u540D\u7528\u6237\u4E0D\u652F\u6301\u767B\u51FA\u64CD\u4F5C");
      const { refreshTokenKey: e, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e);
      if (!s2)
        return;
      const r2 = await this._request.send("auth.logout", { refresh_token: s2 });
      return this._cache.removeStore(e), this._cache.removeStore(t2), this._cache.removeStore(n2), Q(ee), Q(ne, { env: this.config.env, loginType: oe.NULL, persistence: this.config.persistence }), r2;
    }
    async signUpWithEmailAndPassword(e, t2) {
      return this._request.send("auth.signUpWithEmailAndPassword", { email: e, password: t2 });
    }
    async sendPasswordResetEmail(e) {
      return this._request.send("auth.sendPasswordResetEmail", { email: e });
    }
    onLoginStateChanged(e) {
      G(ee, () => {
        const t3 = this.hasLoginState();
        e.call(this, t3);
      });
      const t2 = this.hasLoginState();
      e.call(this, t2);
    }
    onLoginStateExpired(e) {
      G(te, e.bind(this));
    }
    onAccessTokenRefreshed(e) {
      G(re, e.bind(this));
    }
    onAnonymousConverted(e) {
      G(se, e.bind(this));
    }
    onLoginTypeChanged(e) {
      G(ne, () => {
        const t2 = this.hasLoginState();
        e.call(this, t2);
      });
    }
    async getAccessToken() {
      return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
    }
    hasLoginState() {
      const { refreshTokenKey: e } = this._cache.keys;
      return this._cache.getStore(e) ? new ge(this.config.env) : null;
    }
    async isUsernameRegistered(e) {
      if (typeof e != "string")
        throw new Error("username must be a string");
      const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e });
      return t2 && t2.isRegistered;
    }
    getLoginState() {
      return Promise.resolve(this.hasLoginState());
    }
    async signInWithTicket(e) {
      return new ye(this.config).signIn(e);
    }
    shouldRefreshAccessToken(e) {
      this._request._shouldRefreshAccessTokenHook = e.bind(this);
    }
    getUserInfo() {
      return this._request.send("auth.getUserInfo", {}).then((e) => e.code ? e : __spreadProps(__spreadValues({}, e.data), { requestId: e.seqId }));
    }
    getAuthHeader() {
      const { refreshTokenKey: e, accessTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e);
      return { "x-cloudbase-credentials": this._cache.getStore(t2) + "/@@/" + n2 };
    }
    _onAnonymousConverted(e) {
      const { env: t2 } = e.data;
      t2 === this.config.env && this._cache.updatePersistence(this.config.persistence);
    }
    _onLoginTypeChanged(e) {
      const { loginType: t2, persistence: n2, env: s2 } = e.data;
      s2 === this.config.env && (this._cache.updatePersistence(n2), this._cache.setStore(this._cache.keys.loginTypeKey, t2));
    }
  }
  const ve = function(e, t2) {
    t2 = t2 || R();
    const n2 = de(this.config.env), { cloudPath: s2, filePath: r2, onUploadProgress: o2, fileType: i2 = "image" } = e;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e2) => {
      const { data: { url: a2, authorization: c2, token: u2, fileId: h2, cosFileId: l2 }, requestId: d } = e2, f2 = { key: s2, signature: c2, "x-cos-meta-fileid": l2, success_action_status: "201", "x-cos-security-token": u2 };
      n2.upload({ url: a2, data: f2, file: r2, name: s2, fileType: i2, onUploadProgress: o2 }).then((e3) => {
        e3.statusCode === 201 ? t2(null, { fileID: h2, requestId: d }) : t2(new Error(`STORAGE_REQUEST_FAIL: ${e3.data}`));
      }).catch((e3) => {
        t2(e3);
      });
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, Se = function(e, t2) {
    t2 = t2 || R();
    const n2 = de(this.config.env), { cloudPath: s2 } = e;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e2) => {
      t2(null, e2);
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, Te = function({ fileList: e }, t2) {
    if (t2 = t2 || R(), !e || !Array.isArray(e))
      return { code: "INVALID_PARAM", message: "fileList\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u6570\u7EC4" };
    for (let t3 of e)
      if (!t3 || typeof t3 != "string")
        return { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" };
    const n2 = { fileid_list: e };
    return de(this.config.env).send("storage.batchDeleteFile", n2).then((e2) => {
      e2.code ? t2(null, e2) : t2(null, { fileList: e2.data.delete_list, requestId: e2.requestId });
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, Ae = function({ fileList: e }, t2) {
    t2 = t2 || R(), e && Array.isArray(e) || t2(null, { code: "INVALID_PARAM", message: "fileList\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u6570\u7EC4" });
    let n2 = [];
    for (let s3 of e)
      typeof s3 == "object" ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u5305\u542BfileID\u548CmaxAge\u7684\u5BF9\u8C61" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : typeof s3 == "string" ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u5B57\u7B26\u4E32" });
    const s2 = { file_list: n2 };
    return de(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e2) => {
      e2.code ? t2(null, e2) : t2(null, { fileList: e2.data.download_list, requestId: e2.requestId });
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, Pe = async function({ fileID: e }, t2) {
    const n2 = (await Ae.call(this, { fileList: [{ fileID: e, maxAge: 600 }] })).fileList[0];
    if (n2.code !== "SUCCESS")
      return t2 ? t2(n2) : new Promise((e2) => {
        e2(n2);
      });
    const s2 = de(this.config.env);
    let r2 = n2.download_url;
    if (r2 = encodeURI(r2), !t2)
      return s2.download({ url: r2 });
    t2(await s2.download({ url: r2 }));
  }, Ie = function({ name: e, data: t2, query: n2, parse: s2, search: r2 }, o2) {
    const i2 = o2 || R();
    let a2;
    try {
      a2 = t2 ? JSON.stringify(t2) : "";
    } catch (e2) {
      return Promise.reject(e2);
    }
    if (!e)
      return Promise.reject(new Error("\u51FD\u6570\u540D\u4E0D\u80FD\u4E3A\u7A7A"));
    const c2 = { inQuery: n2, parse: s2, search: r2, function_name: e, request_data: a2 };
    return de(this.config.env).send("functions.invokeFunction", c2).then((e2) => {
      if (e2.code)
        i2(null, e2);
      else {
        let t3 = e2.data.response_data;
        if (s2)
          i2(null, { result: t3, requestId: e2.requestId });
        else
          try {
            t3 = JSON.parse(e2.data.response_data), i2(null, { result: t3, requestId: e2.requestId });
          } catch (e3) {
            i2(new Error("response data must be json"));
          }
      }
      return i2.promise;
    }).catch((e2) => {
      i2(e2);
    }), i2.promise;
  }, be = { timeout: 15e3, persistence: "session" }, Ee = {};
  class Oe {
    constructor(e) {
      this.config = e || this.config, this.authObj = void 0;
    }
    init(e) {
      switch (M.adapter || (this.requestClient = new M.adapter.reqClass({ timeout: e.timeout || 5e3, timeoutMsg: `\u8BF7\u6C42\u5728${(e.timeout || 5e3) / 1e3}s\u5185\u672A\u5B8C\u6210\uFF0C\u5DF2\u4E2D\u65AD` })), this.config = __spreadValues(__spreadValues({}, be), e), true) {
        case this.config.timeout > 6e5:
          console.warn("timeout\u5927\u4E8E\u53EF\u914D\u7F6E\u4E0A\u9650[10\u5206\u949F]\uFF0C\u5DF2\u91CD\u7F6E\u4E3A\u4E0A\u9650\u6570\u503C"), this.config.timeout = 6e5;
          break;
        case this.config.timeout < 100:
          console.warn("timeout\u5C0F\u4E8E\u53EF\u914D\u7F6E\u4E0B\u9650[100ms]\uFF0C\u5DF2\u91CD\u7F6E\u4E3A\u4E0B\u9650\u6570\u503C"), this.config.timeout = 100;
      }
      return new Oe(this.config);
    }
    auth({ persistence: e } = {}) {
      if (this.authObj)
        return this.authObj;
      const t2 = e || M.adapter.primaryStorage || be.persistence;
      var n2;
      return t2 !== this.config.persistence && (this.config.persistence = t2), function(e2) {
        const { env: t3 } = e2;
        W[t3] = new H(e2), z[t3] = new H(__spreadProps(__spreadValues({}, e2), { persistence: "local" }));
      }(this.config), n2 = this.config, le[n2.env] = new he(n2), this.authObj = new ke(this.config), this.authObj;
    }
    on(e, t2) {
      return G.apply(this, [e, t2]);
    }
    off(e, t2) {
      return Z.apply(this, [e, t2]);
    }
    callFunction(e, t2) {
      return Ie.apply(this, [e, t2]);
    }
    deleteFile(e, t2) {
      return Te.apply(this, [e, t2]);
    }
    getTempFileURL(e, t2) {
      return Ae.apply(this, [e, t2]);
    }
    downloadFile(e, t2) {
      return Pe.apply(this, [e, t2]);
    }
    uploadFile(e, t2) {
      return ve.apply(this, [e, t2]);
    }
    getUploadMetadata(e, t2) {
      return Se.apply(this, [e, t2]);
    }
    registerExtension(e) {
      Ee[e.name] = e;
    }
    async invokeExtension(e, t2) {
      const n2 = Ee[e];
      if (!n2)
        throw Error(`\u6269\u5C55${e} \u5FC5\u987B\u5148\u6CE8\u518C`);
      return await n2.invoke(t2, this);
    }
    useAdapters(e) {
      const { adapter: t2, runtime: n2 } = $(e) || {};
      t2 && (M.adapter = t2), n2 && (M.runtime = n2);
    }
  }
  var Ce = new Oe();
  function Ue(e, t2, n2) {
    n2 === void 0 && (n2 = {});
    var s2 = /\?/.test(t2), r2 = "";
    for (var o2 in n2)
      r2 === "" ? !s2 && (t2 += "?") : r2 += "&", r2 += o2 + "=" + encodeURIComponent(n2[o2]);
    return /^http(s)?:\/\//.test(t2 += r2) ? t2 : "" + e + t2;
  }
  class xe {
    post(e) {
      const { url: t2, data: n2, headers: s2 } = e;
      return new Promise((e2, r2) => {
        b.request({ url: Ue("https:", t2), data: n2, method: "POST", header: s2, success(t3) {
          e2(t3);
        }, fail(e3) {
          r2(e3);
        } });
      });
    }
    upload(e) {
      return new Promise((t2, n2) => {
        const { url: s2, file: r2, data: o2, headers: i2, fileType: a2 } = e, h2 = b.uploadFile({ url: Ue("https:", s2), name: "file", formData: Object.assign({}, o2), filePath: r2, fileType: a2, header: i2, success(e2) {
          const n3 = { statusCode: e2.statusCode, data: e2.data || {} };
          e2.statusCode === 200 && o2.success_action_status && (n3.statusCode = parseInt(o2.success_action_status, 10)), t2(n3);
        }, fail(e2) {
          n2(new Error(e2.errMsg || "uploadFile:fail"));
        } });
        typeof e.onUploadProgress == "function" && h2 && typeof h2.onProgressUpdate == "function" && h2.onProgressUpdate((t3) => {
          e.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
        });
      });
    }
  }
  const De = { setItem(e, t2) {
    b.setStorageSync(e, t2);
  }, getItem: (e) => b.getStorageSync(e), removeItem(e) {
    b.removeStorageSync(e);
  }, clear() {
    b.clearStorageSync();
  } };
  var qe = { genAdapter: function() {
    return { root: {}, reqClass: xe, localStorage: De, primaryStorage: "local" };
  }, isMatch: function() {
    return true;
  }, runtime: "uni_app" };
  Ce.useAdapters(qe);
  const Re = Ce, Fe = Re.init;
  Re.init = function(e) {
    e.env = e.spaceId;
    const t2 = Fe.call(this, e);
    t2.config.provider = "tencent", t2.config.spaceId = e.spaceId;
    const n2 = t2.auth;
    return t2.auth = function(e2) {
      const t3 = n2.call(this, e2);
      return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e3) => {
        t3[e3] = S(t3[e3]).bind(t3);
      }), t3;
    }, t2.customAuth = t2.auth, t2;
  };
  var Le = Re;
  function Ne(e) {
    return e && Ne(e.__v_raw) || e;
  }
  function $e() {
    return { token: b.getStorageSync("uni_id_token") || b.getStorageSync("uniIdToken"), tokenExpired: b.getStorageSync("uni_id_token_expired") };
  }
  var je = class extends C {
    getAccessToken() {
      return new Promise((e, t2) => {
        const n2 = "Anonymous_Access_token";
        this.setAccessToken(n2), e(n2);
      });
    }
    setupRequest(e, t2) {
      const n2 = Object.assign({}, e, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      t2 !== "auth" && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = I.sign(n2, this.config.clientSecret);
      const r2 = P();
      s2["x-client-info"] = JSON.stringify(r2);
      const { token: o2 } = $e();
      return s2["x-client-token"] = o2, { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: JSON.parse(JSON.stringify(s2)) };
    }
    uploadFileToOSS({ url: e, formData: t2, name: n2, filePath: s2, fileType: r2, onUploadProgress: o2 }) {
      return new Promise((i2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e, formData: t2, name: n2, filePath: s2, fileType: r2, success(e2) {
          e2 && e2.statusCode < 400 ? i2(e2) : a2(new T({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        }, fail(e2) {
          a2(new T({ code: e2.code || "UPLOAD_FAILED", message: e2.message || e2.errMsg || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        } });
        typeof o2 == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((e2) => {
          o2({ loaded: e2.totalBytesSent, total: e2.totalBytesExpectedToSend });
        });
      });
    }
    uploadFile({ filePath: e, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
      if (!t2)
        throw new T({ code: "CLOUDPATH_REQUIRED", message: "cloudPath\u4E0D\u53EF\u4E3A\u7A7A" });
      let r2;
      return this.getOSSUploadOptionsFromPath({ cloudPath: t2 }).then((t3) => {
        const { url: o2, formData: i2, name: a2 } = t3.result;
        r2 = t3.result.fileUrl;
        const c2 = { url: o2, formData: i2, name: a2, filePath: e, fileType: n2 };
        return this.uploadFileToOSS(Object.assign({}, c2, { onUploadProgress: s2 }));
      }).then(() => this.reportOSSUpload({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
        t3.success ? n3({ success: true, filePath: e, fileID: r2 }) : s3(new T({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      }));
    }
    deleteFile({ fileList: e }) {
      const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e }) };
      return this.request(this.setupRequest(t2));
    }
    getTempFileURL({ fileList: e } = {}) {
      const t2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e }) };
      return this.request(this.setupRequest(t2));
    }
  };
  var Be = { init(e) {
    const t2 = new je(e), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  function Ke({ data: e }) {
    let t2;
    t2 = P();
    const n2 = JSON.parse(JSON.stringify(e || {}));
    if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
      const { token: e2 } = $e();
      e2 && (n2.uniIdToken = e2);
    }
    return n2;
  }
  function He({ name: e, data: t2 }) {
    const { localAddress: n2, localPort: s2 } = this, r2 = { aliyun: "aliyun", tencent: "tcb" }[this.config.provider], o2 = this.config.spaceId, i2 = `http://${n2}:${s2}/system/check-function`, a2 = `http://${n2}:${s2}/cloudfunctions/${e}`;
    return new Promise((t3, n3) => {
      b.request({ method: "POST", url: i2, data: { name: e, platform: u, provider: r2, spaceId: o2 }, timeout: 3e3, success(e2) {
        t3(e2);
      }, fail() {
        t3({ data: { code: "NETWORK_ERROR", message: "\u8FDE\u63A5\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u5BA2\u6237\u7AEF\u662F\u5426\u548C\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570\u3002" } });
      } });
    }).then(({ data: e2 } = {}) => {
      const { code: t3, message: n3 } = e2 || {};
      return { code: t3 === 0 ? 0 : t3 || "SYS_ERR", message: n3 || "SYS_ERR" };
    }).then(({ code: n3, message: s3 }) => {
      if (n3 !== 0) {
        switch (n3) {
          case "MODULE_ENCRYPTED":
            console.error(`\u6B64\u4E91\u51FD\u6570\uFF08${e}\uFF09\u4F9D\u8D56\u52A0\u5BC6\u516C\u5171\u6A21\u5757\u4E0D\u53EF\u672C\u5730\u8C03\u8BD5\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u4E91\u7AEF\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570`);
            break;
          case "FUNCTION_ENCRYPTED":
            console.error(`\u6B64\u4E91\u51FD\u6570\uFF08${e}\uFF09\u5DF2\u52A0\u5BC6\u4E0D\u53EF\u672C\u5730\u8C03\u8BD5\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u4E91\u7AEF\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570`);
            break;
          case "ACTION_ENCRYPTED":
            console.error(s3 || "\u9700\u8981\u8BBF\u95EE\u52A0\u5BC6\u7684uni-clientDB-action\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u4E91\u7AEF\u73AF\u5883");
            break;
          case "NETWORK_ERROR": {
            const e2 = "\u8FDE\u63A5\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u5BA2\u6237\u7AEF\u662F\u5426\u548C\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B";
            throw console.error(e2), new Error(e2);
          }
          case "SWITCH_TO_CLOUD":
            break;
          default: {
            const e2 = `\u68C0\u6D4B\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u51FA\u73B0\u9519\u8BEF\uFF1A${s3}\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u73AF\u5883\u6216\u91CD\u542F\u5BA2\u6237\u7AEF\u518D\u8BD5`;
            throw console.error(e2), new Error(e2);
          }
        }
        return this._originCallFunction({ name: e, data: t2 });
      }
      return new Promise((e2, n4) => {
        const s4 = Ke.call(this, { data: t2 });
        b.request({ method: "POST", url: a2, data: { provider: r2, platform: u, param: s4 }, success: ({ statusCode: t3, data: s5 } = {}) => !t3 || t3 >= 400 ? n4(new T({ code: s5.code || "SYS_ERR", message: s5.message || "request:fail" })) : e2({ result: s5 }), fail(e3) {
          n4(new T({ code: e3.code || e3.errCode || "SYS_ERR", message: e3.message || e3.errMsg || "request:fail" }));
        } });
      });
    });
  }
  const We = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "\uFF0C\u4E91\u51FD\u6570[{functionName}]\u5728\u4E91\u7AEF\u4E0D\u5B58\u5728\uFF0C\u8BF7\u68C0\u67E5\u6B64\u4E91\u51FD\u6570\u540D\u79F0\u662F\u5426\u6B63\u786E\u4EE5\u53CA\u8BE5\u4E91\u51FD\u6570\u662F\u5426\u5DF2\u4E0A\u4F20\u5230\u670D\u52A1\u7A7A\u95F4", mode: "append" }];
  var ze = /[\\^$.*+?()[\]{}|]/g, Je = RegExp(ze.source);
  function Ve(e, t2, n2) {
    return e.replace(new RegExp((s2 = t2) && Je.test(s2) ? s2.replace(ze, "\\$&") : s2, "g"), n2);
    var s2;
  }
  function Ye({ functionName: e, result: t2, logPvd: n2 }) {
    if (this.config.useDebugFunction && t2 && t2.requestId) {
      const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e, requestId: t2.requestId });
      console.log(`[${n2}-request]${s2}[/${n2}-request]`);
    }
  }
  function Xe(e) {
    const t2 = e.callFunction, n2 = function(n3) {
      const s2 = n3.name;
      n3.data = Ke.call(e, { data: n3.data });
      const r2 = { aliyun: "aliyun", tencent: "tcb" }[this.config.provider];
      return t2.call(this, n3).then((e2) => (Ye.call(this, { functionName: s2, result: e2, logPvd: r2 }), Promise.resolve(e2)), (e2) => (Ye.call(this, { functionName: s2, result: e2, logPvd: r2 }), e2 && e2.message && (e2.message = function({ message: e3 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
        for (let s3 = 0; s3 < n4.length; s3++) {
          const { rule: r3, content: o2, mode: i2 } = n4[s3], a2 = e3.match(r3);
          if (!a2)
            continue;
          let c2 = o2;
          for (let e4 = 1; e4 < a2.length; e4++)
            c2 = Ve(c2, `{$${e4}}`, a2[e4]);
          for (const e4 in t3)
            c2 = Ve(c2, `{${e4}}`, t3[e4]);
          return i2 === "replace" ? c2 : e3 + c2;
        }
        return e3;
      }({ message: `[${n3.name}]: ${e2.message}`, formatter: We, extraInfo: { functionName: s2 } })), Promise.reject(e2)));
    };
    e.callFunction = function(t3) {
      let s2;
      return e.debugInfo && !e.debugInfo.forceRemote && l ? (e._originCallFunction || (e._originCallFunction = n2), s2 = He.call(this, t3)) : s2 = n2.call(this, t3), Object.defineProperty(s2, "result", { get: () => (console.warn("\u5F53\u524D\u8FD4\u56DE\u7ED3\u679C\u4E3APromise\u7C7B\u578B\uFF0C\u4E0D\u53EF\u76F4\u63A5\u8BBF\u95EE\u5176result\u5C5E\u6027\uFF0C\u8BE6\u60C5\u8BF7\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), s2;
    };
  }
  const Ge = Symbol("CLIENT_DB_INTERNAL");
  function Qe(e, t2) {
    return e.then = "DoNotReturnProxyWithAFunctionNamedThen", e._internalType = Ge, e.__v_raw = void 0, new Proxy(e, { get(e2, n2, s2) {
      if (n2 === "_uniClient")
        return null;
      if (n2 in e2 || typeof n2 != "string") {
        const t3 = e2[n2];
        return typeof t3 == "function" ? t3.bind(e2) : t3;
      }
      return t2.get(e2, n2, s2);
    } });
  }
  function Ze(e) {
    return { on: (t2, n2) => {
      e[t2] = e[t2] || [], e[t2].indexOf(n2) > -1 || e[t2].push(n2);
    }, off: (t2, n2) => {
      e[t2] = e[t2] || [];
      const s2 = e[t2].indexOf(n2);
      s2 !== -1 && e[t2].splice(s2, 1);
    } };
  }
  const et = ["db.Geo", "db.command", "command.aggregate"];
  function tt(e, t2) {
    return et.indexOf(`${e}.${t2}`) > -1;
  }
  function nt(e) {
    switch (o(e = Ne(e))) {
      case "array":
        return e.map((e2) => nt(e2));
      case "object":
        return e._internalType === Ge || Object.keys(e).forEach((t2) => {
          e[t2] = nt(e[t2]);
        }), e;
      case "regexp":
        return { $regexp: { source: e.source, flags: e.flags } };
      case "date":
        return { $date: e.toISOString() };
      default:
        return e;
    }
  }
  class st {
    constructor(e, t2, n2) {
      this.content = e, this.prevStage = t2 || null, this.udb = null, this._database = n2;
    }
    toJSON() {
      let e = this;
      const t2 = [e.content];
      for (; e.prevStage; )
        e = e.prevStage, t2.push(e.content);
      return { $db: t2.reverse().map((e2) => ({ $method: e2.$method, $param: nt(e2.$param) })) };
    }
    getAction() {
      const e = this.toJSON().$db.find((e2) => e2.$method === "action");
      return e && e.$param && e.$param[0];
    }
    getCommand() {
      return { $db: this.toJSON().$db.filter((e) => e.$method !== "action") };
    }
    get useAggregate() {
      let e = this, t2 = false;
      for (; e.prevStage; ) {
        e = e.prevStage;
        const n2 = e.content.$method;
        if (n2 === "aggregate" || n2 === "pipeline") {
          t2 = true;
          break;
        }
      }
      return t2;
    }
    get count() {
      if (!this.useAggregate)
        return function() {
          return this._send("count", Array.from(arguments));
        };
      const e = this;
      return function() {
        return rt({ $method: "count", $param: nt(Array.from(arguments)) }, e, this._database);
      };
    }
    get() {
      return this._send("get", Array.from(arguments));
    }
    add() {
      return this._send("add", Array.from(arguments));
    }
    remove() {
      return this._send("remove", Array.from(arguments));
    }
    update() {
      return this._send("update", Array.from(arguments));
    }
    end() {
      return this._send("end", Array.from(arguments));
    }
    set() {
      throw new Error("clientDB\u7981\u6B62\u4F7F\u7528set\u65B9\u6CD5");
    }
    _send(e, t2) {
      const n2 = this.getAction(), s2 = this.getCommand();
      if (s2.$db.push({ $method: e, $param: nt(t2) }), c) {
        const e2 = s2.$db.find((e3) => e3.$method === "collection"), t3 = e2 && e2.$param;
        t3 && t3.length === 1 && typeof e2.$param[0] == "string" && e2.$param[0].indexOf(",") > -1 && console.warn("\u68C0\u6D4B\u5230\u4F7F\u7528JQL\u8BED\u6CD5\u8054\u8868\u67E5\u8BE2\u65F6\uFF0C\u672A\u4F7F\u7528getTemp\u5148\u8FC7\u6EE4\u4E3B\u8868\u6570\u636E\uFF0C\u5728\u4E3B\u8868\u6570\u636E\u91CF\u5927\u7684\u60C5\u51B5\u4E0B\u53EF\u80FD\u4F1A\u67E5\u8BE2\u7F13\u6162\u3002\n- \u5982\u4F55\u4F18\u5316\u8BF7\u53C2\u8003\u6B64\u6587\u6863\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp \n- \u5982\u679C\u4E3B\u8868\u6570\u636E\u91CF\u5F88\u5C0F\u8BF7\u5FFD\u7565\u6B64\u4FE1\u606F\uFF0C\u9879\u76EE\u53D1\u884C\u65F6\u4E0D\u4F1A\u51FA\u73B0\u6B64\u63D0\u793A\u3002");
      }
      return this._database._callCloudFunction({ action: n2, command: s2 });
    }
  }
  function rt(e, t2, n2) {
    return Qe(new st(e, t2, n2), { get(e2, t3) {
      let s2 = "db";
      return e2 && e2.content && (s2 = e2.content.$method), tt(s2, t3) ? rt({ $method: t3 }, e2, n2) : function() {
        return rt({ $method: t3, $param: nt(Array.from(arguments)) }, e2, n2);
      };
    } });
  }
  function ot({ path: e, method: t2 }) {
    return class {
      constructor() {
        this.param = Array.from(arguments);
      }
      toJSON() {
        return { $newDb: [...e.map((e2) => ({ $method: e2 })), { $method: t2, $param: this.param }] };
      }
    };
  }
  class it extends class {
    constructor({ uniClient: e = {} } = {}) {
      this._uniClient = e, this._authCallBacks = {}, this._dbCallBacks = {}, e.isDefault && (this._dbCallBacks = g("_globalUniCloudDatabaseCallback")), this.auth = Ze(this._authCallBacks), Object.assign(this, Ze(this._dbCallBacks)), this.env = Qe({}, { get: (e2, t2) => ({ $env: t2 }) }), this.Geo = Qe({}, { get: (e2, t2) => ot({ path: ["Geo"], method: t2 }) }), this.serverDate = ot({ path: [], method: "serverDate" }), this.RegExp = ot({ path: [], method: "RegExp" });
    }
    getCloudEnv(e) {
      if (typeof e != "string" || !e.trim())
        throw new Error("getCloudEnv\u53C2\u6570\u9519\u8BEF");
      return { $env: e.replace("$cloudEnv_", "") };
    }
    _callback(e, t2) {
      const n2 = this._dbCallBacks;
      n2[e] && n2[e].forEach((e2) => {
        e2(...t2);
      });
    }
    _callbackAuth(e, t2) {
      const n2 = this._authCallBacks;
      n2[e] && n2[e].forEach((e2) => {
        e2(...t2);
      });
    }
    multiSend() {
      const e = Array.from(arguments), t2 = e.map((e2) => {
        const t3 = e2.getAction(), n2 = e2.getCommand();
        if (n2.$db[n2.$db.length - 1].$method !== "getTemp")
          throw new Error("multiSend\u53EA\u652F\u6301\u5B50\u547D\u4EE4\u5185\u4F7F\u7528getTemp");
        return { action: t3, command: n2 };
      });
      return this._callCloudFunction({ multiCommand: t2, queryList: e });
    }
  } {
    _callCloudFunction({ action: e, command: t2, multiCommand: n2, queryList: s2 }) {
      function r2(e2, t3) {
        if (n2 && s2)
          for (let n3 = 0; n3 < s2.length; n3++) {
            const r3 = s2[n3];
            r3.udb && typeof r3.udb.setResult == "function" && (t3 ? r3.udb.setResult(t3) : r3.udb.setResult(e2.result.dataList[n3]));
          }
      }
      const o2 = k(v("database", "invoke")), i2 = this._uniClient;
      return o2.then(() => i2.callFunction({ name: "DCloud-clientDB", data: { action: e, command: t2, multiCommand: n2 } })).then((e2) => {
        const { code: t3, message: n3, token: s3, tokenExpired: o3, systemInfo: i3 = [] } = e2.result;
        if (i3)
          for (let e3 = 0; e3 < i3.length; e3++) {
            const { level: t4, message: n4, detail: s4 } = i3[e3], r3 = console[t4] || console.log;
            let o4 = "[System Info]" + n4;
            s4 && (o4 = `${o4}
\u8BE6\u7EC6\u4FE1\u606F\uFF1A${s4}`), r3(o4);
          }
        if (t3) {
          const s4 = new T({ message: n3, code: t3, requestId: e2.requestId });
          return this._callback("error", [s4]), Promise.reject(s4);
        }
        s3 && o3 && (!function({ token: e3, tokenExpired: t4 } = {}) {
          e3 && b.setStorageSync("uni_id_token", e3), t4 && b.setStorageSync("uni_id_token_expired", t4);
        }({ token: s3, tokenExpired: o3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: o3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: o3 }]));
        const a2 = e2.result.affectedDocs;
        return typeof a2 == "number" && Object.defineProperty(e2.result, "affectedDocs", { get: () => (console.warn("affectedDocs\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528inserted/deleted/updated/data.length\u66FF\u4EE3"), a2) }), k(v("database", "success"), e2).then(() => k(v("database", "complete"), e2)).then(() => (r2(e2, null), Promise.resolve(e2)));
      }, (e2) => {
        const t3 = new T({ code: e2.code || "SYSTEM_ERROR", message: e2.message, requestId: e2.requestId });
        return this._callback("error", [t3]), /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e2.message) && console.warn("clientDB\u672A\u521D\u59CB\u5316\uFF0C\u8BF7\u5728web\u63A7\u5236\u53F0\u4FDD\u5B58\u4E00\u6B21schema\u4EE5\u5F00\u542FclientDB"), k(v("database", "fail"), e2).then(() => k(v("database", "complete"), e2)).then(() => (r2(null, e2), Promise.reject(e2)));
      });
    }
  }
  function at(e) {
    e.database = function(t2) {
      if (t2 && Object.keys(t2).length > 0)
        return e.init(t2).database();
      if (this._database)
        return this._database;
      const n2 = function(e2, t3 = {}) {
        return Qe(new e2(t3), { get: (e3, t4) => tt("db", t4) ? rt({ $method: t4 }, null, e3) : function() {
          return rt({ $method: t4, $param: nt(Array.from(arguments)) }, null, e3);
        } });
      }(it, { uniClient: e });
      return this._database = n2, n2;
    };
  }
  let ct;
  const ut = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", ht = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
  function lt() {
    const e = $e().token || "", t2 = e.split(".");
    if (!e || t2.length !== 3)
      return { uid: null, role: [], permission: [], tokenExpired: 0 };
    let n2;
    try {
      n2 = JSON.parse((s2 = t2[1], decodeURIComponent(ct(s2).split("").map(function(e2) {
        return "%" + ("00" + e2.charCodeAt(0).toString(16)).slice(-2);
      }).join(""))));
    } catch (e2) {
      throw new Error("\u83B7\u53D6\u5F53\u524D\u7528\u6237\u4FE1\u606F\u51FA\u9519\uFF0C\u8BE6\u7EC6\u9519\u8BEF\u4FE1\u606F\u4E3A\uFF1A" + e2.message);
    }
    var s2;
    return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
  }
  ct = typeof atob != "function" ? function(e) {
    if (e = String(e).replace(/[\t\n\f\r ]+/g, ""), !ht.test(e))
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    var t2;
    e += "==".slice(2 - (3 & e.length));
    for (var n2, s2, r2 = "", o2 = 0; o2 < e.length; )
      t2 = ut.indexOf(e.charAt(o2++)) << 18 | ut.indexOf(e.charAt(o2++)) << 12 | (n2 = ut.indexOf(e.charAt(o2++))) << 6 | (s2 = ut.indexOf(e.charAt(o2++))), r2 += n2 === 64 ? String.fromCharCode(t2 >> 16 & 255) : s2 === 64 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
    return r2;
  } : atob;
  var dt = t(n(function(e, t2) {
    Object.defineProperty(t2, "__esModule", { value: true });
    const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
    function r2(e2, t3) {
      return e2.tempFiles.forEach((e3, n3) => {
        e3.name || (e3.name = e3.path.substring(e3.path.lastIndexOf("/") + 1)), t3 && (e3.fileType = t3), e3.cloudPath = Date.now() + "_" + n3 + e3.name.substring(e3.name.lastIndexOf("."));
      }), e2.tempFilePaths || (e2.tempFilePaths = e2.tempFiles.map((e3) => e3.path)), e2;
    }
    function o2(e2, t3, { onChooseFile: s3, onUploadProgress: r3 }) {
      return t3.then((e3) => {
        if (s3) {
          const t4 = s3(e3);
          if (t4 !== void 0)
            return Promise.resolve(t4).then((t5) => t5 === void 0 ? e3 : t5);
        }
        return e3;
      }).then((t4) => t4 === false ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e3, t5, s4 = 5, r4) {
        (t5 = Object.assign({}, t5)).errMsg = n2;
        const o3 = t5.tempFiles, i2 = o3.length;
        let a2 = 0;
        return new Promise((n3) => {
          for (; a2 < s4; )
            c2();
          function c2() {
            const s5 = a2++;
            if (s5 >= i2)
              return void (!o3.find((e4) => !e4.url && !e4.errMsg) && n3(t5));
            const u2 = o3[s5];
            e3.uploadFile({ filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, onUploadProgress(e4) {
              e4.index = s5, e4.tempFile = u2, e4.tempFilePath = u2.path, r4 && r4(e4);
            } }).then((e4) => {
              u2.url = e4.fileID, s5 < i2 && c2();
            }).catch((e4) => {
              u2.errMsg = e4.errMsg || e4.message, s5 < i2 && c2();
            });
          }
        });
      }(e2, t4, 5, r3));
    }
    t2.initChooseAndUploadFile = function(e2) {
      return function(t3 = { type: "all" }) {
        return t3.type === "image" ? o2(e2, function(e3) {
          const { count: t4, sizeType: n3, sourceType: o3 = ["album", "camera"], extension: i2 } = e3;
          return new Promise((e4, a2) => {
            uni.chooseImage({ count: t4, sizeType: n3, sourceType: o3, extension: i2, success(t5) {
              e4(r2(t5, "image"));
            }, fail(e5) {
              a2({ errMsg: e5.errMsg.replace("chooseImage:fail", s2) });
            } });
          });
        }(t3), t3) : t3.type === "video" ? o2(e2, function(e3) {
          const { camera: t4, compressed: n3, maxDuration: o3, sourceType: i2 = ["album", "camera"], extension: a2 } = e3;
          return new Promise((e4, c2) => {
            uni.chooseVideo({ camera: t4, compressed: n3, maxDuration: o3, sourceType: i2, extension: a2, success(t5) {
              const { tempFilePath: n4, duration: s3, size: o4, height: i3, width: a3 } = t5;
              e4(r2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: o4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: i3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
            }, fail(e5) {
              c2({ errMsg: e5.errMsg.replace("chooseVideo:fail", s2) });
            } });
          });
        }(t3), t3) : o2(e2, function(e3) {
          const { count: t4, extension: n3 } = e3;
          return new Promise((e4, o3) => {
            let i2 = uni.chooseFile;
            if (typeof wx != "undefined" && typeof wx.chooseMessageFile == "function" && (i2 = wx.chooseMessageFile), typeof i2 != "function")
              return o3({ errMsg: s2 + " \u8BF7\u6307\u5B9A type \u7C7B\u578B\uFF0C\u8BE5\u5E73\u53F0\u4EC5\u652F\u6301\u9009\u62E9 image \u6216 video\u3002" });
            i2({ type: "all", count: t4, extension: n3, success(t5) {
              e4(r2(t5));
            }, fail(e5) {
              o3({ errMsg: e5.errMsg.replace("chooseFile:fail", s2) });
            } });
          });
        }(t3), t3);
      };
    };
  }));
  const ft = "manual";
  function pt(e) {
    return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {} }), created() {
      this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
        var e2 = [];
        return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
          e2.push(this[t2]);
        }), e2;
      }, (e2, t2) => {
        if (this.loadtime === ft)
          return;
        let n2 = false;
        const s2 = [];
        for (let r2 = 2; r2 < e2.length; r2++)
          e2[r2] !== t2[r2] && (s2.push(e2[r2]), n2 = true);
        e2[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
      });
    }, methods: { onMixinDatacomPropsChange(e2, t2) {
    }, mixinDatacomEasyGet({ getone: e2 = false, success: t2, fail: n2 } = {}) {
      this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomGet().then((n3) => {
        this.mixinDatacomLoading = false;
        const { data: s2, count: r2 } = n3.result;
        this.getcount && (this.mixinDatacomPage.count = r2), this.mixinDatacomHasMore = s2.length < this.pageSize;
        const o2 = e2 ? s2.length ? s2[0] : void 0 : s2;
        this.mixinDatacomResData = o2, t2 && t2(o2);
      }).catch((e3) => {
        this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e3, n2 && n2(e3);
      }));
    }, mixinDatacomGet(t2 = {}) {
      let n2 = e.database(this.spaceInfo);
      const s2 = t2.action || this.action;
      s2 && (n2 = n2.action(s2));
      const r2 = t2.collection || this.collection;
      n2 = Array.isArray(r2) ? n2.collection(...r2) : n2.collection(r2);
      const o2 = t2.where || this.where;
      o2 && Object.keys(o2).length && (n2 = n2.where(o2));
      const i2 = t2.field || this.field;
      i2 && (n2 = n2.field(i2));
      const a2 = t2.foreignKey || this.foreignKey;
      a2 && (n2 = n2.foreignKey(a2));
      const c2 = t2.groupby || this.groupby;
      c2 && (n2 = n2.groupBy(c2));
      const u2 = t2.groupField || this.groupField;
      u2 && (n2 = n2.groupField(u2));
      (t2.distinct !== void 0 ? t2.distinct : this.distinct) === true && (n2 = n2.distinct());
      const h2 = t2.orderby || this.orderby;
      h2 && (n2 = n2.orderBy(h2));
      const l2 = t2.pageCurrent !== void 0 ? t2.pageCurrent : this.mixinDatacomPage.current, d = t2.pageSize !== void 0 ? t2.pageSize : this.mixinDatacomPage.size, f2 = t2.getcount !== void 0 ? t2.getcount : this.getcount, p2 = t2.gettree !== void 0 ? t2.gettree : this.gettree, g2 = t2.gettreepath !== void 0 ? t2.gettreepath : this.gettreepath, m2 = { getCount: f2 }, y2 = { limitLevel: t2.limitlevel !== void 0 ? t2.limitlevel : this.limitlevel, startWith: t2.startwith !== void 0 ? t2.startwith : this.startwith };
      return p2 && (m2.getTree = y2), g2 && (m2.getTreePath = y2), n2 = n2.skip(d * (l2 - 1)).limit(d).get(m2), n2;
    } } };
  }
  function gt(e) {
    e.getCurrentUserInfo = lt, e.chooseAndUploadFile = dt.initChooseAndUploadFile(e), Object.assign(e, { get mixinDatacom() {
      return pt(e);
    } }), e.importObject = function(e2) {
      return function(t2) {
        return new Proxy({}, { get: (n2, s2) => async function(...n3) {
          const r2 = await e2.callFunction({ name: t2, data: { method: s2, params: n3 } }), { errCode: o2, errMsg: i2 } = r2.result || {};
          if (o2) {
            const e3 = new T({ code: o2, message: i2, requestId: r2.requestId });
            throw e3.detail = r2.result, e3;
          }
          return r2.result;
        } });
      };
    }(e);
  }
  async function mt(e, t2) {
    const n2 = `http://${e}:${t2}/system/ping`;
    try {
      const e2 = await (s2 = { url: n2, timeout: 500 }, new Promise((e3, t3) => {
        b.request(__spreadProps(__spreadValues({}, s2), { success(t4) {
          e3(t4);
        }, fail(e4) {
          t3(e4);
        } }));
      }));
      return !(!e2.data || e2.data.code !== 0);
    } catch (e2) {
      return false;
    }
    var s2;
  }
  function yt(e) {
    if (e.initUniCloudStatus && e.initUniCloudStatus !== "rejected")
      return;
    let t2 = Promise.resolve();
    var n2;
    n2 = 1, t2 = new Promise((e2, t3) => {
      setTimeout(() => {
        e2();
      }, n2);
    }), e.isReady = false, e.isDefault = false;
    const s2 = e.auth();
    e.initUniCloudStatus = "pending", e.initUniCloud = t2.then(() => s2.getLoginState()).then((e2) => e2 ? Promise.resolve() : s2.signInAnonymously()).then(() => {
      if (e.debugInfo) {
        const { address: t3, servePort: n3 } = e.debugInfo;
        return async function(e2, t4) {
          let n4;
          for (let s3 = 0; s3 < e2.length; s3++) {
            const r2 = e2[s3];
            if (await mt(r2, t4)) {
              n4 = r2;
              break;
            }
          }
          return { address: n4, port: t4 };
        }(t3, n3);
      }
    }).then(({ address: t3, port: n3 } = {}) => {
      if (t3)
        e.localAddress = t3, e.localPort = n3;
      else if (e.debugInfo) {
        const t4 = console["warn"];
        let n4 = "";
        e.debugInfo.initialLaunchType === "remote" ? (e.debugInfo.forceRemote = true, n4 = "\u5F53\u524D\u5BA2\u6237\u7AEF\u548CHBuilderX\u4E0D\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\uFF08\u6216\u5176\u4ED6\u7F51\u7EDC\u539F\u56E0\u65E0\u6CD5\u8FDE\u63A5HBuilderX\uFF09\uFF0CuniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u4E0D\u5BF9\u5F53\u524D\u5BA2\u6237\u7AEF\u751F\u6548\u3002\n- \u5982\u679C\u4E0D\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u76F4\u63A5\u5FFD\u7565\u6B64\u4FE1\u606F\u3002\n- \u5982\u9700\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u5C06\u5BA2\u6237\u7AEF\u4E0E\u4E3B\u673A\u8FDE\u63A5\u5230\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u5E76\u91CD\u65B0\u8FD0\u884C\u5230\u5BA2\u6237\u7AEF\u3002\n- \u5982\u679C\u5728HBuilderX\u5F00\u542F\u7684\u72B6\u6001\u4E0B\u5207\u6362\u8FC7\u7F51\u7EDC\u73AF\u5883\uFF0C\u8BF7\u91CD\u542FHBuilderX\u540E\u518D\u8BD5\n- \u68C0\u67E5\u7CFB\u7EDF\u9632\u706B\u5899\u662F\u5426\u62E6\u622A\u4E86HBuilderX\u81EA\u5E26\u7684nodejs") : n4 = "\u65E0\u6CD5\u8FDE\u63A5uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u5F53\u524D\u5BA2\u6237\u7AEF\u662F\u5426\u4E0E\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u3002\n- \u5982\u9700\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u5C06\u5BA2\u6237\u7AEF\u4E0E\u4E3B\u673A\u8FDE\u63A5\u5230\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u5E76\u91CD\u65B0\u8FD0\u884C\u5230\u5BA2\u6237\u7AEF\u3002\n- \u5982\u679C\u5728HBuilderX\u5F00\u542F\u7684\u72B6\u6001\u4E0B\u5207\u6362\u8FC7\u7F51\u7EDC\u73AF\u5883\uFF0C\u8BF7\u91CD\u542FHBuilderX\u540E\u518D\u8BD5\n- \u68C0\u67E5\u7CFB\u7EDF\u9632\u706B\u5899\u662F\u5426\u62E6\u622A\u4E86HBuilderX\u81EA\u5E26\u7684nodejs", t4(n4);
      }
    }).then(() => {
      e.isReady = true, e.initUniCloudStatus = "fulfilled";
    }).catch((t3) => {
      console.error(t3), e.initUniCloudStatus = "rejected";
    });
  }
  let _t = new class {
    init(e) {
      let t2 = {};
      const n2 = e.debugFunction !== false && c && u === "app-plus";
      switch (e.provider) {
        case "tencent":
          t2 = Le.init(Object.assign(e, { useDebugFunction: n2 }));
          break;
        case "aliyun":
          t2 = U.init(Object.assign(e, { useDebugFunction: n2 }));
          break;
        case "private":
          t2 = Be.init(Object.assign(e, { useDebugFunction: n2 }));
          break;
        default:
          throw new Error("\u672A\u63D0\u4F9B\u6B63\u786E\u7684provider\u53C2\u6570");
      }
      const s2 = h;
      s2 && !s2.code && (t2.debugInfo = s2), yt(t2), t2.reInit = function() {
        yt(this);
      }, Xe(t2), function(e2) {
        const t3 = e2.uploadFile;
        e2.uploadFile = function(e3) {
          return t3.call(this, e3);
        };
      }(t2), at(t2), gt(t2);
      return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e2) => {
        if (!t2[e2])
          return;
        const n3 = t2[e2];
        t2[e2] = function() {
          return t2.reInit(), n3.apply(t2, Array.from(arguments));
        }, t2[e2] = S(t2[e2], e2).bind(t2);
      }), t2.init = this.init, t2;
    }
  }();
  (() => {
    {
      const e = l;
      let t2 = {};
      if (e.length === 1)
        t2 = e[0], _t = _t.init(t2), _t.isDefault = true;
      else {
        const t3 = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "database", "getCurrentUSerInfo", "importObject"];
        let n2;
        n2 = e && e.length > 0 ? "\u5E94\u7528\u6709\u591A\u4E2A\u670D\u52A1\u7A7A\u95F4\uFF0C\u8BF7\u901A\u8FC7uniCloud.init\u65B9\u6CD5\u6307\u5B9A\u8981\u4F7F\u7528\u7684\u670D\u52A1\u7A7A\u95F4" : "\u5E94\u7528\u672A\u5173\u8054\u670D\u52A1\u7A7A\u95F4\uFF0C\u8BF7\u5728uniCloud\u76EE\u5F55\u53F3\u952E\u5173\u8054\u670D\u52A1\u7A7A\u95F4", t3.forEach((e2) => {
          _t[e2] = function() {
            return console.error(n2), Promise.reject(new T({ code: "SYS_ERR", message: n2 }));
          };
        });
      }
      Object.assign(_t, { get mixinDatacom() {
        return pt(_t);
      } }), _t.addInterceptor = _, _t.removeInterceptor = w;
    }
  })();
  var wt = _t;
  const _sfc_main$c = {
    name: "loading1",
    data() {
      return {};
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading1" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  var Loading1 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-2ba2bd4e"]]);
  const _sfc_main$b = {
    name: "loading2",
    data() {
      return {};
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading2" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  var Loading2 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-2b868e4c"]]);
  const _sfc_main$a = {
    name: "loading3",
    data() {
      return {};
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading3" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  var Loading3 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-2b6a5f4a"]]);
  const _sfc_main$9 = {
    name: "loading5",
    data() {
      return {};
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading5" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  var Loading4 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-2b4e3048"]]);
  const _sfc_main$8 = {
    name: "loading6",
    data() {
      return {};
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading6" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  var Loading5 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-2b320146"]]);
  const _sfc_main$7 = {
    components: { Loading1, Loading2, Loading3, Loading4, Loading5 },
    name: "qiun-loading",
    props: {
      loadingType: {
        type: Number,
        default: 2
      }
    },
    data() {
      return {};
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Loading1 = vue.resolveComponent("Loading1");
    const _component_Loading2 = vue.resolveComponent("Loading2");
    const _component_Loading3 = vue.resolveComponent("Loading3");
    const _component_Loading4 = vue.resolveComponent("Loading4");
    const _component_Loading5 = vue.resolveComponent("Loading5");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      $props.loadingType == 1 ? (vue.openBlock(), vue.createBlock(_component_Loading1, { key: 0 })) : vue.createCommentVNode("v-if", true),
      $props.loadingType == 2 ? (vue.openBlock(), vue.createBlock(_component_Loading2, { key: 1 })) : vue.createCommentVNode("v-if", true),
      $props.loadingType == 3 ? (vue.openBlock(), vue.createBlock(_component_Loading3, { key: 2 })) : vue.createCommentVNode("v-if", true),
      $props.loadingType == 4 ? (vue.openBlock(), vue.createBlock(_component_Loading4, { key: 3 })) : vue.createCommentVNode("v-if", true),
      $props.loadingType == 5 ? (vue.openBlock(), vue.createBlock(_component_Loading5, { key: 4 })) : vue.createCommentVNode("v-if", true)
    ]);
  }
  var __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6]]);
  const _sfc_main$6 = {
    name: "qiun-error",
    props: {
      errorMessage: {
        type: String,
        default: null
      }
    },
    data() {
      return {};
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chartsview" }, [
      vue.createElementVNode("view", { class: "charts-error" }),
      vue.createElementVNode("view", { class: "charts-font" }, vue.toDisplayString($props.errorMessage == null ? "\u8BF7\u70B9\u51FB\u91CD\u8BD5" : $props.errorMessage), 1)
    ]);
  }
  var __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-61aa4844"]]);
  const color$1 = ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"];
  const formatDateTime = (timeStamp, returnType) => {
    var date = new Date();
    date.setTime(timeStamp * 1e3);
    var y2 = date.getFullYear();
    var m2 = date.getMonth() + 1;
    m2 = m2 < 10 ? "0" + m2 : m2;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var h2 = date.getHours();
    h2 = h2 < 10 ? "0" + h2 : h2;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    if (returnType == "full") {
      return y2 + "-" + m2 + "-" + d + " " + h2 + ":" + minute + ":" + second;
    }
    if (returnType == "y-m-d") {
      return y2 + "-" + m2 + "-" + d;
    }
    if (returnType == "h:m") {
      return h2 + ":" + minute;
    }
    if (returnType == "h:m:s") {
      return h2 + ":" + minute + ":" + second;
    }
    return [y2, m2, d, h2, minute, second];
  };
  const cfu = {
    "type": ["pie", "ring", "rose", "word", "funnel", "map", "arcbar", "line", "column", "bar", "area", "radar", "gauge", "candle", "mix", "tline", "tarea", "scatter", "bubble", "demotype"],
    "range": ["\u997C\u72B6\u56FE", "\u5706\u73AF\u56FE", "\u73AB\u7470\u56FE", "\u8BCD\u4E91\u56FE", "\u6F0F\u6597\u56FE", "\u5730\u56FE", "\u5706\u5F27\u8FDB\u5EA6\u6761", "\u6298\u7EBF\u56FE", "\u67F1\u72B6\u56FE", "\u6761\u72B6\u56FE", "\u533A\u57DF\u56FE", "\u96F7\u8FBE\u56FE", "\u4EEA\u8868\u76D8", "K\u7EBF\u56FE", "\u6DF7\u5408\u56FE", "\u65F6\u95F4\u8F74\u6298\u7EBF", "\u65F6\u95F4\u8F74\u533A\u57DF", "\u6563\u70B9\u56FE", "\u6C14\u6CE1\u56FE", "\u81EA\u5B9A\u4E49\u7C7B\u578B"],
    "categories": ["line", "column", "bar", "area", "radar", "gauge", "candle", "mix", "demotype"],
    "instance": {},
    "option": {},
    "formatter": {
      "yAxisDemo1": function(val) {
        return val + "\u5143";
      },
      "yAxisDemo2": function(val) {
        return val.toFixed(2);
      },
      "xAxisDemo1": function(val) {
        return val + "\u5E74";
      },
      "xAxisDemo2": function(val) {
        return formatDateTime(val, "h:m");
      },
      "seriesDemo1": function(val) {
        return val + "\u5143";
      },
      "tooltipDemo1": function(item, category, index, opts) {
        if (index == 0) {
          return "\u968F\u4FBF\u7528" + item.data + "\u5E74";
        } else {
          return "\u5176\u4ED6\u6211\u6CA1\u6539" + item.data + "\u5929";
        }
      },
      "pieDemo": function(val, index, series) {
        if (index !== void 0) {
          return series[index].name + "\uFF1A" + series[index].data + "\u5143";
        }
      }
    },
    "demotype": {
      "type": "line",
      "color": color$1,
      "padding": [15, 10, 0, 15],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2
      },
      "legend": {},
      "extra": {
        "line": {
          "type": "curve",
          "width": 2
        }
      }
    },
    "pie": {
      "type": "pie",
      "color": color$1,
      "padding": [5, 5, 5, 5],
      "extra": {
        "pie": {
          "activeOpacity": 0.5,
          "activeRadius": 10,
          "offsetAngle": 0,
          "labelWidth": 15,
          "border": true,
          "borderWidth": 3,
          "borderColor": "#FFFFFF"
        }
      }
    },
    "ring": {
      "type": "ring",
      "color": color$1,
      "padding": [5, 5, 5, 5],
      "rotate": false,
      "dataLabel": true,
      "legend": {
        "show": true,
        "position": "right",
        "lineHeight": 25
      },
      "title": {
        "name": "\u6536\u76CA\u7387",
        "fontSize": 15,
        "color": "#666666"
      },
      "subtitle": {
        "name": "70%",
        "fontSize": 25,
        "color": "#7cb5ec"
      },
      "extra": {
        "ring": {
          "ringWidth": 30,
          "activeOpacity": 0.5,
          "activeRadius": 10,
          "offsetAngle": 0,
          "labelWidth": 15,
          "border": true,
          "borderWidth": 3,
          "borderColor": "#FFFFFF"
        }
      }
    },
    "rose": {
      "type": "rose",
      "color": color$1,
      "padding": [5, 5, 5, 5],
      "legend": {
        "show": true,
        "position": "left",
        "lineHeight": 25
      },
      "extra": {
        "rose": {
          "type": "area",
          "minRadius": 50,
          "activeOpacity": 0.5,
          "activeRadius": 10,
          "offsetAngle": 0,
          "labelWidth": 15,
          "border": false,
          "borderWidth": 2,
          "borderColor": "#FFFFFF"
        }
      }
    },
    "word": {
      "type": "word",
      "color": color$1,
      "extra": {
        "word": {
          "type": "normal",
          "autoColors": false
        }
      }
    },
    "funnel": {
      "type": "funnel",
      "color": color$1,
      "padding": [15, 15, 0, 15],
      "extra": {
        "funnel": {
          "activeOpacity": 0.3,
          "activeWidth": 10,
          "border": true,
          "borderWidth": 2,
          "borderColor": "#FFFFFF",
          "fillOpacity": 1,
          "labelAlign": "right"
        }
      }
    },
    "map": {
      "type": "map",
      "color": color$1,
      "padding": [0, 0, 0, 0],
      "dataLabel": true,
      "extra": {
        "map": {
          "border": true,
          "borderWidth": 1,
          "borderColor": "#666666",
          "fillOpacity": 0.6,
          "activeBorderColor": "#F04864",
          "activeFillColor": "#FACC14",
          "activeFillOpacity": 1
        }
      }
    },
    "arcbar": {
      "type": "arcbar",
      "color": color$1,
      "title": {
        "name": "\u767E\u5206\u6BD4",
        "fontSize": 25,
        "color": "#00FF00"
      },
      "subtitle": {
        "name": "\u9ED8\u8BA4\u6807\u9898",
        "fontSize": 15,
        "color": "#666666"
      },
      "extra": {
        "arcbar": {
          "type": "default",
          "width": 12,
          "backgroundColor": "#E9E9E9",
          "startAngle": 0.75,
          "endAngle": 0.25,
          "gap": 2
        }
      }
    },
    "line": {
      "type": "line",
      "canvasId": "",
      "canvas2d": false,
      "background": "none",
      "animation": true,
      "timing": "easeOut",
      "duration": 1e3,
      "color": [
        "#1890FF",
        "#91CB74",
        "#FAC858",
        "#EE6666",
        "#73C0DE",
        "#3CA272",
        "#FC8452",
        "#9A60B4",
        "#ea7ccc"
      ],
      "padding": [
        15,
        10,
        0,
        15
      ],
      "rotate": false,
      "errorReload": true,
      "fontSize": 13,
      "fontColor": "#666666",
      "enableScroll": false,
      "touchMoveLimit": 60,
      "enableMarkLine": true,
      "dataLabel": false,
      "dataPointShape": true,
      "dataPointShapeType": "solid",
      "tapLegend": true,
      "xAxis": {
        "disabled": false,
        "axisLine": true,
        "axisLineColor": "#CCCCCC",
        "calibration": false,
        "fontColor": "#666666",
        "fontSize": 13,
        "rotateLabel": false,
        "labelCount": 20,
        "itemCount": 5,
        "boundaryGap": "center",
        "disableGrid": true,
        "gridColor": "#CCCCCC",
        "gridType": "solid",
        "dashLength": 4,
        "gridEval": 1,
        "scrollShow": false,
        "scrollAlign": "left",
        "scrollColor": "#A6A6A6",
        "scrollBackgroundColor": "#EFEBEF",
        "format": ""
      },
      "yAxis": {
        "disabled": false,
        "disableGrid": false,
        "splitNumber": 5,
        "gridType": "dash",
        "dashLength": 2,
        "gridColor": "#CCCCCC",
        "padding": 10,
        "showTitle": false,
        "data": []
      },
      "legend": {
        "show": true,
        "position": "top",
        "float": "center",
        "padding": 5,
        "margin": 5,
        "backgroundColor": "rgba(0,0,0,0)",
        "borderColor": "rgba(0,0,0,0)",
        "borderWidth": 0,
        "fontSize": 13,
        "fontColor": "#666666",
        "lineHeight": 11,
        "hiddenColor": "#CECECE",
        "itemGap": 10
      },
      "extra": {
        "line": {
          "type": "straight",
          "width": 2
        },
        "tooltip": {
          "showBox": true,
          "showArrow": true,
          "showCategory": false,
          "borderWidth": 0,
          "borderRadius": 0,
          "borderColor": "#000000",
          "borderOpacity": 0.7,
          "bgColor": "#000000",
          "bgOpacity": 0.7,
          "gridType": "solid",
          "dashLength": 4,
          "gridColor": "#CCCCCC",
          "fontColor": "#FFFFFF",
          "splitLine": true,
          "horizentalLine": false,
          "xAxisLabel": false,
          "yAxisLabel": false,
          "labelBgColor": "#FFFFFF",
          "labelBgOpacity": 0.7,
          "labelFontColor": "#666666"
        },
        "markLine": {
          "type": "solid",
          "dashLength": 4,
          "data": [
            {
              "value": 45,
              "lineColor": "#DE4A42",
              "showLabel": true,
              "labelFontColor": "#666666",
              "labelBgColor": "#DFE8FF",
              "labelBgOpacity": 0.8,
              "yAxisIndex": 0
            },
            {
              "value": 85,
              "lineColor": "#3344FF",
              "showLabel": false,
              "labelFontColor": "#666666",
              "labelBgColor": "#DFE8FF",
              "labelBgOpacity": 0.8,
              "yAxisIndex": 0
            }
          ]
        }
      }
    },
    "tline": {
      "type": "line",
      "color": color$1,
      "padding": [15, 10, 0, 15],
      "xAxis": {
        "disableGrid": false,
        "boundaryGap": "justify"
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2,
        "data": [
          {
            "min": 0,
            "max": 80
          }
        ]
      },
      "legend": {},
      "extra": {
        "line": {
          "type": "curve",
          "width": 2
        }
      }
    },
    "tarea": {
      "type": "area",
      "color": color$1,
      "padding": [15, 10, 0, 15],
      "xAxis": {
        "disableGrid": true,
        "boundaryGap": "justify"
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2,
        "data": [
          {
            "min": 0,
            "max": 80
          }
        ]
      },
      "legend": {},
      "extra": {
        "area": {
          "type": "curve",
          "opacity": 0.2,
          "addLine": true,
          "width": 2,
          "gradient": true
        }
      }
    },
    "column": {
      "type": "column",
      "color": color$1,
      "padding": [15, 15, 0, 5],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "data": [{ "min": 0 }]
      },
      "legend": {},
      "extra": {
        "column": {
          "type": "group",
          "width": 30,
          "activeBgColor": "#000000",
          "activeBgOpacity": 0.08
        }
      }
    },
    "bar": {
      "type": "bar",
      "color": color$1,
      "padding": [15, 30, 0, 5],
      "xAxis": {
        "boundaryGap": "justify",
        "disableGrid": false,
        "min": 0,
        "axisLine": false
      },
      "yAxis": {},
      "legend": {},
      "extra": {
        "bar": {
          "type": "group",
          "width": 30,
          "meterBorde": 1,
          "meterFillColor": "#FFFFFF",
          "activeBgColor": "#000000",
          "activeBgOpacity": 0.08
        }
      }
    },
    "area": {
      "type": "area",
      "color": color$1,
      "padding": [15, 15, 0, 15],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2
      },
      "legend": {},
      "extra": {
        "area": {
          "type": "straight",
          "opacity": 0.2,
          "addLine": true,
          "width": 2,
          "gradient": false
        }
      }
    },
    "radar": {
      "type": "radar",
      "color": color$1,
      "padding": [5, 5, 5, 5],
      "dataLabel": false,
      "legend": {
        "show": true,
        "position": "right",
        "lineHeight": 25
      },
      "extra": {
        "radar": {
          "gridType": "radar",
          "gridColor": "#CCCCCC",
          "gridCount": 3,
          "opacity": 0.2,
          "max": 200
        }
      }
    },
    "gauge": {
      "type": "gauge",
      "color": color$1,
      "title": {
        "name": "66Km/H",
        "fontSize": 25,
        "color": "#2fc25b",
        "offsetY": 50
      },
      "subtitle": {
        "name": "\u5B9E\u65F6\u901F\u5EA6",
        "fontSize": 15,
        "color": "#1890ff",
        "offsetY": -50
      },
      "extra": {
        "gauge": {
          "type": "default",
          "width": 30,
          "labelColor": "#666666",
          "startAngle": 0.75,
          "endAngle": 0.25,
          "startNumber": 0,
          "endNumber": 100,
          "labelFormat": "",
          "splitLine": {
            "fixRadius": 0,
            "splitNumber": 10,
            "width": 30,
            "color": "#FFFFFF",
            "childNumber": 5,
            "childWidth": 12
          },
          "pointer": {
            "width": 24,
            "color": "auto"
          }
        }
      }
    },
    "candle": {
      "type": "candle",
      "color": color$1,
      "padding": [15, 15, 0, 15],
      "enableScroll": true,
      "enableMarkLine": true,
      "dataLabel": false,
      "xAxis": {
        "labelCount": 4,
        "itemCount": 40,
        "disableGrid": true,
        "gridColor": "#CCCCCC",
        "gridType": "solid",
        "dashLength": 4,
        "scrollShow": true,
        "scrollAlign": "left",
        "scrollColor": "#A6A6A6",
        "scrollBackgroundColor": "#EFEBEF"
      },
      "yAxis": {},
      "legend": {},
      "extra": {
        "candle": {
          "color": {
            "upLine": "#f04864",
            "upFill": "#f04864",
            "downLine": "#2fc25b",
            "downFill": "#2fc25b"
          },
          "average": {
            "show": true,
            "name": ["MA5", "MA10", "MA30"],
            "day": [5, 10, 20],
            "color": ["#1890ff", "#2fc25b", "#facc14"]
          }
        },
        "markLine": {
          "type": "dash",
          "dashLength": 5,
          "data": [
            {
              "value": 2150,
              "lineColor": "#f04864",
              "showLabel": true
            },
            {
              "value": 2350,
              "lineColor": "#f04864",
              "showLabel": true
            }
          ]
        }
      }
    },
    "mix": {
      "type": "mix",
      "color": color$1,
      "padding": [15, 15, 0, 15],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "disabled": false,
        "disableGrid": false,
        "splitNumber": 5,
        "gridType": "dash",
        "dashLength": 4,
        "gridColor": "#CCCCCC",
        "padding": 10,
        "showTitle": true,
        "data": []
      },
      "legend": {},
      "extra": {
        "mix": {
          "column": {
            "width": 20
          }
        }
      }
    },
    "scatter": {
      "type": "scatter",
      "color": color$1,
      "padding": [15, 15, 0, 15],
      "dataLabel": false,
      "xAxis": {
        "disableGrid": false,
        "gridType": "dash",
        "splitNumber": 5,
        "boundaryGap": "justify",
        "min": 0
      },
      "yAxis": {
        "disableGrid": false,
        "gridType": "dash"
      },
      "legend": {},
      "extra": {
        "scatter": {}
      }
    },
    "bubble": {
      "type": "bubble",
      "color": color$1,
      "padding": [15, 15, 0, 15],
      "xAxis": {
        "disableGrid": false,
        "gridType": "dash",
        "splitNumber": 5,
        "boundaryGap": "justify",
        "min": 0,
        "max": 250
      },
      "yAxis": {
        "disableGrid": false,
        "gridType": "dash",
        "data": [{
          "min": 0,
          "max": 150
        }]
      },
      "legend": {},
      "extra": {
        "bubble": {
          "border": 2,
          "opacity": 0.5
        }
      }
    }
  };
  const color = ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"];
  const cfe = {
    "type": ["pie", "ring", "rose", "funnel", "line", "column", "area", "radar", "gauge", "candle", "demotype"],
    "categories": ["line", "column", "area", "radar", "gauge", "candle", "demotype"],
    "instance": {},
    "option": {},
    "formatter": {
      "tooltipDemo1": function(res) {
        let result = "";
        for (let i2 in res) {
          if (i2 == 0) {
            result += res[i2].axisValueLabel + "\u5E74\u9500\u552E\u989D";
          }
          let value = "--";
          if (res[i2].data !== null) {
            value = res[i2].data;
          }
          result += "<br/>" + res[i2].marker + res[i2].seriesName + "\uFF1A" + value + " \u4E07\u5143";
        }
        return result;
      },
      legendFormat: function(name) {
        return "\u81EA\u5B9A\u4E49\u56FE\u4F8B+" + name;
      },
      yAxisFormatDemo: function(value, index) {
        return value + "\u5143";
      },
      seriesFormatDemo: function(res) {
        return res.name + "\u5E74" + res.value + "\u5143";
      }
    },
    "demotype": {
      "color": color
    },
    "column": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "axis"
      },
      "grid": {
        "top": 30,
        "bottom": 50,
        "right": 15,
        "left": 40
      },
      "legend": {
        "bottom": "left"
      },
      "toolbox": {
        "show": false
      },
      "xAxis": {
        "type": "category",
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        },
        "boundaryGap": true,
        "data": []
      },
      "yAxis": {
        "type": "value",
        "axisTick": {
          "show": false
        },
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        }
      },
      "seriesTemplate": {
        "name": "",
        "type": "bar",
        "data": [],
        "barwidth": 20,
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        }
      }
    },
    "line": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "axis"
      },
      "grid": {
        "top": 30,
        "bottom": 50,
        "right": 15,
        "left": 40
      },
      "legend": {
        "bottom": "left"
      },
      "toolbox": {
        "show": false
      },
      "xAxis": {
        "type": "category",
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        },
        "boundaryGap": true,
        "data": []
      },
      "yAxis": {
        "type": "value",
        "axisTick": {
          "show": false
        },
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        }
      },
      "seriesTemplate": {
        "name": "",
        "type": "line",
        "data": [],
        "barwidth": 20,
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        }
      }
    },
    "area": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "axis"
      },
      "grid": {
        "top": 30,
        "bottom": 50,
        "right": 15,
        "left": 40
      },
      "legend": {
        "bottom": "left"
      },
      "toolbox": {
        "show": false
      },
      "xAxis": {
        "type": "category",
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        },
        "boundaryGap": true,
        "data": []
      },
      "yAxis": {
        "type": "value",
        "axisTick": {
          "show": false
        },
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        }
      },
      "seriesTemplate": {
        "name": "",
        "type": "line",
        "data": [],
        "areaStyle": {},
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        }
      }
    },
    "pie": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "item"
      },
      "grid": {
        "top": 40,
        "bottom": 30,
        "right": 15,
        "left": 15
      },
      "legend": {
        "bottom": "left"
      },
      "seriesTemplate": {
        "name": "",
        "type": "pie",
        "data": [],
        "radius": "50%",
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        }
      }
    },
    "ring": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "item"
      },
      "grid": {
        "top": 40,
        "bottom": 30,
        "right": 15,
        "left": 15
      },
      "legend": {
        "bottom": "left"
      },
      "seriesTemplate": {
        "name": "",
        "type": "pie",
        "data": [],
        "radius": ["40%", "70%"],
        "avoidLabelOverlap": false,
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        },
        "labelLine": {
          "show": true
        }
      }
    },
    "rose": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "item"
      },
      "legend": {
        "top": "bottom"
      },
      "seriesTemplate": {
        "name": "",
        "type": "pie",
        "data": [],
        "radius": "55%",
        "center": ["50%", "50%"],
        "rosetype": "area"
      }
    },
    "funnel": {
      "color": color,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "item",
        "formatter": "{b} : {c}%"
      },
      "legend": {
        "top": "bottom"
      },
      "seriesTemplate": {
        "name": "",
        "type": "funnel",
        "left": "10%",
        "top": 60,
        "bottom": 60,
        "width": "80%",
        "min": 0,
        "max": 100,
        "minSize": "0%",
        "maxSize": "100%",
        "sort": "descending",
        "gap": 2,
        "label": {
          "show": true,
          "position": "inside"
        },
        "labelLine": {
          "length": 10,
          "lineStyle": {
            "width": 1,
            "type": "solid"
          }
        },
        "itemStyle": {
          "bordercolor": "#fff",
          "borderwidth": 1
        },
        "emphasis": {
          "label": {
            "fontSize": 20
          }
        },
        "data": []
      }
    },
    "gauge": {
      "color": color,
      "tooltip": {
        "formatter": "{a} <br/>{b} : {c}%"
      },
      "seriesTemplate": {
        "name": "\u4E1A\u52A1\u6307\u6807",
        "type": "gauge",
        "detail": { "formatter": "{value}%" },
        "data": [{ "value": 50, "name": "\u5B8C\u6210\u7387" }]
      }
    },
    "candle": {
      "xAxis": {
        "data": []
      },
      "yAxis": {},
      "color": color,
      "title": {
        "text": ""
      },
      "dataZoom": [
        {
          "type": "inside",
          "xAxisIndex": [0, 1],
          "start": 10,
          "end": 100
        },
        {
          "show": true,
          "xAxisIndex": [0, 1],
          "type": "slider",
          "bottom": 10,
          "start": 10,
          "end": 100
        }
      ],
      "seriesTemplate": {
        "name": "",
        "type": "k",
        "data": []
      }
    }
  };
  var block0 = (Comp) => {
    (Comp.$renderjs || (Comp.$renderjs = [])).push("rdcharts");
    (Comp.$renderjsModules || (Comp.$renderjsModules = {}))["rdcharts"] = "4974725c";
  };
  function deepCloneAssign(origin = {}, ...args) {
    for (let i2 in args) {
      for (let key in args[i2]) {
        if (args[i2].hasOwnProperty(key)) {
          origin[key] = args[i2][key] && typeof args[i2][key] === "object" ? deepCloneAssign(Array.isArray(args[i2][key]) ? [] : {}, origin[key], args[i2][key]) : args[i2][key];
        }
      }
    }
    return origin;
  }
  function formatterAssign(args, formatter) {
    for (let key in args) {
      if (args[key] !== null && typeof args[key] === "object") {
        formatterAssign(args[key], formatter);
      } else if (key === "format" && typeof args[key] === "string") {
        args["formatter"] = formatter[args[key]] ? formatter[args[key]] : void 0;
      }
    }
    return args;
  }
  function getFormatDate(date) {
    var seperator = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator + month + seperator + strDate;
    return currentdate;
  }
  const _sfc_main$5 = {
    name: "qiun-data-charts",
    mixins: [wt.mixinDatacom],
    props: {
      type: {
        type: String,
        default: null
      },
      canvasId: {
        type: String,
        default: "uchartsid"
      },
      canvas2d: {
        type: Boolean,
        default: false
      },
      background: {
        type: String,
        default: "rgba(0,0,0,0)"
      },
      animation: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        default() {
          return {
            categories: [],
            series: []
          };
        }
      },
      opts: {
        type: Object,
        default() {
          return {};
        }
      },
      eopts: {
        type: Object,
        default() {
          return {};
        }
      },
      loadingType: {
        type: Number,
        default: 2
      },
      errorShow: {
        type: Boolean,
        default: true
      },
      errorReload: {
        type: Boolean,
        default: true
      },
      errorMessage: {
        type: String,
        default: null
      },
      inScrollView: {
        type: Boolean,
        default: false
      },
      reshow: {
        type: Boolean,
        default: false
      },
      reload: {
        type: Boolean,
        default: false
      },
      disableScroll: {
        type: Boolean,
        default: false
      },
      ontap: {
        type: Boolean,
        default: true
      },
      ontouch: {
        type: Boolean,
        default: false
      },
      onmouse: {
        type: Boolean,
        default: true
      },
      onmovetip: {
        type: Boolean,
        default: false
      },
      echartsH5: {
        type: Boolean,
        default: false
      },
      echartsApp: {
        type: Boolean,
        default: false
      },
      tooltipShow: {
        type: Boolean,
        default: true
      },
      tooltipFormat: {
        type: String,
        default: void 0
      },
      tooltipCustom: {
        type: Object,
        default: void 0
      },
      startDate: {
        type: String,
        default: void 0
      },
      endDate: {
        type: String,
        default: void 0
      },
      textEnum: {
        type: Array,
        default() {
          return [];
        }
      },
      groupEnum: {
        type: Array,
        default() {
          return [];
        }
      },
      pageScrollTop: {
        type: Number,
        default: 0
      },
      directory: {
        type: String,
        default: "/"
      },
      tapLegend: {
        type: Boolean,
        default: true
      },
      menus: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        cid: "uchartsid",
        inWx: false,
        inAli: false,
        inTt: false,
        inBd: false,
        inH5: false,
        inApp: false,
        inWin: false,
        type2d: true,
        disScroll: false,
        openmouse: false,
        pixel: 1,
        cWidth: 375,
        cHeight: 250,
        showchart: false,
        echarts: false,
        echartsResize: false,
        uchartsOpts: {},
        echartsOpts: {},
        drawData: {},
        lastDrawTime: null
      };
    },
    created() {
      this.cid = this.canvasId;
      if (this.canvasId == "uchartsid" || this.canvasId == "") {
        let t2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let len = t2.length;
        let id = "";
        for (let i2 = 0; i2 < 32; i2++) {
          id += t2.charAt(Math.floor(Math.random() * len));
        }
        this.cid = id;
      }
      const systemInfo = uni.getSystemInfoSync();
      if (systemInfo.platform === "windows" || systemInfo.platform === "mac") {
        this.inWin = true;
      }
      this.type2d = false;
      this.disScroll = this.disableScroll;
    },
    mounted() {
      this.inApp = true;
      if (this.echartsApp === true) {
        this.echarts = true;
        this.openmouse = false;
      }
      this.$nextTick(() => {
        this.beforeInit();
      });
    },
    destroyed() {
      if (this.echarts === true) {
        delete cfe.option[this.cid];
        delete cfe.instance[this.cid];
      } else {
        delete cfu.option[this.cid];
        delete cfu.instance[this.cid];
      }
      uni.offWindowResize(() => {
      });
    },
    watch: {
      chartDataProps: {
        handler(val, oldval) {
          if (typeof val === "object") {
            if (JSON.stringify(val) !== JSON.stringify(oldval)) {
              if (val.series && val.series.length > 0) {
                this.beforeInit();
              } else {
                this.mixinDatacomLoading = true;
                this._clearChart();
                this.showchart = false;
                this.mixinDatacomErrorMessage = null;
              }
            }
          } else {
            this.mixinDatacomLoading = false;
            this._clearChart();
            this.showchart = false;
            this.mixinDatacomErrorMessage = "\u53C2\u6570\u9519\u8BEF\uFF1AchartData\u6570\u636E\u7C7B\u578B\u9519\u8BEF";
          }
        },
        immediate: false,
        deep: true
      },
      localdata: {
        handler(val, oldval) {
          if (JSON.stringify(val) !== JSON.stringify(oldval)) {
            if (val.length > 0) {
              this.beforeInit();
            } else {
              this.mixinDatacomLoading = true;
              this._clearChart();
              this.showchart = false;
              this.mixinDatacomErrorMessage = null;
            }
          }
        },
        immediate: false,
        deep: true
      },
      optsProps: {
        handler(val, oldval) {
          if (typeof val === "object") {
            if (JSON.stringify(val) !== JSON.stringify(oldval) && this.echarts === false) {
              this.checkData(this.drawData);
            }
          } else {
            this.mixinDatacomLoading = false;
            this._clearChart();
            this.showchart = false;
            this.mixinDatacomErrorMessage = "\u53C2\u6570\u9519\u8BEF\uFF1Aopts\u6570\u636E\u7C7B\u578B\u9519\u8BEF";
          }
        },
        immediate: false,
        deep: true
      },
      eoptsProps: {
        handler(val, oldval) {
          if (typeof val === "object") {
            if (JSON.stringify(val) !== JSON.stringify(oldval) && this.echarts === true) {
              this.checkData(this.drawData);
            }
          } else {
            this.mixinDatacomLoading = false;
            this.showchart = false;
            this.mixinDatacomErrorMessage = "\u53C2\u6570\u9519\u8BEF\uFF1Aeopts\u6570\u636E\u7C7B\u578B\u9519\u8BEF";
          }
        },
        immediate: false,
        deep: true
      },
      reshow(val, oldval) {
        if (val === true && this.mixinDatacomLoading === false) {
          setTimeout(() => {
            this.mixinDatacomErrorMessage = null;
            this.echartsResize = !this.echartsResize;
            this.checkData(this.drawData);
          }, 200);
        }
      },
      reload(val, oldval) {
        if (val === true) {
          this.showchart = false;
          this.mixinDatacomErrorMessage = null;
          this.reloading();
        }
      },
      mixinDatacomErrorMessage(val, oldval) {
        if (val) {
          this.emitMsg({ name: "error", params: { type: "error", errorShow: this.errorShow, msg: val, id: this.cid } });
          if (this.errorShow) {
            formatAppLog("log", "at components/qiun-data-charts/qiun-data-charts.vue:600", "[\u79CB\u4E91\u56FE\u8868\u7EC4\u4EF6]" + val);
          }
        }
      },
      errorMessage(val, oldval) {
        if (val && this.errorShow && val !== null && val !== "null" && val !== "") {
          this.showchart = false;
          this.mixinDatacomLoading = false;
          this.mixinDatacomErrorMessage = val;
        } else {
          this.showchart = false;
          this.mixinDatacomErrorMessage = null;
          this.reloading();
        }
      }
    },
    computed: {
      optsProps() {
        return JSON.parse(JSON.stringify(this.opts));
      },
      eoptsProps() {
        return JSON.parse(JSON.stringify(this.eopts));
      },
      chartDataProps() {
        return JSON.parse(JSON.stringify(this.chartData));
      }
    },
    methods: {
      beforeInit() {
        this.mixinDatacomErrorMessage = null;
        if (typeof this.chartData === "object" && this.chartData != null && this.chartData.series !== void 0 && this.chartData.series.length > 0) {
          this.drawData = deepCloneAssign({}, this.chartData);
          this.mixinDatacomLoading = false;
          this.showchart = true;
          this.checkData(this.chartData);
        } else if (this.localdata.length > 0) {
          this.mixinDatacomLoading = false;
          this.showchart = true;
          this.localdataInit(this.localdata);
        } else if (this.collection !== "") {
          this.mixinDatacomLoading = false;
          this.getCloudData();
        } else {
          this.mixinDatacomLoading = true;
        }
      },
      localdataInit(resdata) {
        if (this.groupEnum.length > 0) {
          for (let i2 = 0; i2 < resdata.length; i2++) {
            for (let j2 = 0; j2 < this.groupEnum.length; j2++) {
              if (resdata[i2].group === this.groupEnum[j2].value) {
                resdata[i2].group = this.groupEnum[j2].text;
              }
            }
          }
        }
        if (this.textEnum.length > 0) {
          for (let i2 = 0; i2 < resdata.length; i2++) {
            for (let j2 = 0; j2 < this.textEnum.length; j2++) {
              if (resdata[i2].text === this.textEnum[j2].value) {
                resdata[i2].text = this.textEnum[j2].text;
              }
            }
          }
        }
        let needCategories = false;
        let tmpData = { categories: [], series: [] };
        let tmpcategories = [];
        let tmpseries = [];
        if (this.echarts === true) {
          needCategories = cfe.categories.includes(this.type);
        } else {
          needCategories = cfu.categories.includes(this.type);
        }
        if (needCategories === true) {
          if (this.chartData && this.chartData.categories && this.chartData.categories.length > 0) {
            tmpcategories = this.chartData.categories;
          } else {
            if (this.startDate && this.endDate) {
              let idate = new Date(this.startDate);
              let edate = new Date(this.endDate);
              while (idate <= edate) {
                tmpcategories.push(getFormatDate(idate));
                idate = idate.setDate(idate.getDate() + 1);
                idate = new Date(idate);
              }
            } else {
              let tempckey = {};
              resdata.map(function(item, index) {
                if (item.text != void 0 && !tempckey[item.text]) {
                  tmpcategories.push(item.text);
                  tempckey[item.text] = true;
                }
              });
            }
          }
          tmpData.categories = tmpcategories;
        }
        let tempskey = {};
        resdata.map(function(item, index) {
          if (item.group != void 0 && !tempskey[item.group]) {
            tmpseries.push({ name: item.group, data: [] });
            tempskey[item.group] = true;
          }
        });
        if (tmpseries.length == 0) {
          tmpseries = [{ name: "\u9ED8\u8BA4\u5206\u7EC4", data: [] }];
          if (needCategories === true) {
            for (let j2 = 0; j2 < tmpcategories.length; j2++) {
              let seriesdata = 0;
              for (let i2 = 0; i2 < resdata.length; i2++) {
                if (resdata[i2].text == tmpcategories[j2]) {
                  seriesdata = resdata[i2].value;
                }
              }
              tmpseries[0].data.push(seriesdata);
            }
          } else {
            for (let i2 = 0; i2 < resdata.length; i2++) {
              tmpseries[0].data.push({ "name": resdata[i2].text, "value": resdata[i2].value });
            }
          }
        } else {
          for (let k2 = 0; k2 < tmpseries.length; k2++) {
            if (tmpcategories.length > 0) {
              for (let j2 = 0; j2 < tmpcategories.length; j2++) {
                let seriesdata = 0;
                for (let i2 = 0; i2 < resdata.length; i2++) {
                  if (tmpseries[k2].name == resdata[i2].group && resdata[i2].text == tmpcategories[j2]) {
                    seriesdata = resdata[i2].value;
                  }
                }
                tmpseries[k2].data.push(seriesdata);
              }
            } else {
              for (let i2 = 0; i2 < resdata.length; i2++) {
                if (tmpseries[k2].name == resdata[i2].group) {
                  tmpseries[k2].data.push(resdata[i2].value);
                }
              }
            }
          }
        }
        tmpData.series = tmpseries;
        this.drawData = deepCloneAssign({}, tmpData);
        this.checkData(tmpData);
      },
      reloading() {
        if (this.errorReload === false) {
          return;
        }
        this.showchart = false;
        this.mixinDatacomErrorMessage = null;
        if (this.collection !== "") {
          this.mixinDatacomLoading = false;
          this.onMixinDatacomPropsChange(true);
        } else {
          this.beforeInit();
        }
      },
      checkData(anyData) {
        let cid = this.cid;
        if (this.echarts === true) {
          cfe.option[cid] = deepCloneAssign({}, this.eopts);
          cfe.option[cid].id = cid;
          cfe.option[cid].type = this.type;
        } else {
          if (this.type && cfu.type.includes(this.type)) {
            cfu.option[cid] = deepCloneAssign({}, cfu[this.type], this.opts);
            cfu.option[cid].canvasId = cid;
          } else {
            this.mixinDatacomLoading = false;
            this.showchart = false;
            this.mixinDatacomErrorMessage = "\u53C2\u6570\u9519\u8BEF\uFF1Aprops\u53C2\u6570\u4E2Dtype\u7C7B\u578B\u4E0D\u6B63\u786E";
          }
        }
        let newData = deepCloneAssign({}, anyData);
        if (newData.series !== void 0 && newData.series.length > 0) {
          this.mixinDatacomErrorMessage = null;
          if (this.echarts === true) {
            cfe.option[cid].chartData = newData;
            this.$nextTick(() => {
              this.init();
            });
          } else {
            cfu.option[cid].categories = newData.categories;
            cfu.option[cid].series = newData.series;
            this.$nextTick(() => {
              this.init();
            });
          }
        }
      },
      resizeHandler() {
        let currTime = Date.now();
        let lastDrawTime = this.lastDrawTime ? this.lastDrawTime : currTime - 3e3;
        let duration = currTime - lastDrawTime;
        if (duration < 1e3)
          return;
        uni.createSelectorQuery().in(this).select("#ChartBoxId" + this.cid).boundingClientRect((data) => {
          this.showchart = true;
          if (data.width > 0 && data.height > 0) {
            if (data.width !== this.cWidth || data.height !== this.cHeight) {
              this.checkData(this.drawData);
            }
          }
        }).exec();
      },
      getCloudData() {
        if (this.mixinDatacomLoading == true) {
          return;
        }
        this.mixinDatacomLoading = true;
        this.mixinDatacomGet().then((res) => {
          this.mixinDatacomResData = res.result.data;
          this.localdataInit(this.mixinDatacomResData);
        }).catch((err) => {
          this.mixinDatacomLoading = false;
          this.showchart = false;
          this.mixinDatacomErrorMessage = "\u8BF7\u6C42\u9519\u8BEF\uFF1A" + err;
        });
      },
      onMixinDatacomPropsChange(needReset, changed) {
        if (needReset == true && this.collection !== "") {
          this.showchart = false;
          this.mixinDatacomErrorMessage = null;
          this._clearChart();
          this.getCloudData();
        }
      },
      _clearChart() {
        let cid = this.cid;
        if (this.echrts !== true) {
          const ctx = uni.createCanvasContext(cid, this);
          ctx.clearRect(0, 0, this.cWidth, this.cHeight);
          ctx.draw();
        }
      },
      init() {
        let cid = this.cid;
        uni.createSelectorQuery().in(this).select("#ChartBoxId" + cid).boundingClientRect((data) => {
          if (data.width > 0 && data.height > 0) {
            this.mixinDatacomLoading = false;
            this.showchart = true;
            this.lastDrawTime = Date.now();
            this.cWidth = data.width;
            this.cHeight = data.height;
            if (this.echarts !== true) {
              cfu.option[cid].background = this.background == "rgba(0,0,0,0)" ? "#FFFFFF" : this.background;
              cfu.option[cid].canvas2d = this.type2d;
              cfu.option[cid].pixelRatio = this.pixel;
              cfu.option[cid].animation = this.animation;
              cfu.option[cid].width = data.width * this.pixel;
              cfu.option[cid].height = data.height * this.pixel;
              cfu.option[cid].ontap = this.ontap;
              cfu.option[cid].ontouch = this.ontouch;
              cfu.option[cid].onmouse = this.openmouse;
              cfu.option[cid].onmovetip = this.onmovetip;
              cfu.option[cid].tooltipShow = this.tooltipShow;
              cfu.option[cid].tooltipFormat = this.tooltipFormat;
              cfu.option[cid].tooltipCustom = this.tooltipCustom;
              cfu.option[cid].inScrollView = this.inScrollView;
              cfu.option[cid].lastDrawTime = this.lastDrawTime;
              cfu.option[cid].tapLegend = this.tapLegend;
            }
            if (this.inH5 || this.inApp) {
              if (this.echarts == true) {
                cfe.option[cid].ontap = this.ontap;
                cfe.option[cid].onmouse = this.openmouse;
                cfe.option[cid].tooltipShow = this.tooltipShow;
                cfe.option[cid].tooltipFormat = this.tooltipFormat;
                cfe.option[cid].tooltipCustom = this.tooltipCustom;
                cfe.option[cid].lastDrawTime = this.lastDrawTime;
                this.echartsOpts = deepCloneAssign({}, cfe.option[cid]);
              } else {
                cfu.option[cid].rotateLock = cfu.option[cid].rotate;
                this.uchartsOpts = deepCloneAssign({}, cfu.option[cid]);
              }
            } else {
              cfu.option[cid] = formatterAssign(cfu.option[cid], cfu.formatter);
              this.mixinDatacomErrorMessage = null;
              this.mixinDatacomLoading = false;
              this.showchart = true;
              this.$nextTick(() => {
                if (this.type2d === true) {
                  const query = uni.createSelectorQuery().in(this);
                  query.select("#" + cid).fields({ node: true, size: true }).exec((res) => {
                    if (res[0]) {
                      const canvas = res[0].node;
                      const ctx = canvas.getContext("2d");
                      cfu.option[cid].context = ctx;
                      canvas.width = data.width * this.pixel;
                      canvas.height = data.height * this.pixel;
                      canvas._width = data.width * this.pixel;
                      canvas._height = data.height * this.pixel;
                      cfu.option[cid].rotateLock = cfu.option[cid].rotate;
                      if (cfu.instance[cid] && cfu.option[cid] && cfu.option[cid].update === true) {
                        this._updataUChart(cid);
                      } else {
                        setTimeout(() => {
                          cfu.option[cid].context.restore();
                          cfu.option[cid].context.save();
                          this._newChart(cid);
                        }, 100);
                      }
                    } else {
                      this.showchart = false;
                      this.mixinDatacomErrorMessage = "\u53C2\u6570\u9519\u8BEF\uFF1A\u5F00\u542F2d\u6A21\u5F0F\u540E\uFF0C\u672A\u83B7\u53D6\u5230dom\u8282\u70B9\uFF0Ccanvas-id:" + cid;
                    }
                  });
                } else {
                  if (this.inAli) {
                    cfu.option[cid].rotateLock = cfu.option[cid].rotate;
                  }
                  cfu.option[cid].context = uni.createCanvasContext(cid, this);
                  if (cfu.instance[cid] && cfu.option[cid] && cfu.option[cid].update === true) {
                    this._updataUChart(cid);
                  } else {
                    setTimeout(() => {
                      cfu.option[cid].context.restore();
                      cfu.option[cid].context.save();
                      this._newChart(cid);
                    }, 100);
                  }
                }
              });
            }
          } else {
            this.mixinDatacomLoading = false;
            this.showchart = false;
            if (this.reshow == true) {
              this.mixinDatacomErrorMessage = "\u5E03\u5C40\u9519\u8BEF\uFF1A\u672A\u83B7\u53D6\u5230\u7236\u5143\u7D20\u5BBD\u9AD8\u5C3A\u5BF8\uFF01canvas-id:" + cid;
            }
          }
        }).exec();
      },
      saveImage() {
        uni.canvasToTempFilePath({
          canvasId: this.cid,
          success: (res) => {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function() {
                uni.showToast({
                  title: "\u4FDD\u5B58\u6210\u529F",
                  duration: 2e3
                });
              }
            });
          }
        }, this);
      },
      _error(e) {
        this.mixinDatacomErrorMessage = e.detail.errMsg;
      },
      emitMsg(msg) {
        this.$emit(msg.name, msg.params);
      },
      getRenderType() {
        if (this.echarts === true && this.mixinDatacomLoading === false) {
          this.beforeInit();
        }
      },
      toJSON() {
        return this;
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_qiun_loading = resolveEasycom(vue.resolveDynamicComponent("qiun-loading"), __easycom_0$2);
    const _component_qiun_error = resolveEasycom(vue.resolveDynamicComponent("qiun-error"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "chartsview",
      id: "ChartBoxId" + $data.cid
    }, [
      _ctx.mixinDatacomLoading ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
        vue.createCommentVNode(" \u81EA\u5B9A\u4E49\u52A0\u8F7D\u72B6\u6001\uFF0C\u8BF7\u6539\u8FD9\u91CC "),
        vue.createVNode(_component_qiun_loading, { loadingType: $props.loadingType }, null, 8, ["loadingType"])
      ])) : vue.createCommentVNode("v-if", true),
      _ctx.mixinDatacomErrorMessage && $props.errorShow ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        onClick: _cache[0] || (_cache[0] = (...args) => $options.reloading && $options.reloading(...args))
      }, [
        vue.createCommentVNode(" \u81EA\u5B9A\u4E49\u9519\u8BEF\u63D0\u793A\uFF0C\u8BF7\u6539\u8FD9\u91CC "),
        vue.createVNode(_component_qiun_error, { errorMessage: $props.errorMessage }, null, 8, ["errorMessage"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" APP\u548CH5\u91C7\u7528renderjs\u6E32\u67D3\u56FE\u8868 "),
      $data.echarts ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        style: vue.normalizeStyle([{ background: $props.background }, { "width": "100%", "height": "100%" }]),
        "data-directory": $props.directory,
        id: "EC" + $data.cid,
        prop: $data.echartsOpts,
        "change:prop": _ctx.rdcharts.ecinit,
        resize: $data.echartsResize,
        "change:resize": _ctx.rdcharts.ecresize
      }, null, 12, ["data-directory", "id", "prop", "change:prop", "resize", "change:resize"])), [
        [vue.vShow, $data.showchart]
      ]) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        onClick: _cache[2] || (_cache[2] = (...args) => _ctx.rdcharts.tap && _ctx.rdcharts.tap(...args)),
        onMousemove: _cache[3] || (_cache[3] = (...args) => _ctx.rdcharts.mouseMove && _ctx.rdcharts.mouseMove(...args)),
        onMousedown: _cache[4] || (_cache[4] = (...args) => _ctx.rdcharts.mouseDown && _ctx.rdcharts.mouseDown(...args)),
        onMouseup: _cache[5] || (_cache[5] = (...args) => _ctx.rdcharts.mouseUp && _ctx.rdcharts.mouseUp(...args)),
        onTouchstart: _cache[6] || (_cache[6] = (...args) => _ctx.rdcharts.touchStart && _ctx.rdcharts.touchStart(...args)),
        onTouchmove: _cache[7] || (_cache[7] = (...args) => _ctx.rdcharts.touchMove && _ctx.rdcharts.touchMove(...args)),
        onTouchend: _cache[8] || (_cache[8] = (...args) => _ctx.rdcharts.touchEnd && _ctx.rdcharts.touchEnd(...args)),
        id: "UC" + $data.cid,
        prop: $data.uchartsOpts,
        "change:prop": _ctx.rdcharts.ucinit
      }, [
        vue.withDirectives(vue.createElementVNode("canvas", {
          id: $data.cid,
          canvasId: $data.cid,
          style: vue.normalizeStyle({ width: $data.cWidth + "px", height: $data.cHeight + "px", background: $props.background }),
          "disable-scroll": $props.disableScroll,
          onError: _cache[1] || (_cache[1] = (...args) => $options._error && $options._error(...args))
        }, null, 44, ["id", "canvasId", "disable-scroll"]), [
          [vue.vShow, $data.showchart]
        ])
      ], 40, ["id", "prop", "change:prop"])),
      vue.createCommentVNode(" \u652F\u4ED8\u5B9D\u5C0F\u7A0B\u5E8F "),
      vue.createCommentVNode(" \u5176\u4ED6\u5C0F\u7A0B\u5E8F\u901A\u8FC7vue\u6E32\u67D3\u56FE\u8868 ")
    ], 8, ["id"]);
  }
  if (typeof block0 === "function")
    block0(_sfc_main$5);
  var __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-f10dbef8"]]);
  const baseOption = {
    "line": {
      "type": "line",
      "canvasId": "",
      "canvas2d": false,
      "background": "none",
      "animation": true,
      "timing": "easeOut",
      "duration": 1e3,
      "color": [
        "#1890FF",
        "#91CB74",
        "#FAC858",
        "#EE6666",
        "#73C0DE",
        "#3CA272",
        "#FC8452",
        "#9A60B4",
        "#ea7ccc"
      ],
      "padding": [
        15,
        10,
        0,
        15
      ],
      "rotate": false,
      "errorReload": true,
      "fontSize": 13,
      "fontColor": "#666666",
      "enableScroll": false,
      "touchMoveLimit": 60,
      "enableMarkLine": true,
      "dataLabel": true,
      "dataPointShape": true,
      "dataPointShapeType": "solid",
      "tapLegend": true,
      "xAxis": {
        "disabled": false,
        "axisLine": true,
        "axisLineColor": "#CCCCCC",
        "calibration": false,
        "fontColor": "#666666",
        "fontSize": 13,
        "rotateLabel": false,
        "labelCount": 20,
        "itemCount": 5,
        "boundaryGap": "center",
        "disableGrid": true,
        "gridColor": "#CCCCCC",
        "gridType": "solid",
        "dashLength": 4,
        "gridEval": 1,
        "scrollShow": false,
        "scrollAlign": "left",
        "scrollColor": "#A6A6A6",
        "scrollBackgroundColor": "#EFEBEF",
        "format": ""
      },
      "yAxis": {
        "disabled": false,
        "disableGrid": false,
        "splitNumber": 5,
        "gridType": "dash",
        "dashLength": 2,
        "gridColor": "#CCCCCC",
        "padding": 10,
        "showTitle": false,
        "data": []
      },
      "legend": {
        "show": true,
        "position": "bottom",
        "float": "center",
        "padding": 5,
        "margin": 5,
        "backgroundColor": "rgba(0,0,0,0)",
        "borderColor": "rgba(0,0,0,0)",
        "borderWidth": 0,
        "fontSize": 13,
        "fontColor": "#666666",
        "lineHeight": 11,
        "hiddenColor": "#CECECE",
        "itemGap": 10
      },
      "extra": {
        "line": {
          "type": "straight",
          "width": 2
        },
        "tooltip": {
          "showBox": true,
          "showArrow": true,
          "showCategory": false,
          "borderWidth": 0,
          "borderRadius": 0,
          "borderColor": "#000000",
          "borderOpacity": 0.7,
          "bgColor": "#000000",
          "bgOpacity": 0.7,
          "gridType": "solid",
          "dashLength": 4,
          "gridColor": "#CCCCCC",
          "fontColor": "#FFFFFF",
          "splitLine": true,
          "horizentalLine": false,
          "xAxisLabel": false,
          "yAxisLabel": false,
          "labelBgColor": "#FFFFFF",
          "labelBgOpacity": 0.7,
          "labelFontColor": "#666666"
        },
        "markLine": {
          "type": "solid",
          "dashLength": 4,
          "data": [
            {
              "value": 45,
              "lineColor": "#DE4A42",
              "showLabel": true,
              "labelFontColor": "#666666",
              "labelBgColor": "#DFE8FF",
              "labelBgOpacity": 0.8,
              "yAxisIndex": 0
            },
            {
              "value": 85,
              "lineColor": "#3344FF",
              "showLabel": false,
              "labelFontColor": "#666666",
              "labelBgColor": "#DFE8FF",
              "labelBgOpacity": 0.8,
              "yAxisIndex": 0
            }
          ]
        }
      }
    }
  };
  var baseOption$1 = { baseOption };
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = __spreadValues({}, defaultSettings);
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data = JSON.parse(raw);
        Object.assign(currentSettings, data);
      } catch (e) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e) {
          }
          currentSettings = value;
        }
      };
      hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
        if (pluginId === this.plugin.id) {
          this.fallbacks.setSettings(value);
        }
      });
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    async setRealTarget(target) {
      this.target = target;
      for (const item of this.onQueue) {
        this.target.on[item.method](...item.args);
      }
      for (const item of this.targetQueue) {
        item.resolve(await this.target[item.method](...item.args));
      }
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && pluginDescriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(pluginDescriptor, hook) : null;
      const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
      list.push({
        pluginDescriptor,
        setupFn,
        proxy
      });
      if (proxy)
        setupFn(proxy.proxiedTarget);
    }
  }
  /*!
   * vuex v4.0.2
   * (c) 2021 Evan You
   * @license MIT
   */
  var storeKey = "store";
  function forEachValue(obj, fn) {
    Object.keys(obj).forEach(function(key) {
      return fn(obj[key], key);
    });
  }
  function isObject(obj) {
    return obj !== null && typeof obj === "object";
  }
  function isPromise(val) {
    return val && typeof val.then === "function";
  }
  function assert(condition, msg) {
    if (!condition) {
      throw new Error("[vuex] " + msg);
    }
  }
  function partial(fn, arg) {
    return function() {
      return fn(arg);
    };
  }
  function genericSubscribe(fn, subs, options) {
    if (subs.indexOf(fn) < 0) {
      options && options.prepend ? subs.unshift(fn) : subs.push(fn);
    }
    return function() {
      var i2 = subs.indexOf(fn);
      if (i2 > -1) {
        subs.splice(i2, 1);
      }
    };
  }
  function resetStore(store2, hot) {
    store2._actions = /* @__PURE__ */ Object.create(null);
    store2._mutations = /* @__PURE__ */ Object.create(null);
    store2._wrappedGetters = /* @__PURE__ */ Object.create(null);
    store2._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
    var state = store2.state;
    installModule(store2, state, [], store2._modules.root, true);
    resetStoreState(store2, state, hot);
  }
  function resetStoreState(store2, state, hot) {
    var oldState = store2._state;
    store2.getters = {};
    store2._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
    var wrappedGetters = store2._wrappedGetters;
    var computedObj = {};
    forEachValue(wrappedGetters, function(fn, key) {
      computedObj[key] = partial(fn, store2);
      Object.defineProperty(store2.getters, key, {
        get: function() {
          return computedObj[key]();
        },
        enumerable: true
      });
    });
    store2._state = vue.reactive({
      data: state
    });
    if (store2.strict) {
      enableStrictMode(store2);
    }
    if (oldState) {
      if (hot) {
        store2._withCommit(function() {
          oldState.data = null;
        });
      }
    }
  }
  function installModule(store2, rootState, path, module, hot) {
    var isRoot = !path.length;
    var namespace = store2._modules.getNamespace(path);
    if (module.namespaced) {
      if (store2._modulesNamespaceMap[namespace] && true) {
        console.error("[vuex] duplicate namespace " + namespace + " for the namespaced module " + path.join("/"));
      }
      store2._modulesNamespaceMap[namespace] = module;
    }
    if (!isRoot && !hot) {
      var parentState = getNestedState(rootState, path.slice(0, -1));
      var moduleName = path[path.length - 1];
      store2._withCommit(function() {
        {
          if (moduleName in parentState) {
            console.warn('[vuex] state field "' + moduleName + '" was overridden by a module with the same name at "' + path.join(".") + '"');
          }
        }
        parentState[moduleName] = module.state;
      });
    }
    var local = module.context = makeLocalContext(store2, namespace, path);
    module.forEachMutation(function(mutation, key) {
      var namespacedType = namespace + key;
      registerMutation(store2, namespacedType, mutation, local);
    });
    module.forEachAction(function(action, key) {
      var type = action.root ? key : namespace + key;
      var handler = action.handler || action;
      registerAction(store2, type, handler, local);
    });
    module.forEachGetter(function(getter, key) {
      var namespacedType = namespace + key;
      registerGetter(store2, namespacedType, getter, local);
    });
    module.forEachChild(function(child, key) {
      installModule(store2, rootState, path.concat(key), child, hot);
    });
  }
  function makeLocalContext(store2, namespace, path) {
    var noNamespace = namespace === "";
    var local = {
      dispatch: noNamespace ? store2.dispatch : function(_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;
        if (!options || !options.root) {
          type = namespace + type;
          if (!store2._actions[type]) {
            console.error("[vuex] unknown local action type: " + args.type + ", global type: " + type);
            return;
          }
        }
        return store2.dispatch(type, payload);
      },
      commit: noNamespace ? store2.commit : function(_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;
        if (!options || !options.root) {
          type = namespace + type;
          if (!store2._mutations[type]) {
            console.error("[vuex] unknown local mutation type: " + args.type + ", global type: " + type);
            return;
          }
        }
        store2.commit(type, payload, options);
      }
    };
    Object.defineProperties(local, {
      getters: {
        get: noNamespace ? function() {
          return store2.getters;
        } : function() {
          return makeLocalGetters(store2, namespace);
        }
      },
      state: {
        get: function() {
          return getNestedState(store2.state, path);
        }
      }
    });
    return local;
  }
  function makeLocalGetters(store2, namespace) {
    if (!store2._makeLocalGettersCache[namespace]) {
      var gettersProxy = {};
      var splitPos = namespace.length;
      Object.keys(store2.getters).forEach(function(type) {
        if (type.slice(0, splitPos) !== namespace) {
          return;
        }
        var localType = type.slice(splitPos);
        Object.defineProperty(gettersProxy, localType, {
          get: function() {
            return store2.getters[type];
          },
          enumerable: true
        });
      });
      store2._makeLocalGettersCache[namespace] = gettersProxy;
    }
    return store2._makeLocalGettersCache[namespace];
  }
  function registerMutation(store2, type, handler, local) {
    var entry = store2._mutations[type] || (store2._mutations[type] = []);
    entry.push(function wrappedMutationHandler(payload) {
      handler.call(store2, local.state, payload);
    });
  }
  function registerAction(store2, type, handler, local) {
    var entry = store2._actions[type] || (store2._actions[type] = []);
    entry.push(function wrappedActionHandler(payload) {
      var res = handler.call(store2, {
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: local.state,
        rootGetters: store2.getters,
        rootState: store2.state
      }, payload);
      if (!isPromise(res)) {
        res = Promise.resolve(res);
      }
      if (store2._devtoolHook) {
        return res.catch(function(err) {
          store2._devtoolHook.emit("vuex:error", err);
          throw err;
        });
      } else {
        return res;
      }
    });
  }
  function registerGetter(store2, type, rawGetter, local) {
    if (store2._wrappedGetters[type]) {
      {
        console.error("[vuex] duplicate getter key: " + type);
      }
      return;
    }
    store2._wrappedGetters[type] = function wrappedGetter(store3) {
      return rawGetter(local.state, local.getters, store3.state, store3.getters);
    };
  }
  function enableStrictMode(store2) {
    vue.watch(function() {
      return store2._state.data;
    }, function() {
      {
        assert(store2._committing, "do not mutate vuex store state outside mutation handlers.");
      }
    }, { deep: true, flush: "sync" });
  }
  function getNestedState(state, path) {
    return path.reduce(function(state2, key) {
      return state2[key];
    }, state);
  }
  function unifyObjectStyle(type, payload, options) {
    if (isObject(type) && type.type) {
      options = payload;
      payload = type;
      type = type.type;
    }
    {
      assert(typeof type === "string", "expects string as the type, but found " + typeof type + ".");
    }
    return { type, payload, options };
  }
  var LABEL_VUEX_BINDINGS = "vuex bindings";
  var MUTATIONS_LAYER_ID = "vuex:mutations";
  var ACTIONS_LAYER_ID = "vuex:actions";
  var INSPECTOR_ID = "vuex";
  var actionId = 0;
  function addDevtools(app, store2) {
    setupDevtoolsPlugin({
      id: "org.vuejs.vuex",
      app,
      label: "Vuex",
      homepage: "https://next.vuex.vuejs.org/",
      logo: "https://vuejs.org/images/icons/favicon-96x96.png",
      packageName: "vuex",
      componentStateTypes: [LABEL_VUEX_BINDINGS]
    }, function(api) {
      api.addTimelineLayer({
        id: MUTATIONS_LAYER_ID,
        label: "Vuex Mutations",
        color: COLOR_LIME_500
      });
      api.addTimelineLayer({
        id: ACTIONS_LAYER_ID,
        label: "Vuex Actions",
        color: COLOR_LIME_500
      });
      api.addInspector({
        id: INSPECTOR_ID,
        label: "Vuex",
        icon: "storage",
        treeFilterPlaceholder: "Filter stores..."
      });
      api.on.getInspectorTree(function(payload) {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          if (payload.filter) {
            var nodes = [];
            flattenStoreForInspectorTree(nodes, store2._modules.root, payload.filter, "");
            payload.rootNodes = nodes;
          } else {
            payload.rootNodes = [
              formatStoreForInspectorTree(store2._modules.root, "")
            ];
          }
        }
      });
      api.on.getInspectorState(function(payload) {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          var modulePath = payload.nodeId;
          makeLocalGetters(store2, modulePath);
          payload.state = formatStoreForInspectorState(getStoreModule(store2._modules, modulePath), modulePath === "root" ? store2.getters : store2._makeLocalGettersCache, modulePath);
        }
      });
      api.on.editInspectorState(function(payload) {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          var modulePath = payload.nodeId;
          var path = payload.path;
          if (modulePath !== "root") {
            path = modulePath.split("/").filter(Boolean).concat(path);
          }
          store2._withCommit(function() {
            payload.set(store2._state.data, path, payload.state.value);
          });
        }
      });
      store2.subscribe(function(mutation, state) {
        var data = {};
        if (mutation.payload) {
          data.payload = mutation.payload;
        }
        data.state = state;
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: Date.now(),
            title: mutation.type,
            data
          }
        });
      });
      store2.subscribeAction({
        before: function(action, state) {
          var data = {};
          if (action.payload) {
            data.payload = action.payload;
          }
          action._id = actionId++;
          action._time = Date.now();
          data.state = state;
          api.addTimelineEvent({
            layerId: ACTIONS_LAYER_ID,
            event: {
              time: action._time,
              title: action.type,
              groupId: action._id,
              subtitle: "start",
              data
            }
          });
        },
        after: function(action, state) {
          var data = {};
          var duration = Date.now() - action._time;
          data.duration = {
            _custom: {
              type: "duration",
              display: duration + "ms",
              tooltip: "Action duration",
              value: duration
            }
          };
          if (action.payload) {
            data.payload = action.payload;
          }
          data.state = state;
          api.addTimelineEvent({
            layerId: ACTIONS_LAYER_ID,
            event: {
              time: Date.now(),
              title: action.type,
              groupId: action._id,
              subtitle: "end",
              data
            }
          });
        }
      });
    });
  }
  var COLOR_LIME_500 = 8702998;
  var COLOR_DARK = 6710886;
  var COLOR_WHITE = 16777215;
  var TAG_NAMESPACED = {
    label: "namespaced",
    textColor: COLOR_WHITE,
    backgroundColor: COLOR_DARK
  };
  function extractNameFromPath(path) {
    return path && path !== "root" ? path.split("/").slice(-2, -1)[0] : "Root";
  }
  function formatStoreForInspectorTree(module, path) {
    return {
      id: path || "root",
      label: extractNameFromPath(path),
      tags: module.namespaced ? [TAG_NAMESPACED] : [],
      children: Object.keys(module._children).map(function(moduleName) {
        return formatStoreForInspectorTree(module._children[moduleName], path + moduleName + "/");
      })
    };
  }
  function flattenStoreForInspectorTree(result, module, filter, path) {
    if (path.includes(filter)) {
      result.push({
        id: path || "root",
        label: path.endsWith("/") ? path.slice(0, path.length - 1) : path || "Root",
        tags: module.namespaced ? [TAG_NAMESPACED] : []
      });
    }
    Object.keys(module._children).forEach(function(moduleName) {
      flattenStoreForInspectorTree(result, module._children[moduleName], filter, path + moduleName + "/");
    });
  }
  function formatStoreForInspectorState(module, getters, path) {
    getters = path === "root" ? getters : getters[path];
    var gettersKeys = Object.keys(getters);
    var storeState = {
      state: Object.keys(module.state).map(function(key) {
        return {
          key,
          editable: true,
          value: module.state[key]
        };
      })
    };
    if (gettersKeys.length) {
      var tree = transformPathsToObjectTree(getters);
      storeState.getters = Object.keys(tree).map(function(key) {
        return {
          key: key.endsWith("/") ? extractNameFromPath(key) : key,
          editable: false,
          value: canThrow(function() {
            return tree[key];
          })
        };
      });
    }
    return storeState;
  }
  function transformPathsToObjectTree(getters) {
    var result = {};
    Object.keys(getters).forEach(function(key) {
      var path = key.split("/");
      if (path.length > 1) {
        var target = result;
        var leafKey = path.pop();
        path.forEach(function(p2) {
          if (!target[p2]) {
            target[p2] = {
              _custom: {
                value: {},
                display: p2,
                tooltip: "Module",
                abstract: true
              }
            };
          }
          target = target[p2]._custom.value;
        });
        target[leafKey] = canThrow(function() {
          return getters[key];
        });
      } else {
        result[key] = canThrow(function() {
          return getters[key];
        });
      }
    });
    return result;
  }
  function getStoreModule(moduleMap, path) {
    var names = path.split("/").filter(function(n2) {
      return n2;
    });
    return names.reduce(function(module, moduleName, i2) {
      var child = module[moduleName];
      if (!child) {
        throw new Error('Missing module "' + moduleName + '" for path "' + path + '".');
      }
      return i2 === names.length - 1 ? child : child._children;
    }, path === "root" ? moduleMap : moduleMap.root._children);
  }
  function canThrow(cb) {
    try {
      return cb();
    } catch (e) {
      return e;
    }
  }
  var Module = function Module2(rawModule, runtime) {
    this.runtime = runtime;
    this._children = /* @__PURE__ */ Object.create(null);
    this._rawModule = rawModule;
    var rawState = rawModule.state;
    this.state = (typeof rawState === "function" ? rawState() : rawState) || {};
  };
  var prototypeAccessors$1 = { namespaced: { configurable: true } };
  prototypeAccessors$1.namespaced.get = function() {
    return !!this._rawModule.namespaced;
  };
  Module.prototype.addChild = function addChild(key, module) {
    this._children[key] = module;
  };
  Module.prototype.removeChild = function removeChild(key) {
    delete this._children[key];
  };
  Module.prototype.getChild = function getChild(key) {
    return this._children[key];
  };
  Module.prototype.hasChild = function hasChild(key) {
    return key in this._children;
  };
  Module.prototype.update = function update2(rawModule) {
    this._rawModule.namespaced = rawModule.namespaced;
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions;
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations;
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters;
    }
  };
  Module.prototype.forEachChild = function forEachChild(fn) {
    forEachValue(this._children, fn);
  };
  Module.prototype.forEachGetter = function forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  };
  Module.prototype.forEachAction = function forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  };
  Module.prototype.forEachMutation = function forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  };
  Object.defineProperties(Module.prototype, prototypeAccessors$1);
  var ModuleCollection = function ModuleCollection2(rawRootModule) {
    this.register([], rawRootModule, false);
  };
  ModuleCollection.prototype.get = function get(path) {
    return path.reduce(function(module, key) {
      return module.getChild(key);
    }, this.root);
  };
  ModuleCollection.prototype.getNamespace = function getNamespace(path) {
    var module = this.root;
    return path.reduce(function(namespace, key) {
      module = module.getChild(key);
      return namespace + (module.namespaced ? key + "/" : "");
    }, "");
  };
  ModuleCollection.prototype.update = function update$1(rawRootModule) {
    update([], this.root, rawRootModule);
  };
  ModuleCollection.prototype.register = function register(path, rawModule, runtime) {
    var this$1$1 = this;
    if (runtime === void 0)
      runtime = true;
    {
      assertRawModule(path, rawModule);
    }
    var newModule = new Module(rawModule, runtime);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      var parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
    }
    if (rawModule.modules) {
      forEachValue(rawModule.modules, function(rawChildModule, key) {
        this$1$1.register(path.concat(key), rawChildModule, runtime);
      });
    }
  };
  ModuleCollection.prototype.unregister = function unregister(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    var child = parent.getChild(key);
    if (!child) {
      {
        console.warn("[vuex] trying to unregister module '" + key + "', which is not registered");
      }
      return;
    }
    if (!child.runtime) {
      return;
    }
    parent.removeChild(key);
  };
  ModuleCollection.prototype.isRegistered = function isRegistered(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    if (parent) {
      return parent.hasChild(key);
    }
    return false;
  };
  function update(path, targetModule, newModule) {
    {
      assertRawModule(path, newModule);
    }
    targetModule.update(newModule);
    if (newModule.modules) {
      for (var key in newModule.modules) {
        if (!targetModule.getChild(key)) {
          {
            console.warn("[vuex] trying to add a new module '" + key + "' on hot reloading, manual reload is needed");
          }
          return;
        }
        update(path.concat(key), targetModule.getChild(key), newModule.modules[key]);
      }
    }
  }
  var functionAssert = {
    assert: function(value) {
      return typeof value === "function";
    },
    expected: "function"
  };
  var objectAssert = {
    assert: function(value) {
      return typeof value === "function" || typeof value === "object" && typeof value.handler === "function";
    },
    expected: 'function or object with "handler" function'
  };
  var assertTypes = {
    getters: functionAssert,
    mutations: functionAssert,
    actions: objectAssert
  };
  function assertRawModule(path, rawModule) {
    Object.keys(assertTypes).forEach(function(key) {
      if (!rawModule[key]) {
        return;
      }
      var assertOptions = assertTypes[key];
      forEachValue(rawModule[key], function(value, type) {
        assert(assertOptions.assert(value), makeAssertionMessage(path, key, type, value, assertOptions.expected));
      });
    });
  }
  function makeAssertionMessage(path, key, type, value, expected) {
    var buf = key + " should be " + expected + ' but "' + key + "." + type + '"';
    if (path.length > 0) {
      buf += ' in module "' + path.join(".") + '"';
    }
    buf += " is " + JSON.stringify(value) + ".";
    return buf;
  }
  function createStore(options) {
    return new Store(options);
  }
  var Store = function Store2(options) {
    var this$1$1 = this;
    if (options === void 0)
      options = {};
    {
      assert(typeof Promise !== "undefined", "vuex requires a Promise polyfill in this browser.");
      assert(this instanceof Store2, "store must be called with the new operator.");
    }
    var plugins = options.plugins;
    if (plugins === void 0)
      plugins = [];
    var strict = options.strict;
    if (strict === void 0)
      strict = false;
    var devtools = options.devtools;
    this._committing = false;
    this._actions = /* @__PURE__ */ Object.create(null);
    this._actionSubscribers = [];
    this._mutations = /* @__PURE__ */ Object.create(null);
    this._wrappedGetters = /* @__PURE__ */ Object.create(null);
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
    this._subscribers = [];
    this._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
    this._devtools = devtools;
    var store2 = this;
    var ref = this;
    var dispatch = ref.dispatch;
    var commit = ref.commit;
    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store2, type, payload);
    };
    this.commit = function boundCommit(type, payload, options2) {
      return commit.call(store2, type, payload, options2);
    };
    this.strict = strict;
    var state = this._modules.root.state;
    installModule(this, state, [], this._modules.root);
    resetStoreState(this, state);
    plugins.forEach(function(plugin) {
      return plugin(this$1$1);
    });
  };
  var prototypeAccessors = { state: { configurable: true } };
  Store.prototype.install = function install(app, injectKey) {
    app.provide(injectKey || storeKey, this);
    app.config.globalProperties.$store = this;
    var useDevtools = this._devtools !== void 0 ? this._devtools : true;
    if (useDevtools) {
      addDevtools(app, this);
    }
  };
  prototypeAccessors.state.get = function() {
    return this._state.data;
  };
  prototypeAccessors.state.set = function(v2) {
    {
      assert(false, "use store.replaceState() to explicit replace store state.");
    }
  };
  Store.prototype.commit = function commit(_type, _payload, _options) {
    var this$1$1 = this;
    var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;
    var mutation = { type, payload };
    var entry = this._mutations[type];
    if (!entry) {
      {
        console.error("[vuex] unknown mutation type: " + type);
      }
      return;
    }
    this._withCommit(function() {
      entry.forEach(function commitIterator(handler) {
        handler(payload);
      });
    });
    this._subscribers.slice().forEach(function(sub) {
      return sub(mutation, this$1$1.state);
    });
    if (options && options.silent) {
      console.warn("[vuex] mutation type: " + type + ". Silent option has been removed. Use the filter functionality in the vue-devtools");
    }
  };
  Store.prototype.dispatch = function dispatch(_type, _payload) {
    var this$1$1 = this;
    var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;
    var action = { type, payload };
    var entry = this._actions[type];
    if (!entry) {
      {
        console.error("[vuex] unknown action type: " + type);
      }
      return;
    }
    try {
      this._actionSubscribers.slice().filter(function(sub) {
        return sub.before;
      }).forEach(function(sub) {
        return sub.before(action, this$1$1.state);
      });
    } catch (e) {
      {
        console.warn("[vuex] error in before action subscribers: ");
        console.error(e);
      }
    }
    var result = entry.length > 1 ? Promise.all(entry.map(function(handler) {
      return handler(payload);
    })) : entry[0](payload);
    return new Promise(function(resolve, reject) {
      result.then(function(res) {
        try {
          this$1$1._actionSubscribers.filter(function(sub) {
            return sub.after;
          }).forEach(function(sub) {
            return sub.after(action, this$1$1.state);
          });
        } catch (e) {
          {
            console.warn("[vuex] error in after action subscribers: ");
            console.error(e);
          }
        }
        resolve(res);
      }, function(error) {
        try {
          this$1$1._actionSubscribers.filter(function(sub) {
            return sub.error;
          }).forEach(function(sub) {
            return sub.error(action, this$1$1.state, error);
          });
        } catch (e) {
          {
            console.warn("[vuex] error in error action subscribers: ");
            console.error(e);
          }
        }
        reject(error);
      });
    });
  };
  Store.prototype.subscribe = function subscribe(fn, options) {
    return genericSubscribe(fn, this._subscribers, options);
  };
  Store.prototype.subscribeAction = function subscribeAction(fn, options) {
    var subs = typeof fn === "function" ? { before: fn } : fn;
    return genericSubscribe(subs, this._actionSubscribers, options);
  };
  Store.prototype.watch = function watch$1(getter, cb, options) {
    var this$1$1 = this;
    {
      assert(typeof getter === "function", "store.watch only accepts a function.");
    }
    return vue.watch(function() {
      return getter(this$1$1.state, this$1$1.getters);
    }, cb, Object.assign({}, options));
  };
  Store.prototype.replaceState = function replaceState(state) {
    var this$1$1 = this;
    this._withCommit(function() {
      this$1$1._state.data = state;
    });
  };
  Store.prototype.registerModule = function registerModule(path, rawModule, options) {
    if (options === void 0)
      options = {};
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
      assert(path.length > 0, "cannot register the root module by using registerModule.");
    }
    this._modules.register(path, rawModule);
    installModule(this, this.state, path, this._modules.get(path), options.preserveState);
    resetStoreState(this, this.state);
  };
  Store.prototype.unregisterModule = function unregisterModule(path) {
    var this$1$1 = this;
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }
    this._modules.unregister(path);
    this._withCommit(function() {
      var parentState = getNestedState(this$1$1.state, path.slice(0, -1));
      delete parentState[path[path.length - 1]];
    });
    resetStore(this);
  };
  Store.prototype.hasModule = function hasModule(path) {
    if (typeof path === "string") {
      path = [path];
    }
    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }
    return this._modules.isRegistered(path);
  };
  Store.prototype.hotUpdate = function hotUpdate(newOptions) {
    this._modules.update(newOptions);
    resetStore(this, true);
  };
  Store.prototype._withCommit = function _withCommit(fn) {
    var committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  };
  Object.defineProperties(Store.prototype, prototypeAccessors);
  const store = createStore({
    state() {
      return {
        "servers": [
          { "name": "\u6D4B\u8BD5", "addr": "http://192.168.31.183" },
          { "name": "\u51B7\u85CF/\u53D1\u9175\u67DC", "addr": "http://192.168.31.244" },
          { "name": "\u5C0F\u53D1\u9175\u7BB1", "addr": "http://192.168.31.74" }
        ],
        "server": { "name": "\u6D4B\u8BD5", "addr": "http://192.168.31.183" }
      };
    },
    mutations: {
      update_server(state, server) {
        state.server = server;
      }
    }
  });
  const _sfc_main$4 = {
    name: "charts_panel",
    props: ["config", "measure", "tt", "th", "dts", "mode"],
    data() {
      return {
        time_series: [],
        sensors_data: []
      };
    },
    beforeMount() {
      this.initChart();
    },
    mounted() {
      this.initData();
    },
    computed: {
      current_server() {
        return store.state.server;
      },
      target_temp() {
        return this.tt;
      },
      target_humi() {
        return this.th;
      },
      dChartData() {
        if (this.measure && this.dts) {
          let lines = [this.dts];
          this.measure.forEach((sensor) => {
            lines.push(sensor[0]);
            lines.push(sensor[1]);
            lines.push(sensor[2]);
          });
          this.addData(lines);
        }
        let data = { categories: this.time_series, series: this.sensors_data };
        return data;
      },
      dChartOption() {
        let op = baseOption$1["baseOption"];
        op["line"]["extra"]["markLine"]["data"][0]["value"] = this.target_temp;
        if (this.mode === "COOLER") {
          op["line"]["extra"]["markLine"]["data"][1]["value"] = this.target_humi;
        }
        return op["line"];
      },
      easyChartOption() {
        let op = {};
        op["xAxis"] = { "labelCount": 30 / this.time_series.length };
        if (this.mode === "COOLER") {
          op["extra"] = { "markLine": { "data": [{ "value": this.target_temp }, { "value": this.target_humi }] } };
        } else {
          op["extra"] = { "markLine": { "data": [{ "value": this.target_temp }] } };
        }
        return op;
      }
    },
    methods: {
      initChart() {
        let hcs = ["#ee4423", "#ee6423", "#ee8423"];
        let ucs = ["#2323ee", "#6464ee", "#8484ff"];
        if (this.config && this.config["sersors"]) {
          this.config["sersors"].forEach((s2, index) => {
            this.sensors_data.push({ "name": s2 + "\u6E29\u5EA6", "data": [], "color": hcs[index] });
            this.sensors_data.push({ "name": s2 + "\u6E7F\u5EA6", "data": [], "color": ucs[index] });
          });
        }
      },
      valid_date(s2) {
        if (parseFloat(s2))
          ;
        else {
          return 0;
        }
      },
      addData(line) {
        this.time_series.push(line[0].split(" ")[1]);
        for (let i2 = 1, j2 = 0; i2 < line.length; i2 = i2 + 3) {
          this.sensors_data[j2]["data"].push(this.valid_date(line[i2 + 1]));
          j2 = j2 + 1;
          this.sensors_data[j2]["data"].push(this.valid_date(line[i2 + 2]));
          j2 = j2 + 1;
        }
      },
      initData() {
        uni.request({
          url: this.current_server.addr + "/his",
          method: "GET",
          dataType: "text",
          mode: "cors",
          success: (res) => {
            var lines = res.data.split("\n");
            for (var i2 = 0; i2 < lines.length; i2++) {
              var line = lines[i2].split("^");
              this.addData(line);
            }
          }
        });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_qiun_data_charts = resolveEasycom(vue.resolveDynamicComponent("qiun-data-charts"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createVNode(_component_qiun_data_charts, {
        class: "h5_chart",
        type: "line",
        chartData: $options.dChartData,
        opts: $options.easyChartOption
      }, null, 8, ["chartData", "opts"])
    ]);
  }
  var __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-52aed078"]]);
  const _sfc_main$3 = {
    data() {
      return {
        config: {
          functions: []
        },
        msg: {
          mode: "HEATER",
          r: false,
          measure: [],
          status: [],
          tt: 28,
          th: 85
        },
        href: "https://uniapp.dcloud.io/component/README?id=uniui"
      };
    },
    onLoad() {
      this.getConfig();
      this.checkStatus();
      this.timerID = setInterval(() => this.checkStatus(), 33e3);
    },
    computed: {
      current_server() {
        return store.state.server;
      }
    },
    methods: {
      onSwitchLight() {
        uni.request({
          type: "GET",
          url: this.current_server.addr + "/operate?op=switch_light",
          dataType: "text",
          mode: "cors",
          success: (res) => {
          },
          fail: (res) => {
            formatAppLog("log", "at pages/index/index.vue:75", "fail startup");
          }
        });
      },
      onStartUp() {
        uni.request({
          type: "GET",
          url: this.current_server.addr + "/operate?op=startup",
          dataType: "text",
          mode: "cors",
          success: (res) => {
            this.checkStatus();
          },
          fail: (res) => {
            formatAppLog("log", "at pages/index/index.vue:89", "fail startup");
          }
        });
      },
      onShutDown() {
        uni.request({
          type: "GET",
          url: this.current_server.addr + "/operate?op=shutdown",
          dataType: "text",
          mode: "cors",
          success: (res) => {
            this.msg.r = false;
          },
          fail: (res) => {
            formatAppLog("log", "at pages/index/index.vue:103", "fail startup");
          }
        });
      },
      onSwitchMode(e) {
        let mode = e.detail.value;
        formatAppLog("log", "at pages/index/index.vue:109", "switch mode:", mode);
        uni.request({
          url: this.current_server.addr + "/operate?op=switch_mode&value=" + mode,
          method: "GET",
          dataType: "text",
          mode: "cors"
        }).then((response) => {
          this.msg.mode = mode;
          this.checkStatus();
        }).catch((e2) => {
        });
      },
      onTempSetup(t2) {
        uni.request({
          type: "GET",
          url: this.current_server.addr + "/operate?op=temp_val&value=" + t2,
          dataType: "text",
          mode: "cors",
          success: (res) => {
            this.msg.tt = t2;
          },
          fail: (res) => {
            formatAppLog("log", "at pages/index/index.vue:131", "fail startup");
          }
        });
      },
      onHumiSetup(t2) {
        uni.request({
          type: "GET",
          url: this.current_server.addr + "/operate?op=humi_val&value=" + t2,
          dataType: "text",
          mode: "cors",
          success: (res) => {
            this.msg.th = t2;
          },
          fail: (res) => {
            formatAppLog("log", "at pages/index/index.vue:145", "fail startup");
          }
        });
      },
      getConfig() {
        uni.request({
          url: this.current_server.addr + "/box_config",
          dataType: "json",
          mode: "cors",
          success: (res) => {
            this.config = res.data;
          },
          fail: (res) => {
            formatAppLog("log", "at pages/index/index.vue:158", "fail get status", res);
          }
        });
      },
      checkStatus() {
        uni.request({
          url: this.current_server.addr + "/status",
          dataType: "json",
          mode: "cors",
          success: (res) => {
            this.msg = res.data;
          },
          fail: (res) => {
            formatAppLog("log", "at pages/index/index.vue:171", "fail get status");
          }
        });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_control_panel = resolveEasycom(vue.resolveDynamicComponent("control_panel"), __easycom_0$4);
    const _component_setup_panel = resolveEasycom(vue.resolveDynamicComponent("setup_panel"), __easycom_1$1);
    const _component_status_panel = resolveEasycom(vue.resolveDynamicComponent("status_panel"), __easycom_2);
    const _component_charts_panel = resolveEasycom(vue.resolveDynamicComponent("charts_panel"), __easycom_3);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", { class: "container" }, [
        vue.createElementVNode("view", { class: "h5control_header" }, [
          vue.createElementVNode("text", { class: "title_text" }, "\u5F53\u524D\u8BBE\u5907\uFF1A" + vue.toDisplayString($options.current_server.name), 1),
          vue.createVNode(_component_control_panel, vue.mergeProps({
            onSwitchLight: $options.onSwitchLight,
            onStartUp: $options.onStartUp,
            onShutDown: $options.onShutDown,
            onSwitchMode: $options.onSwitchMode,
            config: $data.config
          }, $data.msg), null, 16, ["onSwitchLight", "onStartUp", "onShutDown", "onSwitchMode", "config"]),
          vue.createVNode(_component_setup_panel, vue.mergeProps({
            config: $data.config,
            onTempSetup: $options.onTempSetup,
            onHumiSetup: $options.onHumiSetup
          }, $data.msg), null, 16, ["config", "onTempSetup", "onHumiSetup"]),
          vue.createVNode(_component_status_panel, vue.mergeProps({ config: $data.config }, $data.msg), null, 16, ["config"])
        ]),
        $data.msg["r"] ? (vue.openBlock(), vue.createBlock(_component_charts_panel, vue.mergeProps({
          key: 0,
          config: $data.config
        }, $data.msg), null, 16, ["config"])) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  var PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2]]);
  const _sfc_main$2 = {
    name: "config_item",
    props: ["full", "stop", "title", "desc"],
    data() {
      return {};
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_number_box = resolveEasycom(vue.resolveDynamicComponent("uni-number-box"), __easycom_0$3);
    return vue.openBlock(), vue.createElementBlock("view", { class: "value_panel" }, [
      vue.createElementVNode("view", { class: "title_pan" }, [
        vue.createElementVNode("text", { class: "title_text" }, vue.toDisplayString($props.title), 1),
        $props.desc ? (vue.openBlock(), vue.createElementBlock("text", {
          key: 0,
          class: "desc_text"
        }, vue.toDisplayString($props.desc), 1)) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createElementVNode("view", { class: "values_pan" }, [
        vue.createElementVNode("text", { class: "label_text" }, "\u6EE1\u8F7D\u6E29\u5DEE"),
        vue.createVNode(_component_uni_number_box, {
          min: $props.full[1],
          max: $props.full[2],
          step: $props.full[3],
          value: $props.full[0],
          onChange: $props.full[4]
        }, null, 8, ["min", "max", "step", "value", "onChange"]),
        vue.createElementVNode("text", { class: "label_text" }, "\u505C\u6B62\u6E29\u5DEE"),
        vue.createVNode(_component_uni_number_box, {
          min: $props.stop[1],
          max: $props.stop[2],
          step: $props.stop[3],
          value: $props.stop[0],
          onChange: $props.stop[4]
        }, null, 8, ["min", "max", "step", "value", "onChange"])
      ])
    ]);
  }
  var __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-4de6ce66"]]);
  const _sfc_main$1 = {
    data() {
      return {
        config: {},
        settings: []
      };
    },
    onLoad() {
      this.getConfig();
    },
    computed: {
      current_server() {
        return store.state.server;
      },
      proof_box_servers() {
        return store.state.servers;
      }
    },
    methods: {
      switchServer(e) {
        this.proof_box_servers.forEach((server) => {
          if (server.name === e.detail.value) {
            formatAppLog("log", "at pages/config/config.vue:73", "update server to:", server);
            store.commit("update_server", server);
          }
        });
      },
      getConfig() {
        uni.request({
          url: this.current_server.addr + "/box_config",
          dataType: "json",
          mode: "cors",
          success: (res) => {
            this.config = res.data;
            this.getSettings();
          },
          fail: (res) => {
            formatAppLog("log", "at pages/config/config.vue:88", "fail get status", res);
          }
        });
      },
      getSettings() {
        uni.request({
          url: this.current_server.addr + "/get_settings",
          method: "GET",
          mode: "cors",
          dataType: "json",
          success: (res) => {
            this.settings = res.data;
          }
        });
      },
      onSubmit() {
        let form_data = JSON.stringify(this.settings);
        uni.request({
          url: this.current_server.addr + "/change_settings",
          dataType: "text",
          method: "POST",
          mode: "cors",
          data: form_data,
          timeout: 9e3,
          success: (res) => {
            onReturn();
          }
        });
      },
      onReturn() {
        uni.switchTab({
          url: "../index/index"
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_config_item = resolveEasycom(vue.resolveDynamicComponent("config_item"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "setup_header" }, [
      vue.createElementVNode("view", { class: "server_select_panel" }, [
        vue.createElementVNode("text", { class: "title_text" }, " \u8BBE\u5907\uFF1A "),
        vue.createElementVNode("radio-group", {
          onChange: _cache[0] || (_cache[0] = (...args) => $options.switchServer && $options.switchServer(...args))
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.proof_box_servers, (item) => {
            return vue.openBlock(), vue.createElementBlock("label", {
              class: "label_text",
              key: item.name
            }, [
              vue.createElementVNode("radio", {
                value: item.name,
                checked: $options.current_server.name === item.name
              }, vue.toDisplayString(item.name), 9, ["value", "checked"])
            ]);
          }), 128))
        ], 32),
        vue.createElementVNode("button", {
          class: "action_button",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.onReturn && $options.onReturn(...args))
        }, "\u5207\u6362")
      ]),
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.config["heaters"], (item, index) => {
        return vue.openBlock(), vue.createBlock(_component_config_item, {
          title: "\u52A0\u70ED\u5668\u4EF6" + item,
          key: item,
          full: [$data.settings[item] ? $data.settings[item][1] : 5, 5, 8, 0.5, (v2) => {
            $data.settings[item][1] = v2;
          }],
          stop: [$data.settings[item] ? $data.settings[item][2] : -1, -2, 1, 0.5, (v2) => {
            $data.settings[item][2] = v2;
          }]
        }, null, 8, ["title", "full", "stop"]);
      }), 128)),
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.config["humis"], (item, index) => {
        return vue.openBlock(), vue.createBlock(_component_config_item, {
          title: "\u52A0\u6E7F\u5668\u4EF6" + item,
          key: item,
          full: [$data.settings[item] ? $data.settings[item][1] : 10, 10, 30, 2, (v2) => {
            $data.settings[item][1] = v2;
          }],
          stop: [$data.settings[item] ? $data.settings[item][2] : -1, -5, 5, 2, (v2) => {
            $data.settings[item][2] = v2;
          }]
        }, null, 8, ["title", "full", "stop"]);
      }), 128)),
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.config["fans"], (item, index) => {
        return vue.openBlock(), vue.createBlock(_component_config_item, {
          title: "\u98CE\u6247\u5668\u4EF6" + item,
          key: item,
          desc: "\u8BBE\u7F6E-1,-1\u65F6\u98CE\u6247\u5168\u901F\u8FD0\u8F6C,-2,-2\u65F6\u98CE\u6247\u6700\u4F4E\u901F\u8FD0\u8F6C",
          full: [$data.settings[item] ? $data.settings[item][1] : -1, -2, 6, 0.5, (v2) => {
            $data.settings[item][1] = v2;
          }],
          stop: [$data.settings[item] ? $data.settings[item][2] : -1, -2, 1, 0.5, (v2) => {
            $data.settings[item][2] = v2;
          }]
        }, null, 8, ["title", "full", "stop"]);
      }), 128)),
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.config["frigs"], (item, index) => {
        return vue.openBlock(), vue.createBlock(_component_config_item, {
          title: "\u5236\u51B7\u5668\u4EF6" + item,
          key: item,
          full: [$data.settings[item] ? $data.settings[item][1] : 3, -6, 6, 0.5, (v2) => {
            $data.settings[item][1] = v2;
          }],
          stop: [$data.settings[item] ? $data.settings[item][2] : -1, -6, 6, 0.5, (v2) => {
            $data.settings[item][2] = v2;
          }]
        }, null, 8, ["title", "full", "stop"]);
      }), 128)),
      vue.createElementVNode("view", { class: "action_pan" }, [
        vue.createElementVNode("button", {
          class: "action_button",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.onReturn && $options.onReturn(...args))
        }, "\u8FD4\u56DE"),
        vue.createElementVNode("button", {
          class: "action_button",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.getSettings && $options.getSettings(...args))
        }, "\u6062\u590D"),
        vue.createElementVNode("button", {
          class: "action_button",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.onSubmit && $options.onSubmit(...args))
        }, "\u8BBE\u7F6E")
      ])
    ]);
  }
  var PagesConfigConfig = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render]]);
  if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
    Promise.prototype.finally = function(callback) {
      const promise = this.constructor;
      return this.then((value) => promise.resolve(callback()).then(() => value), (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      }));
    };
  }
  if (uni && uni.base64ToArrayBuffer) {
    ArrayBuffer = uni.base64ToArrayBuffer("").constructor;
  }
  if (uni.restoreGlobal) {
    uni.restoreGlobal(vue__namespace, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
  }
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/config/config", PagesConfigConfig);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("warn", "at App.vue:4", "\u5F53\u524D\u7EC4\u4EF6\u4EC5\u652F\u6301 uni_modules \u76EE\u5F55\u7ED3\u6784 \uFF0C\u8BF7\u5347\u7EA7 HBuilderX \u5230 3.1.0 \u7248\u672C\u4EE5\u4E0A\uFF01");
      formatAppLog("log", "at App.vue:5", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:8", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:11", "App Hide");
    }
  };
  var version = "3.0.0-alpha-3031320220314001";
  const STAT_VERSION = version;
  const STAT_URL = "https://tongji.dcloud.io/uni/stat";
  const STAT_H5_URL = "https://tongji.dcloud.io/uni/stat.gif";
  const PAGE_PVER_TIME = 1800;
  const APP_PVER_TIME = 300;
  const OPERATING_TIME = 10;
  const DIFF_TIME = 60 * 1e3 * 60 * 24;
  const statConfig$1 = {
    appid: "__UNI__7A2368B"
  };
  const UUID_KEY = "__DC_STAT_UUID";
  const UUID_VALUE = "__DC_UUID_VALUE";
  function getUuid() {
    let uuid = "";
    if (getPlatformName() === "n") {
      try {
        uuid = plus.runtime.getDCloudId();
      } catch (e) {
        uuid = "";
      }
      return uuid;
    }
    try {
      uuid = uni.getStorageSync(UUID_KEY);
    } catch (e) {
      uuid = UUID_VALUE;
    }
    if (!uuid) {
      uuid = Date.now() + "" + Math.floor(Math.random() * 1e7);
      try {
        uni.setStorageSync(UUID_KEY, uuid);
      } catch (e) {
        uni.setStorageSync(UUID_KEY, UUID_VALUE);
      }
    }
    return uuid;
  }
  const getSgin = (statData) => {
    let arr = Object.keys(statData);
    let sortArr = arr.sort();
    let sgin = {};
    let sginStr = "";
    for (var i2 in sortArr) {
      sgin[sortArr[i2]] = statData[sortArr[i2]];
      sginStr += sortArr[i2] + "=" + statData[sortArr[i2]] + "&";
    }
    return {
      sign: "",
      options: sginStr.substr(0, sginStr.length - 1)
    };
  };
  const getSplicing = (data) => {
    let str = "";
    for (var i2 in data) {
      str += i2 + "=" + data[i2] + "&";
    }
    return str.substr(0, str.length - 1);
  };
  const getTime = () => {
    return parseInt(new Date().getTime() / 1e3);
  };
  const getPlatformName = () => {
    const aliArr = ["y", "a", "p", "mp-ali"];
    const platformList = {
      "app-plus": "n",
      h5: "h5",
      "mp-weixin": "wx",
      [aliArr.reverse().join("")]: "ali",
      "mp-baidu": "bd",
      "mp-toutiao": "tt",
      "mp-qq": "qq",
      "quickapp-native": "qn",
      "mp-kuaishou": "ks"
    };
    return platformList["app"];
  };
  const getPackName = () => {
    let packName = "";
    if (getPlatformName() === "wx" || getPlatformName() === "qq") {
      if (uni.canIUse("getAccountInfoSync")) {
        packName = uni.getAccountInfoSync().miniProgram.appId || "";
      }
    }
    return packName;
  };
  const getVersion = () => {
    return getPlatformName() === "n" ? plus.runtime.version : "";
  };
  const getChannel = () => {
    const platformName = getPlatformName();
    let channel = "";
    if (platformName === "n") {
      channel = plus.runtime.channel;
    }
    return channel;
  };
  const getScene = (options) => {
    const platformName = getPlatformName();
    let scene = "";
    if (options) {
      return options;
    }
    if (platformName === "wx") {
      scene = uni.getLaunchOptionsSync().scene;
    }
    return scene;
  };
  const First__Visit__Time__KEY = "First__Visit__Time";
  const Last__Visit__Time__KEY = "Last__Visit__Time";
  const getFirstVisitTime = () => {
    const timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
    let time = 0;
    if (timeStorge) {
      time = timeStorge;
    } else {
      time = getTime();
      uni.setStorageSync(First__Visit__Time__KEY, time);
      uni.removeStorageSync(Last__Visit__Time__KEY);
    }
    return time;
  };
  const getLastVisitTime = () => {
    const timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
    let time = 0;
    if (timeStorge) {
      time = timeStorge;
    } else {
      time = "";
    }
    uni.setStorageSync(Last__Visit__Time__KEY, getTime());
    return time;
  };
  const PAGE_RESIDENCE_TIME = "__page__residence__time";
  let First_Page_residence_time = 0;
  let Last_Page_residence_time = 0;
  const setPageResidenceTime = () => {
    First_Page_residence_time = getTime();
    if (getPlatformName() === "n") {
      uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
    }
    return First_Page_residence_time;
  };
  const getPageResidenceTime = () => {
    Last_Page_residence_time = getTime();
    if (getPlatformName() === "n") {
      First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
    }
    return Last_Page_residence_time - First_Page_residence_time;
  };
  const TOTAL__VISIT__COUNT = "Total__Visit__Count";
  const getTotalVisitCount = () => {
    const timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
    let count = 1;
    if (timeStorge) {
      count = timeStorge;
      count++;
    }
    uni.setStorageSync(TOTAL__VISIT__COUNT, count);
    return count;
  };
  const GetEncodeURIComponentOptions = (statData) => {
    let data = {};
    for (let prop in statData) {
      data[prop] = encodeURIComponent(statData[prop]);
    }
    return data;
  };
  let Set__First__Time = 0;
  let Set__Last__Time = 0;
  const getFirstTime = () => {
    let time = new Date().getTime();
    Set__First__Time = time;
    Set__Last__Time = 0;
    return time;
  };
  const getLastTime = () => {
    let time = new Date().getTime();
    Set__Last__Time = time;
    return time;
  };
  const getResidenceTime = (type) => {
    let residenceTime = 0;
    if (Set__First__Time !== 0) {
      residenceTime = Set__Last__Time - Set__First__Time;
    }
    residenceTime = parseInt(residenceTime / 1e3);
    residenceTime = residenceTime < 1 ? 1 : residenceTime;
    if (type === "app") {
      let overtime = residenceTime > APP_PVER_TIME ? true : false;
      return {
        residenceTime,
        overtime
      };
    }
    if (type === "page") {
      let overtime = residenceTime > PAGE_PVER_TIME ? true : false;
      return {
        residenceTime,
        overtime
      };
    }
    return {
      residenceTime
    };
  };
  const getRoute = () => {
    var pages = getCurrentPages();
    var page = pages[pages.length - 1];
    if (!page)
      return "";
    let _self = page.$vm;
    if (getPlatformName() === "bd") {
      return _self.$mp && _self.$mp.page.is;
    } else {
      return _self.route || _self.$scope && _self.$scope.route;
    }
  };
  const getPageRoute = (_this) => {
    let pageVm = _this.self;
    let page = pageVm.$page || pageVm.$scope.$page;
    return page.fullPath === "/" ? page.route : page.fullPath;
  };
  const getPageTypes = (self) => {
    if (self.$mpType === "page" || self.$mp && self.$mp.mpType === "page" || self.$options.mpType === "page") {
      return true;
    }
    return false;
  };
  const calibration = (eventName, options) => {
    if (!eventName) {
      console.error(`uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570`);
      return true;
    }
    if (typeof eventName !== "string") {
      console.error(`uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B`);
      return true;
    }
    if (eventName.length > 255) {
      console.error(`uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255`);
      return true;
    }
    if (typeof options !== "string" && typeof options !== "object") {
      console.error(`uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B`);
      return true;
    }
    if (typeof options === "string" && options.length > 255) {
      console.error(`uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255`);
      return true;
    }
    if (eventName === "title" && typeof options !== "string") {
      console.error("uni.report [eventName] \u53C2\u6570\u4E3A title \u65F6\uFF0C[options] \u53C2\u6570\u53EA\u80FD\u4E3A String \u7C7B\u578B");
      return true;
    }
  };
  const Report_Data_Time = "Report_Data_Time";
  const Report_Status = "Report_Status";
  const isReportData = () => {
    return new Promise((resolve, reject) => {
      let start_time = "";
      let end_time = new Date().getTime();
      let diff_time = DIFF_TIME;
      let report_status = 1;
      try {
        start_time = uni.getStorageSync(Report_Data_Time);
        report_status = uni.getStorageSync(Report_Status);
      } catch (e) {
        start_time = "";
        report_status = 1;
      }
      if (report_status === "") {
        requestData(({ enable }) => {
          uni.setStorageSync(Report_Data_Time, end_time);
          uni.setStorageSync(Report_Status, enable);
          if (enable === 1) {
            resolve();
          }
        });
        return;
      }
      if (report_status === 1) {
        resolve();
      }
      if (!start_time) {
        uni.setStorageSync(Report_Data_Time, end_time);
        start_time = end_time;
      }
      if (end_time - start_time > diff_time) {
        requestData(({ enable }) => {
          uni.setStorageSync(Report_Data_Time, end_time);
          uni.setStorageSync(Report_Status, enable);
        });
      }
    });
  };
  const requestData = (done) => {
    let formData = {
      usv: STAT_VERSION,
      conf: JSON.stringify({
        ak: statConfig$1.appid
      })
    };
    uni.request({
      url: STAT_URL,
      method: "GET",
      data: formData,
      success: (res) => {
        const { data } = res;
        if (data.ret === 0) {
          typeof done === "function" && done({
            enable: data.enable
          });
        }
      },
      fail: (e) => {
        let report_status_code = 1;
        try {
          report_status_code = uni.getStorageSync(Report_Status);
        } catch (e2) {
          report_status_code = 1;
        }
        if (report_status_code === "") {
          report_status_code = 1;
        }
        typeof done === "function" && done({
          enable: report_status_code
        });
      }
    });
  };
  const titleJsons = {};
  const statConfig = {
    appid: "__UNI__7A2368B"
  };
  const resultOptions = uni.getSystemInfoSync();
  class Util {
    constructor() {
      this.self = "";
      this._retry = 0;
      this._platform = "";
      this._query = {};
      this._navigationBarTitle = {
        config: "",
        page: "",
        report: "",
        lt: ""
      };
      this._operatingTime = 0;
      this._reportingRequestData = {
        1: [],
        11: []
      };
      this.__prevent_triggering = false;
      this.__licationHide = false;
      this.__licationShow = false;
      this._lastPageRoute = "";
      this.statData = {
        uuid: getUuid(),
        ut: getPlatformName(),
        mpn: getPackName(),
        ak: statConfig.appid,
        usv: STAT_VERSION,
        v: getVersion(),
        ch: getChannel(),
        cn: "",
        pn: "",
        ct: "",
        t: getTime(),
        tt: "",
        p: resultOptions.platform === "android" ? "a" : "i",
        brand: resultOptions.brand || "",
        md: resultOptions.model,
        sv: resultOptions.system.replace(/(Android|iOS)\s/, ""),
        mpsdk: resultOptions.SDKVersion || "",
        mpv: resultOptions.version || "",
        lang: resultOptions.language,
        pr: resultOptions.pixelRatio,
        ww: resultOptions.windowWidth,
        wh: resultOptions.windowHeight,
        sw: resultOptions.screenWidth,
        sh: resultOptions.screenHeight
      };
      let registerInterceptor = typeof uni.addInterceptor === "function" && false;
      if (registerInterceptor) {
        this.addInterceptorInit();
        this.interceptLogin();
        this.interceptShare(true);
        this.interceptRequestPayment();
      }
    }
    addInterceptorInit() {
      let self = this;
      uni.addInterceptor("setNavigationBarTitle", {
        invoke(args) {
          self._navigationBarTitle.page = args.title;
        }
      });
    }
    interceptLogin() {
      let self = this;
      uni.addInterceptor("login", {
        complete() {
          self._login();
        }
      });
    }
    interceptShare(type) {
      let self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor("share", {
        success() {
          self._share();
        },
        fail() {
          self._share();
        }
      });
    }
    interceptRequestPayment() {
      let self = this;
      uni.addInterceptor("requestPayment", {
        success() {
          self._payment("pay_success");
        },
        fail() {
          self._payment("pay_fail");
        }
      });
    }
    getIsReportData() {
      return isReportData();
    }
    _applicationShow() {
      if (this.__licationHide) {
        getLastTime();
        const time = getResidenceTime("app");
        if (time.overtime) {
          let options = {
            path: this._lastPageRoute,
            scene: this.statData.sc
          };
          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    }
    _applicationHide(self, type) {
      this.__licationHide = true;
      getLastTime();
      const time = getResidenceTime();
      getFirstTime();
      const route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime
      }, type);
    }
    _pageShow() {
      const route = getPageRoute(this);
      const routepath = getRoute();
      this._navigationBarTitle.config = titleJsons && titleJsons[routepath] || "";
      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        this._lastPageRoute = route;
        return;
      }
      getLastTime();
      const time = getResidenceTime("page");
      if (time.overtime) {
        let options = {
          path: route,
          scene: this.statData.sc
        };
        this._sendReportRequest(options);
      }
      getFirstTime();
    }
    _pageHide() {
      if (!this.__licationHide) {
        getLastTime();
        const time = getResidenceTime("page");
        let route = getPageRoute(this);
        if (!this._lastPageRoute) {
          this._lastPageRoute = route;
        }
        this._sendPageRequest({
          url: route,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime
        });
        this._lastPageRoute = route;
        this._navigationBarTitle = {
          config: "",
          page: "",
          report: "",
          lt: ""
        };
        return;
      }
    }
    _login() {
      this._sendEventRequest({
        key: "login"
      }, 0);
    }
    _share() {
      this._sendEventRequest({
        key: "share"
      }, 0);
    }
    _payment(key) {
      this._sendEventRequest({
        key
      }, 0);
    }
    _sendReportRequest(options) {
      this._navigationBarTitle.lt = "1";
      this._navigationBarTitle.config = titleJsons && titleJsons[options.path] || "";
      let query = options.query && JSON.stringify(options.query) !== "{}" ? "?" + JSON.stringify(options.query) : "";
      this.statData.lt = "1";
      this.statData.url = options.path + query || "";
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === "n") {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    }
    _sendPageRequest(opt) {
      let { url, urlref, urlref_ts } = opt;
      this._navigationBarTitle.lt = "11";
      let options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: "11",
        ut: this.statData.ut,
        url,
        tt: this.statData.tt,
        urlref,
        urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p
      };
      this.request(options);
    }
    _sendHideRequest(opt, type) {
      let { urlref, urlref_ts } = opt;
      let options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: "3",
        ut: this.statData.ut,
        urlref,
        urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p
      };
      this.request(options, type);
    }
    _sendEventRequest({ key = "", value = "" } = {}) {
      const route = this._lastPageRoute;
      let options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: "21",
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === "object" ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p
      };
      this.request(options);
    }
    getNetworkInfo() {
      uni.getNetworkType({
        success: (result) => {
          this.statData.net = result.networkType;
          this.getLocation();
        }
      });
    }
    getProperty() {
      plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
        this.statData.v = wgtinfo.version || "";
        this.getNetworkInfo();
      });
    }
    getLocation() {
      {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    }
    request(data, type) {
      let time = getTime();
      const title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;
      let requestData2 = this._reportingRequestData;
      if (getPlatformName() === "n") {
        requestData2 = uni.getStorageSync("__UNI__STAT__DATA") || {};
      }
      if (!requestData2[data.lt]) {
        requestData2[data.lt] = [];
      }
      requestData2[data.lt].push(data);
      if (getPlatformName() === "n") {
        uni.setStorageSync("__UNI__STAT__DATA", requestData2);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      let uniStatData = this._reportingRequestData;
      if (getPlatformName() === "n") {
        uniStatData = uni.getStorageSync("__UNI__STAT__DATA");
      }
      setPageResidenceTime();
      let firstArr = [];
      let contentArr = [];
      let lastArr = [];
      for (let i2 in uniStatData) {
        const rd = uniStatData[i2];
        rd.forEach((elm) => {
          const newData = getSplicing(elm);
          if (i2 === 0) {
            firstArr.push(newData);
          } else if (i2 === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });
      }
      firstArr.push(...contentArr, ...lastArr);
      let optionsData = {
        usv: STAT_VERSION,
        t: time,
        requests: JSON.stringify(firstArr)
      };
      this._reportingRequestData = {};
      if (getPlatformName() === "n") {
        uni.removeStorageSync("__UNI__STAT__DATA");
      }
      if (data.ut === "h5") {
        this.imageRequest(optionsData);
        return;
      }
      if (getPlatformName() === "n" && this.statData.p === "a") {
        setTimeout(() => {
          this._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    }
    _sendRequest(optionsData) {
      this.getIsReportData().then(() => {
        uni.request({
          url: STAT_URL,
          method: "POST",
          data: optionsData,
          success: () => {
          },
          fail: (e) => {
            if (++this._retry < 3) {
              setTimeout(() => {
                this._sendRequest(optionsData);
              }, 1e3);
            }
          }
        });
      });
    }
    imageRequest(data) {
      this.getIsReportData().then(() => {
        let image = new Image();
        let options = getSgin(GetEncodeURIComponentOptions(data)).options;
        image.src = STAT_H5_URL + "?" + options;
      });
    }
    sendEvent(key, value) {
      if (calibration(key, value))
        return;
      if (key === "title") {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key,
        value: typeof value === "object" ? JSON.stringify(value) : value
      }, 1);
    }
  }
  class Stat extends Util {
    static getInstance() {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    }
    constructor() {
      super();
      this.instance = null;
    }
    report(options, self) {
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    }
    load(options, self) {
      this.self = self;
      this._query = options;
    }
    show(self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    }
    ready(self) {
    }
    hide(self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    }
    error(em) {
      if (this._platform === "devtools") {
        {
          console.info("\u5F53\u524D\u8FD0\u884C\u73AF\u5883\u4E3A\u5F00\u53D1\u8005\u5DE5\u5177\uFF0C\u4E0D\u4E0A\u62A5\u6570\u636E\u3002");
        }
      }
      let emVal = "";
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      let options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: "31",
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p
      };
      this.request(options);
    }
  }
  var Stat$1 = Stat;
  Stat$1.getInstance();
  function main() {
    {
      uni.report = function(type, options) {
      };
    }
  }
  main();
  function createApp() {
    const app = vue.createVueApp(_sfc_main);
    app.use(store);
    return {
      app
    };
  }
  const __app__ = createApp().app;
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.use(uni.__vuePlugin).mount("#app");
})(Vue);

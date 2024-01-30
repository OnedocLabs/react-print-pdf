"use strict";
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = _object_without_properties_loose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = function(target, all) {
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = function(to, from, except, desc) {
    if (from && typeof from === "object" || typeof from === "function") {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var key = _step.value;
                if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
                    get: function() {
                        return from[key];
                    },
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                });
            };
            for(var _iterator = __getOwnPropNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return to;
};
var __toESM = function(mod, isNodeMode, target) {
    return target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod);
};
var __toCommonJS = function(mod) {
    return __copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
};
// src/index.ts
var src_exports = {};
__export(src_exports, {
    CurrentPageTop: function() {
        return CurrentPageTop;
    },
    FloatBottom: function() {
        return FloatBottom;
    },
    Footnote: function() {
        return Footnote;
    },
    Frontmatter: function() {
        return Frontmatter;
    },
    FrontmatterProvider: function() {
        return FrontmatterProvider;
    },
    NoBreak: function() {
        return NoBreak;
    },
    PageBottom: function() {
        return PageBottom;
    },
    PageBreak: function() {
        return PageBreak;
    },
    PageNumber: function() {
        return PageNumber;
    },
    PageTop: function() {
        return PageTop;
    },
    RunningH1: function() {
        return RunningH1;
    },
    RunningH2: function() {
        return RunningH2;
    },
    RunningH3: function() {
        return RunningH3;
    },
    RunningH4: function() {
        return RunningH4;
    },
    RunningH5: function() {
        return RunningH5;
    },
    RunningH6: function() {
        return RunningH6;
    },
    Signature: function() {
        return Signature;
    },
    TotalPages: function() {
        return TotalPages;
    },
    TrackBox: function() {
        return TrackBox;
    },
    formatters: function() {
        return formatters;
    },
    useFrontmatter: function() {
        return useFrontmatter;
    }
});
module.exports = __toCommonJS(src_exports);
// src/RunningHeader/headings.tsx
var import_react = __toESM(require("react"));
var RunningHeader = function(level) {
    return function(param) {
        var _param_before = param.before, before = _param_before === void 0 ? "" : _param_before, _param_after = param.after, after = _param_after === void 0 ? "" : _param_after;
        return /* @__PURE__ */ import_react.default.createElement("span", {
            className: "--docify-heading-contents --docify-h".concat(level, "-contents"),
            "data-before": before,
            "data-after": after
        });
    };
};
var RunningH1 = RunningHeader(1);
var RunningH2 = RunningHeader(2);
var RunningH3 = RunningHeader(3);
var RunningH4 = RunningHeader(4);
var RunningH5 = RunningHeader(5);
var RunningH6 = RunningHeader(6);
// src/Shell/shell.tsx
var import_react2 = __toESM(require("react"));
var PageTop = function(props) {
    return /* @__PURE__ */ import_react2.default.createElement("div", _object_spread_props(_object_spread({}, props), {
        className: "--docify-page-top ".concat((props === null || props === void 0 ? void 0 : props.className) || "")
    }));
};
var CurrentPageTop = function(props) {
    return /* @__PURE__ */ import_react2.default.createElement("div", _object_spread_props(_object_spread({}, props), {
        className: "--docify-current-page-top ".concat((props === null || props === void 0 ? void 0 : props.className) || "")
    }));
};
var PageBottom = function(props) {
    return /* @__PURE__ */ import_react2.default.createElement("div", _object_spread_props(_object_spread({}, props), {
        className: "--docify-page-bottom ".concat((props === null || props === void 0 ? void 0 : props.className) || "")
    }));
};
var PageBreak = function(props) {
    return /* @__PURE__ */ import_react2.default.createElement("div", _object_spread_props(_object_spread({}, props), {
        className: "--docify-page-break ".concat((props === null || props === void 0 ? void 0 : props.className) || "")
    }));
};
var NoBreak = function(props) {
    return /* @__PURE__ */ import_react2.default.createElement("div", _object_spread_props(_object_spread({}, props), {
        className: "--docify-no-break ".concat((props === null || props === void 0 ? void 0 : props.className) || "")
    }));
};
var FloatBottom = function(props) {
    return /* @__PURE__ */ import_react2.default.createElement("div", _object_spread_props(_object_spread({}, props), {
        style: {
            "-prince-float": "bottom"
        }
    }), props.children);
};
// src/FileMetadata/variables.tsx
var import_react3 = __toESM(require("react"));
var PageNumber = function() {
    return /* @__PURE__ */ import_react3.default.createElement("span", {
        className: "--docify-page-number-current"
    });
};
var TotalPages = function() {
    return /* @__PURE__ */ import_react3.default.createElement("span", {
        className: "--docify-page-number-total"
    });
};
// src/Frontmatter/frontmatter.tsx
var import_react4 = __toESM(require("react"));
var formatters = {
    date: function(language, options) {
        return function(date) {
            return new Intl.DateTimeFormat(language, options).format(new Date(date));
        };
    },
    raw: function() {
        return function(value) {
            return value;
        };
    }
};
var FrontmatterContext = (0, import_react4.createContext)({});
var Frontmatter = function(param) {
    var field = param.field, _param_placeholder = param.placeholder, placeholder = _param_placeholder === void 0 ? "" : _param_placeholder, _param_formatter = param.formatter, formatter = _param_formatter === void 0 ? formatters.raw() : _param_formatter, _param_optional = param.optional, optional = _param_optional === void 0 ? false : _param_optional;
    var frontmatter = (0, import_react4.useContext)(FrontmatterContext);
    var value = frontmatter[field] !== void 0 && formatter(frontmatter[field]) || (optional ? "" : "<".concat(placeholder || "", " [").concat(field, "]>"));
    return value;
};
var FrontmatterProvider = function(param) {
    var frontmatter = param.frontmatter, children = param.children;
    return /* @__PURE__ */ import_react4.default.createElement(FrontmatterContext.Provider, {
        value: frontmatter || {}
    }, children);
};
var useFrontmatter = function(field) {
    var frontmatter = (0, import_react4.useContext)(FrontmatterContext);
    return frontmatter[field] || void 0;
};
// src/Footnote/footnote.tsx
var import_react5 = __toESM(require("react"));
var Footnote = function(_param) {
    var children = _param.children, props = _object_without_properties(_param, [
        "children"
    ]);
    return /* @__PURE__ */ import_react5.default.createElement("span", _object_spread({
        className: "--docify-footnote text-left text-xs font-normal"
    }, props), children);
};
// src/SIgnature/signature.tsx
var import_react7 = __toESM(require("react"));
// src/TrackBox/trackbox.tsx
var import_react6 = __toESM(require("react"));
var TrackBox = function(_param) {
    var children = _param.children, tag = _param.tag, props = _object_without_properties(_param, [
        "children",
        "tag"
    ]);
    return /* @__PURE__ */ import_react6.default.createElement("div", _object_spread({
        "data-track-box": tag
    }, props), children || null);
};
// src/extensions/signatureconstants.ts
var SIGNATURE_PREFIX = "--docify-signature:";
// src/SIgnature/signature.tsx
var Signature = function(param) {
    var company = param.company, representative = param.representative, tag = param.tag;
    return /* @__PURE__ */ import_react7.default.createElement("div", {
        className: "border-b border-b-black h-48 whitespace-pre-wrap flex flex-col"
    }, company && /* @__PURE__ */ import_react7.default.createElement("div", {
        className: "text-xs text-gray-400 pb-1"
    }, company), representative && /* @__PURE__ */ import_react7.default.createElement("div", {
        className: "text-sm"
    }, representative), /* @__PURE__ */ import_react7.default.createElement("div", {
        className: "h-4"
    }), /* @__PURE__ */ import_react7.default.createElement(TrackBox, {
        tag: "".concat(SIGNATURE_PREFIX).concat(tag),
        className: "flex-grow"
    }));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    CurrentPageTop: CurrentPageTop,
    FloatBottom: FloatBottom,
    Footnote: Footnote,
    Frontmatter: Frontmatter,
    FrontmatterProvider: FrontmatterProvider,
    NoBreak: NoBreak,
    PageBottom: PageBottom,
    PageBreak: PageBreak,
    PageNumber: PageNumber,
    PageTop: PageTop,
    RunningH1: RunningH1,
    RunningH2: RunningH2,
    RunningH3: RunningH3,
    RunningH4: RunningH4,
    RunningH5: RunningH5,
    RunningH6: RunningH6,
    Signature: Signature,
    TotalPages: TotalPages,
    TrackBox: TrackBox,
    formatters: formatters,
    useFrontmatter: useFrontmatter
});
//# sourceMappingURL=index.js.map
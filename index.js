var jsonObj = {};
var jsonArr = [];

// Add this for IE else find doesn't work
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return undefined.
            return undefined;
        },
        configurable: true,
        writable: true
    });
}


var foundLang = function (jsonObj, lang) {
    const t = jsonObj.find(el => el.lang[0] === lang[0] && el.lang[1] === lang[1])
    if (t)
        return t
    else
        return jsonObj.find(el => el.lang[0] === lang[0])
}


var register = function (json, lang) {
    jsonArr.push({
        "lang": lang,
        "json": json
    })
}

var init = function () {
    var userLg = (navigator.language || navigator.userLanguage).match(/([A-z]){2}/g);
    jsonObj = function () {
        var jsonlg = foundLang(jsonArr, userLg)
        var defaut = jsonArr.find((element) => element.lang === "default")
        if (!!jsonlg) {
            return jsonlg.json
        }
        else if (!!defaut) {
            return defaut.json
        } else {
            throw new Error("Cannot found lang")
        }
    }()
}

var clear = function () {
    jsonArr = []
    jsonObj = {}
}

module.exports = {
    get: (name) => jsonObj[name],
    addLang: register,
    init: init,
    clear: clear
}
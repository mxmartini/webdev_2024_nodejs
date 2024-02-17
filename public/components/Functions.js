/* FUNTIONS-LIB */

Object.defineProperty(Object.prototype, 'instanceOf', {
    value: function(newTargetConstructor) {
        return newTargetConstructor.toString().split('\n')[0].replace('class', '').replace('{', '').trim() === this.constructor.name;
    },
    enumerable: false, // default value
});

Object.defineProperty(NodeList.prototype, 'querySelector', {
    value: function (selector) {
        const elements = this;
        return [].filter.call(elements, function(element) {
            return element.matches(selector);
        })[0];
    },
    enumerable: document.querySelectorAll("empty"), // default value
});

Object.defineProperty(NodeList.prototype, 'querySelectorAll', {
    value: function (selector) {
        const elements = this;
        return [].filter.call(elements, function(element) {
            return element.matches(selector);
        });
    },
    enumerable: document.querySelectorAll("empty"), // default value
});



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

Object.defineProperty(HTMLCollection.prototype, 'querySelector', {
    value: function (selector) {
        const elements = this;
        return [].filter.call(elements, function(element) {
            return element.matches(selector);
        })[0];
    },
    enumerable: document.querySelectorAll("empty"), // default value
});

Object.defineProperty(HTMLCollection.prototype, 'querySelectorAll', {
    value: function (selector) {
        const elements = this;
        return [].filter.call(elements, function(element) {
            return element.matches(selector);
        });
    },
    enumerable: document.querySelectorAll("empty"), // default value
});

Object.defineProperty(String.prototype, 'toDOM', {
    value: function() {
        var d=document
        ,i
        ,a=d.createElement("div")
        ,b=d.createDocumentFragment();
        a.innerHTML=this;
        while(i=a.firstChild)b.appendChild(i);
        return b;
    },
    enumerable: undefined
});



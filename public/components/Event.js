/* HOME-LIB */

import '/public/components/Functions.js';

export class FilterModel {
    #container;
    #filterListeners = [];
    constructor(target, options){

        if (this.instanceOf(new.target)) throw new TypeError("Cannot instantiate because it is Abstract");
        
        this.#container = typeof target === 'string' ? document.querySelector(target) : target;
        this.inputs = this.#container.querySelectorAll("input:not([type=button]):not([type=submit]), select, textarea");
    }
    find(selector){
        return this.inputs.querySelector(selector);
    }
    filter(options, callback){ 
        
        if(!callback && typeof options === 'function') callback = options;
        
        callback?.(new FilterEvent(this, Array.from(this.inputs).reduce((data, input) => {
            const inputTag = (input.tagName+(input.tagName.toLowerCase()=='input'?input.type:'')).toLowerCase(); 
            switch(inputTag) { 
                case 'inputtext':
                case 'inputdate': 
                case 'textarea': data[input.name] = input.value; break;
                case 'inputcheckbox': data[input.name] = input.checked; break;
                case 'select': data[input.name] = input.value; break;
            }
            return data;
        }, {})))
        
        return false;
    }
    addFilterEventTrigger(target, event, options=null, callback=null) {
        const element = typeof target == 'string' ? document.querySelector(target) : target;
        if(element) {

            element[event] = (e) => { return this.filter(options, callback); }
            this.#filterListeners.push({ element, event });
        }
    }
}

export class EventFilter extends FilterModel {
    constructor(target, options) {
        super(target, options || {  });
    }
}


export class TableModel {
    #table;
    #filterListeners = [];
    constructor(target, options) {
        
        if (this.instanceOf(new.target)) throw new TypeError("Cannot instantiate because it is Abstract");
        
        this.#table = typeof target === 'string' ? document.querySelector(target) : target;

        this.options = {
            url : options?.url || "",
            method : options?.method || "GET",
            headers : options?.headers || undefined,
            uid : options?.uid || "id",
            filter : options?.filter || undefined,
            columns : options?.columns || [],
        }
    }
    
    #bindColumns(data, tr){

        let td = null;
        for (const prop in this.options.columns){
            td = document.createElement('td');
            switch(typeof this.options.columns[prop]) {
            
                case 'string':
                    td.innerHTML = data[this.options.columns[prop]]
                    tr.appendChild(td);
                    continue;
            
                case 'object':
                    const { html, style } = this.options.columns[prop];
                    if(html) { 
                        const dom = typeof html === 'function' ? html(data) : html;
                        if(typeof dom === 'string') td.innerHTML = dom;
                        else td.appendChild(dom);
                    }
                    if(style) { 
                        const styleSelectors = typeof html === 'function' ? style(data) : style;
                        for (const selector in styleSelectors) td.style[selector] = styleSelectors[selector];
                    }
                    tr.appendChild(td);
                    continue;
            
                default:
                    td.innerHTML = ""
                    tr.appendChild(td);
                    continue;
            }
        }
    }

    add(data) {
        const tr = document.createElement("tr");
        tr.setAttribute("uid", data[this.options.uid])
        
        this.#bindColumns(data, tr);
        
        this.#table.appendChild(tr);
    }
    
    update(data){
        
        const tr = this.#table.rows.querySelector(`[uid='${data[this.options.uid]}']`);
        tr.innerHTML = "";
        this.#bindColumns(data, tr);
    }

    remove(data){
        
        const row = this.#table.rows.querySelector(`[uid='${data[this.options.uid]}']`);
        row.remove();
    }

    clear(){
        
        const [ head, ...rows ] = this.#table.rows;
        Array.from(rows).findLast((row) => row.remove());
    }

    load(options, callback=null){
        
        if(!callback && typeof options === 'function') callback = options;

        const { url, method, ...otherOptions } = { ...this.options, ...options };
        const init = {
            method: method || "GET",
            ...otherOptions
        }; 
        const filter = Object.keys(otherOptions.filter).length > 0 ? '?' + new URLSearchParams(otherOptions.filter).toString() : "";
            
        fetch(url+filter, init)
        .then( (res)=> { if (!res.ok) return res.text().then((t) => { throw new Error(t); }); return res.json() })
        .then( (events) => {
            events.forEach(event => this.add(event));
            callback?.(new LoadEvent(this, events, undefined)) 
        })
        .catch( (err) => callback?.(new LoadEvent(this, undefined, err)) );

        return false;
    }

    addLoadEventTrigger(target, event, options=null, callback=null) {
        const element = typeof target == 'string' ? document.querySelector(target) : target;
        if(element) {

            element[event] = (e) => { return this.load(options, callback); }
            this.#filterListeners.push({ element, event });
        }
    }
}

export class EventTable extends TableModel {
    
    constructor(target, options) {
        super(target, options || { 
            url: 'http://localhost:3001/events',
            method: "GET",
            headers: { "Content-Type" : "application/json" },
            uid: "id",
            filter: {},
            columns : [ 
                "name", 
                { html: (data) => new Date(data.date).toLocaleString("en-US", { dateStyle: "short" }) }, 
                { html: (data) => data.active ? "&#10004;" : "&#10008;", style: (data) => data.active ? { color: "green" } : { color: "red" } }, 
                { html: (data) => {
                    const dom = 
                    `<div class="dropdown">
                        <button class="dropbtn">&#65049;</button>
                            <div class="dropdown-content" style="right: 0;">
                                <a href="#">Edit</a>
                                <a href="#">Remove</a>
                                <a href="#">View Guests</a>
                        </div>
                    </div>`.toDOM();
                    const edit = dom.querySelector(".dropdown-content a:nth-child(1)");
                    const remove = dom.querySelector(".dropdown-content a:nth-child(2)");
                    const guests = dom.querySelector(".dropdown-content a:nth-child(3)");
                    edit.onclick = (e) => { this.onEdit(new TableEditEvent(this, data)) };
                    remove.onclick = (e) => { this.onRemove(new TableRemoveEvent(this, data)) };
                    guests.onclick = (e) => { this.onGuests(new TableGuestsEvent(this, data)) };
                    return dom; 
                }} 
            ] 
        });
    }

    onEdit(e){}
    onRemove(e){}
    onGuests(e){}
}

class GenericEvent {
    constructor(target, data) {
        this.target = target;
        this.data = data;
    }
}
class FilterEvent extends GenericEvent {}
class TableEditEvent extends GenericEvent {}
class TableRemoveEvent extends GenericEvent {}
class TableGuestsEvent extends GenericEvent {}

export class FormModel {
    #form
    constructor(form){

        if (this.instanceOf(new.target)) throw new TypeError("Cannot instantiate because it is Abstract");

        this.#form = typeof form === 'string' ? document.querySelector(form) : form;

        this.inputs = this.#form.querySelectorAll("input:not([type=button]):not([type=submit]), select, textarea");
    }

    data() {
        const formData = new FormData(this.#form); 
        const data = Array.from(formData.entries()).reduce((agg, [key, value]) => ({
            ...agg,
            [key]:value
        }), {});
        return data;
    }

    send(options){throw new Error("Not implemented. Must be overrided in a child class.") }
    
    clear() {
        [...this.inputs].forEach(input => {
            const inputTag = (input.tagName+(input.tagName.toLowerCase()=='input'?input.type:'')).toLowerCase(); 
            switch(inputTag) { 
                case 'inputtext':
                case 'inputdate': 
                case 'textarea': input.value = ''; break;
                case 'inputcheckbox': input.checked = false; break;
                case 'select': input.selectedIndex = 0; break;
            }
        });
    }

    find(selector){
        return this.inputs.querySelector(selector);
    }
}

export class EventForm extends FormModel {
    #sendListeners = [];
    constructor (form, options) {
        super(form);
        this.options = options ||  {
            url: 'http://localhost:3001/events',
            method: "POST",
            headers: { "Content-Type" : "application/json" }
        };
    }

    send(options, callback){
        
        if(!callback && typeof options === 'function') callback = options;

        const { url, method, body, ...otherOptions } = { ...this.options, ...options };
        const init = {
            method: method || "POST",
            ...otherOptions,
            body: body || JSON.stringify(this.data())
        }; 
        
        fetch(url, init)
        .then( (res)=> { if (!res.ok) return res.text().then((t) => { throw new Error(t); }); return res.json() })
        .then( (event) => callback?.(new SendEvent(this, event, undefined)))
        .catch( (err) => callback?.(new SendEvent(this, undefined, err)))

        return init?.preventSubmit == false;
    }

    addSendEventTrigger(target, event, options=null, callback=null) {
        const element = typeof target == 'string' ? document.querySelector(target) : target;
        if(element) {

            element[event] = (e) => { return this.send(options, callback); }
            this.#sendListeners.push({ element, event });
        }
    }
}

class ResultEvent extends GenericEvent {
    constructor(target, data, error){
        super(target, data);
        this.error = error;
    }
}
class LoadEvent extends ResultEvent {}
class SendEvent extends ResultEvent {}
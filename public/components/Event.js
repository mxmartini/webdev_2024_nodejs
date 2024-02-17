/* HOME-LIB */

import '/public/components/Functions.js';

export class TableModel {
    #table;
    constructor(table, options) {
        
        if (this.instanceOf(new.target)) throw new TypeError("Cannot instantiate because it is Abstract");
        
        this.#table = typeof table === 'string' ? document.querySelector(table) : table;

        const [ head, ...rows] = this.#table?.querySelectorAll("tr") || document.querySelectorAll("empty"); 
        this.columns = options?.columns || [];
        this.head = head;
        this.rows = rows;
    }

    add(data) { 
        const tr = document.createElement("tr");
        let td = null;
        for (const prop in this.columns){
            td = document.createElement('td')
            switch(typeof this.columns[prop]) {
            
                case 'string':
                    td.innerHTML = data[this.columns[prop]]
                    tr.appendChild(td);
                    continue;
            
                case 'object':
                    const { html, style } = this.columns[prop];
                    if(html) td.innerHTML = typeof html === 'function' ? html(data) : html
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
        this.#table.appendChild(tr);
    }
}

export class EventTable extends TableModel {
    
    constructor(tableSelector, options) {
        super(tableSelector, options || { 
            columns : [ 
                "name", 
                { html: (data) => new Date(data.date).toLocaleString("en-US", { dateStyle: "short" }) }, 
                { html: (data) => data.active ? "&#10004;" : "&#10008;", style: (data) => data.active ? { color: "green" } : { color: "red" } }, 
                { html: (data) => 
                    `<div class="dropdown">
                        <button class="dropbtn">&#65049;</button>
                            <div class="dropdown-content">
                                <a href="#" onclick="">Edit</a>
                                <a href="#" onclick="">Remove</a>
                                <a href="#" onclick="window.open('/guests/${btoa(data.id)}', '_self')">View Guests</a>
                        </div>
                    </div>` 
                } 
            ] 
        });
    }

}

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

    // send(method){ throw new Error("Not implemented. Must be overrided in a child class.") }
    // send(url, method){ throw new Error("Not implemented. Must be overrided in a child class.") }

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

    send(e, options){

        e.preventDefault();

        const { url, method, body, ...otherOptions } = { ...options, ...this.options };
        const init = {
            method: method || "POST",
            ...otherOptions,
            body: body || JSON.stringify(this.data())
        }; 
        
        fetch(url, init)
        .then( (res)=> res.json() )
        .then( (event) => options.success?.(event))
        .catch( (err) => options.error?.(err) );
    }

    addSendEventTrigger(target, event, options) {
        const element = typeof target == 'string' ? document.querySelector(target) : target;
        if(element) {

            element[event] = (e) => { this.send(e, options); }
            this.#sendListeners.push({ element, event });
        }
    }
}
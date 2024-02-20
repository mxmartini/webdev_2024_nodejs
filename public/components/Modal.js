/* MODAL-LIB */

export class Modal {
    #modal
    #openListeners = []
    constructor(target){
        this.#modal = typeof target == 'string' ? document.querySelector(target) : target;
        
        this.closeButton = document.getElementsByClassName("close").item(0);
        this.closeButton.onclick = (e) => { this.close(null) };
        window.onclick = (e) => { if( this.equals(e.target)) this.close(null) }
    }
    open(callback=null) {
        this.#modal.style.display = "block";
        callback?.(new OpenEvent(this));
    }
    close(callback=null) {
        this.#modal.style.display = "none";
        callback?.(new CloseEvent(this));
    }
    equals(htmlElement) {
        return htmlElement === this.#modal;
    }
    find(selector) {
        return this.#modal.querySelector(selector)
    }
    addOpenEventTrigger(target, event, callback=null) {
        const element = typeof target == 'string' ? document.querySelector(target) : target;
        if(element) {

            element[event] = (e) => { this.open(callback); }
            this.#openListeners.push({ element, event });
        }
    }
}

class GenericModalEvent {
    constructor(target) {
        this.target = target;
    }
}
class OpenEvent extends GenericModalEvent {}
class CloseEvent extends GenericModalEvent {}
import { Modal } from '/public/components/Modal.js';
import { EventTable, EventForm } from '/public/components/Event.js';

const modal = new Modal('#modal');

const table = new EventTable('#events');
const form = new EventForm('#form');

onload = (e) => {

    table.load(({ error }) => error && console.warn(error) );
}

modal.addOpenEventTrigger("#register", 'onclick', (e) => {

    form.addSendEventTrigger(self, 'onsubmit', { method: "POST" }, FormState.onCreated);
});

table.onEdit = ({ data : event }) => {

    modal.open();

    form.find("#name").value = event.name;
    form.find("#date").value = event.date;
    form.find("#active").checked = event.active;

    form.addSendEventTrigger(self, 'onsubmit', { url: `${form.options.url}/${btoa(event.id)}`, method: "PUT" }, FormState.onUpdated);
}

table.onRemove = ({ data : event }) => {

    form.send({ url: `${form.options.url}/${btoa(event.id)}`, method: "DELETE" }, ({error}) => {
    
        if(!error) table.remove(event);
        else console.warn(error);
    });
};

table.onGuests = ({ data: event }) => {
    
    window.open(`${form.options.url}/${btoa(event.id)}`, '_self')    
};

class FormState {

    static mode = { CREATE: 0, UPDATE: 1 };
    static onCreated(e) { FormState.onCompleted(FormState.mode.CREATE, e) }
    static onUpdated(e) { FormState.onCompleted(FormState.mode.UPDATE, e) }
    static onCompleted(mode, {data: event, error}) {
    
        if(!error) {
            if (mode === FormState.mode.CREATE) table.add(event)
            if (mode === FormState.mode.UPDATE) table.update(event)
            form.clear();
            modal.close();
        }
        else console.warn(error);
    }
}

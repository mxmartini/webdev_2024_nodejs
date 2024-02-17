import { Modal } from '/public/components/Modal.js';
import { EventTable, EventForm } from '/public/components/Event.js';

const baseurl = 'http://localhost:3001/events';
const modal = new Modal();

const table = new EventTable('#events');
const form = new EventForm('#form', {
    url: baseurl,
    headers: { "Content-Type" : "application/json" }
});

onload = (e) => {
    fetch(baseurl).then( (res)=> res.json() )
    .then( (json) => json.forEach(event => table.add(event)) )
    .catch( (err) => console.warn('Something went wrong.', err) );
}

modal.addOpenEventTrigger("#register", 'onclick');

form.addSendEventTrigger(self, 'onsubmit', {
    method: "POST",
    success: (event) => {
        table.add(event)
        form.clear();
        modal.close();
    }, 
    error: (err) => console.warn(err)
});


onload = (e) => {
    fetch('http://localhost:3001/guests').then( (res)=> res.json() )
    .then( (json) => fillGuests(json) )
    .catch( (err) => console.warn('Algo deu errado.', err) );
}

function fillGuests(json){
    json.forEach(guest => {
        const li = document.createElement("li");
        li.innerHTML = `<b>${guest.name}</b>, ${guest.age} years old`;
        document.getElementById("guests").appendChild(li);
    });
}

onsubmit = (e) => {
    
    e.preventDefault(); 
    
    var inputname = e.target.querySelector("#name"); //document.getElementById("name");
    var inputage = e.target.querySelector("#age");
    
    const formData = new FormData(e.target);
    const data = Array.from(formData.entries()).reduce((agg, [key, value]) => ({
        ...agg,
        [key]:value
    }), {});
    
    fetch('http://localhost:3001/guests', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then( (res)=> res.json() )
    .then( (guest) => {

        // add element
        const li = document.createElement("li");
        li.innerHTML = `<b>${guest.name}</b>, ${guest.age} years old`;
        document.getElementById("guests").appendChild(li);

        //clear inputs
        inputname.value = "";
        inputage.value = "";
    })
    .catch( (err) => console.warn('Algo deu errado.', err) );
}

// MODAL
var modal = document.getElementById("modal");
var btn = document.getElementById("register");
var span = document.getElementsByClassName("close")[0];

btn.onclick = () => {
  modal.style.display = "block";
}
span.onclick = () => {
  modal.style.display = "none";
}
onclick = (e) => {
  if (e.target == modal)
    modal.style.display = "none";
}
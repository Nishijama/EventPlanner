
const tables = document.querySelectorAll(".table");
let tableCapacity = 4;
let GUEST_COUNT = 0;

fetchGuests();

window.onload = () => {
checkTableCapacity();
}


// FUNCTION DEFINITIONS

function getDragAfterElement(table, y) {
    const draggableElements = [...table.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y -box.top - box.height/2;
        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child };
        } else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY }).element;
}



function checkTableCapacity() {
    tables.forEach(table => {
        let numb = table.childElementCount-1;
        if (numb > tableCapacity) {
            table.style.borderColor ="red";
        }
        if (numb <= tableCapacity){
            table.style.borderColor ="black";
        }
    });
}

async function fetchGuests() {
    const response = await fetch("base.json");
    const data = await response.json();
    data.forEach(object => {
        console.log(object.name);
        let guestTag = document.createElement('p');
        guestTag.setAttribute('draggable', 'true');
        guestTag.setAttribute('id', object.id);
        guestTag.classList.add('draggable', 'guestTag');
        guestTag.innerHTML = object.name;
        guestTag.dataset.name = object.name;
        guestTag.dataset.table = object.table;
        guestTag.dataset.house = object.house;
        document.getElementById("table" + object.table).appendChild(guestTag)
        handleDragging();
        GUEST_COUNT+=1;
    });
    console.log(GUEST_COUNT);
}

function fetchHouses () {
    guests = document.querySelectorAll('.guestTag');
    guests.forEach(guest => {
        guest.innerHTML = guest.dataset.house;
    });
}

function fetchNames () {
    guests = document.querySelectorAll('.guestTag');
    guests.forEach(guest => {
        guest.innerHTML = guest.dataset.name;
    });
}


document.getElementById("AddGuestBtn").addEventListener("click", function(event) {
    createNameTag();
    event.preventDefault();
})

function createNameTag() {
    let guestTag = document.createElement('p');
    guestTag.setAttribute('draggable', 'true');
    guestTag.setAttribute('id', GUEST_COUNT+1);
    guestTag.classList.add('draggable', 'guestTag');
    guestTag.dataset.name = document.getElementById("AddGuestName").value;
    guestTag.dataset.table = document.getElementById("AddGuestTable").value;
    guestTag.dataset.house = document.getElementById("AddGuestHouse").value;
    guestTag.innerHTML = guestTag.dataset.name;
    document.getElementById("table" + guestTag.dataset.table).appendChild(guestTag)
    document.getElementById("AddGuestTable").value = "";
    document.getElementById("AddGuestHouse").value = "";
    document.getElementById("AddGuestName").value = "";
    handleDragging();
    GUEST_COUNT+=1;
    console.log(GUEST_COUNT);
}

function handleDragging() {
    const draggables = document.querySelectorAll(".draggable");

    // START DRAGGING
    draggables.forEach(draggable => {
        draggable.addEventListener("dragstart", () =>{
            draggable.classList.add('dragging')
        })

        // ON RELEASE
        draggable.addEventListener("dragend", () =>{
            draggable.classList.remove("dragging")
            checkTableCapacity();

        })
    })

    // DRAGGING OVER TABLE
    tables.forEach(table => {
        table.addEventListener("dragover", e => {
            console.log("drag over");
            e.preventDefault();
            const afterElement = getDragAfterElement(table, e.clientY)
            const currentDraggable = document.querySelector('.dragging');
            if (afterElement == null) {
                table.appendChild(currentDraggable);
                currentDraggable.dataset.table = table.id;
            } else {
                table.insertBefore(currentDraggable, afterElement)
                currentDraggable.dataset.table = table.id;
            }
        });
        
    });
}

function saveToJSON() {
    
}

function saveToLocalStorage() {

}
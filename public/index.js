const tables = document.querySelectorAll(".table");
let tableCapacity = 4;

loadGuests();

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

// PROBABLY COULD REFACTOR USING CLASSES !!!


async function loadGuests() {
    const response = await fetch("base.json");
    const data = await response.json();
    data.forEach(object => {
        console.log(object.name);
        let guestTag = document.createElement('p');
        guestTag.setAttribute('draggable', 'true');
        guestTag.setAttribute('id', object.id);
        guestTag.classList.add('draggable', 'guestTag');
        guestTag.innerHTML = object.name;
        document.getElementById("table" + object.table).appendChild(guestTag)
        guestTag.addEventListener('dblclick', () => {
            guestTag.classList.toggle("highlighted");
        })
        handleDragging();
    });
}


async function fetchHouses () {
    const response = await fetch("base.json");
    const data = await response.json();
    guests = document.querySelectorAll('.guestTag');
    data.forEach(object=> {
        guests.forEach(guest => {
            if (object.id == guest.id)
                guest.innerHTML = object.house;
        });

    });
}

async function fetchNames () {
    const response = await fetch("base.json");
    const data = await response.json();
    guests = document.querySelectorAll('.guestTag');
    data.forEach(object=> {
        guests.forEach(guest => {
            if (object.id == guest.id)
                guest.innerHTML = object.name;
        });

    });
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
            e.preventDefault();
            const afterElement = getDragAfterElement(table, e.clientY)
            const currentDraggable = document.querySelector('.dragging');
            if (afterElement == null) {
                table.appendChild(currentDraggable);
            } else {
                table.insertBefore(currentDraggable, afterElement)
            }
        });
        
    });
}

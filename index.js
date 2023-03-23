
let TABLECAPACTIY = 4;
let GUESTCOUNT = 0;
let NUMBEROFTABLES = 10

createTables(NUMBEROFTABLES);
const tables = document.querySelectorAll(".table");

// if (!localStorage.getItem("guest_list")) {
//     loadGuests();
// }
// loadGuests();

let PLAN = [];
PLAN = populateTables();

window.onload = () => {
checkTableCapacity();
}

// FUNCTION DEFINITIONS

function createTables(n) {
    let tablesContainer = document.querySelector(".tablesContainer")
    for (let i = 0; i < n; i++) {
        let tableWrapper = document.createElement('div');
        tableWrapper.classList.add('table-wrapper');

        let table = document.createElement('div')
        table.classList.add('table');
        table.setAttribute('id', 'table' + (i+1));
        let heading = document.createElement('p');
        heading.classList.add('tableHeading')
        table.appendChild(heading);
        heading.innerHTML =`<strong>Table ${i+1}</strong`;

        let countBox = document.createElement('p')
        countBox.innerHTML = '0'

        tableWrapper.appendChild(table);
        tableWrapper.appendChild(countBox);
        tablesContainer.appendChild(tableWrapper)
    }
}


// Method to upload a valid excel file
function upload() {
    var files = document.getElementById('file_upload').files;
    if(files.length==0){
      alert("Please choose any file...");
      return;
    }
    var filename = files[0].name;
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension == '.XLS' || extension == '.XLSX') {
        excelFileToJSON(files[0]);
    }else{
        alert("Please select a valid excel file.");
    }
  }
   
  //Method to read excel file and convert it into JSON 
function excelFileToJSON(file){
  try {
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function(e) {

        var data = e.target.result;
        var workbook = XLSX.read(data, {
            type : 'binary'
        });
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], {defval: ""});
            if (roa.length > 0) {
                result[sheetName] = roa;
            }
        });
        //displaying the json result
        console.log(result);
        // console.log(JSON.stringify(result.Sheet1, null, 4)); 
        localStorage.setItem("guest_list", JSON.stringify(result.Sheet1, null, 4));
        location.reload();
        }
    }catch(e){
        console.error(e);
    }
}


// Load json file into the local storage 
// async function loadGuests() {
//     const response = await fetch("database.json");
//     const data = await response.json();
//     localStorage.setItem("guest_list", JSON.stringify(data));
// }

function populateTables() {
    let retrievedGuestList = localStorage.getItem('guest_list');
    let guestList = JSON.parse(retrievedGuestList);
    console.log('Guest List: ', guestList);

    guestList.forEach(object => {
        let guestTag = document.createElement('p');
        guestTag.setAttribute('draggable', 'true');
        guestTag.setAttribute('id', object.PersonID);
        guestTag.classList.add('draggable', 'guestTag');
        guestTag.dataset.PersonID = object.PersonID
        guestTag.dataset.Name = object.Name;
        guestTag.dataset.CompanyName = object.CompanyName;
        guestTag.dataset.Role = object.Role;
        guestTag.dataset.Sector = object.Sector;
        guestTag.dataset.Guest = object.Guest;
        guestTag.dataset.PRH = object.PRH;
        guestTag.dataset.TableNumber = object.TableNumber;
        guestTag.dataset.Seats = object.Seats;


        if (guestTag.dataset.CompanyName == "McKinsey") {
            guestTag.style.backgroundColor = "Blue";
            guestTag.style.color = "White";
        }

        if(guestTag.dataset.Guest != "") {
            guestTag.innerHTML = object.Name + "<br /> " + object.Guest
        } else {
            guestTag.innerHTML = object.Name;
        }

        document.getElementById("table" + object.TableNumber).appendChild(guestTag)
        handleDragging();
        GUESTCOUNT+=1;

    });
    console.log(GUESTCOUNT);
    return guestList;
}


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
        let count = 0;
        for (const child of table.children) {
            if(child.classList.contains("guestTag"))
            count += parseInt(child.dataset.Seats)
        }
        console.log(count);
        table.nextSibling.innerHTML = count;

        if (count > TABLECAPACTIY) {
            table.style.borderColor ="red";
        }
        if (count <= TABLECAPACTIY){
            table.style.borderColor ="black";
        }
        })
    }

function showCompanies () {
    guests = document.querySelectorAll('.guestTag');
    guests.forEach(guest => {
        guest.innerHTML = guest.dataset.CompanyName;
    });
}

function showSectors () {
    guests = document.querySelectorAll('.guestTag');
    guests.forEach(guest => {
        guest.innerHTML = guest.dataset.Sector;
    });
}


function showNames () {
    guests = document.querySelectorAll('.guestTag');
    guests.forEach(guest => {
    if(guest.dataset.Guest != "") {
        guest.innerHTML = guest.dataset.Name + "<br /> " + guest.dataset.Guest
    } else {
        guest.innerHTML = guest.dataset.Name;
    }
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
            PLAN = updatePLAN();
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
                currentDraggable.dataset.TableNumber = (table.id).slice(-1);
            } else {
                table.insertBefore(currentDraggable, afterElement)
                currentDraggable.dataset.TableNumber = (table.id).slice(-1);
            }
        });
        
    });
}

function updatePLAN() {
    const guestTags = document.querySelectorAll(".guestTag");
    let newPLAN = []
    guestTags.forEach(tag => {

        let object = new Object()
        object.PersonID = tag.dataset.PersonID;
        object.Name = tag.dataset.Name;
        object.CompanyName = tag.dataset.CompanyName;
        object.Role = tag.dataset.Role;
        object.Sector = tag.dataset.Sector;
        object.Guest = tag.dataset.Guest;
        object.PRH = tag.dataset.PRH;
        object.TableNumber = tag.dataset.TableNumber;
        object.Seats = tag.dataset.Seats;

        newPLAN.push(object)
    })
    return newPLAN;
}

let saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", () => {
    localStorage.setItem("guest_list", JSON.stringify(PLAN));
    downloadObjectAsXlsx()
    alert("Saved!")
})

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

function downloadObjectAsXlsx() {
    let retrievedGuestList = localStorage.getItem('guest_list');
    let guestList = JSON.parse(retrievedGuestList);
    console.log(guestList);
    console.log(typeof(guestList));
    const worksheet = XLSX.utils.json_to_sheet(guestList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    /* create an XLSX file and try to save to Presidents.xlsx */
    XLSX.writeFile(workbook, "guest_list.xlsx", { compression: true });
}
document.addEventListener("DOMContentLoaded", () => {
    displayTasks();
    displayNotes();
});

// CREATE Tasks (With Duplicate Prevention)
function newTask() {
    const input = document.getElementById("taskInput");
    const val = input.value.trim();
    if (val === '') {
        alert("You must write something!");
        return;
    }

    const tasks = JSON.parse(localStorage.getItem("vaultTasks")) || [];
    
    // Check for exact duplicate task text (case-insensitive)
    const isDuplicate = tasks.some(task => task.text.toLowerCase() === val.toLowerCase());
    if (isDuplicate) {
        alert("System Refusal: This task entry already exists in the matrix.");
        return;
    }

    tasks.push({ id: Date.now(), text: val, completed: false });
    localStorage.setItem("vaultTasks", JSON.stringify(tasks));
    input.value = "";
    displayTasks();
}

// CREATE Notes (With Duplicate Prevention)
function newNote() {
    const input = document.getElementById("noteInput");
    const val = input.value.trim();
    if (val === '') {
        alert("You must write something!");
        return;
    }

    const notes = JSON.parse(localStorage.getItem("vaultNotes")) || [];
    
    // Check for exact duplicate note text (case-insensitive)
    const isDuplicate = notes.some(note => note.text.toLowerCase() === val.toLowerCase());
    if (isDuplicate) {
        alert("System Refusal: This note payload matches an existing entry.");
        return;
    }

    notes.push({ id: Date.now(), text: val });
    localStorage.setItem("vaultNotes", JSON.stringify(notes));
    input.value = "";
    displayNotes();
}

// READ Tasks
function displayTasks() {
    const ul = document.getElementById("taskUL");
    ul.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem("vaultTasks")) || [];
    tasks.forEach(task => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("checked");
        
        li.innerHTML = `
            <span contenteditable="true" onblur="updateTask(${task.id}, this.innerText)" class="editable-text">${task.text}</span>
            <span class="close" onclick="deleteItem(${task.id}, 'task', event)">&times;</span>
        `;
        
        li.addEventListener("click", (e) => {
            if (e.target.classList.contains("editable-text") || e.target.classList.contains("close")) return;
            toggleTask(task.id);
        });
        
        ul.appendChild(li);
    });
}

// READ Notes
function displayNotes() {
    const ul = document.getElementById("noteUL");
    ul.innerHTML = "";
    const notes = JSON.parse(localStorage.getItem("vaultNotes")) || [];
    notes.forEach(note => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span contenteditable="true" onblur="updateNote(${note.id}, this.innerText)" class="editable-text">${note.text}</span>
            <span class="close" onclick="deleteItem(${note.id}, 'note', event)">&times;</span>
        `;
        ul.appendChild(li);
    });
}

// UPDATE Task text (With Duplicate Prevention during edits)
function updateTask(id, text) {
    const cleanText = text.trim();
    const tasks = JSON.parse(localStorage.getItem("vaultTasks")) || [];
    
    // Check if the modified text matches *another* task item
    const isDuplicate = tasks.some(t => t.id !== id && t.text.toLowerCase() === cleanText.toLowerCase());
    if (isDuplicate) {
        alert("System Refusal: Modified text conflicts with an existing task entry. Reverting change.");
        displayTasks(); // Re-render to clear the edited text back to original
        return;
    }

    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
        tasks[idx].text = cleanText;
        localStorage.setItem("vaultTasks", JSON.stringify(tasks));
    }
}

// UPDATE Note text (With Duplicate Prevention during edits)
function updateNote(id, text) {
    const cleanText = text.trim();
    const notes = JSON.parse(localStorage.getItem("vaultNotes")) || [];
    
    // Check if the modified text matches *another* note item
    const isDuplicate = notes.some(n => n.id !== id && n.text.toLowerCase() === cleanText.toLowerCase());
    if (isDuplicate) {
        alert("System Refusal: Modified text conflicts with an existing note entry. Reverting change.");
        displayNotes(); // Re-render to clear the edited text back to original
        return;
    }

    const idx = notes.findIndex(n => n.id === id);
    if (idx !== -1) {
        notes[idx].text = cleanText;
        localStorage.setItem("vaultNotes", JSON.stringify(notes));
    }
}

// UPDATE Completion State
function toggleTask(id) {
    const tasks = JSON.parse(localStorage.getItem("vaultTasks")) || [];
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
        tasks[idx].completed = !tasks[idx].completed;
        localStorage.setItem("vaultTasks", JSON.stringify(tasks));
        displayTasks();
    }
}

// DELETE Handler
function deleteItem(id, type, event) {
    event.stopPropagation();
    if (type === 'task') {
        let tasks = JSON.parse(localStorage.getItem("vaultTasks")) || [];
        tasks = tasks.filter(t => t.id !== id);
        localStorage.setItem("vaultTasks", JSON.stringify(tasks));
        displayTasks();
    } else {
        let notes = JSON.parse(localStorage.getItem("vaultNotes")) || [];
        notes = notes.filter(n => n.id !== id);
        localStorage.setItem("vaultNotes", JSON.stringify(notes));
        displayNotes();
    }
}
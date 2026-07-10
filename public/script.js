const API_URL = "/data";
document.addEventListener("DOMContentLoaded", () => {
    displayTasks();
    displayNotes();
});

async function fetchItems(type) {
    const res = await fetch(API_URL);
    const allData = await res.json();
    return allData.filter(item => item.type === type);
}

// CREATE Tasks (With Duplicate Prevention)
async function newTask() {
    const input = document.getElementById("taskInput");
    const val = input.value.trim();
    if (val === '') {
        alert("You must write something!");
        return;
    }

    // Check for exact duplicate task text (case-insensitive)
    const tasks = await fetchItems("task");
    const isDuplicate = tasks.some(task => task.text.toLowerCase() === val.toLowerCase());
    if (isDuplicate) {
        alert("System Refusal: This task entry already exists in the list.");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "task", text: val, completed: false })
    });

    input.value = "";
    displayTasks();
}

// CREATE Notes (With Duplicate Prevention)
async function newNote() {
    const input = document.getElementById("noteInput");
    const val = input.value.trim();
    if (val === '') {
        alert("You must write something!");
        return;
    }

    const notes = await fetchItems("note");
    const isDuplicate = notes.some(note => note.text.toLowerCase() === val.toLowerCase());
    if (isDuplicate) {
        alert("System Refusal: This note entry matches an existing entry.");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "note", text: val })
    });

    input.value = "";
    displayNotes();
}

// READ Tasks
async function displayTasks() {
    const ul = document.getElementById("taskUL");
    ul.innerHTML = "";
    const tasks = await fetchItems("task");
    tasks.forEach(task => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("checked");
        
        li.innerHTML = `
            <span contenteditable="true" onblur="updateTask('${task.id}', this.innerText)" class="editable-text">${task.text}</span>
            <span class="close" onclick="deleteItem('${task.id}', 'task', event)">&times;</span>
        `;
        
        li.addEventListener("click", (e) => {
            if (e.target.classList.contains("editable-text") || e.target.classList.contains("close")) return;
            toggleTask(task.id, task.completed);
        });
        
        ul.appendChild(li);
    });
}

// READ Notes
async function displayNotes() {
    const ul = document.getElementById("noteUL");
    ul.innerHTML = "";
    const notes = await fetchItems("note");
    notes.forEach(note => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span contenteditable="true" onblur="updateNote('${note.id}', this.innerText)" class="editable-text">${note.text}</span>
            <span class="close" onclick="deleteItem('${note.id}', 'note', event)">&times;</span>
        `;
        ul.appendChild(li);
    });
}

// UPDATE Task text (With Duplicate Prevention during edits)
async function updateTask(id, text) {
    const cleanText = text.trim();
    const tasks = await fetchItems("task");
    
    const isDuplicate = tasks.some(t => t.id !== id && t.text.toLowerCase() === cleanText.toLowerCase());
    if (isDuplicate) {
        alert("System Refusal: Modified text conflicts with an existing task entry. Reverting change.");
        displayTasks(); // Re-render to clear the edited text back to original
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText })
    });
}

// UPDATE Note text (With Duplicate Prevention during edits)
async function updateNote(id, text) {
    const cleanText = text.trim();
    const notes = await fetchItems("note");
    
    const isDuplicate = notes.some(n => n.id !== id && n.text.toLowerCase() === cleanText.toLowerCase());
    if (isDuplicate) {
        alert("System Refusal: Modified text conflicts with an existing note entry. Reverting change.");
        displayNotes();
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText })
    });
}

// UPDATE Completion State
async function toggleTask(id, currentState) {
    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentState })
    });
    displayTasks();
}

// DELETE Handler
async function deleteItem(id, type, event) {
    event.stopPropagation();
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (type === "task") {
        displayTasks();
    } else {
        displayNotes();
    }
}

let notes = [];

function saveNotes() {
  localStorage.setItem("stickyNotes", JSON.stringify(notes));
}

function loadNotes() {
  const saved = JSON.parse(localStorage.getItem("stickyNotes"));
  if (saved) {
    notes = saved;
    notes.forEach(createNoteElement);
  }
}

function addNote() {
  const newNote = {
    id: Date.now(),
    text: "",
    x: 50 + Math.random() * 300,
    y: 50 + Math.random() * 300
  };
  notes.push(newNote);
  createNoteElement(newNote);
  saveNotes();
}

function createNoteElement(note) {
  const noteEl = document.createElement("div");
  noteEl.className = "note";
  noteEl.style.left = `${note.x}px`;
  noteEl.style.top = `${note.y}px`;
  noteEl.setAttribute("data-id", note.id);
  noteEl.draggable = true;

  const textarea = document.createElement("textarea");
  textarea.value = note.text;
  textarea.oninput = () => {
    note.text = textarea.value;
    saveNotes();
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "×";
  deleteBtn.onclick = () => {
    notes = notes.filter(n => n.id !== note.id);
    noteEl.remove();
    saveNotes();
  };

  noteEl.appendChild(deleteBtn);
  noteEl.appendChild(textarea);
  document.getElementById("wall").appendChild(noteEl);

  noteEl.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", note.id);
  });

  noteEl.addEventListener("dragend", (e) => {
    const wall = document.getElementById("wall");
    const rect = wall.getBoundingClientRect();
    note.x = e.pageX - rect.left - 100;
    note.y = e.pageY - rect.top - 20;
    noteEl.style.left = `${note.x}px`;
    noteEl.style.top = `${note.y}px`;
    saveNotes();
  });
}

window.onload = loadNotes;

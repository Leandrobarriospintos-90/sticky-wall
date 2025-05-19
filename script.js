
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
    color: "#fff68f",
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
  noteEl.style.background = note.color;
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

  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.className = "color-picker";
  colorPicker.value = note.color;
  colorPicker.oninput = (e) => {
    note.color = e.target.value;
    noteEl.style.background = note.color;
    saveNotes();
  };

  noteEl.appendChild(deleteBtn);
  noteEl.appendChild(textarea);
  noteEl.appendChild(colorPicker);
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

function exportWall() {
  html2canvas(document.getElementById("wall")).then(canvas => {
    const link = document.createElement("a");
    link.download = "muro-de-ideas.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

window.onload = loadNotes;

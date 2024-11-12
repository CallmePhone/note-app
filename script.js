let currentEditLi = null; // ตัวแปรเก็บโน้ตที่กำลังแก้ไข
let originalNoteText = ''; // เก็บข้อมูลโน้ตที่จะแก้ไข

document.addEventListener('DOMContentLoaded', loadNotes); // โหลดโน้ตเมื่อเริ่มต้น

document.getElementById('addNoteButton').addEventListener('click', function() {
    const noteInput = document.getElementById('noteInput');
    const notesList = document.getElementById('notesList');
    const fontSelect = document.getElementById('fontSelect');
    const colorSelect = document.getElementById('colorSelect');
    const bgColorSelect = document.getElementById('bgColorSelect');

    const noteText = noteInput.value.trim();
    if (noteText) {
        const dateAdded = new Date().toLocaleString();
        const noteObj = {
            text: noteText,
            date: dateAdded,
            font: fontSelect.value,
            color: colorSelect.value,
            bgColor: bgColorSelect.value,
        };
        saveNoteToLocalStorage(noteObj); // บันทึกโน้ตลง localStorage
        addNoteToList(noteObj); // แสดงโน้ตในรายการ
        noteInput.value = '';
    } else {
        alert('กรุณาใส่โน้ต');
    }
});

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => addNoteToList(note));
}

function addNoteToList(noteObj) {
    const notesList = document.getElementById('notesList');
    const li = document.createElement('li');

    li.innerHTML = `${noteObj.text} (เพิ่มเมื่อ: ${noteObj.date}) 
                    <button class="editBtn">แก้ไข</button>
                    <button class="deleteBtn">ลบ</button>`;
    li.style.fontFamily = noteObj.font;
    li.style.color = noteObj.color;
    li.style.backgroundColor = noteObj.bgColor;
    li.dataset.noteText = noteObj.text.toLowerCase(); // เก็บข้อมูลโน้ตไว้สำหรับค้นหา

    notesList.appendChild(li);

    li.querySelector('.deleteBtn').addEventListener('click', function() {
        notesList.removeChild(li);
        removeNoteFromLocalStorage(noteObj.text); // ลบโน้ตออกจาก localStorage
    });

    li.querySelector('.editBtn').addEventListener('click', function() {
        if (currentEditLi) return; // ห้ามแก้ไขโน้ตอื่นเมื่อกำลังแก้ไขอยู่
        currentEditLi = li;
        originalNoteText = noteObj.text; // เก็บข้อมูลโน้ตเดิม
        document.getElementById('noteInput').value = noteObj.text; // แสดงโน้ตใน Text Area
        notesList.removeChild(li); // ลบโน้ตออกจากรายการ

        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'ยกเลิกแก้ไข';
        cancelButton.className = 'cancelBtn';
        cancelButton.addEventListener('click', function() {
            document.getElementById('noteInput').value = originalNoteText; // แสดงข้อมูลเดิม
            currentEditLi = null; // ยกเลิกสถานะการแก้ไข
            notesList.appendChild(li); // เพิ่มโน้ตกลับเข้ามาในรายการ
            cancelButton.remove(); // ลบปุ่มยกเลิกออก
        });
        notesList.appendChild(cancelButton);
    });
}

function saveNoteToLocalStorage(noteObj) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(noteObj);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function removeNoteFromLocalStorage(noteText) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const updatedNotes = notes.filter(note => note.text !== noteText);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
}

document.getElementById('searchInput').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const notesList = document.getElementById('notesList');
    const notes = notesList.getElementsByTagName('li');

    Array.from(notes).forEach(note => {
        const noteText = note.dataset.noteText; // ใช้ข้อมูลโน้ตที่เก็บไว้
        note.style.display = noteText.includes(searchValue) ? '' : 'none';
    });
});

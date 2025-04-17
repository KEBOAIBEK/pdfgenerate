let selectedField = null;
let newItem = null;
let draggingItem = null;
let offsetX, offsetY;
let selectedItemForEdit = null;

const template = document.getElementById('templateArea');
const modal = document.getElementById('itemModal');
const modalLabel = document.getElementById('modalLabel');
const deleteBtn = document.getElementById('deleteBtn');
const closeBtn = document.getElementById('closeBtn');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const fontSizeInput = document.getElementById('fontSizeInput');
const applyBtn = document.getElementById('applyBtn');

template.addEventListener('mousedown', function (e) {
  if (e.target.classList.contains('template-item')) {
    draggingItem = e.target;
    const rect = draggingItem.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  }
});

template.addEventListener('mousemove', function (e) {
  const rect = template.getBoundingClientRect();
  if (newItem) {
    newItem.style.left = `${e.clientX - rect.left - newItem.offsetWidth / 2}px`;
    newItem.style.top = `${e.clientY - rect.top - newItem.offsetHeight / 2}px`;
  } else if (draggingItem) {
    draggingItem.style.left = `${e.clientX - rect.left - offsetX}px`;
    draggingItem.style.top = `${e.clientY - rect.top - offsetY}px`;
  }
});

template.addEventListener('mouseup', function () {
  newItem = null;
  draggingItem = null;
});

document.querySelectorAll('.field-button').forEach(button => {
  button.addEventListener('click', function () {
    const label = button.getAttribute('data-label');
    const placeholder = button.getAttribute('data-placeholder');

    const item = document.createElement('div');
    item.classList.add('template-item');
    item.setAttribute('data-label', label);
    item.textContent = `${label}: ${placeholder}`;
    item.style.left = '0px';
    item.style.top = '0px';
    item.style.background = 'none';

    template.appendChild(item);
    newItem = item;
  });
});

template.addEventListener('dblclick', function (e) {
  if (e.target.classList.contains('template-item')) {
    selectedItemForEdit = e.target;
    modalLabel.textContent = 'Field: ' + selectedItemForEdit.getAttribute('data-label');
    fontFamilySelect.value = selectedItemForEdit.style.fontFamily || 'Arial';
    fontSizeInput.value = parseInt(selectedItemForEdit.style.fontSize) || 16;
    modal.style.display = 'block';
  }
});

fontSizeInput.addEventListener('input', () => {
  if (selectedItemForEdit) {
    selectedItemForEdit.style.fontSize = fontSizeInput.value + 'px';
  }
});

fontFamilySelect.addEventListener('change', () => {
  if (selectedItemForEdit) {
    selectedItemForEdit.style.fontFamily = fontFamilySelect.value;
  }
});

applyBtn.addEventListener('click', function () {
  if (selectedItemForEdit) {
    selectedItemForEdit.style.fontFamily = fontFamilySelect.value;
    selectedItemForEdit.style.fontSize = fontSizeInput.value + 'px';
  }
  modal.style.display = 'none';
});

deleteBtn.addEventListener('click', function () {
  if (selectedItemForEdit) {
    selectedItemForEdit.remove();
    selectedItemForEdit = null;
  }
  modal.style.display = 'none';
});

closeBtn.addEventListener('click', function () {
  modal.style.display = 'none';
  selectedItemForEdit = null;
});

document.getElementById('ratio169').addEventListener('click', () => {
  template.style.width = '1240px';
  template.style.height = '697px';
});

document.getElementById('ratio916').addEventListener('click', () => {
  template.style.width = '595px';
  template.style.height = '842px';
});

const bgUpload = document.getElementById('bgUpload');
bgUpload.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    template.style.backgroundImage = `url(${e.target.result})`;
  };
  reader.readAsDataURL(file);
});

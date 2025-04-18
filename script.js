let selectedField = null;
let newItem = null;
let draggingItem = null;
let offsetX, offsetY;
let selectedItemForEdit = null;

const template = document.getElementById('templateArea');
const modal = document.getElementById('itemModal');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const fontSizeInput = document.getElementById('fontSizeInput');
const fontWeightSelect = document.getElementById('fontWeightSelect');
const textColorInput = document.getElementById('textColorInput');
const widthControl = document.getElementById('widthControl');
const applyBtn = document.getElementById('applyBtn');
const deleteBtn = document.getElementById('deleteBtn');
const closeBtn = document.getElementById('closeBtn');
const modalLabel = document.getElementById('modalLabel');
const bgUpload = document.getElementById('bgUpload');

// Modal functionality to edit template item
function openModalForEdit(item) {
  modalLabel.textContent = `Field: ${item.getAttribute('data-label')}`;
  
  fontFamilySelect.value = item.style.fontFamily || 'Arial';
  fontSizeInput.value = parseInt(item.style.fontSize) || 16;
  fontWeightSelect.value = item.style.fontWeight || 'normal';
  textColorInput.value = item.style.color || '#111827';
  widthControl.value = parseInt(item.style.width) || 300;
  
  modal.style.display = 'block';
}

// Apply changes to the selected item in the modal
function applyChanges() {
  if (selectedItemForEdit) {
    selectedItemForEdit.style.fontFamily = fontFamilySelect.value;
    selectedItemForEdit.style.fontSize = `${fontSizeInput.value}px`;
    selectedItemForEdit.style.fontWeight = fontWeightSelect.value;
    selectedItemForEdit.style.color = textColorInput.value;
    selectedItemForEdit.style.width = `${widthControl.value}px`;
  }
  modal.style.display = 'none';
}

// Delete the selected item
function deleteItem() {
  if (selectedItemForEdit) {
    selectedItemForEdit.remove();
    selectedItemForEdit = null;
  }
  modal.style.display = 'none';
}

// Event listeners for modal controls
applyBtn.addEventListener('click', applyChanges);
deleteBtn.addEventListener('click', deleteItem);
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  selectedItemForEdit = null;
});

// Event listeners for live updates
fontWeightSelect.addEventListener('change', () => {
  if (selectedItemForEdit) {
    selectedItemForEdit.style.fontWeight = fontWeightSelect.value;
  }
});

fontSizeInput.addEventListener('input', () => {
  if (selectedItemForEdit) {
    selectedItemForEdit.style.fontSize = `${fontSizeInput.value}px`;
  }
});

widthControl.addEventListener('input', () => {
  if (selectedItemForEdit) {
    selectedItemForEdit.style.width = `${widthControl.value}px`;
  }
});

// Template item interaction (dragging and resizing)
template.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('template-item')) {
    draggingItem = e.target;
    const rect = draggingItem.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  }
});

template.addEventListener('mousemove', (e) => {
  const rect = template.getBoundingClientRect();
  
  if (newItem) {
    newItem.style.left = `${e.clientX - rect.left - newItem.offsetWidth / 2}px`;
    newItem.style.top = `${e.clientY - rect.top - newItem.offsetHeight / 2}px`;
  } else if (draggingItem) {
    draggingItem.style.left = `${e.clientX - rect.left - offsetX}px`;
    draggingItem.style.top = `${e.clientY - rect.top - offsetY}px`;
  }
});

template.addEventListener('mouseup', () => {
  newItem = null;
  draggingItem = null;
});

// Add a new template item on button click
document.querySelectorAll('.field-button').forEach(button => {
  button.addEventListener('click', () => {
    const label = button.getAttribute('data-label');
    const placeholder = button.getAttribute('data-placeholder');

    const item = document.createElement('div');
    item.classList.add('template-item');
    item.setAttribute('data-label', label);
    item.textContent = `${label}: ${placeholder}`;
    item.style.left = '0px';
    item.style.top = '0px';
    item.style.width = '300px'; // Default width
    item.style.background = 'none';

    template.appendChild(item);
    newItem = item;
  });
});

// Open modal to edit template item on double-click
template.addEventListener('dblclick', (e) => {
  if (e.target.classList.contains('template-item')) {
    selectedItemForEdit = e.target;
    openModalForEdit(selectedItemForEdit);
  }
});

// Update font family and font size
fontFamilySelect.addEventListener('change', () => {
  if (selectedItemForEdit) {
    selectedItemForEdit.style.fontFamily = fontFamilySelect.value;
  }
});

// Set template ratio (16:9 or 9:16)
document.getElementById('ratio169').addEventListener('click', () => {
  template.style.width = '1240px';
  template.style.height = '697px';
});

document.getElementById('ratio916').addEventListener('click', () => {
  template.style.width = '595px';
  template.style.height = '842px';
});

// Handle background image upload
bgUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    template.style.backgroundImage = `url(${e.target.result})`;
  };
  reader.readAsDataURL(file);
});

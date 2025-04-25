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

// Add this function to save the current template data
function saveCurrentTemplate() {
  // Create a data object to hold template information
  const templateData = {
    width: template.style.width || '1240px',
    height: template.style.height || '877px',
    backgroundImage: null,
    items: []
  };
  
  // Get background image if exists
  if (template.style.backgroundImage) {
    templateData.backgroundImage = template.style.backgroundImage.replace('url("', '').replace('")', '');
  }
  
  // Get all template items
  const items = document.querySelectorAll('.template-item');
  items.forEach(item => {
    const labelAndPlaceholder = item.textContent.split(': ');
    templateData.items.push({
      label: item.getAttribute('data-label'),
      placeholder: labelAndPlaceholder.length > 1 ? labelAndPlaceholder[1] : item.textContent,
      style: {
        fontFamily: item.style.fontFamily || 'Arial',
        fontSize: item.style.fontSize || '16px',
        fontWeight: item.style.fontWeight || 'normal',
        color: item.style.color || '#111827',
        width: item.style.width || '300px',
        left: item.style.left || '0px',
        top: item.style.top || '0px'
      }
    });
  });
  
  return templateData;
}

document.querySelector('.header .btn').addEventListener('click', () => {
  const downloadBtn = document.querySelector('.header .btn');
  const templatePreview = document.querySelector('.template-preview');
  
  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Sending Data...';

  const templateData = saveCurrentTemplate();
  const htmlContent = templatePreview.outerHTML;
  const orientation = parseInt(templateData.width) > parseInt(templateData.height) ? 'landscape' : 'portrait';

  const requestBody = {
    htmlContent: htmlContent,
    width: templateData.width,
    height: templateData.height,
    orientation: orientation
  };

  const backendUrl = 'https://b6d9-195-158-8-218.ngrok-free.app/api/marathon/Certificates/GeneratePdf';

  fetch(backendUrl, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept': 'application/json'
    }
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to download PDF");
      return response.blob();
    })
    .then((blob) => {
      let a = document.createElement('a');
      a.download = `certificate.pdf`;
      a.href = window.URL.createObjectURL(blob);
      a.click();
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Download PDF';
    })
    .catch(err => {
      console.error(err);
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Download PDF';
    });
});



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
    item.style.position = 'absolute';
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
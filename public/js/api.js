async function getSatellites() {
  const response = await fetch('/api/satellites');
  const { data: satellites } = await response.json();

  if (satellites && satellites.length > 0) {
    const dropdown = document.getElementById('satellites-dropdown');
    dropdown.innerHTML = '';
    const createDropDownItem = (label, value) => {
      const anchor = document.createElement('a');
      anchor.className = 'dropdown-item text-white';
      anchor.href = '#';
      anchor.innerHTML = label;
      anchor.setAttribute('data-value', value);
      anchor.addEventListener('click', (event) => {
        const { target } = event;
        const value = target.getAttribute('data-value');
        if (value) {
          EARTH_TEXTURE = value;
          earth.material.map = new THREE.TextureLoader().load(EARTH_TEXTURE);
        }
      });
      return anchor;
    };

    for (const satellite of satellites) {
      const { label, src } = satellite;

      dropdown
        .appendChild(document.createElement('li'))
        .appendChild(createDropDownItem(label, src));
    }
  }
}

getSatellites();

function toggleRotation() {
  const element = document.getElementById('toggle-rotation');
  if (TOGGLE_ROTATION) {
    element.setAttribute('class', 'nav-link text-success');
  } else {
    element.setAttribute('class', 'nav-link text-danger');
  }

  element.addEventListener('click', (event) => {
    TOGGLE_ROTATION = !TOGGLE_ROTATION;
    if (TOGGLE_ROTATION) {
      event.target.setAttribute('class', 'nav-link text-success');
    } else {
      event.target.setAttribute('class', 'nav-link text-danger');
    }
  });
}

toggleRotation();

const uploadModal = document.getElementById('uploadModal');
const uploadForm = document.getElementById('uploadForm');
const uploadButton = document.getElementById('uploadButton');
uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(uploadForm);

  uploadButton.innerHTML = 'Uploading...';
  uploadButton.setAttribute('class', 'btn btn-primary disabled');

  const response = await fetch('/api/satellites', {
    body: formData,
    method: 'POST',
  });

  if (response.status === 200) {
    uploadButton.innerHTML = 'Done Upload';
    uploadButton.setAttribute('class', 'btn btn-success disabled');

    getSatellites();
  } else {
    uploadButton.innerHTML = 'Error Upload';
    uploadButton.setAttribute('class', 'btn btn-danger disabled');
  }
});

uploadModal.addEventListener('hidden.bs.modal', (event) => {
  uploadButton.innerHTML = 'Upload';
  uploadButton.setAttribute('class', 'btn btn-primary');
  uploadForm.reset();
});

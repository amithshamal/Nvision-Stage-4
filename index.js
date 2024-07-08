document.addEventListener('DOMContentLoaded', () => {
  let db;
  const request = indexedDB.open('FormDB', 1);

  request.onerror = (event) => {
    console.error('Database error:', event.target.errorCode);
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    displayData();
  };

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore('formData', {
      keyPath: 'id',
      autoIncrement: true,
    });
    objectStore.createIndex('input1', 'input1', { unique: false });
    objectStore.createIndex('input2', 'input2', { unique: false });
    objectStore.createIndex('input3', 'input3', { unique: false });
  };

  document.getElementById('myForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;
    const input3 = document.getElementById('input3').value;

    const transaction = db.transaction(['formData'], 'readwrite');
    const objectStore = transaction.objectStore('formData');
    const request = objectStore.add({ input1, input2, input3 });

    request.onsuccess = () => {
      displayData();
      document.getElementById('myForm').reset();
    };

    request.onerror = (event) => {
      console.error('Error adding data:', event.target.errorCode);
    };
  });

  function displayData() {
    const transaction = db.transaction(['formData'], 'readonly');
    const objectStore = transaction.objectStore('formData');
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      const data = event.target.result;
      const tbody = document.querySelector('#dataTable tbody');
      tbody.innerHTML = '';
      data.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                  <td>${item.id}</td>
                  <td>${item.input1}</td>
                  <td>${item.input2}</td>
                  <td>${item.input3}</td>
              `;
        tbody.appendChild(row);
      });
    };

    request.onerror = (event) => {
      console.error('Error fetching data:', event.target.errorCode);
    };
  }
});

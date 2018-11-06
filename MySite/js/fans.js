window.isOnline = () => this.navigator.onLine;

const getById = id => document.getElementById(id);

const feedbackContainer = getById('container');
const form = getById('form_appeal');
const namearea = getById('name');
const textarea = getById('text');	


const feedbackTemplate = (name, text, date, time) => ` 
    <div class="container">
        <br>
        <p>
        <br>
        ${text}
        </p>
        <br>
        <span class="review-date">${date}, ${time}</span>
        <span class="author">${name}</span>
    </div>

    <div class="divider"></div>
`

const addDataRaedToStorage = (online) => {
  if (isOnline()) return;
  const data = localStorage.getItem('feedbacks-data');

  if (!data) {
    console.log('No local data available');
  } else {
    JSON.parse(data).forEach(() => {
        $('#container').prepend(
        feedbackTemplate(title, text, date, time),
        );
    });
  }
}

const writeLocally = (obj) => {
  const item = localStorage.getItem('feedbacks-data')
  let data = item ? JSON.parse(item) : [];
  data.push(obj);
  localStorage.setItem('feedbacks-data', JSON.stringify(data));
}

const onSubmitPress = (e) => {
  e.preventDefault();

  const isValid = (textarea.value.length > 0 && namearea.value.length > 0);
  form.classList.add('was-validated')

  if (!isValid) return;

  const date = new Date();

  $('#container').prepend(
    feedbackTemplate(namearea.value, textarea.value, date.toLocaleDateString(), date.toLocaleTimeString())
  );

  writeLocally({
    name: namearea.value,
    text: textarea.value,
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  });


  form.classList.remove('was-validated');
  namearea.value = '';
  textarea.value = '';
 
}

const onOnline = () => {
  addDataRaedToStorage();
  console.log('Status: online, upload data to server ...');
}

const onOffline = () => {
  addDataRaedToStorage();
  console.log('Missing connection, switching to offline mode ...');
}


// Bind listeners to the DOM
const addButton = getById('submitBtn');
addButton.onclick = onSubmitPress;
window.addEventListener('online', onOnline);
window.addEventListener('offline', onOffline);
window.addEventListener('DOMContentLoaded', addDataRaedToStorage);
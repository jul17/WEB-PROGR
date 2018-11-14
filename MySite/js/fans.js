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

const addDataReadToStorage = (online) => {
  const data = localStorage.getItem('comments');

  console.log('Reading from local storage');

  if (!data) {
    console.log('No local data available');
  } else {
    JSON.parse(data).forEach(({name, text, date, time }) => {
        console.log(name, text, date, time);
        $('#container').prepend(
        feedbackTemplate(name, text, date, time),
        );
    });
  }


  localStorage.removeItem('comments');
}

const addToLocal = (obj) => {
  const item = localStorage.getItem('comments')
  let data = item ? JSON.parse(item) : [];
  data.push(obj);
  localStorage.setItem('comments', JSON.stringify(data));
}

const onSubmitPress = (e) => {
  e.preventDefault();

  const isValid = (textarea.value.length > 0 && namearea.value.length > 0);
  form.classList.add('was-validated')

  if (!isValid) return;

  const date = new Date();

  addToLocal({
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
  addDataReadToStorage();
  console.log('Status: online, upload data to server ...');
}

const onOffline = () => {
  console.log('Missing connection, switching to offline mode ...');
}


// Bind listeners to the DOM
const addButton = getById('submitBtn');
addButton.onclick = onSubmitPress;
window.addEventListener('online', onOnline);
window.addEventListener('offline', onOffline);
window.addEventListener('DOMContentLoaded', addDataReadToStorage);
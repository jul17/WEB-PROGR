window.isOnline = () => this.navigator.onLine;

const getById = (id) => document.getElementById(id);

const newsContainer = getById('news');

const itemTemplate = (title, body, picture) => `
    <div id="content_wrapper_news">
      <a href="#" class="news_table">
        <img src="${picture}" alt="${title}">
        <h1>${body}</h1>
      </a>
`


const addDataReadToStorage = (online) => {
  const data = localStorage.getItem('news_data');

  console.log('Reading from local storage');

  if (!data) {
    console.log('No available local data found');
  } else {
    JSON.parse(data).forEach(({ title, body, picture }) => {
        console.log(title, body);
        $('#news').append(
          itemTemplate(title, body, picture),
        );
    });
  }
}

const onOnline = () => {
  console.log('Network status: online');
}

const onOffline = () => {
  console.log('Connection lost');
}

window.addEventListener('online', onOnline);
window.addEventListener('offline', onOffline);
window.addEventListener('DOMContentLoaded', addDataReadToStorage);


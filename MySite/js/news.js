  var useLocalStorage = false;

  function switchUseLS(){
    useLocalStorage = !useLocalStorage;
  }

  class News{
    constructor(title, body, picture){
      this.title = title;
      this.body = body;
      this.picture = picture;
    }
  }

  window.isOnline = () => this.navigator.onLine;
  const getById = (id) => document.getElementById(id);

  // REST
class ServerService {
  async sendToServer(data) {
    try {
      await fetch('/news', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Cannot fetch data: ', error);
    }
  }

 async getFromServer() {
    try {
      const data = await fetch('/news/all');
      return data.text();
    } catch (error) {
      console.error('Cannot fetch data: ', error);
    }
  }
}
//


  const newsContainer = getById('all_news');

  function newsTemplate(news) {
  var title = news.title;
  var body = news.body;
  var picture = news.picture;
  var button = document.createElement('input');

  button.type  = 'button';
  button.addEventListener('click', function() {
      alert(add);
  }, false);

  return `
     <div id="news">
       <a href="#" class="news_table">
         <img src="${picture}" alt="${title}">
         <h1>${body}</h1>
       </a>     
`
  }

  function myFunction() {
    if(useLocalStorage){
      localStorage.clear();
      alert("Вашу новину видалено успішно!");
      location.reload();
      show();
    }
    else {
        window.indexedDB.deleteDatabase("news_data");
        location.reload();
        show();
    }
  }

  function myFunction() {
  if(useLocalStorage){
    localStorage.clear();
    alert("Вашу новину видалено успішно!");
    location.reload();
    show();
  }
  else {
      window.indexedDB.deleteDatabase("news_data");
      location.reload();
      show();
  }
}

//REST

const service = new ServerService();

const initAndRenderData = async () => {
  const items = await service.getFromServer();
  console.log(items);

  const itemsStringified = JSON.stringify(items);

  JSON.parse(items).forEach(({ title, body, picture }) => {
         var tempNews = new News(title, body, picture);
         $('#all_news').append(
           newsTemplate(tempNews)
         );
   });
}

  const onOnline = () => {
    show();
    console.log('Network status: online');
  }

  const onOffline = () => {
    console.log('Connection lost');
  }

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  window.addEventListener('DOMContentLoaded', initAndRenderData);


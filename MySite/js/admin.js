var useLocalStorage = false;

function switchUseLS(){
  useLocalStorage = !useLocalStorage;
}

window.isOnline = () => this.navigator.onLine;

const getById = id => document.getElementById(id);

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

const service = new ServerService();

const input_form = getById('addPicture');
const newsForm = getById('newsForm');
const text = getById('text');
const caption = getById('caption');

const fileInput = getById('formForFile');

class News{
  constructor(title, body, picture){
    this.title = title;
    this.body = body;
    this.picture = picture;
  }
}

const onSubmitPress = async (e) => {
  e.preventDefault();

  const isValid = (text.value.length > 0 && caption.value.length > 0);
  input_form.classList.add('was-validated')
  newsForm.classList.add('was-validated');

  if (!isValid) return;

  var news = new News(caption.value, text.value, fileInput.value);

  await service.sendToServer({
    title: caption.value,
    body: text.value,
    picture: fileInput.value,
  });

  input_form.classList.remove('was-validated');
  newsForm.classList.remove('was-validated');
  input_form.reset();
  newsForm.reset();

  alert('Вашу новину додано!');
}


function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#example_picture').attr('src', e.target.result);
    }

    reader.readAsDataURL(input.files[0]);
  }
};

$("#formForFile").change(function() {
  readURL(this);
});

function getNews() {
    var news = new Array;
    var news_item = localStorage.getItem('news_data');
    if (news_item !== null) {
        news = JSON.parse(news_item); 
    }
    return news;
}

function writeLocally(newsItem) {
  if(useLocalStorage){
    var news = getNews();
      news.push(newsItem);
      localStorage.setItem('news_data', JSON.stringify(news));
      return false;
  } 
  else{
    var openDB = indexedDB.open("news_data", 1);

    openDB.onerror = function(event) {
      alert("Error occurred when loading news");
    };
    openDB.onupgradeneeded = function() {
        var db = openDB.result;
        var store = db.createObjectStore("news", {keyPath: "title"});
        store.createIndex("title", "title", { unique: false });
        store.createIndex("body", "body", { unique: false });
        store.createIndex("picture", "picture", { unique: false });
    };
    openDB.onsuccess = function(event) {
      var db = openDB.result;
      var tx = db.transaction(["news"], "readwrite");
      var store = tx.objectStore("news");
      var addFeedback = store.put(newsItem);
      addFeedback.onsuccess = function(event){
      }
      addFeedback.onerror = function(event){
        alert("Error occurred when loading news");
      }
      tx.oncomplete = function(){
        db.close();
      }
    };
  }
};


const addButton = getById('submit-btn');
addButton.onclick = onSubmitPress;
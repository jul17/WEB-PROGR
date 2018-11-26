var useLocalStorage = false;

function switchUseLS(){
  useLocalStorage = !useLocalStorage;
}

window.isOnline = () => this.navigator.onLine;

const getById = id => document.getElementById(id);

const feedbackContainer = getById('container');
const form = getById('form_appeal');
const namearea = getById('name');
const textarea = getById('text'); 

class Feedback{
  constructor(name, text, date, time){
    this.name = name;
    this.text = text;
    this.date = date;
    this.time = time;
  }
}

function feedbackTemplate(feedback) { 
var name = feedback.name;
var text = feedback.text;
var date = feedback.date;
var time = feedback.time;

return` 
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
} 

const addDataReadToStorage = (online) => {
  if(useLocalStorage){
      if (isOnline()) return;
      const data = localStorage.getItem('feedbacks-data');

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
  }  else {
  var openDB = indexedDB.open("feedbacks-data", 1);
      openDB.onupgradeneeded = function() {
          var db = openDB.result;
          var store = db.createObjectStore("feedbacks", {keyPath: "name"});
          store.createIndex("name", "name", { unique: false });
          store.createIndex("text", "text", { unique: false });
          store.createIndex("date", "date", { unique: false });
          store.createIndex("time", "time", { unique: false });
      }
      openDB.onsuccess = function(event) {
        var db = openDB.result;
        var tx = db.transaction("feedbacks", "readwrite");
          var store = tx.objectStore("feedbacks");
          store.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;

          if (cursor) {
            var tempFeed = new Feedback(cursor.value.name, cursor.value.text, cursor.value.date, cursor.value.time);
              console.log(tempFeed);
              //feedbacks.push(tempFeed);
              $('#container').prepend(feedbackTemplate(tempFeed));
              cursor.continue();
          }
        };
          tx.oncomplete = function(){
            db.close();
          }
      }
  }
}

function addToLocal(feedback) {
  if(useLocalStorage){
  const item = localStorage.getItem('feedbacks-data')
  let data = item ? JSON.parse(item) : [];
  data.push(obj);
  localStorage.setItem('feedbacks-data', JSON.stringify(data))
 }
  else {
    var openDB = indexedDB.open("feedbacks-data", 1);

    openDB.onerror = function(event) {
      alert("Error occurred when loading feedback");
    };

    openDB.onsuccess = function(event) {
      var db = openDB.result;
      var tx = db.transaction(["feedbacks"], "readwrite");
      var store = tx.objectStore("feedbacks");
      var addFeedback = store.put(feedback);
      addFeedback.onsuccess = function(event){
        alert("Feedback created");
      }
      addFeedback.onerror = function(event){
        alert("Error occurred when loading feedbacks");
      }
      tx.oncomplete = function(){
        db.close();
      }
    };
  }
}


const onSubmitPress = (e) => {
  e.preventDefault();

  const isValid = (textarea.value.length > 0 && namearea.value.length > 0);
  form.classList.add('was-validated')

  if (!isValid) return;

  const date = new Date();
  var feedback = new Feedback(namearea.value, textarea.value, date.toLocaleDateString(), date.toLocaleTimeString());
  
  if(navigator.onLine){
  $('#container').prepend(
    feedbackTemplate(feedback)
  );
  }

  addToLocal(feedback);

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
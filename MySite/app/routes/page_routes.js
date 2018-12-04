var ObjectID = require('mongodb').ObjectID;
var _dirname = 'C:/IOT2018/WEB-PROGR/MySite';
module.exports = function(app, db) {
  app.get('/', (req, res) => {
    res.sendFile(_dirname + '/index.html');
  });
  app.get('/index.html', (req, res) => {
    res.sendFile(_dirname + '/index.html');
  });
  app.get('administrator.html', (req, res) => {
    res.sendFile(_dirname + '/administrator.html');
  });
  app.get('/contacts.html', (req, res) => {
    res.sendFile(_dirname + '/contacts.html');
  });
  app.get('/fans.html', (req, res) => {
    res.sendFile(_dirname + '/fans.html');
  });

  app.get('/news.html', (req, res) => {
    res.sendFile(_dirname + '/news.html');
  });
};
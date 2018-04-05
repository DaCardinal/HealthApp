(function(){
  const global = require('../../constants.js');

  var login = document.getElementById('login-btn');

  login.addEventListener('click', function () {
    global.ipcRenderer.send('login-success');
  });

})();

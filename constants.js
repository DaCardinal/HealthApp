(function(){
  // function define(name, value) {
  //     Object.defineProperty(exports, name, {
  //         value:      value,
  //         enumerable: true,
  //         writable: true
  //     });
  // }
  exports.define = function (name, value, exportsObject) {
    if (!exportsObject){
      if (exports.exportsObject)
          exportsObject = exports.exportsObject;
      else
          exportsObject = exports;
    }

    Object.defineProperty( exportsObject, name, {
        'value': value,
        'enumerable': true,
        'writable': false,
    });
  }


  const electron = require('electron');
  const app = electron.app;
  const remote = electron.remote;
  const ipcRenderer = electron.ipcRenderer;
  const ipcMain = remote.ipcMain;
  const session = remote.session;
  const BrowserWindow = remote.BrowserWindow;

  exports.define("electron", electron);
  exports.define("path", require('path'));
  exports.define("url", require('url'));
  exports.define("fileSystem", require('fs'));
  exports.define("dragula", require('dragula'));
  exports.define("windowManager", remote.require('electron-window-manager'));
  // exports.define("windowStateManager", require('electron-window-state-manager'));
  exports.define("app", electron.app);
  exports.define("remote", electron.remote);
  exports.define("ipcRenderer",  electron.ipcRenderer);
  exports.define("ipcMain", remote.ipcMain);
  exports.define("session",  remote.session);
  exports.define("BrowserWindow",  remote.BrowserWindow);
  exports.define("handlebars",require('handlebars'));

  exports.exportObject = null;
})();

(function(){
  const global = require('../constants.js');
  const TabGroup = require('electron-tabs');
  const SibeBarJS = require('sidebar-tabs');
  
  let menuToggle = document.getElementsByClassName('menu-toggle');
  let collapseToggle = document.getElementById('collapse-toggle');
  let logoutButton = document.getElementById('lock-toggle');
  
  let appBase = global.windowManager.config.appBase;
  let sidebarGroup = new SibeBarJS.SideBarPanel({ready: function (sidebarGroup) {} });
  let tabGroup = new TabGroup({
      ready: function (tabGroup) {
          global.dragula([tabGroup.tabContainer], {
              direction: 'horizontal'
          });
      }
  });

  // console.log(windowManager);
  let sTabHandler = {
    'mainPage' : 'main-frame',
    'pageTabGroup' : {}
  };

  let sidebarTabHandler = {
    'mainPage' : 'main-frame',
    'pageTabGroup' : {}
  };

  function addTab(appBase, id, dir, title, tabHandler, wrapper, preloadJS){

    sTabHandler.pageTabGroup[id] = tabGroup.addTab({
        title: title,
        src: global.path.join(appBase, '/views/main-frame/', dir + '.html'),
        visible: true,
        active: true,
        webviewAttributes: {
          nodeintegration: true,
          plugins: true,
          preload: preloadJS ? global.path.join(appBase, '/views/main-frame/', dir + '.controller.js') : ""
        },
        ready: function (tabGroup) {
          let tab = tabGroup.getActiveTab();
          let webview = tab.webview;
          webview.addEventListener('did-finish-load', function () {
            // webview.insertCSS("body::-webkit-scrollbar {width: 3px;height: 2px; background-color: #F5F5F5;}body::-webkit-scrollbar-button {width: 0px;height: 0px;}body::-webkit-scrollbar-thumb {background: #000000; border: 0px none #ffffff;border-radius: 50px;}body::-webkit-scrollbar-thumb:hover {background: #333;}body::-webkit-scrollbar-thumb:active {background: #000000;}body::-webkit-scrollbar-track {background: #666666;border: 0px none #ffffff;border-radius: 50px;}body::-webkit-scrollbar-track:hover {background: #666666;}body::-webkit-scrollbar-track:active {background: #333333;}body::-webkit-scrollbar-corner {background: transparent;}");
            webview.insertCSS("body::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);background-color: #F5F5F5;}body::-webkit-scrollbar-track:hover{cursor:pointer;}body::-webkit-scrollbar{height: 0px;width: 4px;background-color: #F5F5F5;}body::-webkit-scrollbar-thumb{background-color: #000000;cursor: pointer;}")
            webview.openDevTools();
            console.log(tabHandler);
            global.ipcRenderer.send('registerTab', tabHandler);
          });
        }
    });

     sTabHandler.pageTabGroup[id].on("click", function(tab){
        let t = tabHandler.tabGroup.getTab(id);
        t.openChildView();
        t.activate();
     });

    sTabHandler.pageTabGroup[id].on("close", function(tab){
      console.log("tab-close");
      delete sTabHandler.pageTabGroup[id];
      tabHandler.isOpen = false;
      tabHandler.close(true);
      let t  = tabHandler.tabGroup.getActiveTab();
    });

    return sTabHandler;
  }

  function initTiteBars() {
    document.getElementById('min-btn').addEventListener('click', function (e) {
      const window = global.remote.getCurrentWindow();
      window.minimize();
    });

    document.getElementById('max-btn').addEventListener('click', function (e) {
      const window = global.remote.getCurrentWindow();
      if (!window.isMaximized()) {
        window.maximize();
      } else {
        window.unmaximize();
        }
      });

      document.getElementById('close-btn').addEventListener('click', function (e) {
        const window = global.remote.getCurrentWindow();
        window.close();
      });
  };

  // Check for changes on page
  document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
      // initTabs();
      initTiteBars();

      var sideBarElems = ["Consultation", "Appointments", "Waiting Room", "Billing", "Patient Maintenance", "Reports", "Communications", "Settings"];
      // var sideBarElems = ["Consultation", "Appointments", "Waiting Room"];

      // Add sidebar Elements
      for (let el of sideBarElems) {
          sidebarTabHandler.pageTabGroup[el] = sidebarGroup.addElement({
              title: el,
              config: global.path.join(appBase, '/views/main-frame/'+el+'/sidebar.json'),
              visible: true,
              active: false,
              ready: function (tab) {

                let isOpen = tab.isOpen;

                tab.on("click", function(tab){
                  
                  //If tab is not open
                  if(!isOpen){
                    addTab(appBase, tab.id, tab.src, tab.title, tab, tab.tabGroup.component, true);
                    isOpen = tab.isOpen;
                  } else {
                      isOpen = tab.isOpen;
                      
                      if(sTabHandler.pageTabGroup[tab.id]){
                        sTabHandler.pageTabGroup[tab.id].activate();
                      } else {
                        addTab(appBase, tab.id, tab.src, tab.title, tab, tab.tabGroup.component, true);
                      }
                    }
                });
              }
          });

      }

    }
  };

})();

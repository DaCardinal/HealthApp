(function(){
  const global = require('../constants.js');

  var menuToggle = document.getElementsByClassName('menu-toggle');
  var collapseToggle = document.getElementById('collapse-toggle');
  var logoutButton = document.getElementById('lock-toggle');
  var TabGroup = require('electron-tabs');
  var SibeBarJS = require('sidebar-tabs');
  var appBase = global.windowManager.config.appBase;
  var sidebarGroup = new SibeBarJS({ready: function (sidebarGroup) {} });
  var tabGroup = new TabGroup({
      ready: function (tabGroup) {
          global.dragula([tabGroup.tabContainer], {
              direction: 'horizontal'
          });
      }
  });
  var sTabHandler = {
    'mainPage' : 'main-frame',
    'pageTabGroup' : {}
  };

  var sidebarTabHandler = {
    'mainPage' : 'main-frame',
    'pageTabGroup' : {}
  };

  function initTabs(){
    if(sTabHandler.pageTabGroup){
      $('#page-frame-content').remove();
    }
    var title = 'Electron';
    var dir = global.path.parse(global.path.basename(global.windowManager.get('home').content().webContents.getURL())).name;
    var tabHandler = null;
    var wrapper = $('#wrapper');
    // addTab(appBase, 'welcome', dir, title, tabHandler, wrapper, false);

    // Add Sidebar Elements
    // var sideBarElems = ["Settings"];
    var sideBarElems = ["Consultation", "Appointments", "Waiting Room", "Billing", "Patient Maintenance", "Reports", "Communications", "Settings"];

    for (let el of sideBarElems) {
        sidebarTabHandler.pageTabGroup[el] = sidebarGroup.addElement({
            title: el,
            config: global.path.join(appBase, '/views/main-frame/'+el+'/sidebar.json'),
            visible: true,
            active: false,
            ready: function (tab) {}
        });
    }
    console.log(sidebarTabHandler.pageTabGroup);
  }

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
        ready: function (tab) {
          var tab = tabGroup.getActiveTab();
          var webview = tab.webview;
          webview.addEventListener('did-finish-load', function () {
            // webview.insertCSS("body::-webkit-scrollbar {width: 3px;height: 2px; background-color: #F5F5F5;}body::-webkit-scrollbar-button {width: 0px;height: 0px;}body::-webkit-scrollbar-thumb {background: #000000; border: 0px none #ffffff;border-radius: 50px;}body::-webkit-scrollbar-thumb:hover {background: #333;}body::-webkit-scrollbar-thumb:active {background: #000000;}body::-webkit-scrollbar-track {background: #666666;border: 0px none #ffffff;border-radius: 50px;}body::-webkit-scrollbar-track:hover {background: #666666;}body::-webkit-scrollbar-track:active {background: #333333;}body::-webkit-scrollbar-corner {background: transparent;}");
            webview.insertCSS("body::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);background-color: #F5F5F5;}body::-webkit-scrollbar-track:hover{cursor:pointer;}body::-webkit-scrollbar{height: 0px;width: 4px;background-color: #F5F5F5;}body::-webkit-scrollbar-thumb{background-color: #000000;cursor: pointer;}")
            // webview.openDevTools();
          });
        }
    });

     sTabHandler.pageTabGroup[id].on("click", function(tab){
        console.log("Clicked top nav");
        console.log("isOpen: ",title, sTabHandler.pageTabGroup[id]);
     });

    sTabHandler.pageTabGroup[id].on("close", function(tab){
      delete sTabHandler.pageTabGroup[id];
    });

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

  function loadFrameContents(handler){
    var title = $(handler).data('title');
    var id = $(handler)[0].id;
    var dir = global.path.join($(handler).data('url'));
    var tabHandler = $("#"+id)[0];
    var wrapper = $('#wrapper');

    console.log("id: ", id, "title: ", title);
    if(!(id in sTabHandler.pageTabGroup)) {
      addTab(appBase, id, dir, title, tabHandler, wrapper, true);
    } else{
      sTabHandler.pageTabGroup[id].activate();
      sTabHandler.pageTabGroup[id].emitt("active", sTabHandler.pageTabGroup[id]);
    }
  }

  // Check for changes on page
  document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
      // initTabs();
      initTiteBars();

      var sideBarElems = ["Consultation", "Appointments", "Waiting Room", "Billing", "Patient Maintenance", "Reports", "Communications", "Settings"];

      // Add sidebar Elements
      for (let el of sideBarElems) {
          sidebarTabHandler.pageTabGroup[el] = sidebarGroup.addElement({
              title: el,
              config: global.path.join(appBase, '/views/main-frame/'+el+'/sidebar.json'),
              visible: true,
              active: false,
              ready: function (tab) {
                console.log(tab);
                tab.on("click", function(tab){
                  console.log("click");
                  if (!tab.isActiveTab()){
                    addTab(appBase, tab.id, tab.src, tab.title, tab, tab.tabGroup.component, true);
                  }
                });
              }
          });
      }
      
      // Array.from(menuToggle).forEach(function(element) {
      //    element.addEventListener('click', function(event){
      //      event.preventDefault();
      //      loadFrameContents(this);
      //      //global.remote.getCurrentWindow().setHasShadow(true);
      //    });
      //  });
    }
  };

  // MouseClick Listeners
  // collapseToggle.addEventListener('click', function (event) {
  //     event.preventDefault();
  //     var wrapper = $('#wrapper');

  //     wrapper.toggleClass('collapsed-toggle');
  //     global.remote.getCurrentWindow().setHasShadow(true);
  // });

  // // Logout Listeners
  // logoutButton.addEventListener('click', function (event) {
  //     event.preventDefault();
  //     console.log("Loggging out...");
  //     global.ipcRenderer.send('logout-success');
  //     global.remote.getCurrentWindow().setHasShadow(true);
  // });
})();

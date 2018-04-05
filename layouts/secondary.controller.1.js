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
    var sideBarElems = ["Consultation", "Appointments", "Waiting Room", "Billing", "Patient Maintenance", "Reports", "Communications"];

    for (let el of sideBarElems) {
        sidebarTabHandler.pageTabGroup[id] = sidebarGroup.addElement({
            title: el,
            src: global.path.join(appBase, '/views/main-frame/'+ el +'/index.html'),
            config: global.path.join(appBase, '/views/main-frame/'+el+'/sidebar.json'),
            visible: true,
            active: false,
            ready: function (tab) {}
        });
    }

    // sidebarGroup.addElement({
    //     title: "Collapse Panel",
    //     src: global.path.join(appBase, '/views/main-frame/'+ el +'/index.html'),
    //     config: global.path.join(appBase, '/views/main-frame/'+el+'/sidebar.json'),
    //     visible: true,
    //     active: true,
    //     ready: function (tab) {}
    // });
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
          tab.flash();
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
        populateSidebarContents(tabHandler);
     });

    sTabHandler.pageTabGroup[id].on("active", function(tab){
       console.log("Clicked active");
      var nR = navigate(tabHandler, wrapper);
      var pSC = populateSidebarContents(tabHandler);

      if(!nR && !pSC){
        console.log("inside this bish");
        $('.static-sidebar-nav ul > li > a.active').removeClass('active');
        wrapper.toggleClass('toggled');
      }
    });

    sTabHandler.pageTabGroup[id].on("close", function(tab){
      delete sTabHandler.pageTabGroup[id];

      if(!Object.keys(sTabHandler.pageTabGroup).length){
        $('.static-sidebar-nav ul > li > a.active').removeClass('active');
        wrapper.toggleClass('collapsed-toggle');
      }
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

  function navigate(menu, wrapper){

    //If menu is not found return
    if(!menu){
      return false;
    }

    //Set active links
    if(!menu.classList.contains('active')){
      $('.static-sidebar-nav ul > li > a.active').removeClass('active');
      menu.classList.toggle('active');
    }else{
      menu.classList.toggle('active');
    }

    //Toggle hidden menu panel
    if(!wrapper.hasClass('toggled') && !wrapper.hasClass('collapsed-toggle')){
      wrapper.toggleClass('toggled');
    }else if(wrapper.hasClass('collapsed-toggle') && !wrapper.hasClass('toggled')){
      wrapper.removeClass('collapsed-toggle');
      wrapper.toggleClass('toggled');
    }else if(wrapper.hasClass('toggled collapsed-toggle') || wrapper.hasClass('collapsed-toggle toggled')) {
      wrapper.toggleClass('collapsed-toggle');
    }else if(!menu.classList.contains('active')){
      wrapper.removeClass('toggled');
    }else if(menu.classList.contains('active')){
    }else{
      wrapper.toggleClass('toggled');
    }

    return true;
  }

  function populateSidebarContents(handler){

    //Stop if handler is not found
    if(!handler){
      return false;
    }
    var title = $(handler).data('title');
    var id = $(handler)[0].id;
    console.log("parent_url", $(handler).data('parent'));
    var dir = $(handler).data('parent') ? $(handler).data('parent').replace('/index', '') : $(handler).data('url').replace('/index', '');
    var url = global.url.format({
      pathname: global.path.join(appBase, '/views/main-frame/', dir, '/sidebar.html'),
      protocol: 'file:',
      slashes: true
    }).replace('file://', '');
    var urlJson = global.url.format({
      pathname: global.path.join(appBase, '/views/main-frame/', dir, '/sidebar.json'),
      protocol: 'file:',
      slashes: true
    }).replace('file://', '');

    global.fileSystem.readFile(url, 'utf-8', function(error, content){
        if(error){
          console.log('Can not find the he targeted page :' + url);
          return false;
        }

        global.fileSystem.readFile(urlJson, 'utf-8', function(error, jsonContent){
            if(error){
              console.log('Can not find the he targeted page :' + url);
              return false;
            }

            var template = global.handlebars.compile(content);
            var html = template(JSON.parse(jsonContent));
            $('#wrapper .sidebar-wrapper').html(html);

            //Set sidebar listeners
            Array.from($('.sidebar-nav .nav>li')).forEach(function(element){
              element.addEventListener('click', function(event){
                if(!this.classList.contains('active')){
                  $('.sidebar-nav>ul>li.active').removeClass('active');
                  this.classList.toggle('active');
                }
              });
            });

            //Set sidebar inner listeners
            var sidebarInnerItems = document.getElementsByClassName('sidebar-item-toggle');
            Array.from(sidebarInnerItems).forEach(function(element) {
              element.addEventListener('click', function(event){
                event.preventDefault();
                console.log(element);
                loadFrameContents(this);
              });
            });

        });
    });

    return true;
  }

  function loadFrameContents(handler){
    var title = $(handler).data('title');
    var id = $(handler)[0].id;
    var dir = global.path.join($(handler).data('url'));
    var tabHandler = $("#"+id)[0];
    var wrapper = $('#wrapper');

    console.log("id: ", id);
    console.log("title: ", title);
    if(!(id in sTabHandler.pageTabGroup)) {
      console.log("addTab: ");
      addTab(appBase, id, dir, title, tabHandler, wrapper, true);
    }else{
      console.log("dont Add Tab: ");
      navigate(tabHandler, wrapper);
      populateSidebarContents(tabHandler);
      sTabHandler.pageTabGroup[id].activate();
      sTabHandler.pageTabGroup[id].emitt("active", sTabHandler.pageTabGroup[id]);
    }
  }

  function isTabActive(handler){
    var title = $(handler).data('title');
    var id = $(handler)[0].id;
    console.log("isOpen: ",title, sTabHandler.pageTabGroup[id]);
  }

  // Check for changes on page
  document.onreadystatechange = function () {
    if (document.readyState == 'complete') {
      initTabs();
      // initTiteBars();

      // Array.from(menuToggle).forEach(function(element) {
      //    element.addEventListener('click', function(event){
      //      event.preventDefault();
      //      var menuItem = this;
      //      var menuTitle = $(this).data('title');
      //      var wrapper = $('#wrapper');

      //      //Toggle sidebar
      //      navigate(this, wrapper);

      //      //Load sidebarMenu and contents
      //      populateSidebarContents(this);
      //      loadFrameContents(this);
      //     //  isTabActive(this);
           
      //      global.remote.getCurrentWindow().setHasShadow(true);
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

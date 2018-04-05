window.onload = function() {
    const electron = require('electron')
    const global = require('../../../constants.js');
    const TabGroup = require('electron-tabs');
    const SibeBarJS = require('sidebar-tabs');
    const util = require('util');
    const ipcMain = electron.ipcMain;
    const EventEmitter = require('events').EventEmitter;

    //Fix table elements
    tableFix();

    console.log("magic happes");
    electron.remote.ipcMain.on('sidebar-child-clicked', function (event, tab) {
        event.preventDefault();
        console.log(tab);
    });

    function tableFix () {
        // Change the selector if needed
        var $table = $('.table'),
            $bodyCells = $table.find('tbody tr:first').children(),
            colWidth;
        
        //Do for each table
        $table.map(function() {
            var $bd = $(this).find('tbody tr:first').children();
            var l = ((100/$bd.length) - 10).toFixed(2) + '%';

            $(this).find('thead tr').children().each(function(i, v) {
                $(v).width(l);
            });  

            $(this).find('tbody tr').children().each(function(i, v) {
                $(v).width(l);
            }); 
        });
    }
};
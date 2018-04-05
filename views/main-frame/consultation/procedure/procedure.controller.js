window.onload = function() {
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
};
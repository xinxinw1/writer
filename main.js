function openDirectoryMenu() {
    document.createElement('br');

    //var fileList = getFileInfo();

    //Each file consists of a clickable title, and a delete button
    for (var i = 0; i < 5; i++) {

        var tr = document.createElement('tr');
        var td = document.createElement('td');
        var td_del = document.createElement('td');
        var fileName = document.createElement('span');
        var buttonDelete = document.createElement('button');

        fileName.innerHTML = "TEST" + i;
        buttonDelete.innerHTML = "DELETE" + i;

        td.appendChild(fileName);
        td_del.appendChild(buttonDelete);
        tr.appendChild(td);
        tr.appendChild(td_del);

        document.getElementById("fileContainerDiv").appendChild(tr);
    }
}

$(document).ready(function(){
    fadeIn($('#subtitle1'), 1000);
    fadeIn($('#subtitle2'), 1000, 300);
    fadeIn($('#buttons'), 1000, 600);
});

function fadeIn(elem, time, delay){
  if (delay === undefined)delay = 0;
  elem.css({opacity: 0, visibility: "visible"}).delay(delay).animate({opacity: 1}, time);
}

function getFileInfo() {
    var fileList = [];
    var fs = require("fs");
    var path = require("path");

    var p = "./savedDocuments";

    fs.readdir(path, function(p, files) {
        fileList = files;

        console.log(files);
    })
}

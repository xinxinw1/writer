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
    $('#div_with_text').fadeIn(1000);
    $('#div_with_text2').delay(300).fadeIn(1000);
    $('#buttondiv').delay(600).fadeIn(1000);
});

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

function openDirectoryMenu() {
    document.createElement('br');

    //var fileList = getFileInfo();

    //Each file consists of a clickable title, and a delete button
    for (var i = 0; i < 5; i++) {

        var fileDiv = document.createElement('div');
        var fileName = document.createElement('p');
        var buttonDelete = document.createElement('button');

        fileName.innerHTML = "TEST" + i;

        fileDiv.appendChild(fileName);
        fileDiv.appendChild(buttonDelete);

        document.getElementById("fileContainerDiv").appendChild(fileDiv);
    }
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

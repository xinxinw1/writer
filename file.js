var MQ = MathQuill.getInterface(2); // for backcompat
var mathBox = document.getElementById('math-box');

var mathFieldDivs = [];
var mathFieldFields = [];

// binds handler as the first one to be executed
$.fn.bindUp = function (types, fn){
  types = types.split(/\s+/);

  var jelem = this;
  types.forEach(function (type){
    jelem.each(function (i, elem){
      //console.log(elem);
      $(elem).bind(type, fn);
      var evt = $._data(elem, "events")[type];
      //console.log(evt);
      evt.splice(0, 0, evt.pop());
    });
  });
};

function focusLastField() {
  mathFieldFields[mathFieldFields.length - 1].focus();
}

function addMathField(beforeObj){
  var newObj = document.createElement('div');

  newObj.setAttribute("class","math-field");
  if (beforeObj === undefined){
    mathBox.appendChild(newObj);
  } else {
    $(newObj).insertAfter($(beforeObj));
  }
  
  var mathField = MQ.MathField(newObj, {
  });
  mathField.focus();
  if (beforeObj === undefined){
    mathFieldDivs.push(newObj);
    mathFieldFields.push(mathField);
  } else {
    var posBefore = mathFieldDivs.indexOf(beforeObj);
    //console.log(posBefore);
    mathFieldDivs.splice(posBefore+1, 0, newObj);
    mathFieldFields.splice(posBefore+1, 0, mathField);
  }
  document.body.scrollTop = document.body.scrollHeight;
  
  //var cancelKeyUpAndPress = false;
  $(newObj).bindUp("keydown", function (e) {
      // if this function returns, the following var will
      // still be true, so keyup and keypress are cancelled
      //cancelKeyUpAndPress = true;
      //console.log(e.keyCode);
      switch (e.keyCode){
      case 13: // enter
        setTimeout(function (){
            addMathField(newObj);
        }, 1);
        //return false;
        break;
      case 38: // up
        if (mathField.atTopEnd()){
          goToEndBefore(newObj);
          //return false;
        }
        break;
      case 40: // down
        if (mathField.atBottomEnd()){
          goToEndAfter(newObj);
          //return false;
        }
        break;
      case 37: // left
        if (mathField.atLeftEnd() && !mathField.hasSelection()){
          goToEndBefore(newObj);
          //return false;
        }
        break;
      case 39: // right
        if (mathField.atRightEnd() && !mathField.hasSelection()){
          goToStartAfter(newObj);
          //return false;
        }
        break;
      case 8: // backspace
        if (mathField.atLeftEnd() && !mathField.hasSelection()){
          backSpaceLine(newObj);
        }
        break;
      }
      //cancelKeyUpAndPress = false;
  });
  /*$(newObj).bindUp("keyup keypress", function (e) {
    console.log(e);
  })*/
  
  return mathField;
}

function getPosOfDiv(mathFieldDiv){
  return mathFieldDivs.indexOf(mathFieldDiv);
}

function goToEndOf(p){
  setTimeout(function (){
    mathFieldFields[p].moveToRightEnd();
    mathFieldFields[p].focus();
  }, 1);
}

function goToStartOf(p){
  setTimeout(function (){
    mathFieldFields[p].moveToLeftEnd();
    mathFieldFields[p].focus();
  }, 1);
}

function goToEndBefore(mathFieldDiv){
  var p = getPosOfDiv(mathFieldDiv);
  if (p > 0)goToEndOf(p-1);
}

function goToEndAfter(mathFieldDiv){
  var p = getPosOfDiv(mathFieldDiv);
  if (p < mathFieldFields.length-1)goToEndOf(p+1);
}

function goToStartAfter(mathFieldDiv){
  var p = getPosOfDiv(mathFieldDiv);
  if (p < mathFieldFields.length-1)goToStartOf(p+1);
}

function backSpaceLine(mathFieldDiv){
  var p = getPosOfDiv(mathFieldDiv);
  if (p > 0){
    var previousFieldField = mathFieldFields[p-1];
    var text = mathFieldFields[p].latex();
  
    goToEndOf(p-1);
    previousFieldField.write(text);
  
    mathBox.removeChild(mathFieldDiv);
    mathFieldDivs.splice(p, 1);
    mathFieldFields.splice(p, 1);
  }
}


function downloadData(filename, data, mimeType) {
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';
    
    link.download = filename;
    link.href = 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(data);
    link.click(); 
}

$('#downloadLink').click(function(){
  var fileName = getFilename();
	var data = getLatexArr().join("\n");
	downloadData(fileName, data);
	return false;
});

function getLatexArr(){
  return mathFieldFields.map(function(a){
    return a.latex();
  });
}

function getFilename(){
  return document.getElementById("filename").value;
}

// Bind request to the save button
$('#saveLink').click(function (e){
    saveFile();
    return false;
});

function saveFile(){
  var newFilename = getFilename();
  if (newFilename != '') {
      var newLineData = getLatexArr();
      var data = 'data=' + encodeURIComponent(JSON.stringify({
        filename: newFilename,
        lineData: newLineData
      }));
      $.ajax({
          type: "POST",
          url: '/save',
          data: data,
          processData: false,
          success: function(data) {
              console.log(data);
              origLineData = newLineData;
              var filenameChanged = false;
              if (origFilename !== newFilename){
                filenameChanged = true;
              }
              origFilename = newFilename;
              if (filenameChanged)go(newFilename);
              checkEdit();
          },
          error: function(xhr, textStatus, error) {
              console.log(textStatus);
              console.log(error);
          },
          dataType: 'text'
      });
  }
}

function go(filename){
  window.location.assign("?file=" + encodeURIComponent(filename));
}

var hasOrigData = data !== null && data.err === undefined;
var origFilename = hasOrigData?data.filename:"";
var origLineData = hasOrigData?data.lineData:[""];

var origTitle = genTitle(hasOrigData?data.filename:"");
var newTitle = "*" + origTitle;

function genTitle(filename){
  return (filename === "")?"WriTeX":filename + " | WriteX";
}

$(document).keydown(function (e){
  if (e.ctrlKey && e.keyCode == 83){
    saveFile();
    return false;
  }
});

function hasChanges(){
  return !iso(origLineData, getLatexArr()) || origFilename !== getFilename();
}

function checkEdit(){
  //console.log(origLineData);
  //console.log(getLatexArr());
  if (hasChanges()){
    //console.log("changed");
    document.title = newTitle;
    $("#saveLink").css("opacity", "1");
  } else {
    //console.log("not changed");
    document.title = origTitle;
    $("#saveLink").css("opacity", "0.4");
  }
}

function iso(a, b){
  if (a.length !== b.length)return false;
  for (var i = 0; i < a.length; i++){
    if (a[i] !== b[i])return false;
  }
  return true;
}

document.onkeyup = checkEdit;

window.onbeforeunload = function (){
  if (hasChanges())return "Your changes have not been saved.";
};

$(function (){
  if (data === null){
    addMathField();
  } else if (data.err !== undefined){
    console.log(data.err);
    addMathField();
  } else {
    document.getElementById("filename").value = data.filename;
    data.lineData.forEach(function (line){
      addMathField().latex(line);
    });
    checkEdit();
  }
});

/*var mathField = MQ.MathField(mathFieldSpan, {
  spaceBehavesLikeTab: false, // configurable
  handlers: {
    edit: function() { // useful event handlers
      latexSpan.textContent = mathField.latex(); // simple API
    }
  }
});*/
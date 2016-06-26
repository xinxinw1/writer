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
    console.log(posBefore);
    mathFieldDivs.splice(posBefore+1, 0, newObj);
    mathFieldFields.splice(posBefore+1, 0, mathField);
  }
  var cancelKeyUpAndPress = false;
  $(newObj).bindUp("keydown", function (e) {
      // if this function returns, the following var will
      // still be true, so keyup and keypress are cancelled
      cancelKeyUpAndPress = true;
      console.log(e.keyCode);
      switch (e.keyCode){
      case 13: // enter
        addMathField(newObj);
        return false;
      case 38: // up
        if (mathField.atTopEnd()){
          goToEndBefore(newObj);
          return false;
        }
        break;
      case 40: // down
        if (mathField.atBottomEnd()){
          goToEndAfter(newObj);
          return false;
        }
        break;
      case 37: // left
        if (mathField.atLeftEnd() && !mathField.hasSelection()){
          goToEndBefore(newObj);
          return false;
        }
        break;
      case 39: // right
        if (mathField.atRightEnd() && !mathField.hasSelection()){
          goToStartAfter(newObj);
          return false;
        }
        break;
      case 8: // backspace
        if (mathField.atLeftEnd() && !mathField.hasSelection()){
          backSpaceLine(newObj);
          return false;
        }
        break;
      }
      cancelKeyUpAndPress = false;
  });
  $(newObj).bindUp("keyup keypress", function (e) {
    if (cancelKeyUpAndPress)return false;
  });
}

function getPosOfDiv(mathFieldDiv){
  return mathFieldDivs.indexOf(mathFieldDiv);
}

function goToEndOf(p){
  mathFieldFields[p].moveToRightEnd();
  mathFieldFields[p].focus();
}

function goToStartOf(p){
  mathFieldFields[p].moveToLeftEnd();
  mathFieldFields[p].focus();
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

addMathField();

function downloadData(filename, data, mimeType) {
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';
    
    link.download = filename;
    link.href = 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(data);
    link.click(); 
}

$('#downloadLink').click(function(){
  var fileName =  document.getElementById("filename").value;
	var data = mathFieldFields.map(function(a){return a.latex();}).join("\n");
	downloadData(fileName, data);
});

function saveFile(data) {
    $.ajax({
        type: "POST",
        url: 'save',
        data: data,
        success: function() {
            console.log('Data was saved successfully!')
        }
    });
}

$('#saveLink').click(function() {
    var fileName = document.getElementById("filename").value;
    var data = {filename: fileName, lineData: mathFieldFields.map(function(a){return a.latex();})};
    saveFile(data);
});

/*var mathField = MQ.MathField(mathFieldSpan, {
  spaceBehavesLikeTab: false, // configurable
  handlers: {
    edit: function() { // useful event handlers
      latexSpan.textContent = mathField.latex(); // simple API
    }
  }
});*/
$(document).ready(function(){
    fadeIn($('#subtitle1'), 1000);
    fadeIn($('#subtitle2'), 1000, 300);
    fadeIn($('#buttons'), 1000, 600);
    fadeIn($('#files'), 1000, 600);
});

function fadeIn(elem, time, delay){
  if (delay === undefined)delay = 0;
  elem.css({opacity: 0, visibility: "visible"}).delay(delay).animate({opacity: 1}, time);
}

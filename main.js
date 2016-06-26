$(document).ready(function(){
    console.log(document.referrer);
    if (!/(file\.html|index\.html)/.test(document.referrer)){
      fadeIn($('#subtitle1'), 1000);
      fadeIn($('#subtitle2'), 1000, 300);
      fadeIn($('#buttons'), 1000, 600);
      fadeIn($('#files'), 1000, 600);
    }
});

function fadeIn(elem, time, delay){
  if (delay === undefined)delay = 0;
  elem.css({opacity: 0}).delay(delay).animate({opacity: 1}, time);
}

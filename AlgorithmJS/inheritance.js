var myBox = document.querySelector('.box1');
var myBox2 = document.querySelector('.box2');
myBox.addEventListener('mouseenter', function(e){
  console.log('enter');
  this.style.backgroundColor = '#456';
});
myBox.addEventListener('mouseleave', function(e){
  console.log('leave');
  this.style.backgroundColor = '#123';
});

// create two event: touchEnter and touchLeave
var touchEnterEvent = new Event('touchEnter');
var touchLeaveEvent = new Event('touchLeave');


// return an object that has a function which add
// touchEnter and touchLeave events to the node
var touchEnterLeave = function() {
  // check if a given (x, y) is in the box(node)
  var positionInBox = function(x, y, node) {
    var bound = node.getBoundingClientRect();
    return (x < bound.right && x >bound.left && y < bound.bottom && y > bound.top);
  };
  // add touchEnter event to the node
  var addTouchEnterEvent = function(node) {
    document.addEventListener('touchstart', function(e) {
      // loop through all touches
      for(var i = 0; i < e.changedTouches.length; i++) {
        var touch  = e.changedTouches[i];
        // check if any touchstart occurs on the node
        if(positionInBox(touch.pageX, touch.pageY, node)) {
          // push the inBox touch into the array
          node.inBoxTouches.push(touch.identifier);
          // dispatch touchEnter event
          node.dispatchEvent(touchEnterEvent);
        }
      }
    });
    document.addEventListener('touchmove', function(e) {
      // loop through all touches
      for(var i = 0; i < e.changedTouches.length; i++) {
        var touch = e.changedTouches[i];
        // check if any touchmove enters the node
        if(positionInBox(touch.pageX, touch.pageY, node)) {
          // check if the first time this touch move into the node
          if(node.inBoxTouches.indexOf(touch.identifier) === -1) {
            // push the inBox touch into the array
            node.inBoxTouches.push(touch.identifier);
            // dispatch touchEnter event
            node.dispatchEvent(touchEnterEvent);
          }
        }
      }
    });
  };

  // add touchLeave event to the node
  var addTouchLeaveEvent = function(node) {
    document.addEventListener('touchend', function(e) {
      // loop through all touches
      for(var i = 0; i < e.changedTouches.length; i++) {
        var touch = e.changedTouches[i];
        // check if any touchend occurs in the node
        if(positionInBox(touch.pageX, touch.pageY, node)) {
          // if a touchend occurs in the node,
          // this touch be in the inBoxTouches array
          // therefore no need to check if the touch
          // is in the array

          // remove the touch from the array
          node.inBoxTouches = node.inBoxTouches.filter(function(t) {
            return (t !== touch.identifier);
          });
          // dispatch touchLeave event
          node.dispatchEvent(touchLeaveEvent);

        }
      }
    });
    document.addEventListener('touchcancel', function(e) {
      console.log('touch cancelled');
      // loop through all touches
      for(var i = 0; i < e.changedTouches.length; i++) {
        var touch = e.changedTouches[i];
        // check if any touchend occurs in the node
        if(positionInBox(touch.pageX, touch.pageY, node)) {

          if(node.inBoxTouches.indexOf(touch.identifier) !== -1){
            // remove the touch from the array
            node.inBoxTouches = node.inBoxTouches.filter(function(t) {
              return (t !== touch.identifier);
            });
            // dispatch touchLeave event
            node.dispatchEvent(touchLeaveEvent);
          }

        }
      }
    });
    document.addEventListener('touchmove', function(e) {
      // loop through all touches
      for(var i = 0; i < e.changedTouches.length; i++) {
        var touch = e.changedTouches[i];
        // Check if any touchmove leave the node.
        // A touchmove is leaving the node if
        //   1. the touchmove is not in the box
        //   2. the touch is in the array
        if(!positionInBox(touch.pageX, touch.pageY, node)) {
          if(node.inBoxTouches.indexOf(touch.identifier) !== -1){
            // remove the touch from the array
            node.inBoxTouches = node.inBoxTouches.filter(function(t) {
              return (t !== touch.identifier);
            });
            // dispatch touchLeave event
            node.dispatchEvent(touchLeaveEvent);
          }
        }
      }
    });

  };

  return {
    addTouchEnterLeaveEvent: function(nodes) {
      nodes.forEach(function(node){
        // array that records touches that are in the box
        node.inBoxTouches = node.inBoxTouches || [];
        addTouchEnterEvent(node);
        addTouchLeaveEvent(node);
      });
    }
  };
};
touchEnterLeave().addTouchEnterLeaveEvent([myBox, myBox2]);

myBox.addEventListener('touchEnter', function() {
  this.style.backgroundColor = '#F00';
  console.log('touchEnter');
});
myBox.addEventListener('touchLeave', function() {
  this.style.backgroundColor = '#0F0';
  console.log('touchLeave');
});
myBox2.addEventListener('touchEnter', function() {
  this.style.backgroundColor = '#F00';
  console.log('touchEnter');
});
myBox2.addEventListener('touchLeave', function() {
  this.style.backgroundColor = '#0F0';
  console.log('touchLeave');
});

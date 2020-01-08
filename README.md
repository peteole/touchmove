# touchmove
js library for easy but costumizable touch support
Used code from https://developers.google.com/web/fundamentals/design-and-ux/input/touch

## How to use the library
Add the following code to the head of your website:
```html
<script src='https://peteole.github.io/touchmove/touchmove.js'></script>
```
### making objects dragable
If you have a html element el, you can create an Object which is able to handle it's touch features:
```javascript
var el=document.getElementByID("myDiv");
var touchController=new SwipeElementItem(el);
```
Now, the user will be able to move the element with the mouse or via touch. 
### understanding SwipeElementItems
These are the basic attributes a SwipeElementItem has:
```javascript
this.swipeElement = swipeElement; //HTML-Element that is sensive to touch
//current velocity
this.currentVX = 0;
this.currentVY = 0;
// position the element is moved to
this.currentX = 0;
this.currentY = 0;
//action to execute when the element is moved. By default, only the sensitive element is moved due to the curser movement, but you can add any other movements
this.onMove = function (swipeControler = new SwipeElementItem(null)) {
    SwipeElementItem.moveElement(swipeControler.currentX,swipeControler.currentY,swipeControler.swipeElement);
}
```
### How to move elements
With the following (static!!!) method, you can move a html element by the specified pixel values from its normal position:
```javascript
var el=document.getElementByID("myDiv");
var xMovement=10;
var yMovement=-20;
SwipeElementItem.moveElement(xMovement, yMovement, el);
```
### Setting the swipe position without manually
```javascript
touchController.moveElementWithoutTouch(new Point(30, -40));
```
### Sliding to a specified point
slide to (200|400) in 100ms:
```javascript
touchController.slideToPoint(new Point(200,400),100)
```

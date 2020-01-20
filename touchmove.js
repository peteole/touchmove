class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    distanceTo(p=new Point()){
        return Math.sqrt((p.x-this.x)*(p.x-this.x)+(p.y-this.y)*(p.y-this.y));
    }
}
function distance(A,B){
    return Math.sqrt((A.x-B.x)*(A.x-B.x)+(A.y-B.y)*(A.y-B.y));
}
class Mover{
    constructor(element=document.createElement("div"),tarX,tarY,x,y){
        this.tarX=tarX;
        this.tarY=tarY;
        this.x=x;
        this.y=y;
    }
    
}

class SwipeElementItem {
    constructor(swipeElement=document.createElement("div")) {
        this.swipeElement = swipeElement;
        this.rafPending = false;
        this.initialTouchPos = null;
        this.lastTouchPos = null;
        this.lastControlXRest = 0;
        this.lastControlYRest = 0;
        this.currentVX = 0;
        this.currentVY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.sliding=false;
        this.onMove = function (swipeControler = new SwipeElementItem(null)) {
            SwipeElementItem.moveElement(swipeControler.currentX,swipeControler.currentY,swipeControler.swipeElement);
        }
        this.lastMove = new Point(0, 0);
        this.lastUpdate = new Date().getTime();
        this.initialTime=new Date().getTime();
        this.pointToMove = function (point = new Point(0, 0)) {
            return point;
        }
        this.moveToPoint = function (move = new Point(0, 0)) {
            return move;
        }
        this.onMoveEnd = function (swipeControler= new SwipeElementItem(null),mousePosition=new Point(0,0)) {

        }
        this.onMoveStart=function (swipeControler= new SwipeElementItem(null)) {

        }
        if (window.PointerEvent) {
            // Add Pointer Event Listener
            swipeElement.addEventListener('pointerdown', this.handleGestureStart.bind(this), true);
            swipeElement.addEventListener('pointermove', this.handleGestureMove.bind(this), true);
            swipeElement.addEventListener('pointerup', this.handleGestureEnd.bind(this), true);
            swipeElement.addEventListener('pointercancel', this.handleGestureEnd.bind(this), true);
        } else {
            // Add Touch Listener
            swipeElement.addEventListener('touchstart', this.handleGestureStart.bind(this), true);
            swipeElement.addEventListener('touchmove', this.handleGestureMove.bind(this), true);
            swipeElement.addEventListener('touchend', this.handleGestureEnd.bind(this), true);
            swipeElement.addEventListener('touchcancel', this.handleGestureEnd.bind(this), true);

            // Add Mouse Listener
            swipeElement.addEventListener('mousedown', this.handleGestureStart, true);
        }
    }
    disable(){
        if(this.initialTouchPos){
            this.handleGestureEnd();
        }
        if (window.PointerEvent) {
            // Add Pointer Event Listener
            this.swipeElement.removeEventListener('pointerdown', this.handleGestureStart.bind(this), true);
            this.swipeElement.removeEventListener('pointermove', this.handleGestureMove.bind(this), true);
            this.swipeElement.removeEventListener('pointerup', this.handleGestureEnd.bind(this), true);
            this.swipeElement.removeEventListener('pointercancel', this.handleGestureEnd.bind(this), true);
        } else {
            // Add Touch Listener
            this.swipeElement.removeEventListener('touchstart', this.handleGestureStart.bind(this), true);
            this.swipeElement.removeEventListener('touchmove', this.handleGestureMove.bind(this), true);
            this.swipeElement.removeEventListener('touchend', this.handleGestureEnd.bind(this), true);
            this.swipeElement.removeEventListener('touchcancel', this.handleGestureEnd.bind(this), true);

            // Add Mouse Listener
            this.swipeElement.removeEventListener('mousedown', this.handleGestureStart, true);
        }
    }
    abortMove(){
        this.abort=true;
    }
    getTimeStep() {
        var currentTime = new Date().getTime();
        var toReturn = currentTime - this.lastUpdate;
        this.lastUpdate = currentTime;
        return toReturn;
    }
    getTimeMoving(){
        return new Date().getTime()-this.initialTime;
    }
    // Handle the start of gestures
    handleGestureStart(evt) {
        this.initialTime=new Date().getTime();
        this.onMoveStart(this);
        evt.preventDefault();

        if (evt.touches && evt.touches.length > 1) {
            return;
        }
        // Add the move and end listeners
        if (window.PointerEvent) {
            evt.target.setPointerCapture(evt.pointerId);
        } else {
            // Add Mouse Listeners
            document.addEventListener('mousemove', this.handleGestureMove, true);
            document.addEventListener('mouseup', this.handleGestureEnd, true);
        }
        //document.style.touchaction="none";
        this.initialTouchPos = this.getGesturePointFromEvent(evt);
        this.lastTouchPos=this.initialTouchPos;
        if(isNaN(this.lastMove.x)){
            this.lastMove.x=0;
        }
        if(isNaN(this.lastMove.y)){
            this.lastMove.y=0;
        }
        if(isNaN(this.currentX)||isNaN(this.lastControlXRest)){
            this.currentX=0;
            this.currentVX=0;
            this.lastControlXRest=0;
        }
        if(isNaN(this.currentY)||isNaN(this.lastControlYRest)){
            this.currentY=0;
            this.currentVY=0;
            this.lastControlYRest=0;
        }
        this.swipeElement.style.transition = 'initial';
    }
    /* // [END handle-start-gesture] */

    // Handle move gestures
    //
    /* // [START handle-move] */
    handleGestureMove(evt) {
        evt.preventDefault();

        if(this.abort){
            this.handleGestureEnd(evt);
            this.abort=false;
        }
        if (!this.initialTouchPos) {
            //this.handleGestureEnd(evt);
            return;
        }
        this.lastTouchPos = this.getGesturePointFromEvent(evt);
        this.updateV(new Point(this.currentX, this.currentY));

        if (this.rafPending) {
            return;
        }

        this.rafPending = true;

        window.requestAnimationFrame(this.onAnimFrame.bind(this));
    }
    /* // [END handle-move] */

    /* // [START handle-end-gesture] */
    // Handle end gestures
    handleGestureEnd(evt) {
        document.body.style.touchaction="default";
        if(!this.initialTouchPos){
            // Remove Event Listeners
            if (window.PointerEvent) {
                evt.target.releasePointerCapture(evt.pointerId);
            } else {
                // Remove Mouse Listeners
                document.removeEventListener('mousemove', this.handleGestureMove, true);
                document.removeEventListener('mouseup', this.handleGestureEnd, true);
            }
            console.log("Warum????");
            return;
        }
        evt.preventDefault();

        if (evt.touches && evt.touches.length > 0) {
            return;
        }

        this.rafPending = false;

        // Remove Event Listeners
        if (window.PointerEvent) {
            evt.target.releasePointerCapture(evt.pointerId);
        } else {
            // Remove Mouse Listeners
            document.removeEventListener('mousemove', this.handleGestureMove, true);
            document.removeEventListener('mouseup', this.handleGestureEnd, true);
        }
        document.body.style.touchaction="default";
        this.onMoveEnd(this,this.lastTouchPos);
        this.updateSwipeRestPosition();
        this.initialTouchPos = null;
    }
    /* // [END handle-end-gesture] */

    moveElementWithoutTouch(controlPoint = new Point(0, 0), draw=true) {
        var move=this.pointToMove(controlPoint);
        this.lastControlXRest = controlPoint.x;
        this.lastControlYRest = controlPoint.y;
        this.currentX=move.x;
        this.currentY=move.y;
        this.rafPending = false;
        if(draw){
            this.onMove(this);
        }
    }
    moveElementXWithoutTouch(newX=0,draw=true){
        var move=this.pointToMove(new Point(newX,this.lastControlYRest));
        this.lastControlXRest = newX;
        this.currentX=move.x;
        this.currentY=move.y;
        this.rafPending = false;
        if(draw){
            this.onMove(this);
        }
    }
    moveElementYWithoutTouch(newY=0,draw=true){
        var move=this.pointToMove(new Point(this.lastControlXRest,newY));
        this.lastControlYRest = newY;
        this.currentX=move.x;
        this.currentY=move.y;
        this.rafPending = false;
        if(draw){
            this.onMove(this);
        }
    }
    static animateFunction(f=function(tPart=0){},t=100){
        this.timeLimit=new Date().getTime()+t;
        this.t=t;
        this.g=function(){
            var leftTimePart=(this.timeLimit-new Date().getTime())/this.t;
            if(leftTimePart>0){
                f(leftTimePart);
                window.requestAnimationFrame(this.g);
            }else{
                f(0);
            }
        }.bind(this);
        window.requestAnimationFrame(this.g);
    }
    slideToPoint(p=new Point(0,0),t=100){
        this.target=p;
        this.lastFix=new Point(this.currentX,this.currentY);
        var f=function(tPart=0){
            this.moveElementWithoutTouch(new Point(tPart*this.lastFix.x+(1-tPart)*this.target.x,tPart*this.lastFix.y+(1-tPart)*this.target.y));
            if(tPart==0){
                this.sliding=false;
            }
        }.bind(this);
        this.sliding=true;
        SwipeElementItem.animateFunction(f,t);

        //this.abortMove();
    }

    //decelerate from current speed until arriving at specified point
    breakToPoint(p=new Point(0,0),t=100){
        this.target=p;
        this.lastFix=new Point(this.currentX,this.currentY);
        var lastSpeed=Math.sqrt(this.currentVX*this.currentVX+this.currentVY*this.currentVY);
        var dist=this.lastFix.distanceTo(p);
        this.v0=lastSpeed/dist;
        var f=function(tPart=0){
            var sPart=this.v0*tPart+(1-this.v0)*tPart*tPart
            this.moveElementWithoutTouch(new Point(sPart*this.lastFix.x+(1-sPart)*this.target.x,sPart*this.lastFix.y+(1-sPart)*this.target.y));
            if(tPart==0){
                this.sliding=false;
            }
        }.bind(this);
        this.sliding=true;
        SwipeElementItem.animateFunction(f,t);

        //this.abortMove();
    }
    updateSwipeRestPosition() {
        if(this.lastTouchPos==null){
            return;
        }
        var differenceInX = this.initialTouchPos.x - this.lastTouchPos.x;
        this.lastControlXRest = this.lastControlXRest - differenceInX;

        var differenceInY = this.initialTouchPos.y - this.lastTouchPos.y;
        this.lastControlYRest = this.lastControlYRest - differenceInY;
        //this.swipeElement.style.transition = 'all 150ms ease-out';
    }

    getGesturePointFromEvent(evt) {
        var point = {};

        if (evt.targetTouches) {
            point.x = evt.targetTouches[0].clientX;
            point.y = evt.targetTouches[0].clientY;
        } else {
            // Either Mouse event or Pointer Event
            point.x = evt.clientX;
            point.y = evt.clientY;
        }

        return point;
    }

    /* // [START on-anim-frame] */
    onAnimFrame() {
        if (!this.rafPending) {
            return;
        }

        //var differenceInX = this.initialTouchPos.x - this.lastTouchPos.x;
        //var differenceInY = this.initialTouchPos.y - this.lastTouchPos.y;
        this.currentX = this.lastControlXRest - this.initialTouchPos.x + this.lastTouchPos.x;
        this.currentY = this.lastControlYRest - this.initialTouchPos.y + this.lastTouchPos.y;
        var move = this.pointToMove(new Point(this.currentX, this.currentY));
        /*var newXTransform = (move.x) + 'px';
        var newYTransform = (move.y) + 'px';

        var transformStyle = 'translate(' + newXTransform + ", " + newYTransform + ')';
        this.swipeElement.style.webkitTransform = transformStyle;
        this.swipeElement.style.MozTransform = transformStyle;
        this.swipeElement.style.msTransform = transformStyle;
        this.swipeElement.style.transform = transformStyle;*/
        //SwipeElementItem.moveElement(move.x,move.y,this.swipeElement);
        this.onMove(this);
        this.rafPending = false;
    }
    static moveElement(x = 0, y = 0, el) {
        var newXTransform = x + 'px';
        var newYTransform = y + 'px';

        var transformStyle = 'translate(' + newXTransform + ", " + newYTransform + ')';
        el.style.webkitTransform = transformStyle;
        el.style.MozTransform = transformStyle;
        el.style.msTransform = transformStyle;
        el.style.transform = transformStyle;
    }
    static savePosition(toSave=document.createElement("div")){
        var rect=toSave.getBoundingClientRect();
        toSave.oldX=rect.left;
        toSave.oldY=rect.top;
    }
    static slideElement(toSlide=document.createElement("div")){
        //var oldX=toSlide.clientLeft;
        //var oldY=toSlide.clientTop;
        //toSlide.parentElement.removeChild(toSlide);
        //newParent.children.item(childNumber).insertBefore(toSlide);
        var rect=toSlide.getBoundingClientRect();
        
        SwipeElementItem.moveElement(toSlide.oldX-rect.left,toSlide.oldY-rect.top,toSlide);

    }
    updateV(newMove = new Point(0, 0)) {
        var dt = this.getTimeStep();
        if (dt == 0) {
            return;
        }
        this.currentVX = ((newMove.x - this.lastMove.x) / dt);// * (1 - 0*Math.pow(0.99, dt));
        this.currentVY = ((newMove.y - this.lastMove.y) / dt );// * (1 - 0*Math.pow(0.99, dt));
        this.lastMove = newMove;
    }
    /* // [END on-anim-frame] */

    /* // [START addlisteners] */
    // Check if pointer events are supported.

    /* // [END addlisteners] */
}

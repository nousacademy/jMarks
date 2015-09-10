var init = function() {

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var img = document.createElement("img");
    var mouseDown = false;

    var hasText = true;
    var clearCanvas = function() {
        if (hasText) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            hasText = false;
        }
    };


    // Image for loading	
    img.addEventListener("load", function() {
        clearCanvas();
        context.drawImage(img, 0, 0);
    }, false);




    // To enable drag and drop
    canvas.addEventListener("dragover", function(evt) {
        evt.preventDefault();
    }, false);

    // Handle dropped image file - only Firefox and Google Chrome
    canvas.addEventListener("drop", function(evt) {
        var files = evt.dataTransfer.files;
        if (files.length > 0) {
            var file = files[0];
            if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
                var reader = new FileReader();
                // Note: addEventListener doesn't work in Google Chrome for this event
                reader.onload = function(evt) {
                    img.src = evt.target.result;

                };
                reader.readAsDataURL(file);
            }
        }
        evt.preventDefault();
    }, false);
    //test
    var canvasOffset = $("#canvas").offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;

    var startX;
    var startY;
    var isDown = false;

    var pi2 = Math.PI * 2;
    var resizerRadius = 3;
    var rr = resizerRadius * resizerRadius;
    var draggingResizer = {
        x: 0,
        y: 0
    };
    var imageX = 39;
    var imageY = 15;
    var imageWidth, imageHeight, imageRight, imageBottom;
    var draggingImage = false;
    var startX;
    var startY;

    var img = new Image();
    img.onload = function() {
        imageWidth = 165;
        imageHeight = 125;
        imageRight = imageX + imageWidth;
        imageBottom = imageY + imageHeight
        draw(true, false);
    }



    function draw(withAnchors, withBorders) {

        // clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw the image
        context.drawImage(img, 0, 0, img.width, img.height, imageX, imageY, imageWidth, imageHeight);

        // optionally draw the draggable anchors
        /*if (withAnchors) {
            drawDragAnchor(imageX, imageY);
            drawDragAnchor(imageRight, imageY);
            drawDragAnchor(imageRight, imageBottom);
            drawDragAnchor(imageX, imageBottom);
        }*/

        // optionally draw the connecting anchor lines
        if (withBorders) {
            context.beginPath();
            context.moveTo(imageX, imageY);
            context.lineTo(imageRight, imageY);
            context.lineTo(imageRight, imageBottom);
            context.lineTo(imageX, imageBottom);
            context.closePath();
            context.stroke();
        }

    }

    function drawDragAnchor(x, y) {
        context.beginPath();
        context.arc(x, y, resizerRadius, 0, pi2, false);
        context.closePath();
        context.fill();
    }

    function anchorHitTest(x, y) {

        var dx, dy;

        // top-left
        dx = x - imageX;
        dy = y - imageY;
        if (dx * dx + dy * dy <= rr) {
            return (0);
        }
        // top-right
        dx = x - imageRight;
        dy = y - imageY;
        if (dx * dx + dy * dy <= rr) {
            return (1);
        }
        // bottom-right
        dx = x - imageRight;
        dy = y - imageBottom;
        if (dx * dx + dy * dy <= rr) {
            return (2);
        }
        // bottom-left
        dx = x - imageX;
        dy = y - imageBottom;
        if (dx * dx + dy * dy <= rr) {
            return (3);
        }
        return (-1);

    }


    function hitImage(x, y) {
        return (x > imageX && x < imageX + imageWidth && y > imageY && y < imageY + imageHeight);
    }


    function handleMouseDown(e) {
        startX = parseInt(e.clientX - offsetX);
        startY = parseInt(e.clientY - offsetY);
        draggingResizer = anchorHitTest(startX, startY);
        draggingImage = draggingResizer < 0 && hitImage(startX, startY);
    }

    function handleMouseUp(e) {
        draggingResizer = -1;
        draggingImage = false;
        draw(true, false);
    }

    function handleMouseOut(e) {
        handleMouseUp(e);
    }

    function handleMouseMove(e) {

        if (draggingResizer > -1) {

            mouseX = parseInt(e.clientX - offsetX);
            mouseY = parseInt(e.clientY - offsetY);

            // resize the image
            switch (draggingResizer) {
                case 0:
                    //top-left
                    imageX = mouseX;
                    imageWidth = imageRight - mouseX;
                    imageY = mouseY;
                    imageHeight = imageBottom - mouseY;
                    break;
                case 1:
                    //top-right
                    imageY = mouseY;
                    imageWidth = mouseX - imageX;
                    imageHeight = imageBottom - mouseY;
                    break;
                case 2:
                    //bottom-right
                    imageWidth = mouseX - imageX;
                    imageHeight = mouseY - imageY;
                    break;
                case 3:
                    //bottom-left
                    imageX = mouseX;
                    imageWidth = imageRight - mouseX;
                    imageHeight = mouseY - imageY;
                    break;
            }

            if (imageWidth < 25) {
                imageWidth = 25;
            }
            if (imageHeight < 25) {
                imageHeight = 25;
            }

            // set the image right and bottom
            imageRight = imageX + imageWidth;
            imageBottom = imageY + imageHeight;

            // redraw the image with resizing anchors
            draw(true, true);

        } else if (draggingImage) {

            imageClick = false;

            mouseX = parseInt(e.clientX - offsetX);
            mouseY = parseInt(e.clientY - offsetY);

            // move the image by the amount of the latest drag
            var dx = mouseX - startX;
            var dy = mouseY - startY;
            imageX += dx;
            imageY += dy;
            imageRight += dx;
            imageBottom += dy;
            // reset the startXY for next time
            startX = mouseX;
            startY = mouseY;

            // redraw the image with border
            draw(false, true);

        }


    }


    $("#canvas").mousedown(function(e) {
        handleMouseDown(e);
    });
    $("#canvas").mousemove(function(e) {
        handleMouseMove(e);
    });
    $("#canvas").mouseup(function(e) {
        handleMouseUp(e);
    });
    $("#canvas").mouseout(function(e) {
        handleMouseOut(e);
    });
    //test





    // Save image
    /*var saveImage = document.createElement("button");
    saveImage.innerHTML = "Save canvas";
    saveImage.addEventListener("click", function(evt) {
        window.open(canvas.toDataURL("image/png"));
        evt.preventDefault();
    }, false);
    document.getElementById("main-content").appendChild(saveImage);*/

    //test


    //test

};
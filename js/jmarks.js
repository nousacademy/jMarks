 AWS.config.update({
     accessKeyId: "YOUR ACCESS KEY ID",
     secretAccessKey: "YOUR SECRET ACCESS KEY",
     region: 'YOUR REGION'
 });


 var awsGetLoad = new AWS.S3({
     params: {
         Bucket: 'YOUR BUCKET',
         Prefix: 'PATH TO FOLDER',
         Delimiter: '/' // STOP AT PREFIX FOLDER
     }
 });

 function bin2String(array) {
     return String.fromCharCode.apply(String, array);
 }

 awsGetLoad.listObjects(function(err, data) {
     var bookmarks = data.CommonPrefixes;

     var len = bookmarks.length;
     for (var i = 0; i < len; i++) {
         var value = bookmarks[i].Prefix;
         var displayVal = value.split('/')[1];

         $(".list-group").append("<li class='list-group-item' id='getFolder' title='" + value + "'>" + "<span class='glyphicon glyphicon-book'></span>" + displayVal + "</li>");

     }

 });

 $(document).on("click", "#getFolder", function() {

     if ($('.dynamic')) {
         $('.dynamic').remove();
     }

     if ($('.list-group-item:hover').css('margin-left') === '0px') {
         $('.fold').remove();
     }

     var promises = new Array();

     $('.list-group-item').css("background-color", ""); // clear last selected
     //test
     var folder = new AWS.S3({
         params: {
             Bucket: 'xxxxxxxxx',
             Prefix: $('.list-group-item:hover').attr('title'),
             Delimiter: '/'
         }
     });

     folder.listObjects(function(err, data) {
         var folders = data.CommonPrefixes; // folders
         var jsonData = data.Contents; //json data

         var selected = $('.list-group-item:hover').css("background-color", "rgb(0, 196, 255)"); // new selected color

         var parFolder = parseInt($('.list-group-item:hover').css('margin-left'), 10);
         var add = parFolder + 15;
         var subFolder = add.toString() + 'px';

         if (folders.length > 0) {

             for (var k = 0; k < folders.length; k++) {

                 var value = folders[k].Prefix;
                 var displayVal = value.split('/').slice(-2).join("");


                 var book = "<li class='fold list-group-item' id='getFolder' title='" + value + "'>" + "<span class='glyphicon glyphicon-book'></span>" + displayVal + "<span class='glyphicon glyphicon-remove-sign remove'></span>" + "</li>";

                 $(book).insertAfter(".list-group-item:hover").css('margin-left', subFolder);

             }
         }

         if (jsonData.length > 0) {

             for (var i = 0; i < jsonData.length; i++) {
                 //var path = jsonData[i].Key;
                 var s3 = new AWS.S3();
                 (function(i) {

                     s3.getObject({
                         Bucket: 'xxxxxxxxx',
                         Key: jsonData[i].Key
                     }, function(err, data) {
                         console.log(i)
                         var b = new Object();
                         b.path = jsonData[i].Key;
                         b.body = JSON.parse(bin2String(data.Body));




                         var posTop;
                         var posLeft;



                         var fileURL = b.path;

                         $('.description').css('display', 'none');

                         var fileBody = b.body;
                         var website = fileBody.website;
                         var title = fileBody.title;
                         var description = fileBody.description;
                         var created = fileBody.created;
                         var canvasData = fileBody.canvas;

                         if (!fileBody.hasOwnProperty('canvas')) {
                        
                            var canvasData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAA9hAAAPYQGoP6dpAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAAJj0lEQVRoBe1ZWWyU1xWeBbxigiEskkEYZIgKRTFyCbYQfTCliLVC5CUVlQAJKEQ8AC8kL/AAD/BEKAgKEouEEolUxSxGLAHJgrK1BgRBLIKa4NZ2xvaMZ7zO+vf77tzzc+dnHA+2m/aBI52527nnfOfc5b/3jsv1nt5HYEARcA+od/rO1ClsSlgoCJv1/xd5AvZaltVnQLSMF/J9yv4cnhGExzS0Zs2aApSLwJPBEzUzX6TbkLWJfQfkSH87sx85oaGMRPor8FjwJ+DSlStXjp40aVIW8q66urroyZMnfcg+AN8F/wj+B9gPJtGRfk2v/jhAYybwT1GuXLduXcXy5ctHDBs2zJuVlZUYM2aMZ/jw4floc4VCoU6fz5eIRCKejo6O+OnTpwOHDx++jaZr4L+ATUdEN6oHnzh3XZjHTD8DX9i9e3fr/fv3Lb/f34b6MJiUAMfBMc3Ms44UpuyDBw8s9oWOaupCvdKNvKTIDi4pxTNmzCiE2j9t3bq15c6dO0FEtQfGCdRKJBJkkuSdqWqjLCgWBlHHli1bmqHzK62bqAfdCVFYAuXfHjhwIICp0AkQUSLRgBlhG7zOs2xTPB5XAkgTsZjymd0jnZ2d7fv37+dofAumDZLYTJYG8CuKSmbPnl1z7ty5KACEaBnIFCCmJjnLFDXbdTmlDjqD1E0bwJqxE30tYrVgp0+fPvLx48d/Pn/+/O8WL17MWAwFSJfH4+HOYesAMLa53G63KxgMdtTX18ch90F2drbL603GAW2qDwC7uru7I3l5eV0TJ04swMKnQLS6utq1ZMmSqoqKij/eunWLi9vcNKg+Y1LAAIqKv8K08QNMkJFEmhI9KepUtTU1NQWuXLnShO0zuGLFCk6PHuxM1tixY+lAz8aNGxvOnj3bev36dR+WQoR6SdDRhumk1gSKMvp2kDJGD0F6TvqMiwzztIMGEDkmbxHBiyNoNB3kFhrcvn079/4oOAan6jFCTZBTa0grS4hurgnY5HeDOx1JsCRLGfyKx/xAVXOnoDEzwtpor4nDIevevXvN48aNixQXF/sbGhr87JhGH6qU79Hbt2+HaBtMDCTBlCzp3948E+FP9+zZU15aWpoD+SEyf2E7RYmzLI2UByAW4wAeLisrS5SUlFBXnpahH26jP7qoNTJk5syZ2fhOVEBuhZYVTLqYTNI5QEFapeeV8+fPH8kFRiNiDEaSvfHLepYNEKpNZCTFgg8jn8jNzfUgtSPAdpExbdDmggUL+M2ZByYWYnpjGAVSOgekbtb69esrELk2yHEx2UbZ0QRsOqFBUCSFUO8BuzlFUhqMguEMZbzYndrWrl3LUeA5iyTYkqV0FTAiZ5ExONsMHzFiRC5BgaDfbUm0JBVNlGGds17aJUV7ShS1bmmWwKhpRdvEgEYeEtkm2Gx5p0fUb+lj7ywezCCZzb66hz1faTidcWedbSnDjOEfbWYXFBQMQTqLmIgN+ZQAvOUA7Rw9erRgypQp5TkgFNPOPcoNNjmcJ1CumaETJkz4hJi0vb4dgGB2ZWXlSHx4KCzzB/plILSqQUyo24i+aLZGjx7tXbhw4Yeo4Ewg/aQDSRGALioqcmEKcfiEoP9N397yItyfVAJk6uYUGj9+PNWljZ5zCtl2oSwBRXFUvEFtt0KbEbF0hg3RgWQBQWF4a/GK0t4ccOPS4cVhi3LKc4IUoKyUKDEVNp2izLuS6DTsWF1dXe7W1lZuJmkD6XRAhil69+7dUHNzM0dAEZTbW6jU6ZR9FAsASR1yfRYN4CLrJgZiQQXPUSTBqApOB1QljsydOMrWtre3cwjURwzKVQQITgzplPXcXlO2WKXoHX6o1+E4gfIO3QEsfyemdOqcDijvcCYPQLhWT6Ew8gq8ABcnkKrIo53rxR4hBxDbriFv10lGdEuKetqMAAMDeF9jovhPjgAb2YHUcO3atRhGoUcDIkDoV/0FbDeG14e7QnNjYyPP/Ha70mD8oC/P4axRoyVNWrcdfcMWXzO6r169GoFsg5ZXs0H69pbKqHDvOvPs2TOe2WP6rK6Ou+oHlQAdnDNnDi8foWPHjr1GlVwW5D4gorGWlpYfFy1aFMHRIID7gVxJpR1dk8drVMidIwbbHP0qMB/KSIItWUpXgbrEjh07KPgv8A2cy9WrA06TKCJ8xrcANykLYPityIFhdWJVQvgBHsky9eB6mXXhwgXPvHnzIqNGjVILkrpEH+V12aItlKM3b97sQd+/gf+tMfW6ndKISeJpcXl5+a2XL1+qFwhGB8QflcHLQhDXP96cujDd6qSeYQUxkjIS4SNHjtRDLogpx/cjdTmijJDOq35sh80u2kafYjBJMCVLGfyqhQu5z3ft2uXHYqITvKAoB7RBq66urgUyjdu2bfNhvfDmJtOI4qRwbW1tI6Lr37dvX3M0Gm1PVieDQD2iC6nyCLY6du7cyTX1ucYpWHQxs0R5vHnz5lyIf1NVVcV5q4xrQxK+xIsXL/w4t7/atGlT/aVLl3w3btxoxGW9s6amJnDixAm+LLQeP368GQ4GCJ44NVatyg4Mm9thK4g+X2vbRNtr9PvyjKueH7OP5s6d+/WhQ4dmTps2LYbyUBjinOVEpw5+MUMPHz6Mnjp1qhWLOx/PJYVtbW0+9MvDYSwbp9sczO0c3Q9dbJLFQj3RJ0+eeHGRqkUA/oDyM7BgsDu8a0a8X7Bq1aofsDPwSU29UDijiPpoDwgvDhYZ36AIpgw3AfsFD3k76o58+9OnT+OrV6/+AQB/q0GK7XfFnCLPyJBJi5YuXfr95cuXO7ADdQGAvInyScQEhqY3REd1o8gwlSnIN9KuixcvhrDNPqINZSlpU+zqqv4nphOlUPPXvXv38uMlL9IKjEKFH34zyFImVoMFONMwdVAXdYI/1hBNe7pq4AmVqiHFx4u3oy/xavD0zJkz1uvXrxlF2V24CwlzhMhSVjsUZdmHfaHjCXR9oXUSJW1kHPmMBalZEw3IB4WvBb/Hs/ivN2zYMBmpNz8/n1fAWGFhoQfvofnsg9HoDAQCCXzMhmCxR7DYEwcPHvzno0ePatD8DZj/1pBM3cmaPn7744AY4u4hO8gvkf8IXDZ16tTfLFu27IPi4mIPrtTqHot13f7q1asE3kKDz58//w5ytWDuMN+DScRBlsCw7r9ONKjeesQSPvd8ceMZajL4F+AyzcyzbryWQVYdN5QOZJn+z0iB0GeVjEBoWU6XAQMfsAIHYuoTZpNMMbEj007qHd3fF99H4GePwH8A4lbwUg05k84AAAAASUVORK5CYII=";
                         }


                         if (fileBody.hasOwnProperty('description')) {

                             $('.description').css('display', 'block')
                         }

                         if (fileBody.hasOwnProperty('position')) {

                             var posTop = fileBody.position.top;
                             var posLeft = fileBody.position.left;

                             $('dynamic').css({
                                 'top': posTop,
                                 'left': posLeft
                             });



                             $(".static").append('<div class="dynamic col-md-6" style="top:' + posTop + 'px;left:' + posLeft + 'px">' +
                                 '<div class="panel">' +
                                 //'<canvas id="canvas"></canvas>' +
                                 '<img src="' + canvasData + '">' +
                                 '<div class="panel-body">' +
                                 '<a href="' + website + '" target="_blank" class="title" title="Go to ' + website + '">' + title + '</a>' +
                                 '<span class="website-edit"></span>' +
                                 '<div class="description">' + description + '</div>' +
                                 '</div>' +
                                 '<div class="panel-footer">' +
                                 '<span class="glyphicon glyphicon-bookmark" title="' + fileURL + '"></span>' +
                                 '<span class="glyphicon glyphicon-time" title="' + created + '"></span>' +
                                 '<span class="glyphicon glyphicon-edit" title="Edit this bookmark"></span>' +
                                 '<span class="delete glyphicon glyphicon-remove-sign" title="Delete this bookmark"></span>' +
                                 '</div>' +
                                 '</div>' +
                                 '</div>');
                         }









                         if (!fileBody.hasOwnProperty('position')) {
                             $(".static").append('<div class="dynamic col-md-6">' +
                                 '<div class="panel">' +
                                 //'<canvas id="canvas">' +
                                 '<img src="' + canvasData + '">' +
                                 '<div class="panel-body">' +
                                 '<a href="' + website + '" target="_blank" class="title" title="Go to ' + website + '">' + title + '</a>' +
                                 '<span class="website-edit"></span>' +
                                 '<div class="description">' + description + '</div>' +
                                 '</div>' +
                                 '<div class="panel-footer">' +
                                 '<span class="glyphicon glyphicon-bookmark" title="' + fileURL + '"></span>' +
                                 '<span class="glyphicon glyphicon-time" title="' + created + '"></span>' +
                                 '<span class="glyphicon glyphicon-edit" title="Edit this bookmark"></span>' +
                                 '<span class="delete glyphicon glyphicon-remove-sign" title="Delete this bookmark"></span>' +
                                 '</div>' +
                                 '</div>' +
                                 '</div>')

                         }

                         $('.dynamic').draggable({
                             handle: "div",
                             stop: function(event, ui) {

                                 var changedFile = $(this).find('.panel div.panel-footer .glyphicon-bookmark').attr('title');


                                 var pos = ui.position
                                 var title = $(this).find('.panel .panel-body a.title').text();
                                 var description = $(this).find('.panel .panel-body .description').text();
                                 var website = $(this).find('.panel .panel-body a.title').attr('href');
                                 var created = $(this).find('.panel .panel-footer .glyphicon-time').attr('title');
                                 var canvas = $(this).find('.panel img').attr('src');

                                 console.log(created + ' ' + title + ' ' + description + ' ' + canvasData)

                                 var params = {
                                     Bucket: 'YOUR BUCKET',
                                     Key: changedFile,
                                     Body: JSON.stringify({
                                         website: website,
                                         title: title,
                                         description: description,
                                         position: pos,
                                         created: created,
                                         canvas: canvas
                                     })
                                 }

                                 s3.putObject(params, function(err, req) {
                                     if (err) {
                                         console.log(err);

                                     } else {
                                         console.log('succesfully uploaded the data!');
                                     }
                                 });

                                
                             }
                         });

                     });

                 }(i)); // loop over path (closure)

             }
         }

     });
 });





 $(document).on("click", ".glyphicon-edit", function() {


     $('.dynamic').draggable("disable");

     var description = $(this).parent().siblings().children('.description');
     var websiteData = $(this).parent().siblings().children('.website-edit');

     var title = $(this).parent().siblings().children('.title');
     var website = $(this).parent().siblings().children('.title').attr('href');
     var imgBase64 = $(this).parents('.panel').children('img').attr('src');
     var img = $(this).parents('.panel').children('img');
     var edit = $(this);


     edit.replaceWith('<span class="glyphicon glyphicon-ok-sign" title="Save this bookmark"></span>');

     $('.glyphicon-ok-sign').on('click', function() {
         var title = $(this).parents('.panel').children('.panel-body').children('.title-form').children('#title').val();
         var website = $(this).parents('.panel').children('.panel-body').children('.website-form').children('#website').val();
         var description = $(this).parents('.panel').children('.panel-body').children('.description-form').children('#description').val();
         var folder = $(this).siblings('.glyphicon-bookmark').attr('title');
         var created = $(this).siblings('.glyphicon-time').attr('title');
         var canvas = $(this).parents('.panel').children('#canvas');
         var canvasData = canvas[0].toDataURL("image/png");

         var s3 = new AWS.S3();

         var params = {
             Bucket: 'YOUR BUCKET',
             Key: folder,
             Body: JSON.stringify({
                 website: website,
                 title: title,
                 description: description,
                 created: created,
                 canvas: canvasData
             })
         }

         s3.putObject(params, function(err, req) {
             if (err) {
                 console.log(err);

             } else {
                 console.log('succesfully uploaded the data!');
             }
         });
         location.reload();
     });

     description.replaceWith(
         '<div class="description-form form-group">' +
         '<label for="description">Description</label>' +
         '<textarea class="form-control" rows="5" id="description">' +
         description.text() +
         '</textarea>' +
         '</div>');

     title.replaceWith(
         '<div class="title-form form-group">' +
         '<label for="title">Title</label>' +
         '<input type="text" class="form-control" id="title" value="' +
         title.text() +
         '">' +
         '</div>');

     websiteData.replaceWith(
         '<div class="website-form form-group">' +
         '<label for="website">Website URL</label>' +
         '<input type="text" class="form-control" id="website" value="' +
         website +
         '">' +
         '</div>');


     img.replaceWith('<canvas id="canvas"></canvas>')

     init();

 });

 $(document).on('click', '.remove', function() {

     var deleteReq = $('li.list-group-item:hover').attr('title');

     if (confirm('Are you sure you want to delete this Book - ' + deleteReq + ' ?')) {
         var s3 = new AWS.S3();
         var params = {
             Bucket: 'YOUR BUCKET',
             Delete: {
                 Objects: [{
                     Key: deleteReq
                 }]
             }
         }

         s3.deleteObjects(params, function(err, data) {
             if (err) return console.log(err);
         });
         location.reload();
     }
 });

 $(document).on('click', '.delete', function() {
     var bookmark = $(this).siblings('.glyphicon-bookmark').attr('title');
     if (confirm('Are you sure you want to delete Bookmark ' + bookmark + ' ?')) {
         var s3 = new AWS.S3();
         var params = {
             Bucket: 'YOUR BUCKET',
             Delete: {
                 Objects: [{
                     Key: bookmark
                 }]
             }
         }

         s3.deleteObjects(params, function(err, data) {
             if (err) return console.log(err);
         });

         location.reload();
     }
 });

 $(document).on('click', '#topLvlFolder', function() { // works
     var masterFldr = $('#topLevel').val();
     if (confirm('Are you sure you want to create the Book ' + masterFldr + ' ?')) {
         $("li.list-group-item").each(function(index, element) {

             if ($(this).css('background-color') === 'rgb(0, 196, 255)') {


                 var folder = $(this).attr('title');
                 var s3 = new AWS.S3();
                 var params = {
                     Bucket: 'YOUR BUCKET',
                     Key: folder + masterFldr + '/'
                 }

                 s3.putObject(params, function(err, req) {
                     if (err) {
                         console.log(err);
                         console.log('Error uploading data');
                     } else {
                         console.log('succesfully uploaded the folder!');
                     }
                 });

                 location.reload();
             }
         })
     }

 });

 $('.jMarkBtn').on("click", function() {


     $('.add').append('<div class="dynamic col-md-6">' +
         '<div class="panel">' +
         '<canvas id="canvas">Sorry, your browser doesn\'t support the Canvas!</canvas>' +
         '<div class="panel-body">' +
         '<div class="title-form form-group">' +
         '<label for="title">Title</label>' +
         '<input type="text" class="form-control" id="newTitle"' +
         '<div class="website-form form-group">' +
         '<label for="website">Website URL</label>' +
         '<input type="text" class="form-control" id="newWebsite">' +
         '</div>' +
         '<div class="description-form form-group">' +
         '<label for="description">Description</label>' +
         '<textarea class="form-control" rows="5" id="description">' +
         '</textarea>' +
         '</div>' +
         '</div>' +
         '<div class="panel-footer">' +
         '<span class="glyphicon glyphicon-bookmark" title="New Bookmark"></span>' +
         '<span class="glyphicon glyphicon-save-file" title="Save"></span>' +
         '</div>' +
         '</div>'
     )
     init();
 });

 $(document).on("click", ".glyphicon-save-file", function() {
     var canvas = $('.glyphicon-save-file').parents('.panel').children('#canvas')
     var canvasData = canvas[0].toDataURL("image/png");
     var date = new Date();
     var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
     var rndm = Math.floor(Math.random() * 10000000 + 1);

     console.log(canvasData)
     $("li.list-group-item").each(function(index, element) {
         if ($(this).css('background-color') === 'rgb(0, 196, 255)') {


             var folder = $(this).attr('title');

             var s3 = new AWS.S3();
             var params = {
                 Bucket: 'YOUR BUCKET',
                 Key: folder + rndm + '.json',
                 Body: JSON.stringify({
                     website: $('#newWebsite').val(),
                     title: $('#newTitle').val(),
                     description: $('#description').val(),
                     created: 'Bookmark created on ' + months[date.getMonth()] + ',' + date.getDate() + ' ' + date.getFullYear(),
                     canvas: canvasData
                 })
             }

             s3.putObject(params, function(err, req) {
                 if (err) {
                     console.log(err);
                     console.log('Error uploading data');
                 } else {
                     console.log('posted!')
                 }
             });
             location.reload();
         }
     })

 });

 console.log("%cjMarks was written by The Architect.\n%cYou can contact The Architect at thearchitect@nousacademy.com or see more of his work at https://github.com/nousacademy.", "font-size:1.5em;color:#E5C100;", "color:#5C1616;font-size:1em;")
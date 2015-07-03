"use strict";

var description;

$.get("/bookmarkList", function(data) {
    var bookmarks = data.CommonPrefixes;

    var len = bookmarks.length;
    for (var i = 0; i < len; i++) {
        var value = bookmarks[i].Prefix;
        var displayVal = value.split('/')[1];

        $(".list-group").append("<li class='list-group-item' onclick='getFolder()' title='" + value + "'>" + "<span class='glyphicon glyphicon-book'></span>" + displayVal + "</li>");

    }
});



var getFolder = function() {

    if ($('.list-group-item:hover').css('margin-left') === '0px') {
        $('.fold').remove();
    }

    var promises = new Array();

    $('.list-group-item').css("background-color", ""); // clear last selected

    $.get("/folder", {
        folder: $('.list-group-item:hover').attr('title') //.clone().children().text()
    }, function(data) {
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


                var book = "<li class='fold list-group-item' onclick='getFolder()' title='" + value + "'>" + "<span class='glyphicon glyphicon-book'></span>" + displayVal + "<span class='glyphicon glyphicon-remove-sign' onclick='deleteFldr()'></span>" + "</li>"

                $(book).insertAfter(".list-group-item:hover").css('margin-left', subFolder);

            }
        }

        if (jsonData.length > 0) {
            for (var i = 0; i < jsonData.length; i++) {

                var req = $.get('/fldrContents', {
                    contents: jsonData[i].Key
                }, function(data) {
                    //var b = JSON.parse(data.body);
                });

                promises.push(req);

            }
        }

        $.when.apply(null, promises).done(function(d) {

            if ($('.dynamic')) {
                $('.dynamic').remove();
            }
            for (var i = 0; i < promises.length; i++) {

                var posTop;
                var posLeft;

                var z = JSON.parse(promises[i].responseText);
                console.log(z)

                var fileURL = z.path;

                var lastChar = fileURL.charAt(fileURL.length - 1);
                if (lastChar === '/') {
                    continue;
                }
                $('.description').css('display', 'none')

                var fileBody = JSON.parse(z.body);
                var website = fileBody.website;
                var title = fileBody.title;
                var description = fileBody.description;
                var created = fileBody.created;
                var canvasData = fileBody.canvas;

                // console.log(canvasData)

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
                        '<span class="glyphicon glyphicon-edit" title="Edit this bookmark" onclick="edit()"></span>' +
                        '<span class="delete glyphicon glyphicon-remove-sign" title="Delete this bookmark" onclick="deleteBookmark()"></span>' +
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
                        '<span class="glyphicon glyphicon-edit" title="Edit this bookmark" onclick="edit()"></span>' +
                        '<span class="delete glyphicon glyphicon-remove-sign" title="Delete this bookmark" onclick="deleteBookmark()"></span>' +
                        '</div>' +
                        '</div>' +
                        '</div>')

                }

                if (fileBody.hasOwnProperty('canvas')) {






                }



                $('.dynamic').draggable({
                    handle: "div",
                    stop: function(event, ui) {

                        var changedFile = $(this).children('.panel').children('.panel-footer').children('.glyphicon-bookmark').attr('title');

                        var pos = ui.position
                        var title = $(this).children('.panel').children('.panel-body').children('a.title').text();
                        var description = $(this).children('.panel').children('.panel-body').children('.description').text();
                        var website = $(this).children('.panel').children('.panel-body').children('a.title').attr('href');
                        var created = $(this).children('.panel').children('.panel-footer').children('.glyphicon-time').attr('title');
                        var canvas = $(this).children('.panel').children('img').attr('src') // get base64 data
                        //var canvasData = canvas[0].toDataURL("image/png");

                        console.log(created + ' ' + title + ' ' + description + ' ' + canvasData)

                        $.post('/cssPosition', {
                            website: website,
                            title: title,
                            description: description,
                            position: pos,
                            folder: changedFile,
                            created: created,
                            canvas: canvas
                        }, function() {

                        });
                        //location.reload();

                    }
                });



            }


        });


    });
}


var edit = function() {


    $('.dynamic').draggable("disable");



    var description = $('.glyphicon-edit:hover').parent().siblings().children('.description');
    var websiteData = $('.glyphicon-edit:hover').parent().siblings().children('.website-edit');
    var title = $('.glyphicon-edit:hover').parent().siblings().children('.title');
    var website = $('.glyphicon-edit:hover').parent().siblings().children('.title').attr('href');
    var imgBase64 = $('.glyphicon-edit:hover').parents('.panel').children('img').attr('src');
    var img = $('.glyphicon-edit:hover').parents('.panel').children('img');
    var edit = $('.glyphicon-edit:hover');


    edit.replaceWith('<span class="glyphicon glyphicon-ok-sign" title="Save this bookmark" onclick="saveEdit()"></span>');

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







}

var saveEdit = function() {

    var title = $('.glyphicon-ok-sign:hover').parents('.panel').children('.panel-body').children('.title-form').children('#title').val();
    var website = $('.glyphicon-ok-sign:hover').parents('.panel').children('.panel-body').children('.website-form').children('#website').val();
    var description = $('.glyphicon-ok-sign:hover').parents('.panel').children('.panel-body').children('.description-form').children('#description').val();
    var folder = $('.glyphicon-ok-sign:hover').siblings('.glyphicon-bookmark').attr('title');
    var created = $('.glyphicon-ok-sign:hover').siblings('.glyphicon-time').attr('title');
    var canvas = $('.glyphicon-ok-sign:hover').parents('.panel').children('#canvas');
    var canvasData = canvas[0].toDataURL("image/png");



    $.post('/saveEdit', {
        title: title,
        website: website,
        description: description,
        folder: folder,
        created: created,
        canvas: canvasData
    })
    location.reload();
}



var deleteFldr = function() {

    var deleteReq = $('li.list-group-item:hover').attr('title');

    if (confirm('Are you sure you want to delete this Book - ' + deleteReq + ' ?')) {

        $.post('/delete', {
            folder: deleteReq
        }, function(data) {

        });
        //location.reload();
    }
}

var deleteBookmark = function() {
    var bookmark = $('.delete:hover').siblings('.glyphicon-bookmark').attr('title');
    if (confirm('Are you sure you want to delete Bookmark ' + bookmark + ' ?')) {

        $.post('/deleteBookmark', {
            folder: bookmark
        }, function(data) {

        });
        location.reload();
    }
}


var logOut = function() {
    Cookies.remove('jMarks', {
        path: '/'
    });
    $(".contentArea").hide();
    $(".logOut").hide();
    $("#loginModal").show();
}

var topLvlFolder = function() {
    var masterFldr = $('#topLevel').val();
    if (confirm('Are you sure you want to create the Book ' + masterFldr + ' ?')) {
        $("li.list-group-item").each(function(index, element) {

            if ($(this).css('background-color') === 'rgb(0, 196, 255)') {


                var folder = $(this).attr('title');

                $.post('/newFolder', {
                    folder: folder + masterFldr + '/'
                }, function(data) {

                });
                location.reload();
            }
        })
    }

}

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
        '<span class="glyphicon glyphicon-save-file" title="Save" onclick="newBookmark()"></span>' +
        '</div>' +
        '</div>'
    )
    init();
});


var newBookmark = function() {
    var canvas = $('.glyphicon-save-file').parents('.panel').children('#canvas')
    var canvasData = canvas[0].toDataURL("image/png");
    var date = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    console.log(canvasData)
    $("li.list-group-item").each(function(index, element) {
        if ($(this).css('background-color') === 'rgb(0, 196, 255)') {


            var folder = $(this).attr('title');




            $.post('/newBookmark', {
                title: $('#newTitle').val(),
                canvas: canvasData,
                website: $('#newWebsite').val(),
                description: $('#description').val(),
                created: 'Bookmark created on ' + months[date.getMonth()] + ',' + date.getDate() + ' ' + date.getFullYear(),
                folder: folder
            });
            //location.reload();
        }
    })

}



console.log("%cjMarks was written by The Architect.\n%cYou can contact The Architect at thearchitect@nousacademy.com or see more of his work at https://github.com/nousacademy.", "font-size:1.5em;color:#E5C100;", "color:#5C1616;font-size:1em;")
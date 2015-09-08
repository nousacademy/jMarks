# jMarks
Bookmark Chrome Extension using jQuery, Canvas API, &amp; AWS

jMarks uses S3 for storage on AWS & is hosted on AWS using EC2. 
The Canvas API is used for:
- drag and drop (uploading) from desktop to browser
- moving images around once uploaded to the Canvas
(more features will be added)
- All panels are dynamic and can be moved around, and their positions are saved on S3
- using jQueryUI (draggable)
- REST API using AWS's SDK

This was meant to be a Firefox only extension BUT will start out as an extension for Chrome, because Firefox is implementing a new API called WebExtensions which is compatible with the model used by Chrome and Opera—to make it easier to develop extensions across multiple browsers.

In layman's terms I'm not rebuilding this extension over and over.

Firefox will implement the new API on December 15th!

<a href="https://blog.mozilla.org/addons/2015/08/21/the-future-of-developing-firefox-add-ons/">https://blog.mozilla.org/addons/2015/08/21/the-future-of-developing-firefox-add-ons/</a>

(In case your wondering there are over 5,000 bookmarks!!!)

<strong>TODO LIST</strong>

- <b>Delete some bookmarks</b>
- Build Firefox extension to quickly add bookmarks
- Allow multiple images to be dragged to Canvas


<strong>Requested features</strong>

- File an issue at: https://github.com/nousacademy/jMarks/issues

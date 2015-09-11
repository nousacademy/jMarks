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

(In case you're wondering there are over 5,000 bookmarks!!!)

<strong>TODO LIST</strong>

- <b>Delete some bookmarks</b>
- Build Firefox extension to quickly add bookmarks
- Allow multiple images to be dragged to Canvas


<strong>Requested features</strong>

- File an issue at: https://github.com/nousacademy/jMarks/issues

_______________________________________________________________________________________________________________

<h3>Demo</h3>

This extension is configured to work with AWS's Simple Storage Service or S3. In order to run your own version of this extension you'll have to: 

1) Clone this repo
<br>
2) Sign up for AWS S3 at "https://aws.amazon.com/s3/" if you don't already have it
<br>
3) In jmarks.js put your ACCESS KEY ID, SECRET ACCESS KEY, REGION, BUCKET, and Prefix, where applicable (provided by AWS)
<br>
4) Go to "chrome://extensions/" on your Chrome browser
<br>
5) Click "Unload unpacked extension..."
<br>

A tiny "J" logo will appear on the right side of your browser, you can either click it, visit "chrome://bookmarks/", or simply press <code>Command + D</code> and you will now have jMarks running synced with AWS.

AWS offers up to 1TB of data and is free for a year.
Enjoy!

<img src="https://raw.githubusercontent.com/nousacademy/jMarks/master/img/jmarks1.png">
<br>
<img src="https://raw.githubusercontent.com/nousacademy/jMarks/master/img/jmarks2.png">
<br>
<img src="https://raw.githubusercontent.com/nousacademy/jMarks/master/img/jmarks3.png">
<br>
<img src="https://raw.githubusercontent.com/nousacademy/jMarks/master/img/jmarks4.png">
<br>
<img src="https://raw.githubusercontent.com/nousacademy/jMarks/master/img/jmarks5.png">
<br>
<img src="https://raw.githubusercontent.com/nousacademy/jMarks/master/img/jmarks6.png">


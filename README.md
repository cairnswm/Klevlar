# Klevlar

An Object Orientated Front End library for Javascript.

## Usage

Include the Klevlar css and js files in your index.html

```html
	<head>
        <link rel="stylesheet" href="../klevlar.css" />
	</head>
    <script src="../controller.js"></script>
    <script src="../base.js"></script>
```

Create an event handler to execute when the page has loaded
Create a section of the page where Klevlar will be injected

```html
	<body onload="onLoaded()">
        <div id="klevlar" class="row">
        </div>
	</body>
```

Create a new javascript file where we create the page that will be displayed

for example a file called page.js
```javascript
class Example1Page extends Page {
    constructor (elem) {
        super (elem);
        this.addHeader("Hello World")
            .addText("Hello World from ")
            .addText("Klevlar");
    }
}
```

Create an index.js file where the Klevlar will be created

index.js
```javascript
function onLoaded() {
    let Example1 = new Example1Page("klevlar");
    Example1.show();
}
```

include the page.js and index.js files in the html

```html
<html>
	<head>
		<title>Klevlar</title>
        <link rel="stylesheet" href="../klevlar.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
	</head>
	<body onload="onLoaded()">
        <div id="klevlar" class="row">
        </div>
	</body>
    <script src="../zepto.js"></script>
    <script src="../controller.js"></script>
    <script src="../base.js"></script>
    <script src="./js/page.js"></script>
    <script src="./js/index.js"></script>
</html>
```

View the index.html in your browser.








## zepto

Klevlar currently uses Zepto, a light weight plugin to replace the major functions of jQuery.
Zepto will be removed in a future version.
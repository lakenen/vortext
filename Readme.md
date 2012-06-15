# Vortext

Vortext is a jQuery plugin that transforms text when you mouse over!

[Demo](http://lakenen.com/vortext)

## How to use

Include jQuery (I think 1.4+), and jquery.vortext.js in your page.

```html
<div id="example">
	<h4>child elements work too</h4>
	(text...)
</div>
```
```js
$('#example').vortext(); // basic example radius: 100, multiplier: 2, just words

$('#example').vortext({ radius:50, multiply: 5, letters: true });
```

## Issues

* Lots of text can be slow, especially with letters enabled
* Large radii can be slow
* iOS issues... crashing and super-slowness
* Calling vortext again on the same element is probably bad


## License 

(The MIT License)

Copyright 2012 Cameron Lakenen

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# brackets-csv-formatter

_ Current version: _ **1.0.0** (In Development)

## About

As a developer, dealing with CSVs doesn't usually mean opening Excel
(or LibreOffice Sheets, for those open-source gurus out there). Opening 
a CSV is usually done in a Text Editor, then manually searched, edited,
etc... Why not make this massive text document a little bit easier to gloss
over by formatting it like Excel does?

## Development Notes

This extension uses Brackets LanguageManager and CodeMirror to add a new 
language type: _CSV_. In doing this, the editor is able to correctly recognize
the start and end of every 'cell', which can then be stylistically formatted
to look like a simplified Excel sheet.

### Helpful Resources
- [CodeMirror Docs](http://codemirror.net/doc/manual.html)
- [Brackets Docs](http://brackets.io/docs/current/index.html)

## Future Development

This being my first Brackets extension, I know it's not perfect. I don't know all of the 
event handlers or how to use them, and I'm sure the styling could be improved upon. For
this reason, I am defeinitely looking for feedback. Please submit an issue with an appropriate
tag to leave feedback! Or looking to do more, maybe contribute? Make a PR, send me a message, 
whatever! I'm open to all assitance offerable.

## License
MIT License

Copyright (c) 2017 Brandon Groff @EPICmynamesBG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

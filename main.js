define(function (require, exports, module) {
    'use strict';

    var LanguageManager     = brackets.getModule("language/LanguageManager"),
        CodeMirror          = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        MainViewManager     = brackets.getModule("view/MainViewManager"),
        FileUtils           = brackets.getModule("file/FileUtils"),
        DocumentManager     = brackets.getModule("document/DocumentManager"),
        EditorManager       = brackets.getModule("editor/EditorManager"),
        AppInit             = brackets.getModule('utils/AppInit'),
        path                = ExtensionUtils.getModulePath(module);

    //////////////////////////////////////////////////////////////
    //////  Add Language to CodeMirror and Language Manager //////
    //////////////////////////////////////////////////////////////

    ExtensionUtils.addLinkedStyleSheet(path + "csv-styles.css");

    CodeMirror.defineMode("csv", function (cm, mode) {
        return {
            startState: function () {
                return {
                    column: 0
                };
            },
            token: function (stream, state) {
              var classStr = "m-csv column column-" + state.column;
              if (stream.skipTo(',')) { // Cell found on this line
                  stream.next();
                  state.column += 1;
              } else {
                stream.skipToEnd();
                state.column = 0;
              }
              return classStr; // Token style
            }
        };
    });

    LanguageManager.defineLanguage("csv", {
        name: "CSV (Comma-separated Values)",
        mode: "csv",
        fileExtensions: ["csv"]
    }).done(function (language) {
        console.log("Language " + language.getName() + " is now available!");
    });

    ///////////////////////////////////////////////////////////////////////
    //////////       Page Load formatting                        //////////
    ///////////////////////////////////////////////////////////////////////

    $.fn.textWidth = function(){
      var html_org = $(this).html();
      var html_calc = '<span>' + html_org + '</span>';
      $(this).html(html_calc);
      var width = $(this).find('span:first').width();
      $(this).html(html_org);
      return width;
    };

    var cssElement;
    var _saveCssRules = function(ruleMap = {}) {
      var buildInnerHtml = function() {
        var str = '';
        Object.keys(ruleMap).forEach((className) => {
          var width = ruleMap[className];
          str += `${className} { width: ${width + 5}px !important; }\n`;
        });
        return str;
      };

      if (!cssElement) {
        cssElement = document.createElement('style');
        cssElement.setAttribute('id', 'csv-calc-css');
        cssElement.setAttribute('type', 'text/css');
      } else {
        document.head.removeChild(cssElement);
        cssElement = document.createElement('style');
        cssElement.setAttribute('id', 'csv-calc-css');
      }
      cssElement.innerHTML = buildInnerHtml();
      document.head.appendChild(cssElement);
    };

    var _calculateColumnWidths = function() {
      var index = 0;
      var className = '.cm-m-csv.cm-column.cm-column-' + index;
      var currentColumns = $(className);
      var cssColumnMap = {};
      var minWidth = 50;
      while (currentColumns.length > 0) {
        var largestWidth = -1;
        console.log(currentColumns.length);
        currentColumns.each(function () {
          var thisWidth = $(this).textWidth();
          if (thisWidth > largestWidth) {
            largestWidth = thisWidth;
          }
        });
        cssColumnMap[className] = largestWidth > minWidth ? largestWidth : minWidth;

        index++;
        className = '.cm-m-csv.cm-column.cm-column-' + index;
        currentColumns = $(className);
      }
      _saveCssRules(cssColumnMap);
      return;
    };

    var isCSVFile = function() {
      var doc = DocumentManager.getCurrentDocument();
      var ext = doc ? FileUtils.getFileExtension(doc.file.fullPath).toLowerCase() : '';
      return doc && /csv/.test(ext);
    }

    var viewManagerEventHandler = function () {
        if (isCSVFile()) {
          $('.CodeMirror').addClass('csv');
          setTimeout(_calculateColumnWidths, 50);
        } else {
          $('.CodeMirror').removeClass('csv');
        }
        return;
    }

    MainViewManager.on('currentFileChange', viewManagerEventHandler);
    MainViewManager.on('activePaneChange', viewManagerEventHandler);
    MainViewManager.on('paneLayoutChange', viewManagerEventHandler);
    MainViewManager.on('paneCreate', viewManagerEventHandler);
    MainViewManager.on('pandeDestroy', viewManagerEventHandler);

    AppInit.appReady(function() {
      DocumentManager.on('documentSaved', function() {
        if (isCSVFile()) {
          _calculateColumnWidths();
        }
      });
      EditorManager.on('activeEditorChange', function() {
        if (isCSVFile()) {
          _calculateColumnWidths();
        }
      });
    });
});

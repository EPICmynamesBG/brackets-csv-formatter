define(function (require, exports, module) {
    'use strict';

    var LanguageManager     = brackets.getModule("language/LanguageManager"),
        CodeMirror          = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        MainViewManager     = brackets.getModule("view/MainViewManager"),
        FileUtils           = brackets.getModule("file/FileUtils"),
        DocumentManager     = brackets.getModule("document/DocumentManager"),
        AppInit            = brackets.getModule('utils/AppInit'),
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
              var classStr = "column column-" + state.column;
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

    var _calculateColumnWidths = function() {
      var index = 0;
      var currentColumns = $('.cm-m-csv.cm-column.cm-column-' + index);
      while (currentColumns.length > 0) {
        var largestWidth = -1;
        currentColumns.each(function () {
          var thisWidth = $(this).textWidth();
          if (thisWidth > largestWidth) {
            largestWidth = thisWidth;
          }
        });
        currentColumns.width(function(i, w) {
          return largestWidth > w ? largestWidth : w;
        });
        index++;
        currentColumns = $('.cm-m-csv.cm-column.cm-column-' + index);
      }
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
      DocumentManager.on('documentRefreshed', function() {
        if (isCSVFile()) {
          setTimeout(_calculateColumnWidths, 50);
        }
      })
    });
});

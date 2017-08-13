define(function (require, exports, module) {
    'use strict';

    var LanguageManager     = brackets.getModule("language/LanguageManager"),
        CodeMirror          = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        MainViewManager     = brackets.getModule("view/MainViewManager"),
        FileUtils           = brackets.getModule("file/FileUtils"),
        DocumentManager     = brackets.getModule("document/DocumentManager"),
        path                = ExtensionUtils.getModulePath(module);

    ExtensionUtils.addLinkedStyleSheet(path + "csv-styles.css");

    CodeMirror.defineMode("csv", function (cm, mode) {
        return {
            startState: function () {
                return {
                    inColumn: true
                };
            },
            token: function (stream, state) {
                // console.log(stream);
                // let match = stream.match(/^(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g)
                // console.log(match);
                // if (!match) {
                //   return null;
                // } else  {
                //   return 'column';
                // }

                if (!state.inColumn) {
                    stream.next();
                    state.inColumn = true;
                    return null;
                } else {
                    if (stream.skipTo(',')) { // Quote found on this line
                        stream.next();
                        state.inColumn = false; // Clear flag
                    } else {
                        stream.skipToEnd(); // Rest of line is string
                    }
                    return "column"; // Token style
                }
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

    MainViewManager.on("currentFileChange", () => {
        let doc = DocumentManager.getCurrentDocument();
        let ext = doc ? FileUtils.getFileExtension(doc.file.fullPath).toLowerCase() : "";
        if (doc && /csv/.test(ext)) {
            $('.CodeMirror-code').addClass('csv');
        } else {
            $('.CodeMirror-code').removeClass('csv');
        }
    });
});

const go = new Go();
WebAssembly.instantiateStreaming(fetch('tengo.wasm'), go.importObject).then((result) => {
    go.run(result.instance);
});

var editor = ace.edit("editor");
editor.setTheme("ace/theme/tomorrow_night");
editor.session.setMode("ace/mode/golang");
editor.setOptions({
    fontSize: "12px", showPrintMargin: false, highlightActiveLine: false
});

var output = ace.edit("output");
output.setTheme("ace/theme/tomorrow_night");

output.setOptions({
    fontSize: "12px", readOnly: true, // showGutter: false,
    showPrintMargin: false, showLineNumbers: false, highlightActiveLine: false
});

var executing = false;

function capture_output(block) {
    const originalConsoleLog = console.log;
    let output = [];
    console.log = (...args) => {
        output.push(args.map(String).join(' '));
    };

    try {
        block();
    } finally {
        console.log = originalConsoleLog;
    }

    return output.join('\n');
}

function addOutput(t) {
    output.session.setValue(output.session.getValue() + t + "\n");
}

function setOutput(t) {
    output.session.setValue(t);
}


function runCode() {
    const logBackup = console.log;
    const outputLines = [];

    console.log = function () {
        outputLines.push.apply(outputLines, arguments);
        logBackup.apply(console, arguments);
    };

    const code = editor.session.getValue();
    if (executing || _.isEmpty(_.trim(code))) {
        return
    }
    executing = true;

    setOutput("(executing code...)");

    const output = capture_output(() => {
        tengo.run(code);
    });

    setOutput(output);
    addOutput(`\n\n------------------------\nVersion: ${tengo.version}`)

    executing = false;
}


function loadCode() {
    var codeUrl = "sample.tengo";
    console.log("Loading code from " + codeUrl);
    $.ajax(codeUrl).done(function (res) {
        editor.session.setValue(res);
    });
}

editor.commands.addCommand({
    name: "execute", bindKey: {win: "Ctrl+Enter", mac: "Command+Enter"}, exec: runCode,
});

editor.on("change", function () {
    localStorage.setItem("code", editor.session.getValue());
});

$(document).ready(function () {
    loadCode();

    editor.focus();
    editor.navigateFileEnd();

    $("#run-button").click(function (evt) {
        evt.preventDefault();
        runCode();
    });

    var wto;

    document.querySelector("#editor > textarea").onkeyup = function () {
        clearTimeout(wto);
        wto = setTimeout(function () {
            runCode();
        }, 500);
    }
});

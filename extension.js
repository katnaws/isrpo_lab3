const vscode = require('vscode');

function activate(context) {
    let panel;

    const updatePanel = () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
        const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;

        let imageName;
        if (errors === 0) {
            imageName = "0_errors.jpg";
        } else if (errors === 1) {
            imageName = "1_error.jpg";
        } else if (errors === 2) {
            imageName = "2_errors.jpg";
        } else if (errors === 3) {
            imageName = "3_errors.jpg";
        } else if (errors === 4) {
            imageName = "4_errors.jpg";
        } else if (5 <= errors < 10) {
            imageName = "5_to_10_errors.jpg";
        } else {
            imageName = "10_and_more_errors.jpg";
        }

        if (!panel) {
            panel = vscode.window.createWebviewPanel(
                "errorImagePanel",
                "Ошибки",
                vscode.ViewColumn.Beside,
                {
                    localResourceRoots: [
                        vscode.Uri.joinPath(context.extensionUri, 'media')
                    ],
                    enableScripts: false
                }
            );
        }

        const imgUri = panel.webview.asWebviewUri(
            vscode.Uri.joinPath(context.extensionUri, 'media', imageName)
        );

        panel.webview.html = `
            <html>
                <body style="display:flex;align-items:center;justify-content:center;height:100%;background:#222;">
                    <img src="${imgUri}" style="max-width:100%;height:auto;" />
                </body>
            </html>
        `;
    };

    const diagListener = vscode.languages.onDidChangeDiagnostics(updatePanel);
    const changeEditor = vscode.window.onDidChangeActiveTextEditor(updatePanel);

    context.subscriptions.push(diagListener, changeEditor);

    updatePanel();
}

function deactivate() {}

module.exports = { activate, deactivate };

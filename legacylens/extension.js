const vscode = require('vscode');
const { spawn } = require('child_process');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "legacylens" is now active!');

	let helloWorldDisposable = vscode.commands.registerCommand('legacylens.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from LegacyLens!');
	});

	let analyzeDisposable = vscode.commands.registerCommand('legacylens.analyzeCodebase', async function () {
        const folderUri = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false,
            openLabel: 'Select Codebase Folder'
        });

        if (folderUri && folderUri.length > 0) {
            const selectedPath = folderUri[0].fsPath;

            vscode.window.showInformationMessage(`Selected folder: ${selectedPath}. Starting analysis...`);

            const pythonScriptPath = vscode.Uri.joinPath(context.extensionUri, 'analyze.py').fsPath;
            const pythonProcess = spawn('python', [pythonScriptPath, selectedPath]);

            let allOutput = '';
            pythonProcess.stdout.on('data', (data) => {
                allOutput += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                vscode.window.showErrorMessage(`Python Error: ${data.toString()}`);
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    const outputPath = allOutput.trim().split('\n').pop();
                    vscode.window.showInformationMessage(`Analysis complete! Prompts saved to ${outputPath}`);
                } else {
                    vscode.window.showErrorMessage(`Python process exited with code ${code}. Please check the output for errors.`);
                }
            });

        } else {
            vscode.window.showInformationMessage('No folder selected.');
        }
    });

	let visualizeDisposable = vscode.commands.registerCommand('legacylens.visualizeArchitecture', async () => {
    const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: 'Select Codebase Folder'
    });

    if (folderUri && folderUri.length > 0) {
        const selectedPath = folderUri[0].fsPath;

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "LegacyLens: Visualizing architecture...",
            cancellable: false
        }, async (progress) => {
            const pythonScriptPath = vscode.Uri.joinPath(context.extensionUri, 'visualize.py').fsPath;
            const pythonProcess = spawn('python', [pythonScriptPath, selectedPath]);
            let mermaidCode = '';
            let errorOutput = '';

            pythonProcess.stdout.on('data', (data) => {
                mermaidCode += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            await new Promise((resolve) => {
                pythonProcess.on('close', (code) => {
                    if (code === 0 && !errorOutput && mermaidCode) {
                        const panel = vscode.window.createWebviewPanel(
                            'legacyLensArchitecture',
                            'Application Architecture',
                            vscode.ViewColumn.One, {
                                enableScripts: true
                            }
                        );

                        // --- THIS IS THE FINAL FIX ---
                        panel.webview.html = `<!DOCTYPE html>
                        <html>
                        <head>
                            <script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.3/dist/mermaid.min.js"></script>
                            <style>
                                body, html {
                                    margin: 0;
                                    padding: 0;
                                    width: 100%;
                                    height: 100%;
                                }
                                .zoom-controls {
                                    position: fixed;
                                    top: 10px;
                                    right: 10px;
                                    z-index: 1000;
                                    background-color: var(--vscode-editor-background);
                                    padding: 5px;
                                    border-radius: 5px;
                                }
                                .zoom-controls button {
                                    padding: 5px 10px;
                                    margin-left: 5px;
                                }
                                .scroll-container {
                                    width: 100%;
                                    height: 100%;
                                    overflow: auto;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                }
                                .mermaid-diagram {
                                    /* The scaling happens on this div */
                                    transform-origin: center;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="zoom-controls">
                                <button id="zoomIn">Zoom In</button>
                                <button id="zoomOut">Zoom Out</button>
                            </div>
                            <div class="scroll-container">
                                <div class="mermaid-diagram">
                                    <div class="mermaid">
                                        ${mermaidCode}
                                    </div>
                                </div>
                            </div>
                            <script>
                                const zoomInButton = document.getElementById('zoomIn');
                                const zoomOutButton = document.getElementById('zoomOut');
                                const mermaidDiagram = document.querySelector('.mermaid-diagram');
                                let currentScale = 1.0;
                                const scaleStep = 0.1;

                                zoomInButton.addEventListener('click', () => {
                                    currentScale += scaleStep;
                                    mermaidDiagram.style.transform = \`scale(\${currentScale})\`;
                                });

                                zoomOutButton.addEventListener('click', () => {
                                    currentScale -= scaleStep;
                                    if (currentScale < 0.1) {
                                        currentScale = 0.1;
                                    }
                                    mermaidDiagram.style.transform = \`scale(\${currentScale})\`;
                                });

                                // Initial render
                                mermaid.initialize({ startOnLoad: true });
                            </script>
                        </body>
                        </html>`;
                        // --- END OF FIX ---

                        vscode.window.showInformationMessage('Architecture diagram created successfully!');
                    } else {
                        vscode.window.showErrorMessage(`Visualization failed: ${errorOutput}`);
                    }
                    resolve();
                });
            });
        });

    } else {
        vscode.window.showInformationMessage('No folder selected.');
    }
});

let generateTestsDisposable = vscode.commands.registerCommand('legacylens.generateTests', async () => {
    const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: 'Select Codebase Folder'
    });

    if (folderUri && folderUri.length > 0) {
        const selectedPath = folderUri[0].fsPath;

        const python2ExecutablePath = 'C:\\Python27\\python.exe'; // <-- Replace with your path

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "LegacyLens: Generating unit tests...",
            cancellable: false
        }, async (progress) => {
            const pythonScriptPath = vscode.Uri.joinPath(context.extensionUri, 'test_gen.py').fsPath;
            const pythonProcess = spawn(python2ExecutablePath, [pythonScriptPath, selectedPath]);
            let outputMessage = '';
            let errorOutput = '';

            pythonProcess.stdout.on('data', (data) => {
                outputMessage += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            await new Promise((resolve) => {
                pythonProcess.on('close', (code) => {
                    if (code === 0 && !errorOutput) {
                        // Display the detailed success message with the path
                        vscode.window.showInformationMessage(`Generated tests successfully! ${outputMessage}`);
                    } else {
                        vscode.window.showErrorMessage(`Test generation failed: ${errorOutput}`);
                    }
                    resolve();
                });
            });
        });

    } else {
        vscode.window.showInformationMessage('No folder selected.');
    }
});

	context.subscriptions.push(helloWorldDisposable);
	context.subscriptions.push(analyzeDisposable);
	context.subscriptions.push(visualizeDisposable);
	context.subscriptions.push(generateTestsDisposable);
}

function getWebviewContent(mermaidJsUri, mermaidDiagram) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>LegacyLens Architecture</title>
            <script src="${mermaidJsUri}"></script>
            <style>
                body {
                    background-color: var(--vscode-editor-background);
                    color: var(--vscode-editor-foreground);
                }
            </style>
        </head>
        <body>
            <h1>Application Architecture</h1>
            <div class="mermaid">
                ${mermaidDiagram}
            </div>
            <script>
                window.addEventListener('load', () => {
                    mermaid.init();
                });
            </script>
        </body>
        </html>
    `;
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
import * as vscode from "vscode";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "initialize": {
          await vscode.commands.executeCommand("uitoolkit-essentials.initialize");
          break;
        }
        case "openDocs": {
          vscode.env.openExternal(
            vscode.Uri.parse("https://docs.latin-tools.com/es/ui-toolkit-extension/")
          );
          break;
        }
        case "reportIssue": {
          vscode.env.openExternal(
            vscode.Uri.parse("https://github.com/Latin-Tools-Git/uitoolkit-essentials/issues")
          );
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const logoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "src", "imgs", "app-logo.webp")
    );

    const lang = vscode.env.language.toLowerCase();
    const isEs = lang.startsWith('es');

    const i18n = {
        description: isEs 
            ? "Gestiona el formato de tus archivos UXML y USS. Inicializa scripts fácilmente para proyectos de Unity UI Toolkit." 
            : "Manage your UXML & USS formatting. Initialize scripts easily when working with Unity UI Toolkit projects.",
        btnInit: isEs ? "▶ Inicializar Scripts" : "▶ Initialize Scripts",
        shortcutHint: isEs 
            ? `O usa <span class="key">Ctrl</span>+<span class="key">Shift</span>+<span class="key">P</span> &rarr; "Format Document"`
            : `Or use <span class="key">Ctrl</span>+<span class="key">Shift</span>+<span class="key">P</span> &rarr; "Format Document"`,
        quickLinks: isEs ? "Enlaces Rápidos" : "Quick Links",
        btnDocs: isEs ? "📖 Documentación" : "📖 Documentation",
        btnIssue: isEs ? "🐛 Reportar Problema" : "🐛 Report Issue",
        tips: isEs ? "Consejos" : "Tips",
        tip1: isEs 
            ? "Los scripts a veces requieren inicialización al abrir un nuevo proyecto." 
            : "Scripts sometimes require initialization when opening a new project.",
        tip2: isEs 
            ? "Haz clic derecho dentro de archivos .uxml o .uss para formatear rápidamente." 
            : "Right-click inside .uxml or .uss files to format quickly.",
        jsInitText: isEs ? "⏳ Inicializando..." : "⏳ Initializing...",
        jsCompleteText: isEs ? "✅ ¡Scripts Iniciados!" : "✅ Scripts Started!"
    };

    return `<!DOCTYPE html>
<html lang="${isEs ? 'es' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UIToolkit Essentials</title>
    <style>
        :root {
            --primary-bg: var(--vscode-sideBar-background);
            --secondary-bg: var(--vscode-editor-background);
            --accent-color: var(--vscode-button-background);
            --accent-hover: var(--vscode-button-hoverBackground);
            --text-main: var(--vscode-foreground);
            --text-muted: var(--vscode-descriptionForeground);
            --border-color: var(--vscode-widget-border);
        }

        body {
            font-family: var(--vscode-font-family);
            background-color: var(--primary-bg);
            color: var(--text-main);
            margin: 0;
            padding: 20px 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 25px;
            text-align: center;
            animation: fadeIn 0.5s ease-out;
            width: 100%;
        }

        .logo-container {
            width: 140px;
            height: 140px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .logo-container:hover {
            transform: scale(1.05);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }

        .logo-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 20px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }

        .logo-icon {
            width: 40px;
            height: 40px;
            object-fit: contain;
        }

        .title {
            font-size: 1.2em;
            font-weight: 600;
            margin: 0;
            letter-spacing: 0.5px;
        }

        .version {
            background: rgba(255, 255, 255, 0.1);
            color: #ffd666;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.75em;
            margin-top: 8px;
            font-weight: bold;
        }

        .description {
            color: var(--text-muted);
            font-size: 0.9em;
            text-align: center;
            margin-bottom: 25px;
            line-height: 1.5;
            animation: slideUp 0.6s ease-out;
        }

        .primary-action {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            width: 100%;
            font-size: 1em;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.2s ease;
            margin-bottom: 15px;
            position: relative;
            overflow: hidden;
        }

        .primary-action:hover {
            background-color: var(--vscode-button-hoverBackground);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .primary-action:active {
            transform: translateY(0);
        }

        .shortcut-hint {
            font-size: 0.8em;
            color: var(--text-muted);
            margin-bottom: 30px;
            text-align: center;
            display: flex;
            align-items: center;
            gap: 6px;
            justify-content: center;
        }

        .key {
            background: rgba(128, 128, 128, 0.2);
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid rgba(128, 128, 128, 0.3);
            font-family: monospace;
            font-size: 0.9em;
        }

        .section-title {
            align-self: flex-start;
            font-size: 0.75em;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-muted);
            margin-bottom: 10px;
            font-weight: 600;
        }

        .quick-links {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 30px;
        }

        .link-btn {
            background-color: var(--secondary-bg);
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9em;
            transition: background 0.2s ease, border-color 0.2s ease;
        }

        .link-btn:hover {
            background-color: rgba(255, 255, 255, 0.05);
            border-color: var(--text-muted);
        }

        .tips-box {
            background-color: var(--secondary-bg);
            border-left: 3px solid #ffcc00;
            border-radius: 6px;
            padding: 15px;
            width: calc(100% - 30px);
            font-size: 0.85em;
            color: var(--text-muted);
            position: relative;
            overflow: hidden;
        }

        .tips-title {
            font-weight: 600;
            color: var(--text-main);
            margin-bottom: 10px;
            display: block;
        }

        .tip-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 8px;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-container">
            <img src="${logoUri}" alt="TL Logo" class="logo-image" onerror="this.outerHTML='<div style=\\'color:white;font-weight:bold;font-size:32px;\\'>TL</div>'" />
        </div>
        <h1 class="title">UIToolkit Essentials</h1>
        <span class="version">v0.0.4</span>
    </div>

    <p class="description">
        ${i18n.description}
    </p>

    <button class="primary-action" id="initBtn">
        ${i18n.btnInit}
    </button>

    <div class="shortcut-hint">
        ${i18n.shortcutHint}
    </div>

    <div class="section-title">${i18n.quickLinks}</div>
    <div class="quick-links">
        <button class="link-btn" id="docsBtn">
            ${i18n.btnDocs}
        </button>
        <button class="link-btn" id="issueBtn">
            ${i18n.btnIssue}
        </button>
    </div>

    <div class="tips-box">
        <span class="tips-title">${i18n.tips}</span>
        <div class="tip-item">
            <span>💡</span>
            <span>${i18n.tip1}</span>
        </div>
        <div class="tip-item">
            <span>💡</span>
            <span>${i18n.tip2}</span>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        document.getElementById("initBtn").addEventListener("click", () => {
            const btn = document.getElementById("initBtn");
            btn.innerHTML = "${i18n.jsInitText}";
            setTimeout(() => {
                 vscode.postMessage({ type: "initialize" });
                 btn.innerHTML = "${i18n.jsCompleteText}";
                 setTimeout(() => { btn.innerHTML = "${i18n.btnInit}"; }, 2000);
            }, 300);
        });

        document.getElementById("docsBtn").addEventListener("click", () => {
            vscode.postMessage({ type: "openDocs" });
        });

        document.getElementById("issueBtn").addEventListener("click", () => {
            vscode.postMessage({ type: "reportIssue" });
        });
    </script>
</body>
</html>`;
  }
}

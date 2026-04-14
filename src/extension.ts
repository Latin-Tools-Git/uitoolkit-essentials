import * as vscode from "vscode";
import { UXMLFormatter, UXMLRangeFormatter } from "./formatters/uxmlFormatter";
import { USSFormatter, USSRangeFormatter } from "./formatters/ussFormatter";
import { SidebarProvider } from "./webview/SidebarProvider";

export function activate(context: vscode.ExtensionContext) {

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  const isEs = vscode.env.language.toLowerCase().startsWith("es");

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "uitoolkit-essentials-sidebar",
      sidebarProvider
    )
  );

  // Define document selectors
  const uxmlSelector: vscode.DocumentSelector = [
    { language: "uxml" },
    { language: "xml", pattern: "**/*.uxml" },
    { scheme: "file", pattern: "**/*.uxml" }
  ];

  const ussSelector: vscode.DocumentSelector = [
    { language: "uss" },
    { language: "css", pattern: "**/*.uss" },
    { scheme: "file", pattern: "**/*.uss" }
  ];

  // Register UXML formatters
  const uxmlFormatter =
    vscode.languages.registerDocumentFormattingEditProvider(
      uxmlSelector,
      new UXMLFormatter()
    );

  const uxmlRangeFormatter =
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      uxmlSelector,
      new UXMLRangeFormatter()
    );

  // Register USS formatters
  const ussFormatter = vscode.languages.registerDocumentFormattingEditProvider(
    ussSelector,
    new USSFormatter()
  );

  const ussRangeFormatter =
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      ussSelector,
      new USSRangeFormatter()
    );

  // Register format UXML command
  const formatUXMLCommand = vscode.commands.registerCommand(
    "uitoolkit-essentials.formatUXML",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage(isEs ? "❌ No se ha encontrado ningún editor activo para formatear." : "❌ No active editor was found to format.");
        return;
      }

      if (!editor.document.fileName.endsWith(".uxml")) {
        vscode.window.showWarningMessage(
          isEs ? "⚠️ Este comando de formateo es exclusivo para archivos .uxml" : "⚠️ This formatting command is exclusive to .uxml files"
        );
        return;
      }

      await vscode.commands.executeCommand("editor.action.formatDocument");
      vscode.window.showInformationMessage(isEs ? "✨ ¡Tu archivo UXML ha sido formateado con éxito!" : "✨ Your UXML file has been successfully formatted!");
    }
  );

  // Register format USS command
  const formatUSSCommand = vscode.commands.registerCommand(
    "uitoolkit-essentials.formatUSS",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage(isEs ? "❌ No se ha encontrado ningún editor activo para formatear." : "❌ No active editor was found to format.");
        return;
      }

      if (!editor.document.fileName.endsWith(".uss")) {
        vscode.window.showWarningMessage(
          isEs ? "⚠️ Este comando de formateo es exclusivo para archivos .uss" : "⚠️ This formatting command is exclusive to .uss files"
        );
        return;
      }

      await vscode.commands.executeCommand("editor.action.formatDocument");
      vscode.window.showInformationMessage(isEs ? "🎨 ¡Tu archivo USS ha sido formateado con estilo!" : "🎨 Your USS file has been stylishly formatted!");
    }
  );

  // Register initialize command
  const initCommand = vscode.commands.registerCommand(
    "uitoolkit-essentials.initialize",
    () => {
      vscode.window.showInformationMessage(
        isEs 
          ? "🚀 ¡UIToolkit Essentials ha inicializado tus scripts correctamente!"
          : "🚀 UIToolkit Essentials has successfully initialized your scripts!"
      );
    }
  );

  // Add all disposables to subscriptions
  context.subscriptions.push(
    uxmlFormatter,
    uxmlRangeFormatter,
    ussFormatter,
    ussRangeFormatter,
    formatUXMLCommand,
    formatUSSCommand,
    initCommand
  );

  // Show normal welcome message
  vscode.window.showInformationMessage(
    isEs 
      ? "🛠️ ¡UIToolkit Essentials está listo para potenciar tu desarrollo UI!"
      : "🛠️ UIToolkit Essentials is ready to boost your UI development!"
  );
}

export function deactivate() {}

import * as vscode from "vscode";
import { UXMLFormatter, UXMLRangeFormatter } from "./formatters/uxmlFormatter";
import { USSFormatter, USSRangeFormatter } from "./formatters/ussFormatter";

export function activate(context: vscode.ExtensionContext) {
  console.log("UIToolkit Essentials extension is now active!");

  // Register UXML formatter for multiple language IDs
  const uxmlFormatter1 =
    vscode.languages.registerDocumentFormattingEditProvider(
      { language: "xml", pattern: "**/*.uxml" },
      new UXMLFormatter()
    );

  const uxmlFormatter2 =
    vscode.languages.registerDocumentFormattingEditProvider(
      { language: "uxml" },
      new UXMLFormatter()
    );

  const uxmlFormatter3 =
    vscode.languages.registerDocumentFormattingEditProvider(
      { scheme: "file", pattern: "**/*.uxml" },
      new UXMLFormatter()
    );

  const uxmlRangeFormatter1 =
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      { language: "xml", pattern: "**/*.uxml" },
      new UXMLRangeFormatter()
    );

  const uxmlRangeFormatter2 =
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      { language: "uxml" },
      new UXMLRangeFormatter()
    );

  const uxmlRangeFormatter3 =
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      { scheme: "file", pattern: "**/*.uxml" },
      new UXMLRangeFormatter()
    );

  // Register USS formatter for multiple language IDs
  const ussFormatter1 = vscode.languages.registerDocumentFormattingEditProvider(
    { language: "css", pattern: "**/*.uss" },
    new USSFormatter()
  );

  const ussFormatter2 = vscode.languages.registerDocumentFormattingEditProvider(
    { language: "uss" },
    new USSFormatter()
  );

  const ussFormatter3 = vscode.languages.registerDocumentFormattingEditProvider(
    { scheme: "file", pattern: "**/*.uss" },
    new USSFormatter()
  );

  const ussRangeFormatter1 =
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      { language: "css", pattern: "**/*.uss" },
      new USSRangeFormatter()
    );

  const ussRangeFormatter2 =
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      { language: "uss" },
      new USSRangeFormatter()
    );

  const ussRangeFormatter3 =
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      { scheme: "file", pattern: "**/*.uss" },
      new USSRangeFormatter()
    );

  // Register format UXML command
  const formatUXMLCommand = vscode.commands.registerCommand(
    "uitoolkit-essentials.formatUXML",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      if (!editor.document.fileName.endsWith(".uxml")) {
        vscode.window.showWarningMessage(
          "This command only works with .uxml files"
        );
        return;
      }

      await vscode.commands.executeCommand("editor.action.formatDocument");
      vscode.window.showInformationMessage("UXML formatted successfully!");
    }
  );

  // Register format USS command
  const formatUSSCommand = vscode.commands.registerCommand(
    "uitoolkit-essentials.formatUSS",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      if (!editor.document.fileName.endsWith(".uss")) {
        vscode.window.showWarningMessage(
          "This command only works with .uss files"
        );
        return;
      }

      await vscode.commands.executeCommand("editor.action.formatDocument");
      vscode.window.showInformationMessage("USS formatted successfully!");
    }
  );

  // Add all disposables to subscriptions
  context.subscriptions.push(
    uxmlFormatter1,
    uxmlFormatter2,
    uxmlFormatter3,
    uxmlRangeFormatter1,
    uxmlRangeFormatter2,
    uxmlRangeFormatter3,
    ussFormatter1,
    ussFormatter2,
    ussFormatter3,
    ussRangeFormatter1,
    ussRangeFormatter2,
    ussRangeFormatter3,
    formatUXMLCommand,
    formatUSSCommand
  );

  // Show welcome message
  vscode.window.showInformationMessage(
    "🛠️ UIToolkit Essentials is ready! Format your .uxml and .uss files."
  );
}

export function deactivate() {}

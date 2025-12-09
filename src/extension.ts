import * as vscode from "vscode";
import { UXMLFormatter, UXMLRangeFormatter } from "./formatters/uxmlFormatter";
import { USSFormatter, USSRangeFormatter } from "./formatters/ussFormatter";

export function activate(context: vscode.ExtensionContext) {
  console.log("UIToolkit Essentials extension is now active!");

  // Register UXML formatter
  const uxmlFormatter = vscode.languages.registerDocumentFormattingEditProvider(
    { language: "xml", pattern: "**/*.uxml" },
    new UXMLFormatter()
  );

  const uxmlRangeFormatter =
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      { language: "xml", pattern: "**/*.uxml" },
      new UXMLRangeFormatter()
    );

  // Register USS formatter
  const ussFormatter = vscode.languages.registerDocumentFormattingEditProvider(
    { language: "css", pattern: "**/*.uss" },
    new USSFormatter()
  );

  const ussRangeFormatter =
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      { language: "css", pattern: "**/*.uss" },
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
    uxmlFormatter,
    uxmlRangeFormatter,
    ussFormatter,
    ussRangeFormatter,
    formatUXMLCommand,
    formatUSSCommand
  );

  // Show welcome message
  vscode.window.showInformationMessage(
    "UIToolkit Essentials is ready! Format your .uxml and .uss files."
  );
}

export function deactivate() {}

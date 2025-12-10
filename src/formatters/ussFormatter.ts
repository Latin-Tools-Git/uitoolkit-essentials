import * as vscode from "vscode";

/**
 * USS Formatter - Formats Unity Style Sheets (similar to CSS)
 * USS uses CSS-like syntax for styling Unity UI Toolkit elements
 */
export class USSFormatter implements vscode.DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions
  ): vscode.TextEdit[] {
    const text = document.getText();
    const formatted = this.formatUSS(text, options);

    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length)
    );

    return [vscode.TextEdit.replace(fullRange, formatted)];
  }

  private formatUSS(css: string, options: vscode.FormattingOptions): string {
    try {
      const indentChar = options.insertSpaces
        ? " ".repeat(options.tabSize)
        : "\t";
      let formatted = "";
      let indent = 0;

      // Remove extra whitespace and normalize line endings
      css = css.trim().replace(/\r\n/g, "\n");

      // Split into tokens while preserving comments
      const lines: string[] = [];
      let buffer = "";
      let inComment = false;
      let inString = false;
      let stringChar = "";

      for (let i = 0; i < css.length; i++) {
        const char = css[i];
        const nextChar = css[i + 1];

        // Handle string literals
        if ((char === '"' || char === "'") && !inComment) {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar && css[i - 1] !== "\\") {
            inString = false;
          }
          buffer += char;
          continue;
        }

        if (inString) {
          buffer += char;
          continue;
        }

        // Handle multi-line comments
        if (char === "/" && nextChar === "*" && !inComment) {
          // Flush buffer before comment
          if (buffer.trim()) {
            lines.push(buffer);
            buffer = "";
          }
          inComment = true;
          buffer += char;
          continue;
        }

        if (char === "*" && nextChar === "/" && inComment) {
          buffer += char + nextChar;
          i++; // Skip next char
          inComment = false;
          // End of comment - push it
          lines.push(buffer);
          buffer = "";
          continue;
        }

        if (inComment) {
          buffer += char;
          continue;
        }

        // Handle structural characters
        if (char === "{") {
          buffer += char;
          lines.push(buffer);
          buffer = "";
          continue;
        }

        if (char === "}") {
          if (buffer.trim()) {
            lines.push(buffer);
            buffer = "";
          }
          lines.push("}");
          continue;
        }

        if (char === ";") {
          buffer += char;
          lines.push(buffer);
          buffer = "";
          continue;
        }

        // Skip standalone newlines and carriage returns
        if (char === "\n" || char === "\r") {
          if (buffer.trim()) {
            lines.push(buffer);
            buffer = "";
          }
          continue;
        }

        buffer += char;
      }

      // Add remaining buffer
      if (buffer.trim()) {
        lines.push(buffer);
      }

      // Format each line
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) {
          continue;
        }

        const isComment = line.startsWith("/*");
        const isClosingBrace = line === "}";
        const isOpeningBrace = line.endsWith("{");
        const isProperty = line.endsWith(";");

        // Adjust indent for closing braces
        if (isClosingBrace) {
          indent = Math.max(0, indent - 1);
        }

        // Add the line with proper indentation
        if (isComment) {
          // Comments at current indent level
          formatted += indentChar.repeat(indent) + line + "\n";
        } else if (isClosingBrace) {
          formatted += indentChar.repeat(indent) + line + "\n\n";
        } else if (isOpeningBrace) {
          formatted += indentChar.repeat(indent) + line + "\n";
          indent++;
        } else if (isProperty) {
          formatted += indentChar.repeat(indent) + line + "\n";
        } else {
          // Selector or other
          formatted += indentChar.repeat(indent) + line + "\n";
        }
      }

      // Clean up excessive newlines
      formatted = formatted.replace(/\n{3,}/g, "\n\n");
      formatted = formatted.trim() + "\n";

      return formatted;
    } catch (error) {
      console.error("Error formatting USS:", error);
      return css;
    }
  }
}

/**
 * USS Range Formatter - Formats selected range in USS files
 */
export class USSRangeFormatter
  implements vscode.DocumentRangeFormattingEditProvider
{
  provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range,
    options: vscode.FormattingOptions
  ): vscode.TextEdit[] {
    const text = document.getText(range);
    const formatter = new USSFormatter();
    const formatted = formatter["formatUSS"](text, options);

    return [vscode.TextEdit.replace(range, formatted)];
  }
}

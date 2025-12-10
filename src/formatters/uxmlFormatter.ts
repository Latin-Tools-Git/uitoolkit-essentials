import * as vscode from "vscode";

/**
 * UXML Formatter - Formats Unity UI Toolkit UXML files
 * UXML is XML-based.
 */
export class UXMLFormatter implements vscode.DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions
  ): vscode.TextEdit[] {
    const text = document.getText();
    const formatted = this.formatUXML(text, options);

    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length)
    );

    return [vscode.TextEdit.replace(fullRange, formatted)];
  }

  private formatUXML(xml: string, options: vscode.FormattingOptions): string {
    try {
      // Remove extra whitespace and normalize line endings
      xml = xml.trim().replace(/\r\n/g, "\n");

      const indentChar = options.insertSpaces
        ? " ".repeat(options.tabSize)
        : "\t";
      let formatted = "";
      let indent = 0;

      // Split by tags while preserving content
      const tokens: string[] = [];
      let buffer = "";
      let inTag = false;
      let inComment = false;

      for (let i = 0; i < xml.length; i++) {
        const char = xml[i];
        const peek = xml.substring(i, i + 4);

        // Handle comments
        if (peek === "<!--") {
          if (buffer.trim()) {
            tokens.push(buffer);
            buffer = "";
          }
          inComment = true;
          buffer += char;
          continue;
        }

        if (inComment) {
          buffer += char;
          if (xml.substring(i - 2, i + 1) === "-->") {
            inComment = false;
            tokens.push(buffer);
            buffer = "";
          }
          continue;
        }

        // Handle tags
        if (char === "<" && !inTag) {
          if (buffer.trim()) {
            tokens.push(buffer);
          }
          buffer = char;
          inTag = true;
          continue;
        }

        if (char === ">" && inTag) {
          buffer += char;
          tokens.push(buffer);
          buffer = "";
          inTag = false;
          continue;
        }

        buffer += char;
      }

      if (buffer.trim()) {
        tokens.push(buffer);
      }

      // Format tokens
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i].trim();
        if (!token) {
          continue;
        }

        const isComment = token.startsWith("<!--");
        const isDeclaration = token.startsWith("<?");
        const isClosingTag = token.match(/^<\/[\w:-]+>/);
        const isSelfClosing = token.match(/\/\s*>$/);
        const isOpeningTag =
          token.startsWith("<") &&
          !isClosingTag &&
          !isSelfClosing &&
          !isComment &&
          !isDeclaration;
        const isTextContent = !token.startsWith("<");

        // Adjust indent for closing tags before printing
        if (isClosingTag) {
          indent = Math.max(0, indent - 1);
        }

        // Add indentation and content
        if (isDeclaration) {
          // XML declarations at the start, no indent
          formatted += token + "\n";
        } else if (isComment) {
          // Comments at current indent level
          formatted += indentChar.repeat(indent) + token + "\n";
        } else if (isTextContent) {
          // Text content (usually not in UXML, but handle it)
          const trimmedContent = token.trim();
          if (trimmedContent) {
            formatted += indentChar.repeat(indent) + trimmedContent + "\n";
          }
        } else {
          // Regular tags
          formatted += indentChar.repeat(indent) + token + "\n";
        }

        // Adjust indent after opening tags
        if (isOpeningTag) {
          indent++;
        }
      }

      // Clean up excessive newlines
      formatted = formatted.replace(/\n{3,}/g, "\n\n");
      formatted = formatted.trim() + "\n";

      return formatted;
    } catch (error) {
      console.error("Error formatting UXML:", error);
      return xml;
    }
  }
}

/**
 * UXML Range Formatter - Formats selected range in UXML files
 */
export class UXMLRangeFormatter
  implements vscode.DocumentRangeFormattingEditProvider
{
  provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range,
    options: vscode.FormattingOptions
  ): vscode.TextEdit[] {
    const text = document.getText(range);
    const formatter = new UXMLFormatter();
    const formatted = formatter["formatUXML"](text, options);

    return [vscode.TextEdit.replace(range, formatted)];
  }
}

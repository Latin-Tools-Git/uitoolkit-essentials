import * as vscode from 'vscode';

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
            // Remove extra whitespace and newlines
            xml = xml.trim();

            const indentChar = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
            let formatted = '';
            let indent = 0;
            let inTag = false;
            let inClosingTag = false;
            let inSelfClosingTag = false;

            // Parse XML and format
            const lines = xml.split(/>\s*</);

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();

                // Add back the angle brackets
                if (i > 0) {
                    line = '<' + line;
                }
                if (i < lines.length - 1) {
                    line = line + '>';
                }

                // Check if it's a closing tag
                const isClosingTag = line.match(/^<\/\w+/);
                const isSelfClosing = line.match(/\/>\s*$/);
                const isOpeningTag = line.match(/^<\w+/) && !isSelfClosing;
                const isComment = line.match(/^<!--/);
                const isDeclaration = line.match(/^<\?/);

                // Adjust indent for closing tags
                if (isClosingTag) {
                    indent = Math.max(0, indent - 1);
                }

                // Add indentation
                if (!isDeclaration) {
                    formatted += indentChar.repeat(indent);
                }
                formatted += line;

                // Don't add newline after XML declaration if it's on the same line as root
                if (i < lines.length - 1) {
                    formatted += '\n';
                }

                // Adjust indent for next line
                if (isOpeningTag && !isSelfClosing) {
                    indent++;
                }
            }

            // Clean up extra newlines
            formatted = formatted.replace(/\n{3,}/g, '\n\n');

            return formatted;
        } catch (error) {
            console.error('Error formatting UXML:', error);
            return xml;
        }
    }
}

/**
 * UXML Range Formatter - Formats selected range in UXML files
 */
export class UXMLRangeFormatter implements vscode.DocumentRangeFormattingEditProvider {

    provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range,
        options: vscode.FormattingOptions
    ): vscode.TextEdit[] {
        const text = document.getText(range);
        const formatter = new UXMLFormatter();
        const formatted = formatter['formatUXML'](text, options);

        return [vscode.TextEdit.replace(range, formatted)];
    }
}

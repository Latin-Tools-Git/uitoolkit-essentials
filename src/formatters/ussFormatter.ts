import * as vscode from 'vscode';

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
            const indentChar = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
            let formatted = '';
            let indent = 0;
            let inComment = false;
            let buffer = '';

            // Remove extra whitespace
            css = css.trim();

            for (let i = 0; i < css.length; i++) {
                const char = css[i];
                const nextChar = css[i + 1];
                const prevChar = css[i - 1];

                // Handle comments
                if (char === '/' && nextChar === '*' && !inComment) {
                    inComment = true;
                    buffer += char;
                    continue;
                }

                if (char === '*' && nextChar === '/' && inComment) {
                    inComment = false;
                    buffer += char;
                    continue;
                }

                if (inComment) {
                    buffer += char;
                    continue;
                }

                // Handle opening brace
                if (char === '{') {
                    buffer = buffer.trim();
                    if (buffer) {
                        formatted += indentChar.repeat(indent) + buffer + ' {\n';
                        buffer = '';
                    }
                    indent++;
                    continue;
                }

                // Handle closing brace
                if (char === '}') {
                    buffer = buffer.trim();
                    if (buffer) {
                        formatted += indentChar.repeat(indent) + buffer + '\n';
                        buffer = '';
                    }
                    indent = Math.max(0, indent - 1);
                    formatted += indentChar.repeat(indent) + '}\n\n';
                    continue;
                }

                // Handle semicolon
                if (char === ';') {
                    buffer = buffer.trim();
                    if (buffer) {
                        formatted += indentChar.repeat(indent) + buffer + ';\n';
                        buffer = '';
                    }
                    continue;
                }

                // Handle newlines in buffer
                if (char === '\n' || char === '\r') {
                    const trimmedBuffer = buffer.trim();
                    if (trimmedBuffer && indent === 0) {
                        // Selector outside braces
                        formatted += trimmedBuffer + '\n';
                        buffer = '';
                    }
                    continue;
                }

                buffer += char;
            }

            // Handle remaining buffer
            buffer = buffer.trim();
            if (buffer) {
                formatted += indentChar.repeat(indent) + buffer + '\n';
            }

            // Clean up excessive newlines
            formatted = formatted.replace(/\n{3,}/g, '\n\n');
            formatted = formatted.trim() + '\n';

            return formatted;
        } catch (error) {
            console.error('Error formatting USS:', error);
            return css;
        }
    }
}

/**
 * USS Range Formatter - Formats selected range in USS files
 */
export class USSRangeFormatter implements vscode.DocumentRangeFormattingEditProvider {

    provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range,
        options: vscode.FormattingOptions
    ): vscode.TextEdit[] {
        const text = document.getText(range);
        const formatter = new USSFormatter();
        const formatted = formatter['formatUSS'](text, options);

        return [vscode.TextEdit.replace(range, formatted)];
    }
}

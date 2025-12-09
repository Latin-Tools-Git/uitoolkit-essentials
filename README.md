# UIToolkit Essentials

**Smart snippets and automatic formatting for Unity UI Toolkit (UXML & USS)**

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/latin-tools/uitoolkit-essentials)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Streamline your Unity UI Toolkit development workflow with intelligent code formatting and comprehensive snippets for UXML and USS files.

---

## ✨ Features

### 🎨 **Automatic Formatting**
- **UXML Formatter**: Clean and properly indent your Unity UI Toolkit XML files
- **USS Formatter**: Format Unity Style Sheets with consistent spacing and structure
- **Format on Save**: Optional automatic formatting when you save files
- **Customizable Indentation**: Configure tab size and spacing preferences

### ⚡ **Smart Snippets**

#### UXML Snippets (20+ components)
Quickly insert UI elements with intelligent placeholders:

- `uxml-template` - Complete UXML file template
- `ve` - VisualElement
- `button` - Button
- `label` - Label
- `textfield` - TextField
- `toggle` - Toggle
- `slider` - Slider
- `scrollview` - ScrollView
- `listview` - ListView
- `image` - Image
- `dropdown` - DropdownField
- `foldout` - Foldout
- `groupbox` - GroupBox
- `radio` - RadioButton
- `radiogroup` - RadioButtonGroup
- `vec2` - Vector2Field
- `vec3` - Vector3Field
- `color` - ColorField
- `progress` - ProgressBar
- And many more...

#### USS Snippets (40+ properties)
Accelerate styling with ready-to-use USS properties:

- `class` - Class selector
- `name` - Name selector (#)
- `type` - Type selector
- `flex-direction` - Flex direction with options
- `align-items` - Align items with options
- `justify-content` - Justify content with options
- `bg-color` - Background color
- `bg-image` - Background image
- `width` / `height` - Dimensions
- `margin` / `padding` - Spacing
- `border` - Border properties
- `position` - Positioning
- And many more...

---

### Usage

#### Formatting Files

**Option 1: Keyboard Shortcut**
- Open a `.uxml` or `.uss` file
- Press `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (Mac)

**Option 2: Command Palette**
- Press `Ctrl+Shift+P` / `Cmd+Shift+P`
- Type "Format Document"
- Select `Format UXML Document` or `Format USS Document`

**Option 3: Format on Save**
Enable automatic formatting in your settings:
```json
{
  "uitoolkit-essentials.formatOnSave": true
}
```

#### Using Snippets

1. Create or open a `.uxml` or `.uss` file
2. Start typing a snippet prefix (e.g., `button`, `class`)
3. Press `Tab` to expand the snippet
4. Navigate through placeholders with `Tab`

---

## ⚙️ Configuration

Customize UIToolkit Essentials in your VS Code settings:

```json
{
  // Number of spaces for UXML indentation
  "uitoolkit-essentials.uxml.indentSize": 4,
  
  // Number of spaces for USS indentation
  "uitoolkit-essentials.uss.indentSize": 4,
  
  // Automatically format files on save
  "uitoolkit-essentials.formatOnSave": false
}
```

### Setting Default Formatter

If you have multiple formatters installed, set UIToolkit Essentials as the default for UXML and USS files:

1. Open a `.uxml` file
2. Press `Ctrl+Shift+P` / `Cmd+Shift+P`
3. Type "Format Document With..."
4. Select "Configure Default Formatter..."
5. Choose "UIToolkit Essentials"

Repeat for `.uss` files.

---

## 🐛 Known Issues

- First-time setup may require manually selecting UIToolkit Essentials as the default formatter
- Some complex UXML structures may require manual formatting adjustments

Report issues on [GitHub Issues](https://github.com/Latin-Tools-Git/uitoolkit-essentials/issues).

---

## 🤝 Contributing

Contributions are greatly appreciated. Please fork the repository and submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Enjoy faster Unity UI Toolkit development!** 🚀
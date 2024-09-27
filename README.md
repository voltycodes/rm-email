# rm-email Extension

`rm-email` is a simple Chrome extension designed to hide email addresses on web pages by replacing them with custom text. You can also specify any text that will replace the email addresses found on the page.

## Features
- Automatically scans web pages for email addresses and replaces them.
- Customizable replacement text.
- Stores replacement text using Chrome's sync storage, allowing it to persist across sessions and devices.

## Installation

1. **Clone or Download the Extension**:
   - Clone this repository:  
     ```bash
     git clone https://github.com/yourusername/rm-email.git
     ```
   - Or download the ZIP file and extract it to your preferred location.

2. **Load the Extension in Chrome**:
   - Open your browser and go to `browser://extensions/` (eg: `chrome://extensions/`).
   - Enable **Developer mode** (toggle in the top-right corner).
   - Click on **Load unpacked** and select the folder where you cloned or extracted the extension.

3. The `rm-email` extension is now loaded into your Chrome browser.

## How to Use

1. **Open the Extension Popup**:
   - Click on the extension icon (you may need to pin it from the extensions list).

2. **Change Default Replacement Text**:
   - Enter the text you want to replace email addresses with in the input field.
   - Click the **Set Replacement** button.

3. **Email Replacement**:
   - When you visit any webpage, the extension will automatically find and replace email addresses with your custom text, e.g., replacing `[REDACTED]` with `dwight@schrutefarms.com` if that's your preference.

## Development

If you wish to modify or extend the extension, follow these steps:

1. After making changes to the source code, reload the extension:
   - Open `chrome://extensions/`.
   - Click the **Reload** button next to the `rm-email` extension.

2. **Testing**:
   - Open any webpage containing email addresses to test if they are correctly replaced by your custom text.

## Notes

- **Sync Storage**: The extension uses `chrome.storage.sync` to store the replacement text, meaning the same setting will be available across any Chrome browser where you're logged in.
- **Mutation Observer**: The extension continuously monitors changes to the webpage to ensure that dynamically loaded content (like new emails) is also processed.

## License

This project is licensed under the MIT License.

## Contributing

Feel free to submit a pull request or report an issue. Contributions are welcome!

# Smart Basic & Scientific Calculator

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)](https://andercmd.github.io/Calculadora/)

A premium, highly secure, and visually stunning web calculator application. It features a seamless switch between **Basic Mode** (arithmetic) and **Scientific Mode** (advanced operations) wrapped in a modern glassmorphic interface with micro-interactions.

Designed with a clean, senior-level software architecture, it completely decouples mathematical evaluation from the presentation layer and avoids insecure code evaluation methods.

---

## 🌟 Key Features

- **Dual Modes:** Dynamically toggle between Basic (4 columns) and Scientific (6 columns) panels with responsive sliding layouts.
- **Secure Calculations:** Evaluates input strings using a custom-built, sandboxed token parser (completely avoids `eval()` or `new Function()`).
- **Scientific Operations:** Built-in support for trigonometric (`sin`, `cos`, `tan`), logarithmic (`ln`, `log`), power (`^`), square root (`√`), factorial (`!`), constants (`π`, `e`), and nested parentheses.
- **Keyboard Support:** Full mapping for standard keyboard keys, backspaces, clear inputs (`Esc`), and calculations (`Enter` or `=`).
- **Responsive Layout:** Responsive scaling optimized for desktop viewports, mobile screens, and tablet devices.
- **Advanced SEO & Accessibility:** Includes Open Graph metadata, Structured Data JSON-LD schemas, proper semantic nodes, page headings, and `aria-label` tags for screen readers.

---

## 🛠️ Software Architecture

This application conforms to modern frontend standards:

```
├── index.html                  # Main semantic document with SEO metadata & JSON-LD
├── CSS/
│   └── Inicio.css              # Glassmorphic style sheet with animations and theme variables
└── JavaScript/
    ├── Calculadora.js          # Entry module initializing the UI controller
    └── modules/
        ├── calculator-engine.js # Pure math engine (Tokenizer + Recursive Descent Parser)
        └── calculator-ui.js     # DOM controller, Event delegation, & Keyboard listener
```

### 1. The Parser Engine (`calculator-engine.js`)
Instead of using unsafe JavaScript evaluation functions, we parse mathematical expressions using a **Recursive Descent Parser** structure. The parser works in two main phases:
1. **Tokenization:** Converts the raw input string (e.g. `5+sin(π)`) into an array of typed tokens (`number`, `operator`, `function`, `parenthesis`). Handles implicit multiplication such as `2(3)` -> `2*(3)`.
2. **Grammar Evaluation:** Parses arithmetic operations according to mathematical operator precedence:
   - $Expression \rightarrow Term \ ((\text{`+`} \mid \text{`-`}) \ Term)*$
   - $Term \rightarrow Power \ ((\text{`*`} \mid \text{`/`}) \ Power)*$
   - $Power \rightarrow Factor \ (\text{`^`} \ Power)*$
   - $Factor \rightarrow Primary \ [\text{`!`}]?$
   - $Primary \rightarrow \text{Number} \mid \text{`(`} \ Expression \ \text{`)`} \mid \text{Function}\text{`(`} \ Expression \ \text{`)`} \mid \text{`-`} \ Primary$

### 2. The Presentation Layer (`calculator-ui.js`)
Uses **Event Delegation** on the keypad layouts to capture click events from buttons using semantic HTML `data-val` and `data-action` attributes. It binds global listeners for physical keyboard input, manages state transitions, and updates the DOM displays.

---

## 🚀 Getting Started

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/AnderCMD/Calculadora.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Calculadora
   ```
3. Since the project uses **ES6 modules** (`type="module"`), opening the file directly using the `file://` protocol may cause CORS restrictions in some browsers. It is recommended to serve the folder using a local web server:
   - **Using VS Code Live Server Extension:** Right-click `index.html` and select **Open with Live Server**.
   - **Using Python:** Run `python3 -m http.server 8000` in the directory, then open `http://localhost:8000`.
   - **Using Node (npx):** Run `npx serve` and open the local address.

---

## 📦 Deployment on GitHub Pages

The application is fully compatible with static hosting servers and is currently deployed on GitHub Pages. To deploy your own copy:

1. Push the main branch to GitHub.
2. In the repository settings on GitHub, navigate to **Pages** (under the "Code and automation" section).
3. Set the source to **Deploy from a branch** and select the `main` branch and `/ (root)` folder.
4. Save and copy the live URL provided.

---

## ✒️ Author

* **Ander González** - *Software Architect / Engineer* - [AnderCMD](https://github.com/AnderCMD)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

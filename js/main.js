/**
 * Main Application Entry Point
 * Bootstraps the Calculator User Interface module.
 */

import { CalculatorUI } from './modules/calculator-ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new CalculatorUI();
    app.init();
});
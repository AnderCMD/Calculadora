import { CalculatorEngine } from './calculator-engine.js';

export class CalculatorUI {
    constructor() {
        this.expression = '';
        this.isResultDisplayed = false;
        
        // DOM Cache
        this.card = document.getElementById('calculatorCard');
        this.displayInput = document.getElementById('displayInput');
        this.displayHistory = document.getElementById('displayHistory');
        
        this.btnBasic = document.getElementById('btnModeBasic');
        this.btnScientific = document.getElementById('btnModeScientific');
        this.yearSpan = document.getElementById('currentYear');
        this.statusBadge = document.getElementById('headerStatusBadge');
    }

    /**
     * Initializes listeners, updates footer year, and registers events.
     */
    init() {
        this.updateYear();
        this.setupModeSwitcher();
        this.setupKeypadListeners();
        this.setupKeyboardListeners();
    }

    /**
     * Updates copyright year dynamically.
     */
    updateYear() {
        if (this.yearSpan) {
            this.yearSpan.textContent = new Date().getFullYear().toString();
        }
    }

    /**
     * Toggles between Basic and Scientific modes.
     */
    setupModeSwitcher() {
        const setMode = (mode) => {
            if (mode === 'scientific') {
                this.card.classList.add('mode-scientific');
                this.btnScientific.classList.add('active');
                this.btnBasic.classList.remove('active');
                if (this.statusBadge) this.statusBadge.textContent = 'Científica';
            } else {
                this.card.classList.remove('mode-scientific');
                this.btnBasic.classList.add('active');
                this.btnScientific.classList.remove('active');
                if (this.statusBadge) this.statusBadge.textContent = 'Básica';
            }
        };

        this.btnBasic.addEventListener('click', () => setMode('basic'));
        this.btnScientific.addEventListener('click', () => setMode('scientific'));
    }

    /**
     * Listens to clicks on buttons using event delegation.
     */
    setupKeypadListeners() {
        const layout = this.card.querySelector('.calculator-layout');
        layout.addEventListener('click', (event) => {
            const btn = event.target.closest('.calc-btn');
            if (!btn) return;

            const val = btn.getAttribute('data-val');
            const action = btn.getAttribute('data-action');

            if (val !== null) {
                this.handleInput(val);
            } else if (action !== null) {
                this.handleAction(action);
            }
        });
    }

    /**
     * Maps physical keyboard presses to calculator inputs.
     */
    setupKeyboardListeners() {
        window.addEventListener('keydown', (event) => {
            // Prevent default behavior for Enter/Backspace when focusing random nodes
            const activeTag = document.activeElement.tagName;
            if (activeTag === 'BUTTON' || activeTag === 'INPUT') {
                if (['Enter', 'Backspace', ' '].includes(event.key)) {
                    event.preventDefault();
                }
            }

            const key = event.key;

            if (/[0-9.]/.test(key)) {
                this.handleInput(key);
            } else if (key === '+') {
                this.handleInput('+');
            } else if (key === '-') {
                this.handleInput('-');
            } else if (key === '*' || key === 'x' || key === 'X') {
                this.handleInput('×');
            } else if (key === '/') {
                this.handleInput('÷');
            } else if (key === '^') {
                this.handleInput('^');
            } else if (key === '(' || key === ')') {
                this.handleInput(key);
            } else if (key === '!') {
                this.handleInput('!');
            } else if (key === 'Enter' || key === '=') {
                this.handleAction('calculate');
            } else if (key === 'Backspace') {
                this.handleAction('backspace');
            } else if (key === 'Escape') {
                this.handleAction('clear');
            }
        });
    }

    /**
     * Appends numeric values or mathematical functions to the active display state.
     * @param {string} val - Characters to append.
     */
    handleInput(val) {
        // If a result is currently shown, typing a number starts fresh
        if (this.isResultDisplayed) {
            if (/[0-9.πe]/.test(val) || val.includes('(') || val.includes('sin') || val.includes('cos') || val.includes('tan') || val.includes('log') || val.includes('ln') || val.includes('√')) {
                this.expression = '';
            }
            this.isResultDisplayed = false;
        }

        // Prevent invalid double operators side-by-side (basic filtering)
        const lastChar = this.expression.slice(-1);
        const operators = ['+', '-', '×', '÷', '^'];
        
        if (operators.includes(val) && (this.expression === '' || operators.includes(lastChar))) {
            if (val === '-' && this.expression === '') {
                // Allow starting expression with negative sign
            } else if (operators.includes(lastChar)) {
                // Replace the operator with the new one
                this.expression = this.expression.slice(0, -1) + val;
                this.updateDisplay();
                return;
            } else {
                return; // Block other leading operators
            }
        }

        this.expression += val;
        this.updateDisplay();
    }

    /**
     * Executes specialized actions: calculation, clear screen, backspace removal.
     * @param {string} action - Action key identifier.
     */
    handleAction(action) {
        switch (action) {
            case 'clear':
                this.expression = '';
                this.displayHistory.textContent = '';
                this.isResultDisplayed = false;
                this.updateDisplay();
                break;
            case 'backspace':
                if (this.isResultDisplayed) {
                    this.expression = '';
                    this.displayHistory.textContent = '';
                    this.isResultDisplayed = false;
                } else if (this.expression.length > 0) {
                    // Check if we are deleting functions to delete the whole word
                    const funcs = ['sin(', 'cos(', 'tan(', 'log(', 'ln(', '√('];
                    let deletedWord = false;
                    for (const f of funcs) {
                        if (this.expression.endsWith(f)) {
                            this.expression = this.expression.slice(0, -f.length);
                            deletedWord = true;
                            break;
                        }
                    }
                    if (!deletedWord) {
                        this.expression = this.expression.slice(0, -1);
                    }
                }
                this.updateDisplay();
                break;
            case 'calculate':
                this.performCalculation();
                break;
        }
    }

    /**
     * Passes the expression to the calculator engine, handles output rendering and errors.
     */
    performCalculation() {
        if (!this.expression) return;
        
        try {
            const rawExpr = this.expression;
            const result = CalculatorEngine.calculate(rawExpr);
            
            this.displayHistory.textContent = rawExpr + ' =';
            this.expression = result.toString();
            this.isResultDisplayed = true;
        } catch (error) {
            this.displayHistory.textContent = this.expression;
            this.displayInput.value = error.message || 'Error';
            this.expression = '';
            this.isResultDisplayed = true;
            return;
        }
        
        this.updateDisplay();
    }

    /**
     * Refreshes the display view DOM.
     */
    updateDisplay() {
        this.displayInput.value = this.expression || '0';
        // Auto scroll to the right for long inputs
        this.displayInput.scrollLeft = this.displayInput.scrollWidth;
    }
}

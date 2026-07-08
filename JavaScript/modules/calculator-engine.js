/**
 * Calculator Engine Module
 * Responsible for secure mathematical expression tokenization, parsing, and execution.
 * Avoids using eval() or Function() constructor to ensure code security.
 */

export class CalculatorEngine {
    /**
     * Evaluates a mathematical expression string and returns the numeric result.
     * @param {string} expression - The math expression to evaluate.
     * @returns {number} The calculation result.
     * @throws {Error} If expression is malformed or division by zero occurs.
     */
    static calculate(expression) {
        // Preprocess string to normalize characters
        let sanitized = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');

        // Tokenize the expression
        const tokens = this.tokenize(sanitized);
        if (tokens.length === 0) return 0;

        let index = 0;

        // Recursive descent parser functions
        // E -> T ((+ | -) T)*
        const parseExpression = () => {
            let result = parseTerm();
            while (index < tokens.length) {
                const token = tokens[index];
                if (token.type === 'operator' && (token.value === '+' || token.value === '-')) {
                    index++;
                    const right = parseTerm();
                    if (token.value === '+') {
                        result += right;
                    } else {
                        result -= right;
                    }
                } else {
                    break;
                }
            }
            return result;
        };

        // T -> P ((* | /) P)*
        const parseTerm = () => {
            let result = parsePower();
            while (index < tokens.length) {
                const token = tokens[index];
                if (token.type === 'operator' && (token.value === '*' || token.value === '/')) {
                    index++;
                    const right = parsePower();
                    if (token.value === '*') {
                        result *= right;
                    } else {
                        if (right === 0) {
                            throw new Error('División por cero');
                        }
                        result /= right;
                    }
                } else {
                    break;
                }
            }
            return result;
        };

        // P -> F (^ F)* (exponentiation)
        const parsePower = () => {
            let result = parseFactor();
            while (index < tokens.length) {
                const token = tokens[index];
                if (token.type === 'operator' && token.value === '^') {
                    index++;
                    const right = parsePower();
                    result = Math.pow(result, right);
                } else {
                    break;
                }
            }
            return result;
        };

        // F -> Primary (!)? (postfix factorial)
        const parseFactor = () => {
            let result = parsePrimary();
            while (index < tokens.length && tokens[index].type === 'operator' && tokens[index].value === '!') {
                index++;
                result = factorial(result);
            }
            return result;
        };

        // Primary -> Number | ( E ) | Function( E ) | - Primary | + Primary
        const parsePrimary = () => {
            if (index >= tokens.length) {
                throw new Error('Expresión incompleta');
            }

            const token = tokens[index];

            // Handle unary operators
            if (token.type === 'operator' && token.value === '-') {
                index++;
                return -parsePrimary();
            }
            if (token.type === 'operator' && token.value === '+') {
                index++;
                return parsePrimary();
            }

            // Handle numbers (and constants)
            if (token.type === 'number') {
                index++;
                return token.value;
            }

            // Handle functions
            if (token.type === 'function') {
                const funcName = token.value;
                index++;
                
                if (index >= tokens.length || tokens[index].value !== '(') {
                    throw new Error(`Se esperaba '(' después de ${funcName}`);
                }
                index++; // Consume '('

                const arg = parseExpression();

                if (index >= tokens.length || tokens[index].value !== ')') {
                    throw new Error(`Se esperaba ')' cerrando la función ${funcName}`);
                }
                index++; // Consume ')'

                return evaluateFunction(funcName, arg);
            }

            // Handle parentheses
            if (token.type === 'parenthesis' && token.value === '(') {
                index++; // Consume '('
                const result = parseExpression();
                if (index >= tokens.length || tokens[index].value !== ')') {
                    throw new Error("Se esperaba ')'");
                }
                index++; // Consume ')'
                return result;
            }

            throw new Error(`Sintaxis inválida en: ${token.value}`);
        };

        // Helper: Factorial function
        const factorial = (n) => {
            if (n < 0) throw new Error('Factorial negativo inválido');
            if (n % 1 !== 0) throw new Error('Se requiere número entero para factorial');
            if (n > 170) return Infinity; // Avoid Stack overflow/JS limits
            let res = 1;
            for (let i = 2; i <= n; i++) res *= i;
            return res;
        };

        // Helper: Scientific Functions (Uses Radians)
        const evaluateFunction = (name, val) => {
            switch (name) {
                case 'sin':
                    return Math.sin(val);
                case 'cos':
                    return Math.cos(val);
                case 'tan':
                    return Math.tan(val);
                case 'log':
                    if (val <= 0) throw new Error('Logaritmo no definido');
                    return Math.log10(val);
                case 'ln':
                    if (val <= 0) throw new Error('Logaritmo natural no definido');
                    return Math.log(val);
                case '√':
                    if (val < 0) throw new Error('Raíz de número negativo');
                    return Math.sqrt(val);
                default:
                    throw new Error(`Función desconocida: ${name}`);
            }
        };

        const finalResult = parseExpression();

        if (index < tokens.length) {
            throw new Error(`Símbolo extra después del final: ${tokens[index].value}`);
        }

        // Clean up JS floating-point precision issues
        return parseFloat(finalResult.toFixed(12));
    }

    /**
     * Tokenizes a mathematical expression string.
     * @param {string} str - Expression string.
     * @returns {Array<Object>} List of tokens.
     */
    static tokenize(str) {
        const tokens = [];
        let i = 0;

        while (i < str.length) {
            const char = str[i];

            // Skip whitespace
            if (/\s/.test(char)) {
                i++;
                continue;
            }

            // Numbers
            if (/[0-9.]/.test(char)) {
                let numStr = '';
                while (i < str.length && /[0-9.]/.test(str[i])) {
                    numStr += str[i];
                    i++;
                }
                // Handle multiple dots error
                if ((numStr.match(/\./g) || []).length > 1) {
                    throw new Error(`Número decimal mal formado: ${numStr}`);
                }
                tokens.push({ type: 'number', value: parseFloat(numStr) });
                continue;
            }

            // Word-based Functions and constant 'e'
            if (/[a-zA-Z]/.test(char)) {
                let word = '';
                while (i < str.length && /[a-zA-Z]/.test(str[i])) {
                    word += str[i];
                    i++;
                }

                if (word === 'e') {
                    // Check for implicit multiplication BEFORE e: e.g. 5e -> 5 * e
                    if (tokens.length > 0) {
                        const prev = tokens[tokens.length - 1];
                        if (prev.type === 'number' || (prev.type === 'parenthesis' && prev.value === ')')) {
                            tokens.push({ type: 'operator', value: '*' });
                        }
                    }
                    tokens.push({ type: 'number', value: Math.E });
                } else if (['sin', 'cos', 'tan', 'log', 'ln'].includes(word)) {
                    // Check for implicit multiplication BEFORE function: e.g., 5sin(x) -> 5 * sin(x)
                    if (tokens.length > 0) {
                        const prev = tokens[tokens.length - 1];
                        if (prev.type === 'number' || (prev.type === 'parenthesis' && prev.value === ')')) {
                            tokens.push({ type: 'operator', value: '*' });
                        }
                    }
                    tokens.push({ type: 'function', value: word });
                } else {
                    throw new Error(`Símbolo no identificado: ${word}`);
                }
                continue;
            }

            // Constant Pi (π)
            if (char === 'π') {
                if (tokens.length > 0) {
                    const prev = tokens[tokens.length - 1];
                    if (prev.type === 'number' || (prev.type === 'parenthesis' && prev.value === ')')) {
                        tokens.push({ type: 'operator', value: '*' });
                    }
                }
                tokens.push({ type: 'number', value: Math.PI });
                i++;
                continue;
            }

            // Parentheses
            if (char === '(' || char === ')') {
                // Implicit multiplication: e.g., 5(3) -> 5 * (3) or (3)(4) -> (3) * (4)
                if (char === '(' && tokens.length > 0) {
                    const prev = tokens[tokens.length - 1];
                    if (prev.type === 'number' || (prev.type === 'parenthesis' && prev.value === ')')) {
                        tokens.push({ type: 'operator', value: '*' });
                    }
                }
                tokens.push({ type: 'parenthesis', value: char });
                i++;
                continue;
            }

            // Operators (including sqrt symbol √)
            if (['+', '-', '*', '/', '^', '!', '√'].includes(char)) {
                // If it is square root √, check for implicit multiplication
                if (char === '√' && tokens.length > 0) {
                    const prev = tokens[tokens.length - 1];
                    if (prev.type === 'number' || (prev.type === 'parenthesis' && prev.value === ')')) {
                        tokens.push({ type: 'operator', value: '*' });
                    }
                }
                
                if (char === '√') {
                    tokens.push({ type: 'function', value: '√' });
                } else {
                    // Check for consecutive operators to raise syntax error early (except unary operators)
                    if (tokens.length > 0 && char !== '-' && char !== '+') {
                        const prev = tokens[tokens.length - 1];
                        if (prev.type === 'operator' && prev.value !== '!') {
                            throw new Error('Sintaxis inválida (operadores consecutivos)');
                        }
                    }
                    tokens.push({ type: 'operator', value: char });
                }
                i++;
                continue;
            }

            throw new Error(`Caracter no reconocido: ${char}`);
        }

        return tokens;
    }
}

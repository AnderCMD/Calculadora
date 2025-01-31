function Calcular() {
    let Entrada = document.Calculadora.Resultado.value;
    let Resultado;

    if (Entrada.includes('+')) {
        let Numeros = Entrada.split('+');
        Resultado = parseFloat(Numeros[0]) + parseFloat(Numeros[1]);
    } else if (Entrada.includes('-')) {
        let Numeros = Entrada.split('-');
        Resultado = parseFloat(Numeros[0]) - parseFloat(Numeros[1]);
    } else if (Entrada.includes('×')) {
		let Numeros = Entrada.split('×');
		Resultado = parseFloat(Numeros[0]) * parseFloat(Numeros[1]);
	} else if (Entrada.includes('÷')) {
		let Numeros = Entrada.split('÷');
		Resultado = parseFloat(Numeros[0]) / parseFloat(Numeros[1]);
	}

    document.Calculadora.Resultado.value = Resultado;
}
const prompt = require('prompt-sync')();

function main() {
    const name = prompt('Introduce la cadena → ');
    console.log(`Cadena a evaluar ${name} `);
    const stack = new Stack();
    var noTerminales = ['function', '(', ')', 'var', ':', 'a...z', 'integer', 'real','boolean', 'string', ';', '$'] 
    var Terminales = ['FUNCION','PARAMETROS','PARAMLIST','VARIABLE','NOMBRE','RETOL','LETRA','TIPO','LIST']
    var reglas = [
      ['NOMBRE','LETRA','RETOL'],
      ['PARAMETROS',')','PARAMLIST','('],
      ['PARAMLIST','var','VARIABLE','LIST'],
      ['VARIABLE','NOMBRE',':','TIPO'],
      ['RETOL','LETRA','RETOL'],
      ['LETRA','a...z'],
      ['TIPO',['boolean','string','real','integer']],
      ['LIST',';','VARIABLE','LIST']]
    var cadena = name.split(" ")
    var reservada = new RegExp("^function$|^integer$|^real$|^boolean$|^string$|^var$")
    var simbolos = new RegExp("^[(]$|^[)]$|^:$|^;$")
    var letras = new RegExp("[a-z]+")
    var contador = 0
    hay_error = false
    pasa_var = false
    pasa_nombre = false
    pasa_puntos = false
    pasa_tipo = false
    termina = false
    pasa_punto_coma = false
    if(name == " "){
        console.log("Amigo sabes que tienes que meter mas datos verdad ");
    }else{
        if(cadena[0] == 'function'){
            console.log('la entrada es valida')
            stack.push('$')
            stack.push('PARAMETROS')
            stack.push('NOMBRE')
            stack.push('function')
            stack.print()
        }else{
            hay_error = true
        }
        cadena.forEach(element => {
            if( hay_error == false){
                Terminales.forEach(datas => {
                  if(stack.peek() == datas){                    
                      console.log('actualizar pila');
                      pilaActualizar(datas, reglas, stack,cadena[contador])
                    }                                      
                });
                console.log('Reservadas → ', element," Se extrae → ", stack.peek())
                if(reservada.test(element)){                  
                  if(contador == 0 && element == 'function'){
                    stack.pop()
                    if( letras.test(cadena[contador + 1]))
                  }
                  if(pasa_var == true && element == 'var'){                    
                    stack.pop()
                    pasa_nombre = true
                    pasa_var = false
                  }
                  if (pasa_tipo == true) {                    
                    stack.pop()
                    pasa_tipo = false
                    if(cadena[contador + 1] == ')'){
                      termina = true
                    }else{
                      pasa_punto_coma = true
                    }
                  }
                }else if (simbolos.test(element)) {
                  if(letras.test(element) == false){
                    if(contador == 2 && element == '('){                      
                      stack.pop()
                      pasa_var = true
                    }
                    if (pasa_puntos == true) {                      
                      stack.pop()
                      pasa_puntos = false
                      pasa_tipo = true
                    }
                    if (pasa_punto_coma == true && element == ';') {                      
                      stack.pop()                      
                      pasa_nombre = true
                      pasa_punto_coma = false
                    }
                    if(termina == true && element ==')'){                      
                      stack.pop()
                    }
                  }
                }else if(letras.test(element)){
                  if(stack.peek() != 'var'){                    
                    if(contador == 1){                      
                      stack.pop()
                      stack.pop()
                    }
                    if(pasa_nombre == true){
                        if(element != 'var'){                        
                        stack.pop()
                        stack.pop()
                        pasa_nombre = false
                        pasa_puntos = true
                        }else{
                          hay_error = true
                        }
                    }
                  }
                }else{
                    console.log('Hubo algun error');
                    hay_error = true
                }
                stack.print()
                contador += 1
            }        
        });
    }
    if(stack.peek() != '$' || hay_error == true){
      stack.push('¡ERROR!')
      console.log('no saliste correctamente')      
    }
    stack.print()
}

function pilaActualizar(datas, rules, stack, cadena) {
  rules.forEach(element => {
    if (element[0] == datas) {    
      //console.log('Quitamos →→ ', stack.pop());
      stack.pop()
      if (cadena != ')') {        
        for (let i = element.length - 1; i >= 1; i--) {
          //console.log('Se agrega → ',stack.push(element[i]))
          stack.push(element[i])
        }        
      }      
    }
  });
  stack.print()
}

class Stack {
    constructor() {
      this.stack = [];
    }
    
    push(element) {
      this.stack.push(element);
      return this.stack;
    }
    
    pop() {
      return this.stack.pop();
    }
    
    peek() {
      return this.stack[this.stack.length - 1];
    }
    
    size() {
      return this.stack.length;
    }
  
    print() {
      console.log(this.stack);
    }
  }  

main()
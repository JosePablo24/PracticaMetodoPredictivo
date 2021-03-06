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
    pasa_paren_ini = false
    pasa_punto_coma = false
    n = 1
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
                console.log('variable → ', element," Se extrae → ", stack.peek())
                if(reservada.test(element)){                  
                  if(contador == 0 && element == 'function'){
                    stack.pop()
                    if( letras.test(cadena[contador + 1])){
                      if( cadena[contador + 1] == 'var'){
                        hay_error = true
                      }else{
                        pasa_nombre = true
                      }     
                    }else{
                      hay_error = true
                    }
                  }
                  
                  if(pasa_var == true && element == 'var'){
                    stack.pop()                    
                    pasa_var = false
                    if( letras.test(cadena[contador + 1])){
                      if( cadena[contador + 1] == 'var'){
                        hay_error = true
                      }else{
                        pasa_nombre = true
                      }                      
                    }else{
                      hay_error = true
                    }
                  }

                  if (pasa_tipo == true && ( element == 'string' || element == 'integer' || element == 'boolean' || element == 'real')) {
                    stack.pop()
                    pasa_tipo = false
                    if(cadena[contador + 1] == ')'){
                      stack.pop()
                      termina = true
                    }else{
                      if(cadena[contador + 1 ] == ';'){
                        pasa_punto_coma = true 
                      }else{
                        hay_error == true
                      }
                    }
                  }
                }else if (simbolos.test(element)) {
                  if(element == '(' && pasa_paren_ini == true ){
                    stack.pop()
                    pasa_paren_ini = false
                    if(cadena[contador + 1 ] == 'var'){
                      pasa_var = true
                    }else{
                      hay_error = true
                    }
                  }
                  if (pasa_puntos == true && element == ':') {
                    stack.pop()
                    pasa_puntos = false
                    if(cadena[contador + 1] == 'string' || cadena[contador + 1] == 'integer' || cadena[contador + 1] == 'boolean' || cadena[contador + 1] == 'real'){
                      pasa_tipo = true
                    }else{
                      hay_error = true
                    }
                  }
                  if (pasa_punto_coma == true && element == ';') {                      
                    stack.pop()                                          
                    pasa_punto_coma = false
                    if(letras.test(cadena[contador + 1])){
                      if( cadena[contador + 1] == 'var'){
                        hay_error = true
                      }else{
                        pasa_nombre = true
                      }
                    }else{
                      hay_error = true
                    }
                  }
                  
                  if(termina == true && element ==')'){                      
                    stack.pop()
                  }
                  
                }else if(letras.test(element)){
                  if (pasa_nombre == true && element != 'var'){
                    if(n == 2){
                      stack.print()                      
                      stack.pop()
                      stack.pop()
                      pasa_nombre = false
                      if(cadena[contador + 1 ] == ':'){ 
                        pasa_puntos = true
                      }else{
                        hay_error = true
                      }
                    }
                    if(n == 1){
                      stack.pop()
                      stack.pop()
                      n += 1
                      pasa_nombre = false
                      if(cadena[contador + 1 ] == '('){
                        pasa_paren_ini = true
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
    }else{
      console.log('Cadena aceptada')
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
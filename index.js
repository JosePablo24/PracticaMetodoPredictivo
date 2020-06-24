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
                      //console.log('actualizar pila');
                      pilaActualizar(datas, reglas, stack,cadena[contador])
                    }                                      
                });                
                if(reservada.test(element)){
                  //console.log('Reservadas → ', element," Se extrae → ", stack.pop())
                  stack.pop()
                }else if (simbolos.test(element)) {
                  if(letras.test(element) == false){
                    //console.log('Simbolos → ', element," Se extrae → ", stack.pop())
                    stack.pop()
                  }
                }else if(letras.test(element)){
                  if(stack.peek() != 'var'){
                    //console.log('Variables → ', element," Se extrae → ", stack.pop())
                    stack.pop()
                    stack.pop()
                  }
                }else{
                    console.log('Hubo algun error');
                    hay_error = true
                }
                stack.print()
                contador += 1
            }else{
                console.log('Algo salio mal porfavor revisa')
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
      //stack.print()
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
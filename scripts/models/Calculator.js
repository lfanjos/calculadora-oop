class Calculator {
  constructor () {
    this._displayEl = document.getElementsByClassName('calculator__output')[0]
    this._numbersEls = [...document.getElementsByClassName('calculator__key')].filter(el => !el.classList.contains('calculator__key--operator'))
    this._operatorsEls = document.getElementsByClassName('calculator__key--operator')
    this._memory = [0]
    this._history = []
    this._lastOperator
    this._lastNumber
    this.operatorsHTML = {
      '+': '+',
      '-': '-',
      '\u00D7': '*',
      '÷': '/'
    }

    this.initButtons()
  }

  initButtons () {
    /**
         * Inicializa e configura todos os clicks em cada botão da calculadora
         */

    [...this._numbersEls, ...this._operatorsEls].forEach(btn => {
      btn.addEventListener('click', e => {
        const btnPressed = typeof parseFloat(btn.innerHTML) === 'number' ? parseFloat(btn.innerHTML) : btn

        if (!Number.isNaN(btnPressed)) {
          this.addNumber(btnPressed)
          btn.blur()
          return
        }

        if ([...btn.classList].indexOf('calculator__key--operator') > -1) {
          if (btn.innerHTML === 'AC') {
            this.allClear()
            console.log(btn.innerHTML)
            return
          }

          this.addOperator(this.operatorsHTML[btn.innerHTML])
          return
        }

        if (btn.classList.contains('calculator__key--enter')) {
          btn.blur()
          if (this._memory.length === 3) {
            this.execCalc()
            this.updateDisplay()
            return
          }
          if (this._memory.length === 2) {
            console.log(this._history)
            if (this._history.length > 2 && !this._lastNumber) {
              this._lastNumber = this._history[0]
              this._memory.push(this._lastNumber)

              this.execCalc()
              this.addOperator(this._lastOperator)
              this.updateDisplay()
              return
            }

            this.execCalc()
            this.addOperator(this._lastOperator)
            this.updateDisplay()
            return
          }
        }

        if (btn.innerHTML === '.') {
          if (typeof this._memory[this._memory.length - 1] === 'number') {
            this._memory[this._memory.length - 1] = this._memory[this._memory.length - 1].toString() + '.'
            console.log(this._memory)
          }
        }
      })
    })

    document.addEventListener('keyup', e => {
      switch (e.key) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '+':
        case '-':
          [...document.querySelectorAll('.calculator__key')].filter(el => el.innerHTML === e.key)[0].click()
          break
        case '/':
          [...document.querySelectorAll('.calculator__key')].filter(el => el.innerHTML === '÷')[0].click()
          break
        case '*':
          [...document.querySelectorAll('.calculator__key')].filter(el => el.innerHTML === '\u00D7')[0].click()
          break
        case 'Enter':
          document.getElementsByClassName('calculator__key--enter')[0].click()
          break
        case ',':
        case '.':
          [...document.querySelectorAll('.calculator__key')].filter(el => el.innerHTML === '.')[0].click()
          break
        case 'Delete':
          [...document.querySelectorAll('.calculator__key')].filter(el => el.innerHTML === 'AC')[0].click()
          break
      }
    })
  }

  allClear () {
    this._memory = [0]
    this._history = []
    this.updateDisplay()
  }

  addOperator (operator) {
    switch (operator) {
      case '+':
        this.setOperator('+')
        break
      case '-':
        this.setOperator('-')
        break
      case '*':
        this.setOperator('*')
        break
      case '/':
        this.setOperator('/')
        break
    }
    this.updateDisplay()
  }

  setOperator (operator) {
    if (this._memory[this._memory.length - 1] === 0 && (operator === '/' || operator === '*')) return

    if (['+', '-', '/', '*'].indexOf(this._memory[this._memory.length - 1]) > -1) {
      this._memory[this._memory.length - 1] = operator
      console.log('added', operator)
    } else if (this._memory.length === 3) {
      this.execCalc()
      this.addOperator(operator)
    } else {
      console.log('vou fazer o push do ' + operator)
      this._memory.push(operator)
    }
  }

  execCalc () {
    let expression
    console.log(this._memory)
    if (this._memory.length < 3) {
      expression = this._memory.push(this._history[0] ? this._history[0] : this._memory[0])
    }
    expression = this._memory.join('')
    console.log(expression)
    const result = eval(expression)
    this._history.push(...this._memory)
    this._lastOperator = this._memory[1]
    this._memory = [result, this._lastOperator]
    this.updateDisplay()
  }

  addNumber (number) {
    if (this._memory[0] === 0) {
      this._memory[0] = number
      this.updateDisplay()
      return
    }

    if (typeof this._memory[this._memory.length - 1] === 'number' || this._memory[this._memory.length - 1].toString().includes('.')) {
      this._memory[this._memory.length - 1] = parseFloat(this._memory[this._memory.length - 1].toString() + number.toString())
      this.updateDisplay()
      return console.log(`Botão Pressionado: ${number}, ocorreu a concatenação com o número anterior`)
    }

    console.log(`Botão pressionado: ${number} ocorreu o push na memória`)
    this._memory.push(number)
    this.updateDisplay()
  }

  updateDisplay () {
    const lastNumber = this._memory.reverse().find(item => typeof item === 'number')
    console.log(this._memory.reverse())
    this._displayEl.innerHTML = lastNumber
  }
}

const Calculator = {
    rootApp: "",
    mainContainer: "",
    mapping: "",
    buttons: {},
    formatter: "",
    input: "",
    lastNumber: 0,
    selectedOperator: "",

    init: (selector) => {
        let that = Calculator;
        that.rootApp = document.querySelector(selector);
        if (that.rootApp === null) {
            throw new Error("Non è possibile inizializzare la calcolatrice. " + selector + " non è un selettore valido");
        }

        if (!window.Mapping) {
            throw new Error("Calcolatrice non inizializzata. Script Mapping non caricato");
        }
        
        that.mapping = window.Mapping;

        that.initContainer();
        that.initField();
        that.initButtons();
        that.initAcrylicBg();
        that.formatter = new Intl.NumberFormat('it-IT', {})
    },

    initAcrylicBg: () => {
        let that = Calculator;
        let bg = that.createContainer("light");

        bg.id = "acrylic-container";
        that.mainContainer.appendChild(bg);
        that.mainContainer.addEventListener("mousemove", that.manageAcrylicBg);
    },

    manageAcrylicBg: function(evt) {
        let acrylicBg = document.querySelector("#acrylic-container");
        acrylicBg.style.top = evt.pageY + "px";
        acrylicBg.style.left = evt.pageX + "px";        
    },

    initContainer: () => {
        let that = Calculator;
        let mainContainer = that.createContainer("calculator");
        let fillerTop = that.createContainer("filler top");
        let fillerLeft = that.createContainer("filler left");
        let fillerRight = that.createContainer("filler right");
        let fillerBottom = that.createContainer("filler bottom");

        that.rootApp.appendChild(fillerTop);
        that.rootApp.appendChild(fillerLeft);
        that.rootApp.appendChild(fillerRight);
        that.rootApp.appendChild(fillerBottom);
        that.mainContainer = mainContainer;
        that.rootApp.appendChild(that.mainContainer);
    },

    createContainer: (className) => {
        let that = Calculator;
        let container = document.createElement("div");
        container.className = className;
        
        return container;
    },

    initField: () => {
        let that = Calculator;
        let input = that.createInputField();
        let inputContainer = that.createContainer("input-container");

        inputContainer.appendChild(input);
        that.mainContainer.appendChild(inputContainer);
        that.input = input;
    },

    createInputField: () => {
        let that = Calculator;
        let input = document.createElement("input");
        input.type="text";
        input.className = "calculator-field force-number force-trim";
        input.id="field";

        input.addEventListener("change", that.forceTrim);
        document.addEventListener("keypress", that.forceNumber);

        return input;
    },

    initButtons: () => {
        let that = Calculator;
        let buttonsContainer = that.createContainer("buttons-container");

        for (key in that.mapping) {
            let btn = that.createButton(that.mapping[key]);
            that.buttons[that.mapping[key]["key"]] = btn;
            buttonsContainer.appendChild(btn);
        }

        that.mainContainer.appendChild(buttonsContainer);
        that.initNumberButtons();
        that.initOperatorButtons();
        that.initDeleteButtons();
        that.initDotButton();
        that.initCalculateButton();
    },

    initNumberButtons: () => {
        let that = Calculator;
        let buttons = document.querySelectorAll(".button.number");
        for (button of buttons) {
            button.addEventListener("click", that.handlerClickNumber);
        }
    },

    initOperatorButtons: () => {
        let that = Calculator;
        let buttons = document.querySelectorAll(".button.operator");
        for (button of buttons) {
            button.addEventListener("click", that.handlerClickOperator);
        }
    },

    initCalculateButton: () => {
        let that = Calculator;
        let button = document.querySelector(".button.equal");
        button.addEventListener("click", that.handlerCalculateButton);
    },

    initDeleteButtons: () => {
        let that = Calculator;
        let buttonDelete = document.querySelector(".button.delete.delete-one");
        buttonDelete.addEventListener("click", that.handleClickDelete);

        let buttonDeleteAll = document.querySelector(".button.delete.delete-all");
        buttonDeleteAll.addEventListener("click", that.handleClickDeleteAll);
    },

    initDotButton: () => {
        let that = Calculator;
        let dotButton = document.querySelector(".operator.comma");
        dotButton.addEventListener("click", that.handleClickDot);
    }, 

    createButton: (options) => {
        let button = document.createElement("button");
        let buttonClasses = "button " + options["class"];
        let content = options["key"];

        button.className = buttonClasses;
        button.innerHTML = content;
        button.type = "button";
        button.addEventListener("click", Calculator.defaultButtonHandler);

        return button;
    },

    forceTrim: function(evt) {
        let that =  Calculator;

        let value = this.value;
        let trimmed = value.trim().replace(" ", "");

        this.value = trimmed;
    },

    removeExtraDots: (str) => {
        return str.replace( /^([^.]*\.)(.*)$/, function ( a, b, c ) { 
            return b + c.replace( /\./g, '' );
        });    
    },

    forceNumber: function(evt) {
        evt = (evt) ? evt : window.event;
        let charCode = (evt.which) ? evt.which : evt.keyCode;

        if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
            evt.preventDefault();
            return false;
        }
        
        evt.preventDefault();
        Calculator.dispatchButtonClick(String.fromCharCode(charCode));
        return true;
    },

    handlerClickNumber: function(evt) {
        let that = Calculator;
        let button = this;

        let value = String(button.textContent);
        let input = that.input;
        let inputValue = String(input.value);

        let newValue = (inputValue === '0' || isNaN(inputValue))? value : inputValue + value;
        //newValue = that.formatNumber(parseFloat(newValue));
        input.value = newValue;
    },

    handlerClickOperator: function(evt){
        let that = Calculator;
        let button = this;

        if (that.selectedOperator == "") {
            that.selectedOperator = button.textContent.trim();
            that.lastNumber = parseFloat(that.input.value);
            that.input.value = "0";
        } else {
            let number = parseFloat(that.input.value);
            let result = that.doMath(that.selectedOperator, that.lastNumber, number);

            that.selectedOperator = button.textContent.trim();
            that.lastNumber = result;
            that.input.value = "0";
        }

        console.log(that.selectedOperator);
        console.log(that.lastNumber);
    },

    handlerCalculateButton: function(evt) {
        let that = Calculator;
        let button = this;

        if (that.selectedOperator == "") {
            return;
        }

        let number = parseFloat(that.input.value);
        let result = that.doMath(that.selectedOperator, that.lastNumber, number);

        that.selectedOperator = "";
        that.lastNumber = 0;

        that.input.value = String(result);
    },  

    dispatchButtonClick: (key) => {
        let that = Calculator;
        let btn = that.buttons[key];

        btn.dispatchEvent(new Event("click"));
    },

    handleClickDelete: function(evt) {
        let that = Calculator;
        let input = that.input;
        let inputValue = input.value;

        let newValue = inputValue.slice(0, -1);
        input.value = newValue;
    },

    handleClickDeleteAll: function(evt) {
        let that = Calculator;
        that.input.value = "0";
        that.lastNumber = 0;
        that.selectedOperator = "";
    },

    handleClickDot: function(evt) {
        let that = Calculator;
        let content = this.textContent;
        let inputValue = that.input.value;

        if (inputValue.includes(content)) { return; }

        if (inputValue === "") {
            content = "0" + content;
        }

        inputValue += content;
        that.input.value = inputValue;
    },

    defaultButtonHandler: function(evt) {
        let btn = this;

        btn.classList.add("active");
        setTimeout(() => btn.classList.remove("active"), 150);
    }, 

    formatNumber: (number) => {
        let that = Calculator;
        return that.formatter.format(number);
    },

    doMath(operator, n, m) {
        switch (operator) {
            case "+":
                return n + m;
                break;
            case "-":
                return n - m;
            case "x":
                return n * m;
            case "/":
                return n / m;
            default:
                return 0;
        }
    }
};

window.Calculator = Calculator;
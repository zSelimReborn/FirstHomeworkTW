let Converter = {
    init: function() {
        this.celsius = document.querySelector("#celsius");
        this.fahrenheit = document.querySelector("#fahrenheit");
        this.mapping = {
            "celsius": this.convertToCelsius,
            "fahrenheit": this.convertToFahrenheit
        };

        this.celsius.addEventListener("keypress", this.handleKeypress);
        this.fahrenheit.addEventListener("keypress", this.handleKeypress);
        this.celsius.addEventListener("focus", this.handleFocus);
        this.fahrenheit.addEventListener("focus", this.handleFocus);

        this.formatter = new Intl.NumberFormat('it-IT', { maximumSignificantDigits: 6 });
    },

    convert: function(converter, value) {
        let v = parseFloat(value);
        if (isNaN(v)) {
            return 0;
        }
        
        let func = this.mapping[converter];
        if (func) {
            return func(value)
        }

        throw new Error("Conversione non disponibile per la scala " + converter);
    },

    convertToCelsius: function(fahrenheit) {
        return (parseFloat(fahrenheit) - 32) * (5/9);
    },

    convertToFahrenheit: function(celsius) {
        return (parseFloat(celsius) * (9/5)) + 32;
    },

    handleKeypress: function(evt) {
        let that = Converter;

        evt = (evt) ? evt : window.event;
        let charCode = (evt.which) ? evt.which : evt.keyCode;

        if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode !== 44 && charCode !== 45)) {
            evt.preventDefault();
            return false;
        }

        let value = this.value + String.fromCharCode(charCode)
        value = that.parseLocaleNumber(value);

        let target = document.querySelector("#" + this.dataset.target);
        let converted = that.convert(this.dataset.target, value);

        console.log(value);
        console.log(converted);

        if (target) {
            target.value = that.formatter.format(converted);
        }

        return true;
    },
    
    handleFocus: function(evt) {
        console.log("focus");
        this.value = "";
    },

    parseLocaleNumber: function(stringNumber) {
        let thousandSeparator = (1111).toLocaleString().replace(/1/g, '');
        let decimalSeparator = (1.1).toLocaleString().replace(/1/g, '');
    
        return parseFloat(stringNumber
            .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
            .replace(new RegExp('\\' + decimalSeparator), '.')
        );
    }    
}

window.Converter = Converter;
export default {

    isset: function (flag = '') {        
        if (flag !== undefined && flag !== null) {
            flag = flag + '';            
            return flag.trim().length > 0;
        } else {
            return true;
        }
    },

    assembly: function (route = '', filterBy = '', filterValue = '') {
        if (filterBy && filterValue) {
            if (filterBy.trim().length > 0 && filterValue.trim().length > 0) {
                return `${route}/findby/${filterBy}/${filterValue}`;
            }
        }

        return route;
    },

    setType: function (item, type) {
        //<i class="fas fa-boxes"></i>
        //console.log(type);
        let result = item;
        //if(item) {
        if (type === 'money') {
            if (parseFloat(item) > 0) {
                result = (<> <small><i className="fas fa-dollar-sign text-success"></i></small> {parseFloat(item).toLocaleString('pt-br', { minimumFractionDigits: 2 })} </>);
            } else {
                result = (<> <small><i className="fas fa-dollar-sign text-danger"></i></small> {parseFloat(item).toLocaleString('pt-br', { minimumFractionDigits: 2 })} </>);
            }
        } else if (type === 'date') {
            result = new Date(item).toLocaleDateString('pt-br');
        } else if (type === 'amount') {
            result = (<> <small><i className="fas fa-boxes text-secondary"></i></small> {item} </>)
        } else if (type === 'password') {
            result = (<> <small><i className="fas fa-lock text-secondary"></i></small> ### </>)
        } else if (type === 'boolean') {
            if(item || item == 0) {                
                result = (<> <small title="Verdadeiro"><i className="fas fa-check-circle text-success"></i></small> </>)
            } else {
                result = (<> <small title="Falso"><i className="fas fa-times-circle text-danger"></i></small> </>)
            }            
        } else if (type === 'image/*') {
            result = (<> <small><i className="far fa-image"></i></small> </>)
        }
        //}        
        return result;
    },

    decimal: function (event) {
        let value = event.target.value;                
        value = (value + '').replace(',', '.');

        if(!(value.slice(-1) === '.' || value === '-' || value.slice(-1) === '0')) {
            value = isNaN(Number(value.replace(/[^0-9_.-]/g, ''))) ? '' : Number(value.replace(/[^0-9_.-]/g, ''));
        } else {
            if(value.replace(/[^.]/g, "").length >= 2) {
                //value = value.replace(/[.]/g, "");
                value = '0';
            }
            if(value.replace(/[^-]/g, "").length >= 2) {
                //value = value.replace(/[-]/g, "");
                value = '0';
            }
        } 
        
        value = (value + '').replace('.', ',');
        return value;        
    },

    integer: function(event) {
        let value = event.target.value; 
        return value.replace(/[^\d]/g, "");
    },


    datetime: function(event) {
        let value = event.target.value; 


        if(new Date(value) == "Invalid Date") {
            return new Date().toLocaleString();;
        }

        return new Date(value).toLocaleString();
    },

    date: function(value) {
        
        if(new Date(value) === 'Invalid Date') {
            return new Date();
        }


        return new Date(value);
    },


    toDecimal: function(value) {
        let result = value.replace(',', '.');
        return parseFloat(result);
    }

}
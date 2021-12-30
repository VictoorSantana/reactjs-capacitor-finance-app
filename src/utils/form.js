export default {

    create(fields = []) {
        let result = {};
        fields.forEach((field) => {
            result[field.name] = {
                value: field.default,
                error: '',
                grossValue: field.default,
                loading: false,
                disabled: false
            };
        });
        return result;
    },

    load(form, data) {
        let clone = JSON.parse(JSON.stringify(form));
        for (let field in clone) {
            clone[field].value = data[field] ? data[field] : '';
            clone[field].grossValue = data[field] ? data[field] : '';
        };
        return clone;
    },

    values(form) {
        let clone = JSON.parse(JSON.stringify(form));
        let result = {};
        for (let field in clone) {
            result[field] = clone[field].grossValue;
        }
        return result;
    },

    setAllLoading(form, flag = true) {
        let clone = JSON.parse(JSON.stringify(form));
        for (let field in clone) {
            clone[field].loading = flag;
        };
        return clone;
    },

    setFieldLoading(form, field = '', flag = true) {
        let clone = JSON.parse(JSON.stringify(form));
        if(clone[field]) {
            clone[field].loading = flag;
        }
        return clone;
    },


    setAllDisabled(form, flag = true) {
        let clone = JSON.parse(JSON.stringify(form));
        for (let field in clone) {
            clone[field].disabled = flag;
        };
        return clone;
    },

    setFieldDisabled(form, field = '', flag = true) {
        let clone = JSON.parse(JSON.stringify(form));
        if(clone[field]) {
            clone[field].disabled = flag;
        }
        return clone;
    },

    hasError(form) {
        let clone = JSON.parse(JSON.stringify(form));
        for (let field in clone) {
            if(clone[field].error) {
                if(clone[field].error.length > 0) {
                    return true;
                }
            }
        };
        return false;
    },

    getErros(form) {
        let clone = JSON.parse(JSON.stringify(form));
        let errors = []
        for (let field in clone) {
            if(clone[field].error) {
                if(clone[field].error.length > 0) {
                    errors.push(clone[field].error);
                }
            }
        };
        return errors;
    }





}
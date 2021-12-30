export default { 
 
    isValidToken: function () {        

        const token = localStorage.getItem('authToken');   

        let isAuth = false;
        if (token !== null && token !== undefined) {
            if(token.trim().length > 0) {
                isAuth = true;
            } else {
                isAuth = false;
            }
        }

        return isAuth;
        
    },
    setToken: function(token = '') {
        localStorage.setItem('authToken', token);
    },
    getToken: function() {
        return localStorage.getItem('authToken');
    },
    getBearer: function() {
        return 'Bearer ' + localStorage.getItem('authToken');
    },

    setUser: function(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },


    
    setServer: function (host = '') {
        localStorage.setItem('hostServer', host);
    },

    getServer: function () {
        return localStorage.getItem('hostServer');
    },

    deleteServer: function () {
        localStorage.removeItem('hostServer');
    }
}
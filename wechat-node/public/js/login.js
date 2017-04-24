// !function () {
//   'use strict';

    var configOptions = {
        tenant: "29abf16e-95a2-4d13-8d51-6db1b775d45b", // Optional by default, it sends common
        clientId: "505aae87-e9dd-4979-9c4e-b17dc35a3e32",
        postLogoutRedirectUri: window.location.origin,
    }
    var authContext = new AuthenticationContext(configOptions);

    var isCallback = authContext.isCallback(window.location.hash);
    authContext.handleWindowCallback();

    const webApiEndPointResource = "https://esquel.onmicrosoft.com/805cadd7-d8b2-44f7-9c28-3841c112f04b";

    var getToken = () => new Promise((resolve, reject) => {
        return authContext.acquireToken(webApiEndPointResource, function(error, token){
            if(error) {
                reject(error);
            }
            else{
                // console.log('Access_Token:' + token);
                resolve(token);
            }
        });
    });

    var getUser = () => new Promise((resolve, reject) => {
        return authContext.getUser(function(error, user){
            if(error) {
                reject(error);
            }
            else{
                console.log(user);
                resolve(user);
            }
        });
    });

    var login = () => {
        authContext.login();
    };

    var logout = () => {
        authContext.logOut();
    };

    var loginIfTokenOverdue = () => {
        return getUser()
        .then((data) => {
            console.log('user:' + data.userName);
            return data;
        })
        .catch((error) => {
            // if(error === 'User login is required') {
                login();
            // }
            return error;
        });
    };

    // window.app.LoginHelper = {
    //     authContext: authContext,
    //     webApiEndPointResource: webApiEndPointResource,
    //     login: login,
    //     getToken: getToken,
    //     getUser: getUser,
    //     logout: logout,
    //     loginIfTokenOverdue: loginIfTokenOverdue,
    // };
// }();
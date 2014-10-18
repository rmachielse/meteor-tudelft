Tudelft = {};

Tudelft.requestCredential = function (options, credentialRequestCompleteCallback) {
    // support both (options, callback) and (callback).
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({service: 'tudelft'});
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError("Service not configured"));
        return;
    }
    
    var credentialToken = Random.secret();

    var loginStyle = OAuth._loginStyle('tudelft', config, options);

    var loginUrl =
        'https://oauth.tudelft.nl/oauth2/authorize?client_id=' + config.clientId +
        '&redirect_uri=' + OAuth._redirectUri('tudelft', config) +
        '&response_type=code' + 
        '&state=' + OAuth._stateParam(loginStyle, credentialToken);

    OAuth.launchLogin({
        loginService: "tudelft",
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken
    });
};
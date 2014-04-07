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
    
    var credentialToken = Random.id();

    var loginUrl =
        'https://oauth.tudelft.nl/oauth2/authorize' +
        '?client_id=' + config.clientId +
        '&redirect_uri=' + Meteor.absoluteUrl('_oauth/tudelft?close', config.rootUrl ? {rootUrl: config.rootUrl} : {}) +
        '&response_type=code' + 
        '&state=' + credentialToken;

    Oauth.showPopup(
        loginUrl,
        _.bind(credentialRequestCompleteCallback, null, credentialToken),
        {width: 530, height: 500}
    )
};
TUDelft = {};

TUDelft.authorize = function () {
    var config = ServiceConfiguration.configurations.findOne({service: 'tudelft'});
    if (!config) throw new ServiceConfiguration.ConfigError("Service not configured");
    
    var loginUrl =
        'https://oauth.tudelft.nl/oauth2/authorize' +
        '?client_id=' + config.clientId +
        '&redirect_uri=' + config.redirectUri +
        '&response_type=code';

    window.location.href = loginUrl;
};
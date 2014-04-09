Tudelft = {};

Oauth.registerService('tudelft', 2, null, function(query){

    var response = getTokenResponse(query);
    var accessToken = response.accessToken;
    var identity = getIdentity(accessToken);

    var serviceData = {
        accessToken: accessToken,
        expiresAt: (+new Date) + (1000 * response.expiresIn)
    };

    _.extend(serviceData, identity);

    return {
        serviceData: serviceData,
        options: {
            profile: {
                student_id: identity.id
            }
        }
    };

});

var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'tudelft'});
  if (!config) throw new ServiceConfiguration.ConfigError("Service not configured");

  var response;
  try {
    response = HTTP.post("https://oauth.tudelft.nl/oauth2/token", {
        params: {
            code: query.code,
            grant_type: "authorization_code",
            client_id: config.clientId,
            client_secret: config.secret,
            redirect_uri: Meteor.absoluteUrl('_oauth/tudelft?close', config.rootUrl ? {rootUrl: config.rootUrl} : {}),
            state: query.state
        }
    });
  } catch (err) {
    throw new Error("Failed to complete OAuth handshake with TU Delft" + err.message);
  }

  return {
    accessToken: response.data.access_token,
    expiresIn: response.data.expires_in
  };
};

var getIdentity = function (accessToken) {
    var identity = Tudelft.getStudyProgress(accessToken);
    if(_.isArray(identity)){
        identity = _.first(identity);
    }

    return {
        id: parseInt(identity.studentnummer)
        study: {
            code: identity.opleiding,
            name: identity.opleiding_naam_en
        },
        specialisation: {
            code: identity.specialisatie,
            name: identity.specialisatie_naam_en
        },
        examprogram: {
            code: identity.examenprogramma,
            type: identity.examentype_omschrijving_en,
            name: identity.examenprogramma_naam_en,
            ects: parseInt(identity.minimum_punten_examenprogramma),
            progress: parseInt(identity.behaalde_punten_basisprogramma),
            completed: identity.voldaan == "J"
        }
    };
}

Tudelft.retrieveCredential = function(credentialToken) {
    return Oauth.retrieveCredential(credentialToken);
};

Tudelft.getStudyProgress = function (accessToken) {
    try {
        var response = HTTP.get("http://api.tudelft.nl/v0/studievoortgang", {
            params: {
                oauth_token: accessToken
            }
        });
        var data = JSON.parse(response.content);
        return data.getStudievoortgangByStudentnummerResponse.studievoortgang;
    } catch (err) {
        throw new Error("Failed to fetch studyprogress from TU Delft API. " + err.message);
    }
}

Tudelft.getStudyResults = function (accessToken) {
    try {
        var response = HTTP.get("http://api.tudelft.nl/v0/studieresultaten", {
            params: {
                oauth_token: accessToken
            }
        });
        var data = JSON.parse(response.content);
        return data.studieresultaatLijst.studieresultaat;
    } catch (err) {
        throw new Error("Failed to fetch studyresults from TU Delft API. " + err.message);
    }
}

Tudelft.getCourse = function (courseCode) {
    try {
        var response = HTTP.get("http://api.tudelft.nl/v0/vakken/" + courseCode);
        var data = JSON.parse(response.content);
        return data.vak;
    } catch (err) {
        throw new Error("Failed to fetch course from TU Delft API. " + err.message);
    }
}

Tudelft.getCourseSchedule = function (courseCode) {
    try {
        var response = HTTP.get("http://api.tudelft.nl/v0/vakroosters/" + courseCode);
        var data = JSON.parse(response.content);
        return data.rooster.evenementLijst;
    } catch (err) {
        throw new Error("Failed to fetch course schedule from TU Delft API. " + err.message);
    }
}
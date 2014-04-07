TUDelft = {};

TUDelft.authorize = function (refreshToken, callback) {
  var config = ServiceConfiguration.configurations.findOne({service: 'tudelft'});
  if (!config) throw new ServiceConfiguration.ConfigError("Service not configured");

  var response;
  try {
    response = HTTP.post("https://oauth.tudelft.nl/oauth2/token", {
        params: {
            code: refreshToken,
            grant_type: "authorization_code",
            client_id: config.clientId,
            client_secret: config.secret,
            redirect_uri: config.redirectUri
        }
    });
  } catch (err) {
    throw new Error("Failed to complete OAuth handshake with TU Delft" + err.message);
  }

  var result = {
    access_token: response.data.access_token,
    expires_at: (new Date()) + (1000 * response.data.expires_in)
  }

  callback(result);
};

TUDelft.getStudyProgress = function (accessToken) {
    try {
        return HTTP.get("http://api.tudelft.nl/v0/studievoortgang", {
            params: {
                oauth_token: accessToken
            }
        }).getStudievoortgangByStudentnummerResponse.studievoortgang;
    } catch (err) {
        throw new Error("Failed to fetch studyprogress from TU Delft API. " + err.message);
    }
}

TUDelft.getStudyResults = function (accessToken) {
    try {
        return HTTP.get("http://api.tudelft.nl/v0/studieresultaten", {
            params: {
                oauth_token: accessToken
            }
        }).studieresultaatLijst.studieresultaat;
    } catch (err) {
        throw new Error("Failed to fetch studyresults from TU Delft API. " + err.message);
    }
}

TUDelft.getCourse = function (courseCode) {
    try {
        return HTTP.get("http://api.tudelft.nl/v0/vakken/" + course_code).vak;
    } catch (err) {
        throw new Error("Failed to fetch studyprogress from TU Delft API. " + err.message);
    }
}

TUDelft.getCourseSchedule = function (courseCode) {
    try {
        return HTTP.get("http://api.tudelft.nl/v0/vakroosters/" + course_code).rooster.evenementLijst;
    } catch (err) {
        throw new Error("Failed to fetch studyprogress from TU Delft API. " + err.message);
    }
}

TUDelft.getIdentity = function (accessToken) {
    var identity = TUDelft.getStudyProgress(accessToken);

    return {
        id: identity.studentnummer,
        ects: identity.behaalde_punten_examenprogramma,
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
            ects: identity.minimum_punten_examenprogramma
        }
    }
}
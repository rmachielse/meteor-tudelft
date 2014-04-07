Meteor TU Delft
==============

A Meteor package for the TU Delft API and OAuth authentication using TUDelft NetID

For information on how to register a Client Application see http://www.apidoc.tudelft.nl/

# Configuration

The package will automatically ask for configuration the first time you use it.
You can also set the values manually:

```javascript
ServiceConfiguration.configurations.remove
  service: "tudelft"
ServiceConfiguration.configurations.insert
  service: "tudelft",
  clientId: "",
  secret: "",
  rootUrl: ""
```

The rootUrl configuration can be used to override the rootUrl for local usage.

# Usage

The package provides the following methods:

```javascript
Tudelft.getStudyProgress(accessToken);
Tudelft.getStudyResults(accessToken);
Tudelft.getCourse(courseCode);
Tudelft.getCourseSchedule(courseCode);
```
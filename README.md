Meteor TU Delft
==============

A Meteor package for the TU Delft API and OAuth authentication using TUDelft NetID

For information on how to register a Client Application see http://www.apidoc.tudelft.nl/

You can configure the package with your credentials as follows:

```javascript
ServiceConfiguration.configurations.remove
  service: "tudelft"
ServiceConfiguration.configurations.insert
  service: "tudelft",
  clientId: "",
  secret: "",
  redirectUri: ""
```

You have to add a route that matches your redirect uri yourself.
For example using the iron-router:

```javascript
Router.map(function(){
  this.route('authorize', {
    where: 'server',
    path: '/authorize',
    action: function(){
      if(this.request.query.code){
        var _this = this;
        TUDelft.authorize(this.request.query.code, function(){
          # do something
        }
      }
    }
  });

  this.route('authorize', {
    where: 'client',
    path: '/authorize',
    action: function(){
      TUDelft.authorize();
    }
  });
});
```

You can then use the server functions:

```javascript
TUDelft.getStudyProgress(accessToken);
TUDelft.getStudyResults(accessToken);
TUDelft.getCourse(courseCode);
TUDelft.getCourseSchedule(courseCode);
```
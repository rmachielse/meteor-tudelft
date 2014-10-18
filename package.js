Package.describe({
  summary: "TU Delft API and Oauth authentication",
  version: "0.0.6",
  git: "https://github.com/rmachielse/meteor-tudelft.git"
});

Package.on_use(function(api){
  api.versionsFrom("METEOR@0.9.0");
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Tudelft');

  api.add_files(['tudelft_configure.html', 'tudelft_configure.js'], 'client');

  api.add_files('tudelft_server.js', 'server');
  api.add_files('tudelft_client.js', 'client');
});
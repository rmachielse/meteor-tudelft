Package.describe({
  summary: "TU Delft API and Oauth authentication"
});

Package.on_use(function(api){
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('tudelft');

  api.add_files(['tudelft_configure.html', 'tudelft_configure.js'], 'client');

  api.add_files('tudelft_server.js', 'server');
  api.add_files('tudelft_client.js', 'client');
});
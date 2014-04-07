Package.describe({
  summary: "TU Delft API and Oauth authentication"
});

Package.on_use(function(api){
  api.use('http', 'server');
  api.use('templating', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('TUDelft');

  api.add_files(['tudelft_configure.html', 'tudelft_configure.js'], 'client');

  api.add_files('tudelft_server.js', 'server');
  api.add_files('tudelft_client.js', 'client');
});
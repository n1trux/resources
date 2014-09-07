var fs = require("fs");
var Resource = require('./lib/resource');
var sourcesPath = './sources';

// Read the sources directory and get data.
fs.readdir(sourcesPath, function(error, files) {
  if (error) return console.log(error);

  files.forEach(function(f) {
    var info = require(sourcesPath + '/' + f);

    // Get the name the filename.
    info.name = f.replace(".json", "");

    // Create a Resource.
    var resource = new Resource(info);
    resource.getJSONData(function(data) {
      //
    });
  });
});

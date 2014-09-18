var fs = require("fs");
var Resource = require('./lib/resource');
var sourcesPath = './sources';

// Read the sources directory and get data.
fs.readdir(sourcesPath, function(error, files) {
  if (error) return console.log(error);

  var all = {
    "resources" : []
  };
  files.forEach(function(f) {
    var info = require(sourcesPath + '/' + f);

    // Get the name the filename.
    info.name = f.replace(".json", "");

    all.resources.push(info);

    // Create a Resource.
    var resource = new Resource(info);
    resource.getJSONData(function(data) {
      console.log(data);
    });
  });

  // Write data to file.
  fs.writeFile('./data/all.json', JSON.stringify(all, null, 4), 'utf8', function (error) {
    if (error) return console.log(error);

    // Log success message.
    console.log("Successfully update all");
  });
});

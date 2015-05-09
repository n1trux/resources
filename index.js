var fs = require("fs");
var Resource = require('./lib/resource');
var sourcesPath = './sources';
var handlebars = require('handlebars');

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
      var file = './data/' + data.name + '.json';

      // Write data to file.
      fs.writeFile(file, JSON.stringify(data, null, 4), 'utf8', function (error) {
        if (error) return console.log(error);

        // Log success message.
        console.log("Successfully downloaded data for " + data.name);
      });

      // Update template.
      fs.readFile('./templates/resources.html', 'utf8', function (err, source) {
        if (err) { return console.log(err); }
        var template = handlebars.compile(source, { noEscape: true });
        var result = template(data);

        fs.writeFile('./app/' + data.name + '.html', result, 'utf8', function (error) {
          if (error) return console.log(error);
          // Log success message.
          console.log("Successfully generated " + data.name + ".html");
        });
      });
    });
  });

  // Write data to file.
  fs.writeFile('./data/all.json', JSON.stringify(all, null, 4), 'utf8', function (error) {
    if (error) return console.log(error);
    // Log success message.
    console.log("Successfully updated all.json");
  });
});

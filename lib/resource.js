var md = require('markdown').markdown;
var fs = require('fs');
var request = require('request');

var Resource = function(info) {
  // Attributes from info.
  for (i in info) {
    this[i] = info[i];
  }
}

Resource.prototype.getJSONData = function(callback) {
  var resource = this;
  var file = './data/' + this.name + '.json';

  // Get the README for this resource.
  request(this.readme, function (error, response, body) {
    if (error) return console.log(error);

    if (!error && response.statusCode == 200) {
      var tree = md.parse(body);

      // Get the name of the repository.
//      console.log(tree);

      // Get headers/sections for this resource.
      resource.sections = [];
      tree.forEach(function(t) {
        if (!resource.repoTitle && t[0] == 'header' && t[1].level == 1) {
          resource.repoTitle = t[2].replace(/<(?:.|\n)*?>/gm, '').trim();
        }
        if (t[0] == 'header' && t[1].level == resource.headingLevel) {
          resource.sections.push({
            "title" : t[2],
            "name" : t[2].toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-'),
          });
        }
      });

      // Add data to resource.
      resource.data = body;

      // Write data to file.
      fs.writeFile(file, JSON.stringify(resource, null, 4), 'utf8', function (error) {
        if (error) return console.log(error);

        // Log success message.
        console.log("Successfully downloaded data for " + resource.name);
      });
    }
  })
}

module.exports = Resource;

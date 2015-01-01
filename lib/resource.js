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
      var section = new Object();
      tree.forEach(function(t, currentIndex) {
        var nextElementIndex = currentIndex + 1;
        var nextElement = tree[nextElementIndex];

        // Get the name of the repository.
        if (!resource.repoTitle && t[0] == 'header' && t[1].level == 1) {
          resource.repoTitle = t[2].replace(/<(?:.|\n)*?>/gm, '').trim();
        }

        if (t[0] == 'header' && t[1].level == resource.headingLevel) {
          // We found the first section header.
          // Create a new section object and populate it.
          var section = new Object();
          section.title = t[2];
          section.name = section.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
          section.html = '';

          if (nextElement[0] == 'bulletlist') {
            section.html = "<ul>" + Resource.convertParsedMarkdownToHTML(nextElement) + "</ul>";
          }

          if (nextElement[0] == 'para') {
            section.html = "<p>" + Resource.convertParsedMarkdownToHTML(nextElement) + "</p>";

            nextElementIndex += 1;
            nextElement = tree[nextElementIndex];
            if (nextElement !== undefined && nextElement[0] == 'bulletlist') {
              section.html = "<ul>" + Resource.convertParsedMarkdownToHTML(nextElement) + "</ul>";
            }
          }

          resource.sections.push(section);
        }

//        if (t[0] != 'header'){
//          if (t[2] !== undefined) {
//            var html = Resource.convertParsedMarkdownToHTML(t[2]);
//            section.html += html;
//          }
//        }

        // Get the section header.
//        else if (t[0] == 'header' && t[1].level == resource.headingLevel && resource.sections.length) {
//          // We found a new section header.
//          // Push the previous section up our sections array.
//          resource.sections.push(section);
//
//          // Create a new section object and populate it.
//          var section = {};
//          section.title = t[2];
//          section.name = section.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
//          section.html = '';
//        }
      });

      // Add data to resource.
      resource.data = body;

      // Get author and repoName from github url.
      if (match = resource.url.match(/^https:\/\/github\.com\/(.*)\/(.*)$/)) {
        resource.author = match[1];
        resource.repoName = match[2];
      }

//      resource.sections.forEach(function(section, i) {
//        if (section.name == 'charts') {
//          console.log(body.match());
//        }
//        var next = i + 1;
//        console.log("Start :" + section.title);
//        if (resource.sections[next] !== undefined) {
//          console.log("End :" + resource.sections[next].title);
//        }
//      });

      // Write data to file.
      fs.writeFile(file, JSON.stringify(resource, null, 4), 'utf8', function (error) {
        if (error) return console.log(error);

        // Log success message.
        console.log("Successfully downloaded data for " + resource.name);
      });
    }
  })
}

Resource.convertParsedMarkdownToHTML = function(markdown) {
  return md.renderJsonML(md.toHTMLTree(markdown));
}

module.exports = Resource;

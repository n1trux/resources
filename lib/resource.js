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

          // If the next element is a ul, add it to the html.
          if (nextElement[0] == 'bulletlist') {
            section.html += "<ul>" + Resource.convertParsedMarkdownToHTML(nextElement) + "</ul>";
          }

          // If the next element is a paragraph, add it to the html.
          if (nextElement[0] == 'para') {
            section.html += "<p>" + Resource.convertParsedMarkdownToHTML(nextElement) + "</p>";

            // Find the next ul, add is as well.
            nextElementIndex += 1;
            nextElement = tree[nextElementIndex];
            if (nextElement !== undefined && nextElement[0] == 'bulletlist') {
              section.html += "<ul>" + Resource.convertParsedMarkdownToHTML(nextElement) + "</ul>";
            }
          }

          resource.sections.push(section);
        }
      });

      // Add data to resource.
      resource.data = body;

      // Get author and repoName from github url.
      if (match = resource.url.match(/^https:\/\/github\.com\/(.*)\/(.*)$/)) {
        resource.author = match[1];
        resource.repoName = match[2];
      }

      if (typeof callback === "function") {
        callback(resource);
      }
    }
  })
}

Resource.convertParsedMarkdownToHTML = function(markdown) {
  return md.renderJsonML(md.toHTMLTree(markdown));
}

module.exports = Resource;

## How to add a new resource

1. Fork this repository and clone it.
2. Create a new branch: ```git checkout -b added-new-resource-$RESOURCENAME```.
3. Run ```npm install`` to install dependencies.
4. Copy **sample.json** to **sources/sample.json**.
5. Rename **sample.json** to **$RESOURCENAME.json**.
6. Update the title, url and readme url for **$RESOURCENAME.json**.
7. Update the headinglevel: Look for the number of # in the README markdown for the heading level. Eg the title **## How to add a new resource** above has a heading level 2 (##).
8. Run ```node index.js``` to fetch data for all resources.
9. Commit and push to Github.
10. Create a new Pull Request.

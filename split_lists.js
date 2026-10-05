const fs = require('fs');
let content = fs.readFileSync('projects/index.html', 'utf8');

let newContent = content.replace(
    '<section class="by-year-section">',
    '<section class="lists-wrapper">\n        <div class="by-year-section">'
);

newContent = newContent.replace(
    '                </div>\r\n\r\n                <div class="year-group">\r\n                    <h3 data-en="ART" data-tr="SANAT">ART</h3>',
    '                </div>\n            </div>\n        </div>\n        <div class="by-year-section">\n            <div class="by-year-heading">\n                <h2 data-en="ART." data-tr="SANAT.">ART.</h2>\n            </div>\n            <div class="by-year-grid">\n                <div class="year-group">'
);

newContent = newContent.replace(
    '                </div>\r\n                \r\n            </div>\r\n        </section>',
    '                </div>\n                \n            </div>\n        </div>\n        </section>'
);

fs.writeFileSync('projects/index.html', newContent);

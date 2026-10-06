const fs = require('fs');
const path = require('path');

const projectsList = [
    { id: 'stray', title: 'STRAY' },
    { id: 'bio-decay', title: 'Bio-Decay' },
    { id: 'the-earthen', title: 'The Earthen' },
    { id: 'emek-museum', title: 'Emek Museum' },
    { id: 'traces-together', title: 'you were here.' },
    { id: 'fire-escape-simulation', title: 'Fire Escape' },
    { id: 'ara-sira', title: 'ara-sıra' },
    { id: 'bajo-la-fresca', title: 'Bajo La Fresca' },
    { id: 'millieu', title: 'Millieu' },
    { id: 'chronoclines', title: 'ChronoClines' },
    { id: 'sprouting-garden', title: 'Sprouting Garden' },
    { id: 'wood-weave', title: 'Wood Weave' }
];

const projectsDir = path.join(__dirname, 'projects');
const dirs = fs.readdirSync(projectsDir).filter(f => fs.statSync(path.join(projectsDir, f)).isDirectory());

dirs.forEach(dir => {
    // find index in list
    let idx = projectsList.findIndex(p => p.id === dir);
    if (idx === -1) return; // not found
    
    let prevIdx = (idx - 1 + projectsList.length) % projectsList.length;
    let nextIdx = (idx + 1) % projectsList.length;
    
    let prev = projectsList[prevIdx];
    let next = projectsList[nextIdx];
    
    let htmlFile = path.join(projectsDir, dir, 'index.html');
    if (!fs.existsSync(htmlFile)) return;
    
    let html = fs.readFileSync(htmlFile, 'utf8');
    
    // Check if navigation already exists to avoid duplicates
    if (html.includes('class="project-navigation"')) {
        html = html.replace(/<div class="project-navigation"[\s\S]*?<\/div>/, '');
    }
    
    const navHtml = `
  <div class="project-navigation" style="display: flex; justify-content: space-between; align-items: center; margin-top: 80px; padding-top: 30px; border-top: 1px dashed rgba(0,0,0,0.15);">
      <a href="/projects/${prev.id}/" style="text-decoration: none; color: var(--primary); font-family: monospace; display: flex; flex-direction: column; gap: 5px;">
          <span style="font-weight: bold; letter-spacing: 1px;" data-en="&larr; PREVIOUS" data-tr="&larr; ÖNCEKİ">&larr; PREVIOUS</span>
          <span style="color: #666; font-size: 1rem; font-family: 'Times New Roman', serif; font-style: italic;">${prev.title}</span>
      </a>
      <a href="/projects/${next.id}/" style="text-decoration: none; color: var(--primary); font-family: monospace; display: flex; flex-direction: column; gap: 5px; text-align: right;">
          <span style="font-weight: bold; letter-spacing: 1px;" data-en="NEXT &rarr;" data-tr="SONRAKİ &rarr;">NEXT &rarr;</span>
          <span style="color: #666; font-size: 1rem; font-family: 'Times New Roman', serif; font-style: italic;">${next.title}</span>
      </a>
  </div>
</article>`;

    html = html.replace(/<\/article>/, navHtml);
    
    fs.writeFileSync(htmlFile, html, 'utf8');
    console.log(`Updated ${dir}`);
});

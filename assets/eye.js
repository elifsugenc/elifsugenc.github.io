(() => {
  const data=window.SKETCH_EYE_DATA;
  const NS='http://www.w3.org/2000/svg';
  function createEye(host){
    const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','25 8 205 160');svg.setAttribute('role','img');svg.setAttribute('aria-label','Hand drawn eye following the cursor');
    const uid='eye-'+Math.random().toString(36).slice(2);
    svg.innerHTML=`<defs><clipPath id="${uid}-clip"><path class="eye-clip"/></clipPath><filter id="${uid}-ink" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".028 .06" numOctaves="2" seed="9" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale=".7" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`;
    const ink=document.createElementNS(NS,'g');ink.setAttribute('filter',`url(#${uid}-ink)`);svg.append(ink);
    const nodes=data.parts.map(part=>{const el=document.createElementNS(NS,'path');if(part.kind==='pupil')el.setAttribute('clip-path',`url(#${uid}-clip)`);ink.append(el);return {part,el}});
    host.append(svg);const clip=svg.querySelector('.eye-clip'),noise=svg.querySelector('feTurbulence');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');let targetX=0,targetY=0,x=0,y=0,frame=0,last=0;const start=performance.now();
    const sample=(points,x)=>{let nearest=points[0];for(const p of points){if(Math.abs(p[0]-x)<Math.abs(nearest[0]-x))nearest=p}return nearest[1]};
    const closingShift=x=>Math.max(0,sample(data.lower,Math.min(177,Math.max(42,x)))-sample(data.upper,Math.min(177,Math.max(47,x))));
    const shape=(loops,fn)=>loops.map(loop=>loop.map((p,i)=>{const q=fn(p);return (i?'L':'M')+q[0].toFixed(2)+' '+q[1].toFixed(2)}).join(' ')+'Z').join(' ');
    const ease=t=>t*t*(3-2*t);
    function draw(now){
      const dt=Math.min((now-last)/1000||.016,.05);last=now;const elapsed=(now-start)/1000;
      let shut=0;
      if(!reduced.matches){if(elapsed<1.8)shut=1-ease(Math.max(0,(elapsed-.25)/1.55));else{const phase=(elapsed-1.8)%7;if(phase>6.6){const t=(phase-6.6)/.4;shut=t<.45?ease(t/.45):1-ease((t-.45)/.55)}}}
      const smoothing=reduced.matches?1:1-Math.exp(-dt*10);x+=(targetX-x)*smoothing;y+=(targetY-y)*smoothing;
      nodes.forEach(({part,el},i)=>{const kind=part.kind;el.setAttribute('d',shape(part.loops,p=>{
        let [px,py]=p;
        if(kind==='upper')py+=shut*closingShift(px);
        if(kind==='upper-lash')py+=shut*closingShift(part.cx)*.8;
        if(kind==='pupil'){px+=x;py=85+(py-85)*(1-shut)+y*(1-shut)}
        if(!reduced.matches&&kind!=='pupil'){px+=Math.sin(elapsed*2.1+i)*.12;py+=Math.sin(elapsed*1.8+i*.7)*.18}
        return [px,py]
      }));if(kind==='pupil')el.style.opacity=String(Math.max(0,1-shut*1.4))});
      const upper=data.upper.filter(p=>p[0]>=47&&p[0]<=178).map(([px,py])=>[px,py+shut*closingShift(px)]);
      const lower=data.lower.filter(p=>p[0]>=47&&p[0]<=178).slice().reverse();
      clip.setAttribute('d',shape([upper.concat(lower)],p=>p));
      if(!reduced.matches)noise.setAttribute('baseFrequency',`${.028+Math.sin(elapsed*.65)*.002} ${.06+Math.cos(elapsed*.5)*.003}`);
      frame=requestAnimationFrame(draw);
    }
    function follow(event){const rect=svg.getBoundingClientRect();const cx=rect.left+rect.width*(130-25)/205,cy=rect.top+rect.height*(85-8)/160;const dx=event.clientX-cx,dy=event.clientY-cy;const distance=Math.hypot(dx,dy)||1;const strength=Math.min(1,distance/220);targetX=dx/distance*11*strength;targetY=dy/distance*7*strength}
    function reset(){targetX=targetY=0}
    window.addEventListener('pointermove',follow,{passive:true});document.addEventListener('mouseleave',reset);window.addEventListener('blur',reset);frame=requestAnimationFrame(draw);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',follow);document.removeEventListener('mouseleave',reset);window.removeEventListener('blur',reset);svg.remove()};
  }
  window.createSketchEye=createEye;
  document.querySelectorAll('.sketch-eye-widget').forEach(createEye);
})();

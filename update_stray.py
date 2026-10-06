import re

with open('projects/stray/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Part 1: Header to end of OVERVIEW section
part1_pattern = r'(.*?</div>\s*</div>\s*</div>)(?=\s*<div class="detail-image" style="margin-bottom: 140px;">)'
m1 = re.search(part1_pattern, content, flags=re.DOTALL)
if not m1:
    print("Part 1 not found")
    exit(1)
part1 = m1.group(1)

# Part 3: project-navigation to end of file
# If project-navigation doesn't exist, we find </article>
part3_pattern = r'(<div class="project-navigation".*)'
m3 = re.search(part3_pattern, content, flags=re.DOTALL)
if not m3:
    part3_pattern = r'(</article>.*)'
    m3 = re.search(part3_pattern, content, flags=re.DOTALL)
if not m3:
    print("Part 3 not found")
    exit(1)
part3 = m3.group(1)

new_content = """
<div class="detail-section" style="margin-bottom: 140px; margin-top: 80px;">
    <span class="eyebrow" style="margin-bottom: 15px; display: block;">01 / RESEARCH QUESTION</span>
    <p class="detail-body" style="font-size: 1.5rem; line-height: 1.4; font-weight: bold;">What if an interior was designed not to guide people efficiently, but to make wandering possible?</p>
    <p class="detail-body">STRAY investigates wandering as a spatial behavior rather than a form of inefficiency. Drawing from the flâneur, psychogeography, and serendipitous encounter, the project asks how architecture might create conditions for observation, hesitation, discovery, and unplanned social contact rather than prescribing a single efficient route.</p>

    <div class="detail-image" style="background: rgba(52, 122, 89, 0.05); height: 50vh; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 40px 0; color: var(--primary); font-family: monospace; border: 1px dashed rgba(52, 122, 89, 0.3); text-align: center; padding: 20px;">
        <span style="font-size: 1.2rem; margin-bottom: 10px; font-weight: bold;">[ VISUAL: WALKING & WANDERING SKETCHES ]</span>
        <span style="color: #666; font-size: 0.9rem; max-width: 600px;">Crop from Concept Board: Walking/wandering sketches, Observation → Reflection sequence, and fragments related to the flâneur.</span>
    </div>
</div>

<div class="detail-section" style="margin-bottom: 140px;">
    <span class="eyebrow" style="margin-bottom: 15px; display: block;">02 / FROM BEHAVIOR TO SPATIAL SYSTEM</span>
    <p class="detail-body" style="font-size: 1.5rem; line-height: 1.4;">Rather than designing fixed rooms, STRAY organizes conditions for watching, crossing paths, pausing, and changing direction.</p>
    <p class="detail-body">The project translates wandering into a spatial framework rather than a formal aesthetic. Circulation, observation points, transitional zones, and overlapping programs are deliberately arranged so that users can choose whether to pass through, pause, watch, participate, or change direction.</p>

    <div class="detail-image" style="background: rgba(52, 122, 89, 0.05); min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 40px 0; color: var(--primary); font-family: monospace; border: 1px dashed rgba(52, 122, 89, 0.3); text-align: center; padding: 20px; position: relative;">
        <span style="font-size: 1.2rem; margin-bottom: 10px; font-weight: bold;">[ MAIN VISUAL: EXPLODED AXONOMETRIC ]</span>
        <span style="color: #666; font-size: 0.9rem;">Crop from Development Board: Large exploded axonometric.</span>
        
        <div style="margin-top: 30px; display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
            <div style="background: white; padding: 10px 15px; border: 1px solid rgba(52,122,89,0.2); font-size: 0.85rem;"><strong>WANDER</strong> — circulation without a single prescribed path</div>
            <div style="background: white; padding: 10px 15px; border: 1px solid rgba(52,122,89,0.2); font-size: 0.85rem;"><strong>OBSERVE</strong> — edges and elevated positions allow indirect participation</div>
            <div style="background: white; padding: 10px 15px; border: 1px solid rgba(52,122,89,0.2); font-size: 0.85rem;"><strong>ENCOUNTER</strong> — overlapping programs create unexpected crossings</div>
            <div style="background: white; padding: 10px 15px; border: 1px solid rgba(52,122,89,0.2); font-size: 0.85rem;"><strong>RECONFIGURE</strong> — movable elements alter spatial boundaries</div>
        </div>
    </div>

    <div class="detail-image" style="margin: 40px 0; position: relative;">
        <img src="/assets/stray-perspective-section.png" class="lightbox-trigger" data-index="3" alt="Perspective Section" style="width: 100%; height: auto; display: block; cursor: pointer;">
        <div style="position: absolute; top: 20%; left: 10%; background: white; padding: 5px 10px; font-family: monospace; font-size: 0.8rem; color: var(--primary); border: 1px solid var(--primary); box-shadow: 2px 2px 0px rgba(52,122,89,0.2);">watch without participating</div>
        <div style="position: absolute; top: 50%; right: 15%; background: white; padding: 5px 10px; font-family: monospace; font-size: 0.8rem; color: var(--primary); border: 1px solid var(--primary); box-shadow: 2px 2px 0px rgba(52,122,89,0.2);">cross paths unexpectedly</div>
        <div style="position: absolute; bottom: 30%; left: 30%; background: white; padding: 5px 10px; font-family: monospace; font-size: 0.8rem; color: var(--primary); border: 1px solid var(--primary); box-shadow: 2px 2px 0px rgba(52,122,89,0.2);">pause without a fixed task</div>
    </div>
</div>

<div class="detail-section" style="margin-bottom: 140px;">
    <span class="eyebrow" style="margin-bottom: 15px; display: block;">03 / ADAPTABLE BOUNDARIES & TECHNICAL EXECUTION</span>
    <p class="detail-body" style="font-size: 1.5rem; line-height: 1.4;">Architecture as a negotiable boundary: The interior is designed as a system that can be continuously rearranged by its occupants.</p>
    <p class="detail-body">Instead of assigning one permanent function to each room, I developed a movable partition system that allows users to alter enclosure, visibility, proximity, and circulation. The same spatial field can therefore shift between open gathering, fragmented observation, intimate occupation, and redirected movement.</p>
    
    <div class="detail-image" style="background: rgba(52, 122, 89, 0.05); min-height: 50vh; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 40px 0; color: var(--primary); font-family: monospace; border: 1px dashed rgba(52, 122, 89, 0.3); text-align: center; padding: 20px;">
        <span style="font-size: 1.2rem; margin-bottom: 10px; font-weight: bold;">[ VISUAL: TECHNICAL RESOLUTION ]</span>
        <span style="color: #666; font-size: 0.9rem; max-width: 600px;">Crop from Technical Board: Four "possible uses" diagrams (OPEN, FRAGMENT, REDIRECT, ENCLOSE), Moveable wall mechanism, door mechanism frames, and one clear construction/detail drawing.</span>
    </div>
    
    <p class="detail-body" style="font-size: 0.9rem; color: #888; margin-top: 20px; font-family: monospace;"><em>The system was digitally resolved through configuration studies, storage conditions, ceiling relationships, door mechanisms, sections, and construction-scale details.</em></p>
</div>

<div class="detail-section" style="margin-bottom: 140px;">
    <span class="eyebrow" style="margin-bottom: 15px; display: block;">04 / EXPERIENCE</span>
    <p class="detail-body" style="font-size: 1.5rem; line-height: 1.4;">Circulation becomes occupation</p>
    <p class="detail-body">The ramp is not treated only as infrastructure for moving from one level to another. It becomes an inhabitable field where people can pause, observe, meet, or remain temporarily detached from the activities around them.</p>

    <div class="detail-image" style="margin: 40px 0; position: relative;">
        <img src="/assets/stray-project.png" class="lightbox-trigger" data-index="4" alt="The Ramp" style="width: 100%; height: auto; display: block; cursor: pointer;">
        <div style="position: absolute; top: 10%; right: 10%; background: white; padding: 5px 10px; font-family: monospace; font-size: 0.8rem; color: var(--primary); border: 1px solid var(--primary); box-shadow: 2px 2px 0px rgba(52,122,89,0.2);">MOVING</div>
        <div style="position: absolute; top: 40%; left: 10%; background: white; padding: 5px 10px; font-family: monospace; font-size: 0.8rem; color: var(--primary); border: 1px solid var(--primary); box-shadow: 2px 2px 0px rgba(52,122,89,0.2);">WATCHING</div>
        <div style="position: absolute; bottom: 20%; right: 20%; background: white; padding: 5px 10px; font-family: monospace; font-size: 0.8rem; color: var(--primary); border: 1px solid var(--primary); box-shadow: 2px 2px 0px rgba(52,122,89,0.2);">LINGERING</div>
    </div>

    <div style="display: flex; justify-content: center; gap: 40px; margin-top: 40px; font-family: monospace; color: var(--primary); font-size: 1.1rem; text-align: center;">
        <div>
            <span style="color: #888; font-size: 0.8rem; display: block; margin-bottom: 5px;">EFFICIENCY</span>
            A &rarr; B
        </div>
        <div style="border-left: 1px dashed rgba(52, 122, 89, 0.3);"></div>
        <div>
            <span style="color: #888; font-size: 0.8rem; display: block; margin-bottom: 5px;">WANDERING</span>
            pause / detour / encounter / return
        </div>
    </div>
</div>

<div class="detail-section" style="margin-bottom: 140px;">
    <span class="eyebrow" style="margin-bottom: 15px; display: block;">05 / COLLECTIVE SPATIAL MEMORY</span>
    <p class="detail-body" style="font-size: 1.5rem; line-height: 1.4;">Can a space remember its occupants?</p>
    <p class="detail-body">Participatory surfaces extend wandering beyond movement. Traces, marks, and contributions left by one visitor become part of the environment encountered by another, allowing the interior to accumulate a form of collective spatial memory.</p>

    <div class="detail-image" style="background: rgba(52, 122, 89, 0.05); min-height: 40vh; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 40px 0; color: var(--primary); font-family: monospace; border: 1px dashed rgba(52, 122, 89, 0.3); text-align: center; padding: 20px;">
        <span style="font-size: 1.2rem; margin-bottom: 10px; font-weight: bold;">[ VISUAL: INTERACTIVE SURFACES ]</span>
        <span style="color: #666; font-size: 0.9rem; max-width: 600px;">Crop from Technical Board: "transferring the emotions / experiences" drawing.</span>
    </div>

    <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin: 40px 0; font-family: monospace; color: var(--primary); font-size: 0.9rem; flex-wrap: wrap; text-align: center;">
        <span style="background: rgba(52, 122, 89, 0.05); padding: 10px; border-radius: 4px;">visitor A</span>
        <span>&rarr; leaves a trace &rarr;</span>
        <span style="background: rgba(52, 122, 89, 0.05); padding: 10px; border-radius: 4px;">spatial surface changes</span>
        <span>&rarr;</span>
        <span style="background: rgba(52, 122, 89, 0.05); padding: 10px; border-radius: 4px;">visitor B encounters the trace</span>
    </div>

    <p class="detail-body" style="font-size: 1.2rem; font-weight: bold; margin-top: 60px;">STRAY does not propose a finished sequence of predetermined functions. It proposes a spatial framework that remains incomplete until it is occupied, altered, observed, and wandered through.</p>
</div>

<div style="border-top: 1px dashed rgba(52,122,89,0.3); padding-top: 40px; margin-bottom: 80px; font-size: 0.85rem; color: #888; font-family: monospace; line-height: 1.6;">
    <strong style="color: var(--primary);">Individual Academic Project</strong><br>
    Interior Architecture<br>
    Role: Research, spatial design, system development, technical drawings, visualization
</div>

"""

final_content = part1 + "\\n" + new_content + "\\n" + part3
with open('projects/stray/index.html', 'w', encoding='utf-8') as f:
    f.write(final_content)
print("Updated successfully")

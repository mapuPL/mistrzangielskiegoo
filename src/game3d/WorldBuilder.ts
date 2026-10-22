import * as THREE from 'three';
import { AvatarConfig } from '../types/game';

// Procedural texture generator for signs, cobblestones, and grass
export function createGrassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = '#65a30d'; // vibrant fresh meadow green
  ctx.fillRect(0, 0, 256, 256);
  
  // Subtle grass specks
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const s = 1 + Math.random() * 2;
    ctx.fillStyle = Math.random() > 0.5 ? '#84cc16' : '#4d7c0f';
    ctx.fillRect(x, y, s, s * 2);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createCobblestoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, 256, 256);
  
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 3;
  
  const step = 32;
  for (let y = 0; y < 256; y += step) {
    const offset = (y / step) % 2 === 0 ? 0 : step / 2;
    for (let x = -step; x < 256 + step; x += step) {
      ctx.strokeRect(x + offset + 2, y + 2, step - 4, step - 4);
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createTextSignTexture(textEn: string, textPl: string, bgCol: string = '#fef08a'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  
  // Background wooden plank
  ctx.fillStyle = bgCol;
  ctx.fillRect(0, 0, 256, 128);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#854d0e';
  ctx.strokeRect(4, 4, 248, 120);
  
  // Text
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(textEn, 128, 48);
  
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(textPl, 128, 88);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Composite multi-part procedural models (3-12 parts)
export function createStylizedTree(type: 'apple' | 'pine' | 'oak' = 'oak'): THREE.Group {
  const tree = new THREE.Group();
  
  // Trunk (cylinder + bevel base)
  const trunkGeo = new THREE.CylinderGeometry(0.25, 0.4, 2.2, 7);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 1.1;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);
  
  // Root flare
  const rootGeo = new THREE.CylinderGeometry(0.42, 0.6, 0.3, 7);
  const root = new THREE.Mesh(rootGeo, trunkMat);
  root.position.y = 0.15;
  tree.add(root);
  
  // Foliage
  if (type === 'pine') {
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });
    for (let i = 0; i < 3; i++) {
      const coneGeo = new THREE.ConeGeometry(1.6 - i * 0.35, 1.4, 7);
      const cone = new THREE.Mesh(coneGeo, foliageMat);
      cone.position.y = 2.0 + i * 0.9;
      cone.castShadow = true;
      cone.receiveShadow = true;
      tree.add(cone);
    }
  } else {
    // Round layered foliage
    const foliageMat = new THREE.MeshStandardMaterial({
      color: type === 'apple' ? 0x22c55e : 0x15803d,
      roughness: 0.75
    });
    
    const bulb1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4, 1), foliageMat);
    bulb1.position.set(0, 2.5, 0);
    bulb1.castShadow = true;
    tree.add(bulb1);

    const bulb2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.0, 1), foliageMat);
    bulb2.position.set(0.6, 2.9, 0.3);
    bulb2.castShadow = true;
    tree.add(bulb2);

    const bulb3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 1), foliageMat);
    bulb3.position.set(-0.5, 2.8, -0.4);
    bulb3.castShadow = true;
    tree.add(bulb3);

    // If apple tree, add 4 cute red apples
    if (type === 'apple') {
      const appleMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      const applePos = [
        [0.8, 2.3, 0.7],
        [-0.7, 2.6, 0.6],
        [0.3, 3.2, -0.8],
        [-0.6, 2.2, -0.7]
      ];
      applePos.forEach(([x, y, z]) => {
        const apple = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), appleMat);
        apple.position.set(x, y, z);
        apple.castShadow = true;
        tree.add(apple);
      });
    }
  }

  return tree;
}

// Procedural stylized building (Houses, Library, Bakery, School)
export function createStylizedBuilding(opts: {
  width: number;
  height: number;
  depth: number;
  wallColor: number;
  roofColor: number;
  signEn?: string;
  signPl?: string;
  hasClock?: boolean;
}): THREE.Group {
  const building = new THREE.Group();
  
  // 1. Foundation / Base trim
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(opts.width + 0.3, 0.5, opts.depth + 0.3), baseMat);
  base.position.y = 0.25;
  base.receiveShadow = true;
  building.add(base);

  // 2. Main Walls
  const wallMat = new THREE.MeshStandardMaterial({ color: opts.wallColor, roughness: 0.7 });
  const walls = new THREE.Mesh(new THREE.BoxGeometry(opts.width, opts.height, opts.depth), wallMat);
  walls.position.y = opts.height / 2 + 0.4;
  walls.castShadow = true;
  walls.receiveShadow = true;
  building.add(walls);

  // 3. Gable Roof (slanted triangular prism)
  const roofShape = new THREE.Shape();
  const halfW = (opts.width + 0.6) / 2;
  const roofH = 1.8;
  roofShape.moveTo(-halfW, 0);
  roofShape.lineTo(0, roofH);
  roofShape.lineTo(halfW, 0);
  roofShape.closePath();

  const extrudeSettings = {
    steps: 1,
    depth: opts.depth + 0.8,
    bevelEnabled: false
  };
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
  const roofMat = new THREE.MeshStandardMaterial({ color: opts.roofColor, roughness: 0.65 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(0, opts.height + 0.4, -(opts.depth + 0.8) / 2);
  roof.castShadow = true;
  building.add(roof);

  // 4. Chimney
  const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.9 });
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 0.7), chimneyMat);
  chimney.position.set(opts.width * 0.25, opts.height + 1.2, 0);
  chimney.castShadow = true;
  building.add(chimney);

  // 5. Door
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x582c0b, roughness: 0.8 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.0, 0.15), doorMat);
  door.position.set(0, 1.2, opts.depth / 2 + 0.08);
  building.add(door);

  // Door knob
  const knobMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 });
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), knobMat);
  knob.position.set(0.35, 1.2, opts.depth / 2 + 0.18);
  building.add(knob);

  // 6. Windows
  const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.2, metalness: 0.3 });
  
  const addWindow = (x: number, y: number, z: number, rotY: number = 0) => {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 0.12), windowFrameMat);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.15), glassMat);
    frame.position.set(x, y, z);
    glass.position.set(x, y, z);
    frame.rotation.y = rotY;
    glass.rotation.y = rotY;
    building.add(frame);
    building.add(glass);
  };

  addWindow(-opts.width * 0.3, 2.2, opts.depth / 2 + 0.07);
  addWindow(opts.width * 0.3, 2.2, opts.depth / 2 + 0.07);

  // 7. Signboard if provided
  if (opts.signEn && opts.signPl) {
    const signTex = createTextSignTexture(opts.signEn, opts.signPl);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.0), signMat);
    sign.position.set(0, opts.height + 0.1, opts.depth / 2 + 0.2);
    building.add(sign);
  }

  // 8. Clock tower if school
  if (opts.hasClock) {
    const towerMat = new THREE.MeshStandardMaterial({ color: opts.wallColor, roughness: 0.7 });
    const tower = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.6, 1.8), towerMat);
    tower.position.set(0, opts.height + 1.8, 0);
    building.add(tower);

    const spireMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
    const spire = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.0, 4), spireMat);
    spire.position.set(0, opts.height + 3.8, 0);
    spire.rotation.y = Math.PI / 4;
    building.add(spire);

    // Clock face
    const clockFace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    clockFace.rotation.x = Math.PI / 2;
    clockFace.position.set(0, opts.height + 2.0, 0.95);
    building.add(clockFace);
  }

  return building;
}

// Procedural NPC 3D models with animations
export function createNPCModel(npcId: string, colorHex: string): THREE.Group {
  const group = new THREE.Group();
  group.name = 'npc_' + npcId;

  if (npcId === 'beep') {
    // Floating robot with eye screen & antenna
    const bodyGeo = new THREE.SphereGeometry(0.65, 12, 12);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.5, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.4;
    body.name = 'beep_body';
    group.add(body);

    // Screen visor
    const visorGeo = new THREE.BoxGeometry(0.6, 0.35, 0.2);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.45, 0.55);
    group.add(visor);

    // Antenna
    const antStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4), bodyMat);
    antStem.position.set(0, 2.15, 0);
    group.add(antStem);

    const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    antTip.position.set(0, 2.4, 0);
    group.add(antTip);

    // Jet hover ring
    const ringGeo = new THREE.TorusGeometry(0.45, 0.08, 8, 16);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.7;
    group.add(ring);

  } else if (npcId === 'foxy') {
    // Fox character with pointed ears and bushy tail
    const furMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.8 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    // Torso with merchant apron
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 1.0, 8), furMat);
    torso.position.y = 1.0;
    group.add(torso);

    const apron = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.1), new THREE.MeshStandardMaterial({ color: 0x16a34a }));
    apron.position.set(0, 0.95, 0.38);
    group.add(apron);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 10), furMat);
    head.position.set(0, 1.7, 0);
    group.add(head);

    // Snout
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 6), whiteMat);
    snout.rotation.x = Math.PI / 2;
    snout.position.set(0, 1.65, 0.45);
    group.add(snout);

    // Nose
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), darkMat);
    nose.position.set(0, 1.65, 0.65);
    group.add(nose);

    // Ears
    [-0.25, 0.25].forEach(x => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 4), furMat);
      ear.position.set(x, 2.2, 0);
      group.add(ear);
    });

    // Bushy Tail
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.9, 6), furMat);
    tail.rotation.x = -Math.PI / 3;
    tail.position.set(0, 0.9, -0.5);
    group.add(tail);

    // Legs
    [-0.2, 0.2].forEach(x => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 6), darkMat);
      leg.position.set(x, 0.25, 0);
      group.add(leg);
    });

  } else if (npcId === 'professor_owl') {
    // Owl character with scholar cap and round belly
    const featherMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.8 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.8 });

    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.65, 10, 10), featherMat);
    body.position.set(0, 1.1, 0);
    group.add(body);

    // Belly patch
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), bellyMat);
    belly.position.set(0, 1.0, 0.3);
    group.add(belly);

    // Eyes with spectacles
    [-0.22, 0.22].forEach(x => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      eye.position.set(x, 1.35, 0.5);
      group.add(eye);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), new THREE.MeshBasicMaterial({ color: 0x000000 }));
      pupil.position.set(x, 1.35, 0.62);
      group.add(pupil);

      // Glasses ring
      const glassesRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.18, 0.03, 6, 12),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
      );
      glassesRing.position.set(x, 1.35, 0.58);
      group.add(glassesRing);
    });

    // Beak
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 4), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 1.2, 0.65);
    group.add(beak);

    // Scholar cap (mortarboard)
    const capBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 8), new THREE.MeshStandardMaterial({ color: 0x1e1b4b }));
    capBase.position.set(0, 1.75, 0);
    group.add(capBase);

    const capTop = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.9), new THREE.MeshStandardMaterial({ color: 0x1e1b4b }));
    capTop.position.set(0, 1.9, 0);
    group.add(capTop);

  } else {
    // Humanoid NPCs (Alex, Daisy, Pierre, Leo)
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.6 });
    const clothesMat = new THREE.MeshStandardMaterial({ color: parseInt(colorHex.replace('#', '0x')), roughness: 0.7 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

    // Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.9, 8), clothesMat);
    torso.position.y = 1.0;
    torso.castShadow = true;
    group.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), skinMat);
    head.position.y = 1.7;
    head.castShadow = true;
    group.add(head);

    // Hat / Hair detail depending on character
    if (npcId === 'alex') {
      // Explorer Safari Hat
      const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.08, 12), new THREE.MeshStandardMaterial({ color: 0xa16207 }));
      hatBrim.position.y = 1.9;
      group.add(hatBrim);
      const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.35, 10), new THREE.MeshStandardMaterial({ color: 0xa16207 }));
      hatCrown.position.y = 2.1;
      group.add(hatCrown);

      // Backpack
      const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.3), new THREE.MeshStandardMaterial({ color: 0x059669 }));
      backpack.position.set(0, 1.1, -0.4);
      group.add(backpack);

    } else if (npcId === 'daisy') {
      // Straw sun hat with flower
      const sunHat = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.06, 12), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
      sunHat.position.y = 1.9;
      group.add(sunHat);

    } else if (npcId === 'pierre') {
      // Baker tall chef hat
      const chefHat = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 0.6, 10), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      chefHat.position.y = 2.1;
      group.add(chefHat);

    } else if (npcId === 'leo') {
      // Stationmaster conductor cap
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.4, 0.25, 10), new THREE.MeshStandardMaterial({ color: 0x1e3a8a }));
      cap.position.y = 2.0;
      group.add(cap);
    }

    // Legs
    [-0.18, 0.18].forEach(x => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 6), darkMat);
      leg.position.set(x, 0.3, 0);
      leg.castShadow = true;
      group.add(leg);
    });

    // Arms
    [-0.45, 0.45].forEach(x => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 6), clothesMat);
      arm.position.set(x, 1.0, 0);
      arm.castShadow = true;
      group.add(arm);
    });
  }

  // Floating speech indicator above head
  const markerGeo = new THREE.ConeGeometry(0.2, 0.4, 4);
  const markerMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
  const marker = new THREE.Mesh(markerGeo, markerMat);
  marker.position.y = 2.7;
  marker.rotation.x = Math.PI;
  marker.name = 'npc_marker';
  group.add(marker);

  return group;
}

// Procedural Player Avatar using player's custom colors & accessories
export function createPlayerMesh(config: AvatarConfig): THREE.Group {
  const player = new THREE.Group();
  player.name = 'player_root';

  const skinMat = new THREE.MeshStandardMaterial({ color: parseInt(config.skinColor.replace('#', '0x')), roughness: 0.6 });
  const outfitMat = new THREE.MeshStandardMaterial({ color: parseInt(config.outfitColor.replace('#', '0x')), roughness: 0.7 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: parseInt(config.pantsColor.replace('#', '0x')), roughness: 0.8 });
  const hairMat = new THREE.MeshStandardMaterial({ color: parseInt(config.hairColor.replace('#', '0x')), roughness: 0.9 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

  // Torso
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.4, 0.9, 8), outfitMat);
  torso.position.y = 1.05;
  torso.castShadow = true;
  torso.name = 'player_torso';
  player.add(torso);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 12, 12), skinMat);
  head.position.y = 1.8;
  head.castShadow = true;
  head.name = 'player_head';
  player.add(head);

  // Friendly Eyes
  [-0.12, 0.12].forEach(x => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    eye.position.set(x, 1.84, 0.32);
    player.add(eye);
  });

  // Hair
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.38, 10, 10), hairMat);
  hair.position.set(0, 1.9, -0.05);
  hair.scale.set(1.0, 0.8, 1.0);
  player.add(hair);

  // Accessory
  if (config.accessory === 'explorer_hat') {
    const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.06, 12), new THREE.MeshStandardMaterial({ color: 0xca8a04 }));
    hatBrim.position.y = 2.05;
    player.add(hatBrim);
    const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.4, 0.3, 10), new THREE.MeshStandardMaterial({ color: 0xca8a04 }));
    hatCrown.position.y = 2.22;
    player.add(hatCrown);
  } else if (config.accessory === 'headphones') {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 6, 12), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
    band.position.set(0, 1.88, 0);
    player.add(band);
    [-0.42, 0.42].forEach(x => {
      const earPad = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 8), new THREE.MeshStandardMaterial({ color: 0x111827 }));
      earPad.position.set(x, 1.85, 0);
      earPad.rotation.z = Math.PI / 2;
      player.add(earPad);
    });
  }

  // Backpack
  const packMat = new THREE.MeshStandardMaterial({ color: parseInt(config.backpackColor.replace('#', '0x')), roughness: 0.7 });
  const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.65, 0.28), packMat);
  backpack.position.set(0, 1.1, -0.38);
  backpack.castShadow = true;
  player.add(backpack);

  // Left & Right Arms (hierarchies for walk swing animation)
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.46, 1.35, 0);
  leftArmPivot.name = 'arm_left';
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 6), outfitMat);
  leftArm.position.y = -0.3;
  leftArm.castShadow = true;
  leftArmPivot.add(leftArm);
  player.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.46, 1.35, 0);
  rightArmPivot.name = 'arm_right';
  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 6), outfitMat);
  rightArm.position.y = -0.3;
  rightArm.castShadow = true;
  rightArmPivot.add(rightArm);
  player.add(rightArmPivot);

  // Left & Right Legs
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.18, 0.6, 0);
  leftLegPivot.name = 'leg_left';
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 6), pantsMat);
  leftLeg.position.y = -0.3;
  leftLeg.castShadow = true;
  leftLegPivot.add(leftLeg);
  const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.28), shoeMat);
  leftShoe.position.set(0, -0.55, 0.05);
  leftLegPivot.add(leftShoe);
  player.add(leftLegPivot);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.18, 0.6, 0);
  rightLegPivot.name = 'leg_right';
  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 6), pantsMat);
  rightLeg.position.y = -0.3;
  rightLeg.castShadow = true;
  rightLegPivot.add(rightLeg);
  const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.28), shoeMat);
  rightShoe.position.set(0, -0.55, 0.05);
  rightLegPivot.add(rightShoe);
  player.add(rightLegPivot);

  // Contact shadow disk beneath player (guarantees grounded feel, per Three.js skill)
  const shadowGeo = new THREE.CircleGeometry(0.5, 16);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.35,
    depthWrite: false
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.02;
  contactShadow.name = 'player_shadow';
  player.add(contactShadow);

  return player;
}

// Word Crystal Collectible (Octahedron with hover rotation and glow)
export function createWordCrystalMesh(wordEn: string, wordPl: string, colorHex: number): THREE.Group {
  const group = new THREE.Group();
  group.name = 'word_crystal';

  // Crystal octahedron
  const geo = new THREE.OctahedronGeometry(0.4, 0);
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.2,
    metalness: 0.4,
    emissive: colorHex,
    emissiveIntensity: 0.4
  });
  const crystal = new THREE.Mesh(geo, mat);
  crystal.position.y = 1.0;
  crystal.castShadow = true;
  group.add(crystal);

  // Floating word sign above crystal
  const signTex = createTextSignTexture(wordEn, wordPl, '#ffffff');
  const signMat = new THREE.MeshBasicMaterial({ map: signTex, transparent: true, opacity: 0.9 });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7), signMat);
  sign.position.y = 1.8;
  group.add(sign);

  return group;
}

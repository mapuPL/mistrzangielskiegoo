import * as THREE from 'three';
import { IslandConfig, IslandId, WordItem } from '../types/game';
import { SoundFx } from '../services/audio';

export interface WorldCallbacks {
  onCollectLetter: (letter: string, remainingWord: string, isWordComplete: boolean) => void;
  onNearNPC: (npcId: string, islandId: IslandId) => void;
  onLeaveNPC: () => void;
  onEnterGate: (gateCategory: string) => void;
  onFallIntoAbyss: () => void;
}

export interface FloatingLetter {
  mesh: THREE.Group;
  char: string;
  wordId: string;
  initialY: number;
  rotationSpeed: number;
  bobPhase: number;
  collected: boolean;
}

export interface GateObject {
  group: THREE.Group;
  categoryId: string;
  namePl: string;
  nameEn: string;
  isCorrect: boolean;
  box: THREE.Box3;
}

export class GameWorld {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private callbacks: WorldCallbacks;

  // Animation & loop
  private animFrameId: number | null = null;
  private clock: THREE.Clock = new THREE.Clock();
  private isDestroyed: boolean = false;

  // Player state
  private playerGroup: THREE.Group = new THREE.Group();
  private playerMeshParts: {
    head: THREE.Mesh;
    torso: THREE.Mesh;
    leftArm: THREE.Mesh;
    rightArm: THREE.Mesh;
    leftLeg: THREE.Mesh;
    rightLeg: THREE.Mesh;
    auraSphere: THREE.Mesh;
    hatGroup: THREE.Group;
    wingsGroup: THREE.Group;
    trailPoints: THREE.Points | null;
  } | null = null;

  public playerPos: THREE.Vector3 = new THREE.Vector3(0, 0.5, 0);
  public playerVelocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public playerRotationY: number = 0;
  public isGrounded: boolean = true;
  private isFallingToAbyss: boolean = false;

  // Camera settings
  private cameraAngle: number = 0;
  private cameraPitch: number = 0.38;
  private cameraDistance: number = 10;
  private isDraggingCamera: boolean = false;
  private prevMouseX: number = 0;
  private prevMouseY: number = 0;

  // World objects
  private dynamicIslandGroup: THREE.Group = new THREE.Group();
  private centralHubGroup: THREE.Group = new THREE.Group();
  private floatingLetters: FloatingLetter[] = [];
  private gates: GateObject[] = [];
  private npcMeshes: { id: string; mesh: THREE.Group; bubble: THREE.Mesh; islandId: IslandId }[] = [];
  private particleSystems: THREE.Points[] = [];

  // Active configurations
  private currentActiveIslands: IslandConfig[] = [];
  private currentQuestWord: WordItem | null = null;
  private collectedLettersInOrder: string[] = [];
  private activeIslandId: IslandId = 'zoo';

  // Inputs
  public moveInput = { x: 0, z: 0 };
  public jumpRequested: boolean = false;

  constructor(container: HTMLElement, callbacks: WorldCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    const aspect = container.clientWidth / (container.clientHeight || 1);
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 500);

    // 3. Renderer with ACESFilmic and PCFSoftShadowMap
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.appendChild(this.renderer.domElement);

    // 4. Groups
    this.scene.add(this.centralHubGroup);
    this.scene.add(this.dynamicIslandGroup);
    this.scene.add(this.playerGroup);

    // 5. Build Hub & Player
    this.buildCentralHub();
    this.createPlayerMesh();

    // 6. Bind events
    this.setupEventListeners();

    // 7. Start render loop
    this.animate();
  }

  /* ==========================================================================
     LIGHTING & ENVIRONMENT
     ========================================================================== */

  public updateEnvironment(timeOfDay: 'morning' | 'noon' | 'sunset' | 'night' | 'dawn', skyColorHex: string, fogColorHex: string) {
    // Clean old lights
    const toRemove: THREE.Object3D[] = [];
    this.scene.traverse(obj => {
      if (obj instanceof THREE.Light) toRemove.push(obj);
    });
    toRemove.forEach(l => this.scene.remove(l));

    const skyColor = new THREE.Color(skyColorHex);
    const fogColor = new THREE.Color(fogColorHex);
    this.scene.background = skyColor;
    this.scene.fog = new THREE.FogExp2(fogColor.getHex(), 0.008);

    let hemiSky = skyColorHex;
    let hemiGround = '#334155';
    let dirColor = '#ffffff';
    let dirIntensity = 1.2;
    let dirPos = new THREE.Vector3(25, 45, 20);

    if (timeOfDay === 'sunset') {
      hemiSky = '#fed7aa';
      hemiGround = '#7c2d12';
      dirColor = '#fdba74';
      dirIntensity = 1.35;
      dirPos.set(40, 25, 30);
    } else if (timeOfDay === 'night') {
      hemiSky = '#1e1b4b';
      hemiGround = '#09090b';
      dirColor = '#93c5fd';
      dirIntensity = 0.55;
      dirPos.set(15, 35, 10);
    } else if (timeOfDay === 'morning' || timeOfDay === 'dawn') {
      hemiSky = '#fef08a';
      hemiGround = '#1e293b';
      dirColor = '#fef9c3';
      dirIntensity = 1.15;
    }

    const hemiLight = new THREE.HemisphereLight(hemiSky, hemiGround, 0.75);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(dirColor, dirIntensity);
    dirLight.position.copy(dirPos);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 120;
    const d = 45;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    const ambientFill = new THREE.AmbientLight(0xffffff, 0.25);
    this.scene.add(ambientFill);
  }

  /* ==========================================================================
     CENTRAL HUB (PCD POLSKA / ROBLOX STYLE)
     ========================================================================== */

  private buildCentralHub() {
    const hub = this.centralHubGroup;
    hub.clear();

    // Central Island Platform (Cylinder)
    const islandGeo = new THREE.CylinderGeometry(14, 15, 4, 32);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // dark asphalt/slate
      roughness: 0.85,
      metalness: 0.1
    });
    const platform = new THREE.Mesh(islandGeo, islandMat);
    platform.position.y = -2;
    platform.receiveShadow = true;
    hub.add(platform);

    // Stone decorative perimeter border
    const rimGeo = new THREE.TorusGeometry(14, 0.45, 8, 32);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.05;
    hub.add(rim);

    // Center Plaza Roundabout
    const plazaGeo = new THREE.CircleGeometry(5.5, 32);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.02;
    plaza.receiveShadow = true;
    hub.add(plaza);

    // Center fountain / magic core
    const fBaseGeo = new THREE.CylinderGeometry(1.4, 1.8, 0.6, 16);
    const fBaseMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6 });
    const fBase = new THREE.Mesh(fBaseGeo, fBaseMat);
    fBase.position.y = 0.3;
    fBase.castShadow = true;
    hub.add(fBase);

    const fCoreGeo = new THREE.OctahedronGeometry(0.7, 0);
    const fCoreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const fCore = new THREE.Mesh(fCoreGeo, fCoreMat);
    fCore.position.y = 1.3;
    hub.add(fCore);

    // FIAT 126p (Kultowy Maluch - PCD Polska)
    const maluch = this.createMaluchCar();
    maluch.position.set(-6, 0.05, 5);
    maluch.rotation.y = 0.4;
    hub.add(maluch);

    // WHITE SEDAN (PCD Polska)
    const sedan = this.createSedanCar();
    sedan.position.set(6, 0.05, -5);
    sedan.rotation.y = -2.2;
    hub.add(sedan);

    // POLISH BUS STOP (Wiata PKS/miejska)
    const busStop = this.createBusShelter();
    busStop.position.set(-8, 0, -4);
    busStop.rotation.y = Math.PI / 4;
    hub.add(busStop);

    // GREEN ROAD SIGNS ("SZCZECIN", "CENTRUM")
    const signSzczecin = this.createPolishRoadSign('CENTRUM ➔', 0.2);
    signSzczecin.position.set(4, 0, 8);
    signSzczecin.rotation.y = -Math.PI / 3;
    hub.add(signSzczecin);

    const signWordland = this.createPolishRoadSign('SZCZECIN 72', -0.15);
    signWordland.position.set(-7, 0, 7);
    signWordland.rotation.y = 0.2;
    hub.add(signWordland);

    // POLISH GREEN FLAGS ON TALL MASTS
    for (let f = 0; f < 3; f++) {
      const angle = (f * Math.PI * 2) / 3;
      const mast = this.createFlagMast();
      mast.position.set(Math.cos(angle) * 11, 0, Math.sin(angle) * 11);
      hub.add(mast);
    }

    // THUJA / CYPRESS SHRUBS (Charakterystyczne polskie żywopłoty)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8 + 0.2;
      const thuja = this.createThujaShrub();
      thuja.position.set(Math.cos(angle) * 12.5, 0, Math.sin(angle) * 12.5);
      hub.add(thuja);
    }
  }

  private createMaluchCar(): THREE.Group {
    const car = new THREE.Group();
    // Body (Fiat 126p cyan blue)
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.8, 2.6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.6;
    body.castShadow = true;
    car.add(body);

    // Cabin roof
    const roofGeo = new THREE.BoxGeometry(1.4, 0.65, 1.4);
    const roof = new THREE.Mesh(roofGeo, bodyMat);
    roof.position.set(0, 1.25, -0.2);
    roof.castShadow = true;
    car.add(roof);

    // Windows
    const winMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 });
    const frontWin = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 0.1), winMat);
    frontWin.position.set(0, 1.25, 0.52);
    car.add(frontWin);

    // Wheels (4)
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 });
    const wPositions = [
      [-0.85, 0.3, 0.8],
      [0.85, 0.3, 0.8],
      [-0.85, 0.3, -0.8],
      [0.85, 0.3, -0.8]
    ];
    wPositions.forEach(p => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(p[0], p[1], p[2]);
      w.castShadow = true;
      car.add(w);
    });

    // Bumpers & headlights
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
    const fBumper = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.15, 0.2), bumperMat);
    fBumper.position.set(0, 0.35, 1.35);
    car.add(fBumper);

    const lightMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.6 });
    const hl1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 10), lightMat);
    hl1.rotation.x = Math.PI / 2;
    hl1.position.set(-0.55, 0.7, 1.32);
    car.add(hl1);
    const hl2 = hl1.clone();
    hl2.position.x = 0.55;
    car.add(hl2);

    return car;
  }

  private createSedanCar(): THREE.Group {
    const car = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 3.4), bodyMat);
    body.position.y = 0.55;
    body.castShadow = true;
    car.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.65, 1.8), bodyMat);
    cabin.position.set(0, 1.15, -0.2);
    cabin.castShadow = true;
    car.add(cabin);

    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.25, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b });
    const wPositions = [
      [-0.95, 0.32, 1.0],
      [0.95, 0.32, 1.0],
      [-0.95, 0.32, -1.0],
      [0.95, 0.32, -1.0]
    ];
    wPositions.forEach(p => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(p[0], p[1], p[2]);
      w.castShadow = true;
      car.add(w);
    });

    return car;
  }

  private createBusShelter(): THREE.Group {
    const shelter = new THREE.Group();
    // Glass/polycarbonate back & sides
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x166534 }); // Polish green bus stop frame
    const roof = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 2.0), frameMat);
    roof.position.set(0, 2.4, 0);
    roof.castShadow = true;
    shelter.add(roof);

    // Pillars
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 8), frameMat);
    p1.position.set(-1.4, 1.2, -0.8);
    shelter.add(p1);
    const p2 = p1.clone();
    p2.position.x = 1.4;
    shelter.add(p2);

    // Bench
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const bench = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.4), benchMat);
    bench.position.set(0, 0.5, -0.6);
    shelter.add(bench);

    return shelter;
  }

  private createPolishRoadSign(text: string, tilt: number): THREE.Group {
    const sign = new THREE.Group();
    // Pole
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 2.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7 })
    );
    pole.position.y = 1.4;
    sign.add(pole);

    // Green plate
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.8, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 })
    );
    plate.position.set(0, 2.2, 0);
    plate.rotation.y = tilt;
    sign.add(plate);

    // Text canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 0, 256, 96);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 244, 84);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 48);
    }
    const tex = new THREE.CanvasTexture(canvas);
    const textMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 0.7),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    );
    textMesh.position.set(0, 2.2, 0.05);
    textMesh.rotation.y = tilt;
    sign.add(textMesh);

    return sign;
  }

  private createFlagMast(): THREE.Group {
    const group = new THREE.Group();
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 6.5, 8),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 })
    );
    pole.position.y = 3.25;
    group.add(pole);

    const flagGeo = new THREE.PlaneGeometry(1.6, 0.9);
    const flagMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      side: THREE.DoubleSide,
      roughness: 0.6
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(0.8, 5.8, 0);
    group.add(flag);

    return group;
  }

  private createThujaShrub(): THREE.Group {
    const thuja = new THREE.Group();
    const h = 2.0 + Math.random() * 0.8;
    const r = 0.5 + Math.random() * 0.2;
    const geo = new THREE.ConeGeometry(r, h, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
    const cone = new THREE.Mesh(geo, mat);
    cone.position.y = h / 2;
    cone.castShadow = true;
    thuja.add(cone);
    return thuja;
  }

  /* ==========================================================================
     DYNAMIC ISLAND GENERATION (3 RANDOMLY SELECTED ISLANDS + CONNECTOR BRIDGES)
     ========================================================================== */

  public loadIslands(activeIslands: IslandConfig[], currentWord: WordItem, initialIslandId?: IslandId) {
    this.currentActiveIslands = activeIslands;
    this.currentQuestWord = currentWord;
    this.collectedLettersInOrder = [];
    this.activeIslandId = initialIslandId || activeIslands[0].id;

    // Clean previous dynamic group
    this.cleanDynamicWorld();

    const islandPositions = [
      { x: 38, z: 0, angle: 0 },
      { x: 0, z: 38, angle: Math.PI / 2 },
      { x: -38, z: 0, angle: Math.PI }
    ];

    activeIslands.forEach((cfg, idx) => {
      const pos = islandPositions[idx % islandPositions.length];
      const islandMesh = this.buildIslandMesh(cfg, pos.x, pos.z, pos.angle);
      this.dynamicIslandGroup.add(islandMesh);

      // Build connector bridge from Hub (r=13) to Island (r=14)
      const bridge = this.createBridge(0, 0, pos.x, pos.z);
      this.dynamicIslandGroup.add(bridge);

      // Add Return Portal back to central Hub
      const portal = this.createReturnPortalArch(pos.x * 0.75, pos.z * 0.75, pos.angle);
      this.dynamicIslandGroup.add(portal);

      // Add NPC for this island
      this.spawnNPC(cfg, pos.x, pos.z);
    });

    // Populate Sorting Gates on the primary active island
    const mainIsland = activeIslands.find(i => i.id === this.activeIslandId) || activeIslands[0];
    this.spawnSortingGates(mainIsland);

    // Spawn 3D floating letters for the active word
    this.spawnLettersForWord(currentWord);

    // Update lighting & atmosphere
    this.updateEnvironment(mainIsland.timeOfDay, mainIsland.skyColor, mainIsland.fogColor);
  }

  private cleanDynamicWorld() {
    this.dynamicIslandGroup.traverse(child => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else if (child.material) {
          child.material.dispose();
        }
      }
    });
    this.dynamicIslandGroup.clear();

    // Clear tracking arrays
    this.floatingLetters = [];
    this.gates = [];
    this.npcMeshes = [];
    this.particleSystems.forEach(p => {
      this.scene.remove(p);
      p.geometry.dispose();
    });
    this.particleSystems = [];
  }

  private buildIslandMesh(cfg: IslandConfig, cx: number, cz: number, angle: number): THREE.Group {
    const group = new THREE.Group();
    group.position.set(cx, 0, cz);

    // Ground platform
    const groundGeo = new THREE.CylinderGeometry(14, 15.5, 4, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(cfg.groundColor),
      roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -2;
    ground.receiveShadow = true;
    group.add(ground);

    // Island Title Marker Banner
    const banner = this.createIslandTitleBanner(cfg.namePl, cfg.nameEn, cfg.themeColor);
    banner.position.set(0, 4.5, -10);
    group.add(banner);

    // Themed Props per Island
    if (cfg.id === 'zoo') {
      for (let i = 0; i < 5; i++) {
        const tree = this.createSafariTree();
        tree.position.set(-8 + i * 4, 0, -4 - Math.sin(i) * 4);
        group.add(tree);
      }
    } else if (cfg.id === 'kitchen') {
      const table = this.createGiantKitchenTable();
      table.position.set(0, 0, -3);
      group.add(table);
    } else if (cfg.id === 'school') {
      const desk = this.createGiantSchoolDesk();
      desk.position.set(0, 0, -3);
      group.add(desk);
    } else if (cfg.id === 'house') {
      const houseRoof = this.createCozyCottage();
      houseRoof.position.set(0, 0, -4);
      group.add(houseRoof);
    } else if (cfg.id === 'colors_numbers') {
      const colors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6];
      colors.forEach((c, i) => {
        const pillar = this.createCrystalPillar(c);
        const a = (i * Math.PI * 2) / colors.length;
        pillar.position.set(Math.cos(a) * 8, 0, Math.sin(a) * 8);
        group.add(pillar);
      });
    } else if (cfg.id === 'body_clothes') {
      const wardrobe = this.createGiantWardrobe();
      wardrobe.position.set(0, 0, -4);
      group.add(wardrobe);
    } else if (cfg.id === 'weather_seasons') {
      const weatherShrine = this.createWeatherShrine();
      weatherShrine.position.set(0, 0, -4);
      group.add(weatherShrine);
    }

    return group;
  }

  private createBridge(x1: number, z1: number, x2: number, z2: number): THREE.Group {
    const bridge = new THREE.Group();
    const dx = x2 - x1;
    const dz = z2 - z1;
    const length = Math.sqrt(dx * dx + dz * dz) - 20; // span between island radii
    const angle = Math.atan2(dz, dx);

    const bridgeGeo = new THREE.BoxGeometry(length, 0.4, 3.2);
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 });
    const bridgeMesh = new THREE.Mesh(bridgeGeo, bridgeMat);

    const midX = (x1 + x2) / 2;
    const midZ = (z1 + z2) / 2;
    bridgeMesh.position.set(midX, -0.2, midZ);
    bridgeMesh.rotation.y = -angle;
    bridgeMesh.receiveShadow = true;
    bridge.add(bridgeMesh);

    // Railings
    const railMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e });
    const r1 = new THREE.Mesh(new THREE.BoxGeometry(length, 0.8, 0.15), railMat);
    r1.position.set(midX, 0.35, midZ);
    r1.rotation.y = -angle;
    r1.translateZ(1.5);
    bridge.add(r1);

    const r2 = r1.clone();
    r2.translateZ(-3.0);
    bridge.add(r2);

    return bridge;
  }

  private createReturnPortalArch(x: number, z: number, angle: number): THREE.Group {
    const portal = new THREE.Group();
    portal.position.set(x, 0, z);
    portal.rotation.y = -angle;

    // Glowing Archway
    const archGeo = new THREE.TorusGeometry(1.8, 0.25, 12, 24, Math.PI);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6
    });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.y = 1.8;
    portal.add(arch);

    // Swirling portal center
    const centerGeo = new THREE.CircleGeometry(1.6, 24);
    const centerMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const center = new THREE.Mesh(centerGeo, centerMat);
    center.position.y = 1.8;
    portal.add(center);

    return portal;
  }

  private createIslandTitleBanner(namePl: string, nameEn: string, themeColor: string): THREE.Group {
    const group = new THREE.Group();
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = themeColor;
      ctx.roundRect(8, 8, 496, 144, 24);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.roundRect(8, 8, 496, 144, 24);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(namePl, 256, 60);

      ctx.font = '26px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText(nameEn, 256, 110);
    }
    const tex = new THREE.CanvasTexture(canvas);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 1.8),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
    );
    group.add(plane);
    return group;
  }

  /* ==========================================================================
     PROPS PROCEDURAL GENERATION
     ========================================================================== */

  private createSafariTree(): THREE.Group {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.5, 3.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
    );
    trunk.position.y = 1.75;
    trunk.castShadow = true;
    tree.add(trunk);

    const foliage = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 1.8, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
    );
    foliage.position.y = 3.8;
    foliage.castShadow = true;
    tree.add(foliage);
    return tree;
  }

  private createGiantKitchenTable(): THREE.Group {
    const group = new THREE.Group();
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.4, 4),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.6 })
    );
    top.position.y = 1.8;
    top.castShadow = true;
    group.add(top);

    // Giant Apple
    const apple = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    apple.position.set(-1.4, 2.7, 0);
    apple.castShadow = true;
    group.add(apple);

    // Giant Milk Bottle
    const milk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 1.6, 12),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    milk.position.set(1.4, 2.7, 0);
    milk.castShadow = true;
    group.add(milk);

    return group;
  }

  private createGiantSchoolDesk(): THREE.Group {
    const group = new THREE.Group();
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.3, 3),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.6 })
    );
    desk.position.y = 1.6;
    desk.castShadow = true;
    group.add(desk);

    // Giant Pencil
    const pencil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 3.2, 8),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 })
    );
    pencil.rotation.z = Math.PI / 2.3;
    pencil.position.set(0, 2.0, 0);
    group.add(pencil);

    return group;
  }

  private createCozyCottage(): THREE.Group {
    const house = new THREE.Group();
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(5, 3, 4),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 })
    );
    base.position.y = 1.5;
    base.castShadow = true;
    house.add(base);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(4.2, 2.2, 4),
      new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.8 })
    );
    roof.position.y = 4.1;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);

    return house;
  }

  private createCrystalPillar(color: number): THREE.Group {
    const group = new THREE.Group();
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.6, 4, 6),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.45,
        roughness: 0.2
      })
    );
    pillar.position.y = 2;
    pillar.castShadow = true;
    group.add(pillar);
    return group;
  }

  private createGiantWardrobe(): THREE.Group {
    const group = new THREE.Group();
    const wardrobe = new THREE.Mesh(
      new THREE.BoxGeometry(4, 4.5, 2),
      new THREE.MeshStandardMaterial({ color: 0x0891b2, roughness: 0.6 })
    );
    wardrobe.position.y = 2.25;
    wardrobe.castShadow = true;
    group.add(wardrobe);
    return group;
  }

  private createWeatherShrine(): THREE.Group {
    const group = new THREE.Group();
    const cloud = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.6, 1),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 })
    );
    cloud.position.y = 3.5;
    group.add(cloud);

    const sunRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.2, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.5 })
    );
    sunRing.position.y = 3.5;
    group.add(sunRing);
    return group;
  }

  /* ==========================================================================
     NPC & QUEST DIALOGUE TRIGGERS
     ========================================================================== */

  private spawnNPC(cfg: IslandConfig, islandX: number, islandZ: number) {
    const npcData = cfg.npc;
    const group = new THREE.Group();
    group.position.set(islandX + 4, 0, islandZ + 4);

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.45, 0.55, 1.4, 12);
    const bodyMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(npcData.color) });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.42, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.95;
    head.castShadow = true;
    group.add(head);

    // Floating Quest Indicator Bubble ('?' or '!')
    const bubbleGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8
    });
    const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
    bubble.position.y = 2.8;
    group.add(bubble);

    this.dynamicIslandGroup.add(group);
    this.npcMeshes.push({ id: npcData.id, mesh: group, bubble, islandId: cfg.id });
  }

  /* ==========================================================================
     SORTING GATES (3-4 ARCHES WITH CATEGORIES)
     ========================================================================== */

  private spawnSortingGates(island: IslandConfig) {
    this.gates = [];
    const categories = [...island.gateCategories].sort(() => 0.5 - Math.random());
    const spacing = 4.5;
    const startX = -((categories.length - 1) * spacing) / 2;

    const islandPos = this.getIslandCenter(island.id);

    categories.forEach((cat, idx) => {
      const gateGroup = new THREE.Group();
      const gx = islandPos.x + startX + idx * spacing;
      const gz = islandPos.z + 8;
      gateGroup.position.set(gx, 0, gz);

      // Arch frame
      const frameGeo = new THREE.BoxGeometry(0.35, 3.2, 0.35);
      const frameMat = new THREE.MeshStandardMaterial({ color: cat.isCorrect ? 0x10b981 : 0x64748b });

      const pLeft = new THREE.Mesh(frameGeo, frameMat);
      pLeft.position.set(-1.2, 1.6, 0);
      gateGroup.add(pLeft);

      const pRight = new THREE.Mesh(frameGeo, frameMat);
      pRight.position.set(1.2, 1.6, 0);
      gateGroup.add(pRight);

      const topBar = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.35, 0.35), frameMat);
      topBar.position.set(0, 3.2, 0);
      gateGroup.add(topBar);

      // Category Name Canvas Banner
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 96;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = cat.isCorrect ? '#059669' : '#475569';
        ctx.roundRect(4, 4, 248, 88, 12);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(cat.namePl, 128, 42);
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.fillText(cat.nameEn, 128, 72);
      }
      const tex = new THREE.CanvasTexture(canvas);
      const signMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 0.85),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
      );
      signMesh.position.set(0, 2.4, 0);
      gateGroup.add(signMesh);

      // Glowing Portal Vortex
      const vortexGeo = new THREE.PlaneGeometry(2.0, 2.8);
      const vortexMat = new THREE.MeshBasicMaterial({
        color: cat.isCorrect ? 0x34d399 : 0x94a3b8,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
      });
      const vortex = new THREE.Mesh(vortexGeo, vortexMat);
      vortex.position.set(0, 1.4, 0);
      gateGroup.add(vortex);

      this.dynamicIslandGroup.add(gateGroup);

      // Bounding box for detection
      const box = new THREE.Box3();
      box.setFromCenterAndSize(new THREE.Vector3(gx, 1.5, gz), new THREE.Vector3(2.4, 3, 1.5));

      this.gates.push({
        group: gateGroup,
        categoryId: cat.id,
        namePl: cat.namePl,
        nameEn: cat.nameEn,
        isCorrect: cat.isCorrect,
        box
      });
    });
  }

  /* ==========================================================================
     3D FLOATING LETTERS (ROTATION, BOBBING, PARTICLES)
     ========================================================================== */

  public spawnLettersForWord(word: WordItem) {
    this.currentQuestWord = word;
    this.collectedLettersInOrder = [];

    // Remove existing letter meshes
    this.floatingLetters.forEach(fl => {
      this.scene.remove(fl.mesh);
      fl.mesh.traverse(c => {
        if (c instanceof THREE.Mesh) {
          c.geometry.dispose();
          if (c.material) c.material.dispose();
        }
      });
    });
    this.floatingLetters = [];

    const letters = word.english.toUpperCase().split('');
    const islandPos = this.getIslandCenter(word.category);

    letters.forEach((char, idx) => {
      const letterGroup = new THREE.Group();

      // Canvas 3D badge for the letter
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(64, 64, 58, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 72px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(char, 64, 68);
      }
      const tex = new THREE.CanvasTexture(canvas);
      const letterPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 1.2),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
      );
      letterGroup.add(letterPlane);

      // Glowing golden ring around letter
      const ringGeo = new THREE.TorusGeometry(0.75, 0.08, 12, 24);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.6
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      letterGroup.add(ring);

      // Scatter letters across the island area
      const angle = (idx * Math.PI * 2) / letters.length + 0.4;
      const dist = 4.5 + (idx % 3) * 2.5;
      const lx = islandPos.x + Math.cos(angle) * dist;
      const lz = islandPos.z + Math.sin(angle) * dist;
      const initialY = 1.6;

      letterGroup.position.set(lx, initialY, lz);
      this.scene.add(letterGroup);

      this.floatingLetters.push({
        mesh: letterGroup,
        char,
        wordId: word.id,
        initialY,
        rotationSpeed: 1.5 + Math.random() * 0.5,
        bobPhase: Math.random() * Math.PI * 2,
        collected: false
      });
    });
  }

  private triggerLetterParticleBurst(x: number, y: number, z: number) {
    const count = 30;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = x + (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 2] = z + (Math.random() - 0.5) * 0.4;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xfef08a, size: 0.25, transparent: true, opacity: 1 });
    const pSystem = new THREE.Points(geo, mat);
    this.scene.add(pSystem);
    this.particleSystems.push(pSystem);

    setTimeout(() => {
      this.scene.remove(pSystem);
      geo.dispose();
      mat.dispose();
      const idx = this.particleSystems.indexOf(pSystem);
      if (idx !== -1) this.particleSystems.splice(idx, 1);
    }, 700);
  }

  /* ==========================================================================
     PLAYER MESH & ROBIC AURA (PCD POLSKA AURA + OUTFIT)
     ========================================================================== */

  private createPlayerMesh() {
    this.playerGroup.position.copy(this.playerPos);

    // Head
    const headGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.7 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.7;
    head.castShadow = true;
    this.playerGroup.add(head);

    // Torso (Jersey '#19 QUEST' style PCD Polska)
    const torsoGeo = new THREE.BoxGeometry(0.85, 0.95, 0.5);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 0.95;
    torso.castShadow = true;
    this.playerGroup.add(torso);

    // Limbs
    const limbMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.8 });
    const armGeo = new THREE.BoxGeometry(0.3, 0.85, 0.35);
    const legGeo = new THREE.BoxGeometry(0.35, 0.9, 0.4);

    const leftArm = new THREE.Mesh(armGeo, torsoMat);
    leftArm.position.set(-0.6, 0.95, 0);
    this.playerGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, torsoMat);
    rightArm.position.set(0.6, 0.95, 0);
    this.playerGroup.add(rightArm);

    const leftLeg = new THREE.Mesh(legGeo, limbMat);
    leftLeg.position.set(-0.25, 0.45, 0);
    this.playerGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, limbMat);
    rightLeg.position.set(0.25, 0.45, 0);
    this.playerGroup.add(rightLeg);

    // Glowing Blue Aura Sphere (Roblox Shield / PCD Polska screenshot style)
    const auraGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      wireframe: false,
      depthWrite: false
    });
    const auraSphere = new THREE.Mesh(auraGeo, auraMat);
    auraSphere.position.y = 1.0;
    this.playerGroup.add(auraSphere);

    // Hat & Wings slots
    const hatGroup = new THREE.Group();
    hatGroup.position.set(0, 2.05, 0);
    this.playerGroup.add(hatGroup);

    const wingsGroup = new THREE.Group();
    wingsGroup.position.set(0, 1.1, -0.3);
    this.playerGroup.add(wingsGroup);

    this.playerMeshParts = {
      head,
      torso,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      auraSphere,
      hatGroup,
      wingsGroup,
      trailPoints: null
    };
  }

  public updateEquippedCosmetics(hatId: string, wingsId: string, trailId: string) {
    if (!this.playerMeshParts) return;

    // 1. Hat
    this.playerMeshParts.hatGroup.clear();
    if (hatId === 'hat_cap') {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.2, 12), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.4), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
      visor.position.set(0, -0.05, 0.35);
      this.playerMeshParts.hatGroup.add(cap, visor);
    } else if (hatId === 'hat_wizard') {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.1, 12), new THREE.MeshStandardMaterial({ color: 0x8b5cf6 }));
      this.playerMeshParts.hatGroup.add(cone);
    } else if (hatId === 'hat_crown') {
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.42, 0.35, 8), new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8 }));
      this.playerMeshParts.hatGroup.add(crown);
    } else if (hatId === 'hat_explorer') {
      const explorer = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.2, 12), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
      this.playerMeshParts.hatGroup.add(explorer);
    }

    // 2. Wings
    this.playerMeshParts.wingsGroup.clear();
    if (wingsId !== 'none') {
      let wingColor = 0xffffff;
      if (wingsId === 'wings_cyber') wingColor = 0x06b6d4;
      if (wingsId === 'wings_dragon') wingColor = 0xdc2626;

      const wingMat = new THREE.MeshStandardMaterial({ color: wingColor, side: THREE.DoubleSide });
      const leftW = new THREE.Mesh(new THREE.BufferGeometry(), wingMat);
      // Simple wing shape
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(-1.2, 0.8);
      shape.lineTo(-1.6, 0.2);
      shape.lineTo(-0.8, -0.4);
      shape.closePath();
      const geom = new THREE.ShapeGeometry(shape);
      const w1 = new THREE.Mesh(geom, wingMat);
      w1.rotation.y = 0.3;
      const w2 = new THREE.Mesh(geom, wingMat);
      w2.scale.x = -1;
      w2.rotation.y = -0.3;
      this.playerMeshParts.wingsGroup.add(w1, w2);
    }
  }

  /* ==========================================================================
     PHYSICS & ABYSS DETECTION (FALLING & SAFE RESPAWN)
     ========================================================================== */

  public getGroundHeightAt(px: number, pz: number): number {
    // 1. Central Hub radius
    const distHub = Math.sqrt(px * px + pz * pz);
    if (distHub <= 14) return 0.5;

    // 2. Active Islands radius
    for (const isl of this.currentActiveIslands) {
      const c = this.getIslandCenter(isl.id);
      const d = Math.sqrt((px - c.x) * (px - c.x) + (pz - c.z) * (pz - c.z));
      if (d <= 14.5) return 0.5;
    }

    // 3. Connector Bridges corridors
    const islandPositions = [
      { x: 38, z: 0 },
      { x: 0, z: 38 },
      { x: -38, z: 0 }
    ];
    for (const pos of islandPositions) {
      const distToSegment = this.distanceToLineSegment(px, pz, 0, 0, pos.x, pos.z);
      if (distToSegment <= 1.8) {
        return 0.5;
      }
    }

    // No ground -> Abyss void!
    return -999;
  }

  private distanceToLineSegment(px: number, pz: number, x1: number, z1: number, x2: number, z2: number): number {
    const l2 = (x2 - x1) * (x2 - x1) + (z2 - z1) * (z2 - z1);
    if (l2 === 0) return Math.sqrt((px - x1) * (px - x1) + (pz - z1) * (pz - z1));
    let t = ((px - x1) * (x2 - x1) + (pz - z1) * (z2 - z1)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * (x2 - x1);
    const projZ = z1 + t * (z2 - z1);
    return Math.sqrt((px - projX) * (px - projX) + (pz - projZ) * (pz - projZ));
  }

  private getIslandCenter(id: IslandId): { x: number; z: number } {
    const idx = this.currentActiveIslands.findIndex(i => i.id === id);
    if (idx === -1) return { x: 0, z: 0 };
    const coords = [
      { x: 38, z: 0 },
      { x: 0, z: 38 },
      { x: -38, z: 0 }
    ];
    return coords[idx % coords.length];
  }

  public teleportToIsland(islandId: IslandId | 'hub') {
    SoundFx.playPortal();
    if (islandId === 'hub') {
      this.playerPos.set(0, 0.5, 0);
    } else {
      const c = this.getIslandCenter(islandId);
      this.playerPos.set(c.x, 0.5, c.z);
      this.activeIslandId = islandId;
      const targetConfig = this.currentActiveIslands.find(i => i.id === islandId);
      if (targetConfig) {
        this.updateEnvironment(targetConfig.timeOfDay, targetConfig.skyColor, targetConfig.fogColor);
      }
    }
    this.playerVelocity.set(0, 0, 0);
    this.isFallingToAbyss = false;
  }

  /* ==========================================================================
     UPDATE LOOP & INTERACTION CHECKS
     ========================================================================== */

  private update(delta: number) {
    if (this.isDestroyed) return;

    // 1. Process movement inputs
    const speed = 8.5;
    const moveX = this.moveInput.x;
    const moveZ = this.moveInput.z;

    const isMoving = Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05;

    if (isMoving && !this.isFallingToAbyss) {
      // Camera relative angle
      const forwardAngle = this.cameraAngle;
      const rightAngle = this.cameraAngle + Math.PI / 2;

      const dirX = Math.sin(forwardAngle) * moveZ + Math.sin(rightAngle) * moveX;
      const dirZ = Math.cos(forwardAngle) * moveZ + Math.cos(rightAngle) * moveX;

      this.playerPos.x += dirX * speed * delta;
      this.playerPos.z += dirZ * speed * delta;

      this.playerRotationY = Math.atan2(dirX, dirZ);
    }

    // 2. Physics: Ground check & gravity
    const groundY = this.getGroundHeightAt(this.playerPos.x, this.playerPos.z);

    if (groundY <= -500) {
      // Over the abyss!
      if (!this.isFallingToAbyss) {
        this.isFallingToAbyss = true;
        SoundFx.playFall();
      }
      this.playerVelocity.y -= 25.0 * delta;
      this.playerPos.y += this.playerVelocity.y * delta;

      // Respawn threshold
      if (this.playerPos.y < -25) {
        this.callbacks.onFallIntoAbyss();
        this.teleportToIsland('hub');
      }
    } else {
      // On ground or jumping
      if (this.jumpRequested && this.isGrounded) {
        this.playerVelocity.y = 11.5;
        this.isGrounded = false;
        this.jumpRequested = false;
        SoundFx.playJump();
      }

      this.playerVelocity.y -= 28.0 * delta;
      this.playerPos.y += this.playerVelocity.y * delta;

      if (this.playerPos.y <= groundY) {
        this.playerPos.y = groundY;
        this.playerVelocity.y = 0;
        this.isGrounded = true;
      }
    }

    // 3. Update player mesh position & limb animation
    this.playerGroup.position.copy(this.playerPos);
    this.playerGroup.rotation.y = this.playerRotationY;

    if (this.playerMeshParts) {
      const time = this.clock.getElapsedTime();
      // Aura pulsation
      const s = 1.0 + Math.sin(time * 4) * 0.06;
      this.playerMeshParts.auraSphere.scale.set(s, s, s);

      if (this.isFallingToAbyss) {
        // Flailing limbs in the air
        this.playerMeshParts.leftArm.rotation.x = Math.sin(time * 15) * 1.5;
        this.playerMeshParts.rightArm.rotation.x = -Math.sin(time * 15) * 1.5;
        this.playerMeshParts.leftLeg.rotation.x = Math.cos(time * 15) * 1.2;
        this.playerMeshParts.rightLeg.rotation.x = -Math.cos(time * 15) * 1.2;
      } else if (!this.isGrounded) {
        // Jumping pose (arms raised, knees slightly bent)
        this.playerMeshParts.leftArm.rotation.x = -2.2;
        this.playerMeshParts.rightArm.rotation.x = -2.2;
        this.playerMeshParts.leftLeg.rotation.x = 0.6;
        this.playerMeshParts.rightLeg.rotation.x = 0.6;
      } else if (isMoving) {
        // Walking stride
        const legSwing = Math.sin(time * 12) * 0.8;
        this.playerMeshParts.leftLeg.rotation.x = legSwing;
        this.playerMeshParts.rightLeg.rotation.x = -legSwing;
        this.playerMeshParts.leftArm.rotation.x = -legSwing;
        this.playerMeshParts.rightArm.rotation.x = legSwing;
      } else {
        // Idle breathing
        this.playerMeshParts.leftLeg.rotation.x = 0;
        this.playerMeshParts.rightLeg.rotation.x = 0;
        this.playerMeshParts.leftArm.rotation.x = 0;
        this.playerMeshParts.rightArm.rotation.x = 0;
        this.playerMeshParts.torso.position.y = 0.95 + Math.sin(time * 2) * 0.02;
      }
    }

    // 4. Camera follow player
    const camTarget = this.playerPos.clone().add(new THREE.Vector3(0, 1.4, 0));
    const camX = this.playerPos.x - Math.sin(this.cameraAngle) * Math.cos(this.cameraPitch) * this.cameraDistance;
    const camY = this.playerPos.y + Math.sin(this.cameraPitch) * this.cameraDistance + 1.2;
    const camZ = this.playerPos.z - Math.cos(this.cameraAngle) * Math.cos(this.cameraPitch) * this.cameraDistance;

    this.camera.position.set(camX, camY, camZ);
    this.camera.lookAt(camTarget);

    // 5. Animate Floating Letters & Check Collection
    const time = this.clock.getElapsedTime();
    this.floatingLetters.forEach(fl => {
      if (!fl.collected) {
        fl.mesh.rotation.y += fl.rotationSpeed * delta;
        fl.mesh.position.y = fl.initialY + Math.sin(time * 3 + fl.bobPhase) * 0.25;

        // Check distance to player
        const dist = this.playerPos.distanceTo(fl.mesh.position);
        if (dist < 1.8) {
          fl.collected = true;
          this.scene.remove(fl.mesh);
          this.triggerLetterParticleBurst(fl.mesh.position.x, fl.mesh.position.y, fl.mesh.position.z);
          SoundFx.playLetterCollect();

          this.collectedLettersInOrder.push(fl.char);
          const fullWord = this.currentQuestWord ? this.currentQuestWord.english.toUpperCase() : '';
          const isComplete = this.collectedLettersInOrder.length >= fullWord.length;
          this.callbacks.onCollectLetter(fl.char, fullWord, isComplete);
        }
      }
    });

    // 6. Check NPC Proximity
    let nearNPCId: string | null = null;
    let nearIsland: IslandId = 'zoo';
    this.npcMeshes.forEach(n => {
      n.bubble.rotation.y += 1.5 * delta;
      n.bubble.position.y = 2.8 + Math.sin(time * 3) * 0.12;

      const dist = this.playerPos.distanceTo(n.mesh.position);
      if (dist < 3.2) {
        nearNPCId = n.id;
        nearIsland = n.islandId;
      }
    });

    if (nearNPCId) {
      this.callbacks.onNearNPC(nearNPCId, nearIsland);
    } else {
      this.callbacks.onLeaveNPC();
    }

    // 7. Check Gate Crossing
    const playerPoint = new THREE.Vector3(this.playerPos.x, this.playerPos.y + 1, this.playerPos.z);
    for (const gate of this.gates) {
      if (gate.box.containsPoint(playerPoint)) {
        this.callbacks.onEnterGate(gate.categoryId);
        break;
      }
    }
  }

  private animate = () => {
    if (this.isDestroyed) return;
    this.animFrameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.update(delta);
    this.renderer.render(this.scene, this.camera);
  };

  /* ==========================================================================
     CONTROLS & EVENT LISTENERS
     ========================================================================== */

  private setupEventListeners() {
    // Mouse Drag for Camera Orbit
    const el = this.renderer.domElement;
    el.addEventListener('mousedown', e => {
      this.isDraggingCamera = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDraggingCamera = false;
    });

    window.addEventListener('mousemove', e => {
      if (!this.isDraggingCamera) return;
      const dx = e.clientX - this.prevMouseX;
      const dy = e.clientY - this.prevMouseY;

      this.cameraAngle -= dx * 0.006;
      this.cameraPitch = Math.max(0.1, Math.min(1.2, this.cameraPitch + dy * 0.005));

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    // Window resize
    window.addEventListener('resize', this.onWindowResize);
  }

  private onWindowResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 1;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public destroy() {
    this.isDestroyed = true;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    this.cleanDynamicWorld();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}

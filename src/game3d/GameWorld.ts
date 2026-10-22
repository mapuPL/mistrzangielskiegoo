import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { AvatarConfig, NPCData } from '../types/game';
import { NPCS_DATA } from '../data/curriculum';
import {
  createGrassTexture,
  createCobblestoneTexture,
  createStylizedTree,
  createStylizedBuilding,
  createNPCModel,
  createPlayerMesh,
  createWordCrystalMesh
} from './WorldBuilder';

export interface WorldInteractable {
  type: 'npc' | 'crystal';
  id: string;
  nameEn: string;
  namePl: string;
  position: THREE.Vector3;
}

export class GameWorld {
  public container: HTMLElement;
  public renderer!: THREE.WebGLRenderer;
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public isSoftwareGl: boolean = false;

  private frameId: number = 0;
  private clock: THREE.Clock = new THREE.Clock();

  // Player & Movement
  public playerMesh!: THREE.Group;
  public playerPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public playerVelocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public playerRotation: number = 0;
  public isGrounded: boolean = true;
  public isRunning: boolean = false;
  private walkCycle: number = 0;

  // Input states
  public keys: { [key: string]: boolean } = {};
  public virtualStick: { x: number; y: number } = { x: 0, y: 0 };
  public virtualJump: boolean = false;
  public virtualSprint: boolean = false;

  // Camera
  private cameraDistance: number = 7.5;
  private cameraPitch: number = 0.35; // radians
  private cameraYaw: number = 0; // radians
  private isPointerDown: boolean = false;
  private prevPointerX: number = 0;
  private prevPointerY: number = 0;

  // Interactables & World objects
  public interactables: WorldInteractable[] = [];
  public currentNearInteractable: WorldInteractable | null = null;
  public onNearInteractableChange?: (item: WorldInteractable | null) => void;
  public onCrystalCollected?: (crystalId: string, wordEn: string, wordPl: string) => void;

  private npcGroups: Map<string, THREE.Group> = new Map();
  private crystalMeshes: Map<string, THREE.Group> = new Map();
  private collectedCrystalIds: Set<string> = new Set();

  // Building collision boxes
  private collisionBoxes: { minX: number; maxX: number; minZ: number; maxZ: number }[] = [];

  constructor(container: HTMLElement, avatarConfig: AvatarConfig, collectedCrystals: string[] = []) {
    this.container = container;
    this.collectedCrystalIds = new Set(collectedCrystals);

    this.detectSoftwareGl();
    this.initScene();
    this.initLighting();
    this.buildTerrain();
    this.buildTownBuildings();
    this.buildFoliage();
    this.buildNPCs();
    this.buildWordCrystals();
    this.buildPlayer(avatarConfig);

    this.setupEventListeners();
    this.startLoop();
  }

  private detectSoftwareGl() {
    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) {
        this.isSoftwareGl = true;
        return;
      }
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      this.isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      this.isSoftwareGl = true;
    }
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xbbf7d0); // fresh morning sky
    this.scene.fog = new THREE.Fog(0xbbf7d0, 25, 65);

    const aspect = this.container.clientWidth / this.container.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 120);

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !this.isSoftwareGl
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.container.appendChild(this.renderer.domElement);

    // Studio Environment map via PMREM
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();
  }

  private initLighting() {
    // Hemisphere light (sky vs ground tint)
    const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x86efac, 0.65);
    this.scene.add(hemiLight);

    // Key directional sunlight
    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.3);
    sunLight.position.set(20, 35, 20);
    if (!this.isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 80;
      const d = 30;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    this.scene.add(sunLight);

    // Warm fill light
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.4);
    fillLight.position.set(-20, 15, -20);
    this.scene.add(fillLight);
  }

  private buildTerrain() {
    // 1. Vast green meadow ground
    const grassTex = createGrassTexture();
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 2. Central Town Plaza (Cobblestones circle)
    const cobbleTex = createCobblestoneTexture();
    const plazaGeo = new THREE.CircleGeometry(14, 32);
    const plazaMat = new THREE.MeshStandardMaterial({
      map: cobbleTex,
      roughness: 0.8
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(0, 0.02, -2);
    plaza.receiveShadow = true;
    this.scene.add(plaza);

    // 3. Central Fountain in Plaza
    const fountainGroup = new THREE.Group();
    fountainGroup.position.set(0, 0, -2);
    
    // Basin ring
    const basinMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 });
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.6, 16), basinMat);
    basin.position.y = 0.3;
    basin.castShadow = true;
    fountainGroup.add(basin);

    // Water surface
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85
    });
    const water = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.1, 16), waterMat);
    water.position.y = 0.55;
    fountainGroup.add(water);

    // Center Spire
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 1.6, 8), basinMat);
    spire.position.y = 1.1;
    fountainGroup.add(spire);

    this.scene.add(fountainGroup);
    this.addCollisionBox(0, -2, 2.8, 2.8);

    // 4. Stylized River on East/South edge
    const riverGeo = new THREE.PlaneGeometry(140, 10);
    const river = new THREE.Mesh(riverGeo, waterMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 0.015, 16);
    this.scene.add(river);

    // Wooden Bridge across river at x = -2
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(-2, 0.2, 16);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.8 });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.25, 12), woodMat);
    deck.position.y = 0.2;
    deck.receiveShadow = true;
    bridgeGroup.add(deck);

    // Bridge railings
    [-2.2, 2.2].forEach(x => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 12), woodMat);
      rail.position.set(x, 0.7, 0);
      rail.castShadow = true;
      bridgeGroup.add(rail);
    });
    this.scene.add(bridgeGroup);
  }

  private addCollisionBox(centerX: number, centerZ: number, width: number, depth: number) {
    this.collisionBoxes.push({
      minX: centerX - width / 2 - 0.4,
      maxX: centerX + width / 2 + 0.4,
      minZ: centerZ - depth / 2 - 0.4,
      maxZ: centerZ + depth / 2 + 0.4
    });
  }

  private buildTownBuildings() {
    // 1. Grand Library (Professor Owl)
    const library = createStylizedBuilding({
      width: 8,
      height: 4.8,
      depth: 6,
      wallColor: 0x818cf8, // soft purple
      roofColor: 0x4338ca,
      signEn: 'LIBRARY',
      signPl: 'BIBLIOTEKA'
    });
    library.position.set(-16, 0, -12);
    this.scene.add(library);
    this.addCollisionBox(-16, -12, 8.5, 6.5);

    // 2. Sunny Bakery (Pierre)
    const bakery = createStylizedBuilding({
      width: 6,
      height: 4.2,
      depth: 5,
      wallColor: 0xfde047, // warm yellow
      roofColor: 0xe11d48, // vibrant red
      signEn: 'BAKERY',
      signPl: 'PIEKARNIA'
    });
    bakery.position.set(14, 0, -16);
    this.scene.add(bakery);
    this.addCollisionBox(14, -16, 6.5, 5.5);

    // 3. Wordland Elementary School with Clock
    const school = createStylizedBuilding({
      width: 10,
      height: 5.5,
      depth: 7,
      wallColor: 0xf97316, // cheerful orange
      roofColor: 0x0284c7, // sky blue
      signEn: 'SCHOOL',
      signPl: 'SZKOŁA',
      hasClock: true
    });
    school.position.set(-10, 0, -28);
    this.scene.add(school);
    this.addCollisionBox(-10, -28, 10.5, 7.5);

    // 4. Market Island Stall (Foxy)
    const marketStall = new THREE.Group();
    marketStall.position.set(18, 0, 2);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const counter = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.0, 2.0), woodMat);
    counter.position.y = 0.5;
    counter.castShadow = true;
    marketStall.add(counter);

    // Striped Awning
    const awningMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
    const awning = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.2, 2.6), awningMat);
    awning.position.set(0, 2.6, 0);
    awning.rotation.x = 0.15;
    awning.castShadow = true;
    marketStall.add(awning);

    // Posts
    [[-1.9, -0.9], [1.9, -0.9], [-1.9, 0.9], [1.9, 0.9]].forEach(([x, z]) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2), woodMat);
      post.position.set(x, 1.4, z);
      post.castShadow = true;
      marketStall.add(post);
    });

    this.scene.add(marketStall);
    this.addCollisionBox(18, 2, 4.4, 2.4);

    // 5. Adventure Train Station (Leo)
    const station = createStylizedBuilding({
      width: 9,
      height: 4.5,
      depth: 5,
      wallColor: 0x0d9488, // teal
      roofColor: 0xb45309,
      signEn: 'STATION',
      signPl: 'STACJA'
    });
    station.position.set(-2, 0, 28);
    this.scene.add(station);
    this.addCollisionBox(-2, 28, 9.5, 5.5);

    // 6. Mystery Zone Portal Archway
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 0, -36);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });

    [-2.2, 2.2].forEach(x => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.0, 1.2), stoneMat);
      pillar.position.set(x, 2.5, 0);
      pillar.castShadow = true;
      portalGroup.add(pillar);
    });

    const lintel = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.2, 1.4), stoneMat);
    lintel.position.set(0, 5.4, 0);
    lintel.castShadow = true;
    portalGroup.add(lintel);

    // Portal energy aura
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const aura = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 4.6), auraMat);
    aura.position.set(0, 2.6, 0);
    portalGroup.add(aura);

    this.scene.add(portalGroup);
  }

  private buildFoliage() {
    const treePositions: { x: number; z: number; type: 'apple' | 'pine' | 'oak' }[] = [
      { x: -7, z: -8, type: 'apple' },
      { x: 9, z: -4, type: 'apple' },
      { x: -14, z: 8, type: 'oak' },
      { x: -18, z: 14, type: 'pine' },
      { x: 12, z: 10, type: 'apple' },
      { x: 22, z: -8, type: 'oak' },
      { x: 6, z: -22, type: 'pine' },
      { x: -22, z: -20, type: 'pine' },
      { x: -6, z: 12, type: 'oak' },
      { x: 16, z: 20, type: 'pine' },
      { x: -24, z: 0, type: 'apple' }
    ];

    treePositions.forEach(p => {
      const tree = createStylizedTree(p.type);
      tree.position.set(p.x, 0, p.z);
      this.scene.add(tree);
      this.addCollisionBox(p.x, p.z, 1.0, 1.0);
    });

    // Street Lamps with warm glowing lanterns
    const lampPositions = [
      { x: -4, z: -6 },
      { x: 4, z: -6 },
      { x: -4, z: 2 },
      { x: 4, z: 2 },
      { x: 12, z: 0 },
      { x: -10, z: -10 }
    ];

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    lampPositions.forEach(lp => {
      const lamp = new THREE.Group();
      lamp.position.set(lp.x, 0, lp.z);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 3.2, 8), metalMat);
      pole.position.y = 1.6;
      pole.castShadow = true;
      lamp.add(pole);

      const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.4), glowMat);
      lantern.position.y = 3.2;
      lamp.add(lantern);

      this.scene.add(lamp);
    });
  }

  private buildNPCs() {
    NPCS_DATA.forEach(npc => {
      const model = createNPCModel(npc.id, npc.color);
      model.position.set(npc.position.x, npc.position.y, npc.position.z);
      this.scene.add(model);
      this.npcGroups.set(npc.id, model);

      this.interactables.push({
        type: 'npc',
        id: npc.id,
        nameEn: npc.name,
        namePl: `${npc.name} (${npc.rolePl})`,
        position: new THREE.Vector3(npc.position.x, npc.position.y, npc.position.z)
      });

      this.addCollisionBox(npc.position.x, npc.position.z, 1.2, 1.2);
    });
  }

  private buildWordCrystals() {
    const crystals = [
      { id: 'crys_yellow', wordEn: 'Yellow', wordPl: 'Żółty', color: 0xfacc15, x: 5, z: 8 },
      { id: 'crys_rabbit', wordEn: 'Rabbit', wordPl: 'Królik', color: 0xf472b6, x: -9, z: 6 },
      { id: 'crys_shoes', wordEn: 'Shoes', wordPl: 'Buty', color: 0x60a5fa, x: 14, z: -6 },
      { id: 'crys_water', wordEn: 'Water', wordPl: 'Woda', color: 0x38bdf8, x: -3, z: 12 },
      { id: 'crys_tree', wordEn: 'Tree', wordPl: 'Drzewo', color: 0x4ade80, x: -14, z: -4 },
      { id: 'crys_guitar', wordEn: 'Guitar', wordPl: 'Gitara', color: 0xfb923c, x: 2, z: -14 }
    ];

    crystals.forEach(c => {
      if (this.collectedCrystalIds.has(c.id)) return;

      const mesh = createWordCrystalMesh(c.wordEn, c.wordPl, c.color);
      mesh.position.set(c.x, 0, c.z);
      this.scene.add(mesh);
      this.crystalMeshes.set(c.id, mesh);

      this.interactables.push({
        type: 'crystal',
        id: c.id,
        nameEn: c.wordEn,
        namePl: `Kryształ Słowa: ${c.wordEn} (${c.wordPl})`,
        position: new THREE.Vector3(c.x, 0, c.z)
      });
    });
  }

  public collectCrystal(crystalId: string) {
    const mesh = this.crystalMeshes.get(crystalId);
    if (mesh) {
      this.scene.remove(mesh);
      this.crystalMeshes.delete(crystalId);
      this.collectedCrystalIds.add(crystalId);
      this.interactables = this.interactables.filter(i => i.id !== crystalId);
      if (this.currentNearInteractable?.id === crystalId) {
        this.currentNearInteractable = null;
        this.onNearInteractableChange?.(null);
      }
    }
  }

  public buildPlayer(config: AvatarConfig) {
    if (this.playerMesh) {
      this.scene.remove(this.playerMesh);
    }
    this.playerMesh = createPlayerMesh(config);
    this.playerMesh.position.copy(this.playerPos);
    this.scene.add(this.playerMesh);
  }

  public updateAvatar(config: AvatarConfig) {
    this.buildPlayer(config);
  }

  private setupEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.handleResize);

    const dom = this.renderer.domElement;
    dom.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    dom.addEventListener('wheel', this.handleWheel, { passive: true });
  }

  public dispose() {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);

    const dom = this.renderer?.domElement;
    if (dom) {
      dom.removeEventListener('pointerdown', this.handlePointerDown);
      window.removeEventListener('pointermove', this.handlePointerMove);
      window.removeEventListener('pointerup', this.handlePointerUp);
      dom.removeEventListener('wheel', this.handleWheel);
      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
    }

    this.renderer?.dispose();
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = true;
    this.keys[e.code] = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = false;
    this.keys[e.code] = false;
  };

  private handleResize = () => {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private handlePointerDown = (e: PointerEvent) => {
    if (e.button === 0) {
      this.isPointerDown = true;
      this.prevPointerX = e.clientX;
      this.prevPointerY = e.clientY;
    }
  };

  private handlePointerMove = (e: PointerEvent) => {
    if (!this.isPointerDown) return;
    const deltaX = e.clientX - this.prevPointerX;
    const deltaY = e.clientY - this.prevPointerY;
    this.prevPointerX = e.clientX;
    this.prevPointerY = e.clientY;

    this.cameraYaw -= deltaX * 0.006;
    this.cameraPitch = Math.max(0.1, Math.min(1.2, this.cameraPitch + deltaY * 0.005));
  };

  private handlePointerUp = () => {
    this.isPointerDown = false;
  };

  private handleWheel = (e: WheelEvent) => {
    this.cameraDistance = Math.max(4.0, Math.min(15.0, this.cameraDistance + e.deltaY * 0.008));
  };

  public rotateCameraBy(deltaX: number, deltaY: number) {
    this.cameraYaw -= deltaX * 0.008;
    this.cameraPitch = Math.max(0.1, Math.min(1.2, this.cameraPitch + deltaY * 0.007));
  }

  private checkCollision(newX: number, newZ: number): boolean {
    // Map outer boundaries (-60 to 60)
    if (Math.abs(newX) > 65 || Math.abs(newZ) > 65) return true;

    for (const b of this.collisionBoxes) {
      if (newX >= b.minX && newX <= b.maxX && newZ >= b.minZ && newZ <= b.maxZ) {
        return true;
      }
    }
    return false;
  }

  private updatePlayer(delta: number) {
    // 1. Gather input
    let moveForward = 0;
    let moveRight = 0;

    if (this.keys['w'] || this.keys['arrowup']) moveForward += 1;
    if (this.keys['s'] || this.keys['arrowdown']) moveForward -= 1;
    if (this.keys['d'] || this.keys['arrowright']) moveRight += 1;
    if (this.keys['a'] || this.keys['arrowleft']) moveRight -= 1;

    // Virtual stick input from mobile
    if (Math.abs(this.virtualStick.y) > 0.1) moveForward -= this.virtualStick.y;
    if (Math.abs(this.virtualStick.x) > 0.1) moveRight += this.virtualStick.x;

    const isSprinting = this.keys['shift'] || this.virtualSprint;
    const baseSpeed = isSprinting ? 9.0 : 5.5;

    // Movement direction relative to camera angle
    let inputDir = new THREE.Vector2(moveRight, moveForward);
    const hasMoveInput = inputDir.lengthSq() > 0.01;

    if (hasMoveInput) {
      if (inputDir.length() > 1) inputDir.normalize();

      // Transform by camera yaw
      const cosYaw = Math.cos(this.cameraYaw);
      const sinYaw = Math.sin(this.cameraYaw);
      const worldDx = inputDir.x * cosYaw - inputDir.y * sinYaw;
      const worldDz = inputDir.x * sinYaw + inputDir.y * cosYaw;

      const targetAngle = Math.atan2(worldDx, worldDz);
      this.playerRotation = THREE.MathUtils.damp(this.playerRotation, targetAngle, 12, delta);

      const stepX = worldDx * baseSpeed * delta;
      const stepZ = worldDz * baseSpeed * delta;

      if (!this.checkCollision(this.playerPos.x + stepX, this.playerPos.z)) {
        this.playerPos.x += stepX;
      }
      if (!this.checkCollision(this.playerPos.x, this.playerPos.z + stepZ)) {
        this.playerPos.z += stepZ;
      }

      this.walkCycle += delta * (isSprinting ? 16 : 10);
    } else {
      this.walkCycle = THREE.MathUtils.damp(this.walkCycle, 0, 10, delta);
    }

    // Jump & Gravity
    const jumpRequested = this.keys[' '] || this.virtualJump;
    if (jumpRequested && this.isGrounded) {
      this.playerVelocity.y = 8.5;
      this.isGrounded = false;
    }

    // Apply gravity
    this.playerVelocity.y -= 22 * delta;
    this.playerPos.y += this.playerVelocity.y * delta;

    if (this.playerPos.y <= 0) {
      this.playerPos.y = 0;
      this.playerVelocity.y = 0;
      this.isGrounded = true;
    }

    // Update player mesh transform
    this.playerMesh.position.copy(this.playerPos);
    this.playerMesh.rotation.y = this.playerRotation;

    // Animate limbs during walk/run
    const leftArm = this.playerMesh.getObjectByName('arm_left');
    const rightArm = this.playerMesh.getObjectByName('arm_right');
    const leftLeg = this.playerMesh.getObjectByName('leg_left');
    const rightLeg = this.playerMesh.getObjectByName('leg_right');
    const torso = this.playerMesh.getObjectByName('player_torso');

    if (leftArm && rightArm && leftLeg && rightLeg && torso) {
      const swing = hasMoveInput ? Math.sin(this.walkCycle) * 0.6 : 0;
      leftArm.rotation.x = -swing;
      rightArm.rotation.x = swing;
      leftLeg.rotation.x = swing;
      rightLeg.rotation.x = -swing;
      torso.position.y = 1.05 + Math.abs(Math.sin(this.walkCycle * 2)) * 0.08;
    }

    // Update camera to follow behind player
    const targetCamX = this.playerPos.x - Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
    const targetCamY = this.playerPos.y + 1.6 + Math.sin(this.cameraPitch) * this.cameraDistance;
    const targetCamZ = this.playerPos.z - Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamX, 10, delta);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetCamY, 10, delta);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, targetCamZ, 10, delta);

    const lookTarget = new THREE.Vector3(this.playerPos.x, this.playerPos.y + 1.4, this.playerPos.z);
    this.camera.lookAt(lookTarget);
  }

  private checkProximity() {
    let nearest: WorldInteractable | null = null;
    let minDist = 3.2; // interaction distance in meters

    for (const item of this.interactables) {
      const dist = this.playerPos.distanceTo(item.position);
      if (dist < minDist) {
        minDist = dist;
        nearest = item;
      }
    }

    if (this.currentNearInteractable?.id !== nearest?.id) {
      this.currentNearInteractable = nearest;
      this.onNearInteractableChange?.(nearest);
    }
  }

  private animateWorldObjects(elapsed: number) {
    // Hover animation for BEEP
    const beep = this.npcGroups.get('beep');
    if (beep) {
      const body = beep.getObjectByName('beep_body');
      if (body) {
        body.position.y = 1.4 + Math.sin(elapsed * 3.5) * 0.12;
      }
    }

    // Animate NPC overhead speech markers
    this.npcGroups.forEach(grp => {
      const marker = grp.getObjectByName('npc_marker');
      if (marker) {
        marker.rotation.y = elapsed * 2;
        marker.position.y = 2.7 + Math.sin(elapsed * 4) * 0.08;
      }
    });

    // Animate Word Crystals (rotation and gentle hover)
    this.crystalMeshes.forEach(mesh => {
      mesh.rotation.y = elapsed * 1.5;
      mesh.position.y = Math.sin(elapsed * 2.5) * 0.15;
    });
  }

  private startLoop() {
    const tick = () => {
      const delta = Math.min(this.clock.getDelta(), 0.1);
      const elapsed = this.clock.getElapsedTime();

      this.updatePlayer(delta);
      this.checkProximity();
      this.animateWorldObjects(elapsed);

      this.renderer.render(this.scene, this.camera);

      if (this.isSoftwareGl) {
        this.afterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    tick();
  }

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 60);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }
}

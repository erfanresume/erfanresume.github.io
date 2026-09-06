import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const canvas = document.getElementById("heroCanvas");
const hero = document.getElementById("home");

if (canvas && hero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 50);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });

  // Keep the image crisp without wasting GPU on very high-DPI displays.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));

  const group = new THREE.Group();
  scene.add(group);

  const nodeCount = 26;
  const nodePositions = new Float32Array(nodeCount * 3);
  const vectors = [];

  for (let i = 0; i < nodeCount; i++) {
    const v = new THREE.Vector3(
      (Math.random() - .5) * 7.4,
      (Math.random() - .5) * 4.5,
      (Math.random() - .5) * 3.6
    );
    vectors.push(v);
    nodePositions[i * 3] = v.x;
    nodePositions[i * 3 + 1] = v.y;
    nodePositions[i * 3 + 2] = v.z;
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));

  const nodeMat = new THREE.PointsMaterial({
    size: .075,
    transparent: true,
    opacity: .8,
    depthWrite: false
  });

  const nodes = new THREE.Points(nodeGeo, nodeMat);
  group.add(nodes);

  const linkPairs = [];
  const lineData = [];
  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      if (vectors[i].distanceTo(vectors[j]) < 1.55) {
        lineData.push(
          vectors[i].x, vectors[i].y, vectors[i].z,
          vectors[j].x, vectors[j].y, vectors[j].z
        );
        linkPairs.push([vectors[i], vectors[j]]);
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineData, 3));
  const lineMat = new THREE.LineBasicMaterial({
    transparent: true,
    opacity: .14,
    depthWrite: false
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  // One Points object for all moving packets.
  const packetCount = Math.min(8, linkPairs.length);
  const packetData = new Float32Array(packetCount * 3);
  const packetState = Array.from({ length: packetCount }, () => ({
    link: Math.floor(Math.random() * Math.max(1, linkPairs.length)),
    t: Math.random(),
    speed: .12 + Math.random() * .12
  }));

  const packetGeo = new THREE.BufferGeometry();
  packetGeo.setAttribute("position", new THREE.BufferAttribute(packetData, 3));
  const packetMat = new THREE.PointsMaterial({
    size: .09,
    transparent: true,
    opacity: .86,
    depthWrite: false
  });
  const packets = new THREE.Points(packetGeo, packetMat);
  group.add(packets);

  // Sparse distant particles.
  const bgCount = 70;
  const bgData = new Float32Array(bgCount * 3);
  for (let i = 0; i < bgCount; i++) {
    bgData[i * 3] = (Math.random() - .5) * 10;
    bgData[i * 3 + 1] = (Math.random() - .5) * 6;
    bgData[i * 3 + 2] = (Math.random() - .5) * 5;
  }
  const bgGeo = new THREE.BufferGeometry();
  bgGeo.setAttribute("position", new THREE.BufferAttribute(bgData, 3));
  const bgMat = new THREE.PointsMaterial({
    size: .018,
    transparent: true,
    opacity: .23,
    depthWrite: false
  });
  const backgroundPoints = new THREE.Points(bgGeo, bgMat);
  group.add(backgroundPoints);

  function cssColor(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    try { return new THREE.Color(v || fallback); }
    catch { return new THREE.Color(fallback); }
  }

  function updateTheme() {
    const accent = cssColor("--accent", "#2f93d6");
    const text = cssColor("--text", "#12283c");
    nodeMat.color.copy(accent);
    lineMat.color.copy(accent);
    bgMat.color.copy(accent);
    packetMat.color.copy(text);
  }

  updateTheme();
  window.addEventListener("themechange", updateTheme);

  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  resize();
  window.addEventListener("resize", resize);

  let pointerX = 0;
  let pointerY = 0;
  window.addEventListener("pointermove", e => {
    pointerX = e.clientX / innerWidth - .5;
    pointerY = e.clientY / innerHeight - .5;
  }, { passive: true });

  let running = false;
  let frameId = 0;
  let last = performance.now();

  function frame(now) {
    if (!running) return;

    const dt = Math.min(.04, (now - last) / 1000);
    last = now;

    group.rotation.y += dt * .035;
    group.rotation.x += ((pointerY * .055) - group.rotation.x) * .025;
    camera.position.x += ((pointerX * .18) - camera.position.x) * .025;
    camera.lookAt(0,0,0);

    if (linkPairs.length) {
      const attr = packetGeo.attributes.position;
      packetState.forEach((p, i) => {
        p.t += dt * p.speed;
        if (p.t > 1) {
          p.t = 0;
          p.link = Math.floor(Math.random() * linkPairs.length);
        }
        const [a,b] = linkPairs[p.link];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const z = a.z + (b.z - a.z) * p.t;
        attr.setXYZ(i, x, y, z);
      });
      attr.needsUpdate = true;
    }

    backgroundPoints.rotation.y -= dt * .012;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(frame);
  }

  function start() {
    if (running || document.hidden) return;
    running = true;
    last = performance.now();
    frameId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frameId);
  }

  const visibilityObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) start();
    else stop();
  }, { threshold: .04 });

  visibilityObserver.observe(hero);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (hero.getBoundingClientRect().bottom > 0 &&
             hero.getBoundingClientRect().top < innerHeight) start();
  });
}



/* =========================================================
   CONTACT NETWORK SCENE — FINAL
   Same visual language as Hero, denser and more energetic.
   ========================================================= */

const contactCanvas = document.getElementById("contactCanvas");
const contactSection = document.getElementById("contact");

if (
  contactCanvas &&
  contactSection &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const cScene = new THREE.Scene();

  const cCamera = new THREE.PerspectiveCamera(
    44,
    1,
    0.1,
    60
  );
  cCamera.position.z = 8.6;

  const cRenderer = new THREE.WebGLRenderer({
    canvas: contactCanvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });

  cRenderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.35)
  );

  const cGroup = new THREE.Group();
  cScene.add(cGroup);

  // Main nodes
  const cNodeCount = 46;
  const cNodePositions = new Float32Array(cNodeCount * 3);
  const cVectors = [];

  for (let i = 0; i < cNodeCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.15 + Math.random() * 3.85;

    const v = new THREE.Vector3(
      Math.cos(angle) * radius * (0.88 + Math.random() * .35),
      (Math.random() - .5) * 4.5,
      Math.sin(angle) * radius * .72 + (Math.random() - .5) * 1.2
    );

    cVectors.push(v);
    cNodePositions[i * 3] = v.x;
    cNodePositions[i * 3 + 1] = v.y;
    cNodePositions[i * 3 + 2] = v.z;
  }

  const cNodeGeo = new THREE.BufferGeometry();
  cNodeGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(cNodePositions, 3)
  );

  const cNodeMat = new THREE.PointsMaterial({
    size: .095,
    transparent: true,
    opacity: .92,
    depthWrite: false
  });

  const cNodes = new THREE.Points(cNodeGeo, cNodeMat);
  cGroup.add(cNodes);

  // Network links
  const cLinks = [];
  const cLineData = [];

  for (let i = 0; i < cVectors.length; i++) {
    for (let j = i + 1; j < cVectors.length; j++) {
      const d = cVectors[i].distanceTo(cVectors[j]);

      if (d < 1.72) {
        cLineData.push(
          cVectors[i].x, cVectors[i].y, cVectors[i].z,
          cVectors[j].x, cVectors[j].y, cVectors[j].z
        );
        cLinks.push([cVectors[i], cVectors[j]]);
      }
    }
  }

  const cLineGeo = new THREE.BufferGeometry();
  cLineGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(cLineData, 3)
  );

  const cLineMat = new THREE.LineBasicMaterial({
    transparent: true,
    opacity: .22,
    depthWrite: false
  });

  const cLines = new THREE.LineSegments(
    cLineGeo,
    cLineMat
  );
  cGroup.add(cLines);

  // Moving packets
  const cPacketCount = Math.min(16, cLinks.length);
  const cPacketData = new Float32Array(cPacketCount * 3);

  const cPacketState = Array.from(
    { length: cPacketCount },
    () => ({
      link: Math.floor(
        Math.random() * Math.max(1, cLinks.length)
      ),
      t: Math.random(),
      speed: .18 + Math.random() * .22
    })
  );

  const cPacketGeo = new THREE.BufferGeometry();
  cPacketGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(cPacketData, 3)
  );

  const cPacketMat = new THREE.PointsMaterial({
    size: .13,
    transparent: true,
    opacity: .98,
    depthWrite: false
  });

  const cPackets = new THREE.Points(
    cPacketGeo,
    cPacketMat
  );
  cGroup.add(cPackets);

  // Soft background particles
  const cBgCount = 100;
  const cBgData = new Float32Array(cBgCount * 3);

  for (let i = 0; i < cBgCount; i++) {
    cBgData[i * 3] = (Math.random() - .5) * 12;
    cBgData[i * 3 + 1] = (Math.random() - .5) * 7;
    cBgData[i * 3 + 2] = (Math.random() - .5) * 6;
  }

  const cBgGeo = new THREE.BufferGeometry();
  cBgGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(cBgData, 3)
  );

  const cBgMat = new THREE.PointsMaterial({
    size: .024,
    transparent: true,
    opacity: .24,
    depthWrite: false
  });

  const cBackground = new THREE.Points(
    cBgGeo,
    cBgMat
  );
  cGroup.add(cBackground);

  // Two subtle orbital rings
  const cOrbitMat1 = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: .09,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const cOrbit1 = new THREE.Mesh(
    new THREE.RingGeometry(3.35, 3.37, 128),
    cOrbitMat1
  );

  cOrbit1.rotation.x = Math.PI / 2.55;
  cOrbit1.rotation.z = .32;

  const cOrbitMat2 = cOrbitMat1.clone();

  const cOrbit2 = new THREE.Mesh(
    new THREE.RingGeometry(4.15, 4.17, 128),
    cOrbitMat2
  );

  cOrbit2.rotation.x = Math.PI / 2.08;
  cOrbit2.rotation.z = -.5;

  cGroup.add(cOrbit1, cOrbit2);

  // Central beacon
  const cCoreGeo = new THREE.BufferGeometry();
  cCoreGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([0, 0, 0], 3)
  );

  const cCoreMat = new THREE.PointsMaterial({
    size: .22,
    transparent: true,
    opacity: .98,
    depthWrite: false
  });

  const cCore = new THREE.Points(
    cCoreGeo,
    cCoreMat
  );
  cGroup.add(cCore);

  function cCssColor(name, fallback) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();

    try {
      return new THREE.Color(value || fallback);
    } catch {
      return new THREE.Color(fallback);
    }
  }

  function cUpdateTheme() {
    const accent = cCssColor("--accent", "#147fc3");
    const text = cCssColor("--text", "#102535");

    cNodeMat.color.copy(accent);
    cLineMat.color.copy(accent);
    cBgMat.color.copy(accent);
    cOrbitMat1.color.copy(accent);
    cOrbitMat2.color.copy(accent);

    cPacketMat.color.copy(text);
    cCoreMat.color.copy(text);
  }

  cUpdateTheme();
  window.addEventListener("themechange", cUpdateTheme);

  function cResize() {
    const r = contactCanvas.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);

    cCamera.aspect = w / h;
    cCamera.updateProjectionMatrix();
    cRenderer.setSize(w, h, false);
  }

  cResize();
  window.addEventListener("resize", cResize);

  let cPointerX = 0;
  let cPointerY = 0;

  window.addEventListener(
    "pointermove",
    e => {
      cPointerX = e.clientX / innerWidth - .5;
      cPointerY = e.clientY / innerHeight - .5;
    },
    { passive: true }
  );

  let cRunning = false;
  let cFrameId = 0;
  let cLast = performance.now();

  function cFrame(now) {
    if (!cRunning) return;

    const dt = Math.min(.04, (now - cLast) / 1000);
    const t = now * .001;
    cLast = now;

    // More energetic than Hero, but still controlled.
    cGroup.rotation.y += dt * .052;

    cGroup.rotation.x += (
      cPointerY * .10 - cGroup.rotation.x
    ) * .026;

    cCamera.position.x += (
      cPointerX * .40 - cCamera.position.x
    ) * .026;

    cCamera.position.y += (
      -cPointerY * .16 - cCamera.position.y
    ) * .022;

    // Breathing orbital motion.
    cOrbit1.rotation.z += dt * .046;
    cOrbit2.rotation.z -= dt * .031;

    const s1 = 1 + Math.sin(t * 1.25) * .021;
    const s2 = 1 + Math.sin(t * .92 + 1.3) * .026;

    cOrbit1.scale.setScalar(s1);
    cOrbit2.scale.setScalar(s2);

    cCoreMat.size =
      .19 + (Math.sin(t * 2.4) + 1) * .035;

    // Packets travel along actual connections.
    if (cLinks.length) {
      const attr = cPacketGeo.attributes.position;

      cPacketState.forEach((packet, i) => {
        packet.t += dt * packet.speed;

        if (packet.t > 1) {
          packet.t = 0;
          packet.link = Math.floor(
            Math.random() * cLinks.length
          );
        }

        const [a, b] = cLinks[packet.link];

        attr.setXYZ(
          i,
          a.x + (b.x - a.x) * packet.t,
          a.y + (b.y - a.y) * packet.t,
          a.z + (b.z - a.z) * packet.t
        );
      });

      attr.needsUpdate = true;
    }

    cBackground.rotation.y -= dt * .016;
    cBackground.rotation.x += dt * .004;

    cCamera.lookAt(0, 0, 0);
    cRenderer.render(cScene, cCamera);

    cFrameId = requestAnimationFrame(cFrame);
  }

  function cStart() {
    if (cRunning || document.hidden) return;

    cRunning = true;
    cLast = performance.now();
    cFrameId = requestAnimationFrame(cFrame);
  }

  function cStop() {
    cRunning = false;
    cancelAnimationFrame(cFrameId);
  }

  const cObserver = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        cResize();
        cStart();
      } else {
        cStop();
      }
    },
    { threshold: .04 }
  );

  cObserver.observe(contactSection);

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        cStop();
      } else {
        const r = contactSection.getBoundingClientRect();

        if (r.bottom > 0 && r.top < innerHeight) {
          cResize();
          cStart();
        }
      }
    }
  );
}

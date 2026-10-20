import type { EffectHandle } from "../types";
import { onResize } from "../layout/resize";

/**
 * WebGL globe (dotted sphere + marker points + flyline arcs).
 * The `three` module is injected by the shell so @dv/core stays dependency-free:
 * `createGlobe(el, THREE, options)` where `THREE = await import("three")` or `import * as THREE`.
 */

export interface GlobeMarker {
  lat: number;
  lng: number;
  /** Color override. */
  color?: string;
}

/** A flyline between two markers, referenced by index into `markers`. */
export type GlobeLine = [number, number];

export interface GlobeOptions {
  /** Surface dot count on the fibonacci sphere. Default 1400. */
  density?: number;
  /** Globe color for surface dots. Default "#0a6dff". */
  color?: string;
  /** Marker color. Default "#ffd54a". */
  markerColor?: string;
  /** Arc line color. Default "rgba(0,246,255,0.6)". */
  lineColor?: string;
  /** Radians/sec auto-rotation speed. Default 0.15. 0 = static. */
  speed?: number;
  /** Globe radius in world units. Default 1. */
  radius?: number;
  markers?: GlobeMarker[];
  lines?: GlobeLine[];
}

export interface GlobeHandle extends EffectHandle {
  setData: (data: { markers?: GlobeMarker[]; lines?: GlobeLine[] }) => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type T = any;

function latLngToVec3(lat: number, lng: number, r: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

export function createGlobe(el: HTMLElement, THREE: T, options: GlobeOptions = {}): GlobeHandle {
  const {
    density = 1400,
    color = "#0a6dff",
    markerColor = "#ffd54a",
    lineColor = "rgba(0,246,255,0.6)",
    speed = 0.15,
    radius = 1,
  } = options;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 3.1);

  const group = new THREE.Group();
  group.rotation.x = 0.35; // slight tilt so flylines read in 3D
  scene.add(group);

  // dotted surface — fibonacci sphere
  const positions = new Float32Array(density * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < density; i++) {
    const y = 1 - (i / (density - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  const globeGeo = new THREE.BufferGeometry();
  globeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const globe = new THREE.Points(
    globeGeo,
    new THREE.PointsMaterial({ color, size: 0.015, transparent: true, opacity: 0.85 }),
  );
  group.add(globe);

  // atmosphere halo — a faint back-face sphere
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.02, 32, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.05 }),
  );
  group.add(halo);

  // data layers, rebuilt by setData
  let dataGroup: T = null;
  const movers: { curve: T; t: number; speed: number; mesh: T }[] = [];

  function buildData(markers: GlobeMarker[] = [], lines: GlobeLine[] = []) {
    if (dataGroup) {
      group.remove(dataGroup);
      dataGroup.traverse((o: T) => {
        o.geometry?.dispose?.();
        o.material?.dispose?.();
      });
    }
    dataGroup = new THREE.Group();
    movers.length = 0;

    const vecs = markers.map((m) => new THREE.Vector3(...latLngToVec3(m.lat, m.lng, radius)));

    for (let i = 0; i < markers.length; i++) {
      const mc = markers[i]?.color ?? markerColor;
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 8, 8),
        new THREE.MeshBasicMaterial({ color: mc }),
      );
      dot.position.copy(vecs[i]);
      dataGroup.add(dot);
      // pulse ring on the surface
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.03, 0.042, 24),
        new THREE.MeshBasicMaterial({
          color: mc,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
        }),
      );
      ring.position.copy(vecs[i].clone().multiplyScalar(1.01));
      ring.lookAt(vecs[i].clone().multiplyScalar(2));
      ring.userData.pulse = true;
      dataGroup.add(ring);
    }

    for (const [a, b] of lines) {
      const va = vecs[a];
      const vb = vecs[b];
      if (!va || !vb) continue;
      const mid = va
        .clone()
        .add(vb)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(radius * (1.15 + va.distanceTo(vb) * 0.28));
      const curve = new THREE.QuadraticBezierCurve3(va, mid, vb);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.55 }),
      );
      dataGroup.add(line);
      const mover = new THREE.Mesh(
        new THREE.SphereGeometry(0.014, 8, 8),
        new THREE.MeshBasicMaterial({ color: "#ffffff" }),
      );
      dataGroup.add(mover);
      movers.push({ curve, t: Math.random(), speed: 0.25 + Math.random() * 0.2, mesh: mover });
    }
    group.add(dataGroup);
  }

  buildData(options.markers, options.lines);

  let raf = 0;
  let last = 0;
  let running = false;
  let elapsed = 0;

  const resize = () => {
    const rect = el.getBoundingClientRect();
    const w = Math.max(rect.width, 1);
    const h = Math.max(rect.height, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const offResize = onResize(el, resize);
  resize();

  const frame = (now: number) => {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    elapsed += dt;
    group.rotation.y += speed * dt;
    for (const m of movers) {
      m.t = (m.t + m.speed * dt) % 1;
      m.mesh.position.copy(m.curve.getPoint(m.t));
    }
    dataGroup?.traverse((o: T) => {
      if (o.userData?.pulse) {
        const s = 1 + 0.35 * Math.sin(elapsed * 3 + o.position.x * 10);
        o.scale.setScalar(s);
      }
    });
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  start();

  return {
    start,
    stop,
    resize,
    setData(data) {
      buildData(data.markers, data.lines);
    },
    destroy() {
      stop();
      offResize();
      globeGeo.dispose();
      el.removeChild(renderer.domElement);
      renderer.dispose();
    },
  };
}

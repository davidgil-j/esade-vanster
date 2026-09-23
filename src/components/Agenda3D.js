'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, RoundedBox } from '@react-three/drei';
import {
  drawCover, drawEndpaper, drawTitlePage, drawPaperBump, drawPageEdge,
  drawName, nameCanvas, ensureFonts,
} from '@/lib/agendaTextures';
import { ESADE } from '@/lib/brand';
import { COVER } from './objects/CoverDesign';

// Agenda Esade 2027 (firma 1 y 3). 1 unidad = 10 cm. A5 = 148 × 210 mm.
const W = 1.48;
const H = 2.1;
const PAD = 0.03; // la tapa sobresale de las hojas
const COVER_T = 0.034; // tapa dura: 3,4 mm
const BLOCK_T = 0.15;
const STACK = COVER_T * 2 + BLOCK_T;
const PIVOT_Y = STACK / 2; // eje de la espiral
const RING_R = PIVOT_Y + 0.02;
const EDGE = RING_R - 0.05; // del eje al borde interior de las hojas
const COVER_W = W + PAD;
const COVER_H = H + PAD * 2;
const COVER_X = EDGE - 0.006 + COVER_W / 2;
const CLOSED_CX = EDGE + W / 2;
const BUMP_REPEAT = [3, 4];
const EDGE_REPEAT = [6, 1];

function useCanvasTexture(canvas, { srgb = true, repeat } = {}) {
  const gl = useThree((s) => s.gl);
  return useMemo(() => {
    if (!canvas) return null;
    const t = new THREE.CanvasTexture(canvas);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = gl.capabilities.getMaxAnisotropy();
    if (repeat) {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat[0], repeat[1]);
    }
    return t;
  }, [canvas, gl, srgb, repeat]);
}

function Book({ name, progressRef, pointerRef, mode, onQuad }) {
  const [canvases, setCanvases] = useState(null);
  const nameCv = useMemo(() => (typeof document !== 'undefined' ? nameCanvas() : null), []);
  const famRef = useRef('Montserrat, sans-serif');

  useEffect(() => {
    let alive = true;
    (async () => {
      const fam = await ensureFonts();
      famRef.current = fam;
      const [cover, title] = await Promise.all([drawCover(), drawTitlePage()]);
      if (!alive) return;
      setCanvases({
        cover,
        title,
        endpaper: drawEndpaper(),
        bump: drawPaperBump(),
        edge: drawPageEdge(),
      });
    })();
    return () => { alive = false; };
  }, []);

  const coverTex = useCanvasTexture(canvases?.cover);
  const titleTex = useCanvasTexture(canvases?.title);
  const endTex = useCanvasTexture(canvases?.endpaper);
  const bumpTex = useCanvasTexture(canvases?.bump, { srgb: false, repeat: BUMP_REPEAT });
  const edgeTex = useCanvasTexture(canvases?.edge, { repeat: EDGE_REPEAT });
  const nameTex = useCanvasTexture(nameCv, { srgb: false });

  // El nombre se redibuja en cada tecla: la estampación cambia al instante.
  useEffect(() => {
    if (!nameCv || !nameTex) return;
    drawName(nameCv, mode === 'render' ? '' : name, famRef.current);
    nameTex.needsUpdate = true;
  }, [name, nameCv, nameTex, canvases, mode]);

  const root = useRef();
  const inner = useRef();
  const coverPivot = useRef();
  const namePlane = useRef();
  const { camera, size } = useThree();

  const mats = useMemo(() => {
    const board = new THREE.MeshPhysicalMaterial({
      color: ESADE.dark, roughness: 0.62, metalness: 0, clearcoat: 0.12, clearcoatRoughness: 0.6,
    });
    const ring = new THREE.MeshPhysicalMaterial({
      color: '#C9CDD3', metalness: 1, roughness: 0.2, clearcoat: 0.4,
    });
    // Estampación en caliente: plata metálica que refleja el entorno de estudio,
    // así el brillo se desplaza cuando la agenda se inclina.
    const foil = new THREE.MeshPhysicalMaterial({
      color: '#E4E7EB', metalness: 1, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08,
      transparent: false, alphaTest: 0.45, envMapIntensity: 1.35,
    });
    return { board, ring, foil };
  }, []);

  useEffect(() => {
    if (nameTex) {
      mats.foil.alphaMap = nameTex;
      mats.foil.needsUpdate = true;
    }
  }, [nameTex, mats]);

  const ringGeo = useMemo(() => new THREE.TorusGeometry(RING_R, 0.011, 12, 48), []);
  const ringCount = 24;
  const ringsRef = useRef();
  useEffect(() => {
    const m = ringsRef.current;
    if (!m) return;
    const d = new THREE.Object3D();
    const span = H - 0.18;
    for (let i = 0; i < ringCount; i++) {
      d.position.set(0, PIVOT_Y, -span / 2 + (span * i) / (ringCount - 1));
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);

  const tilt = useRef({ x: 0, y: 0 });
  const quadSent = useRef(false);

  useFrame((state, delta) => {
    const p = mode === 'render' ? 0 : THREE.MathUtils.clamp(progressRef?.current ?? 0, 0, 1);
    const open = THREE.MathUtils.smoothstep(p, 0.08, 0.92);
    if (coverPivot.current) coverPivot.current.rotation.z = open * Math.PI * 0.985;
    if (inner.current) inner.current.position.x = -CLOSED_CX * (1 - open);

    // Inclinación hacia el puntero con amortiguación crítica, sin rebote (coro 9).
    const px = mode === 'render' ? 0 : pointerRef?.current?.x ?? 0;
    const py = mode === 'render' ? 0 : pointerRef?.current?.y ?? 0;
    const k = 1 - Math.exp(-delta * 5);
    tilt.current.x += (py * 0.1 - tilt.current.x) * k;
    tilt.current.y += (px * 0.16 - tilt.current.y) * k;
    if (root.current) {
      const t = state.clock.elapsedTime;
      const idle = mode === 'render' ? 0 : Math.sin(t * 0.6) * 0.012;
      root.current.rotation.set(tilt.current.x + idle, -0.32 + tilt.current.y * (1 - open * 0.6) + open * 0.32, 0);
    }

    // Encuadre: la cámara se aleja lo justo para que quepa la agenda abierta.
    const spanX = COVER_W + (2 * (EDGE + W + PAD) - COVER_W) * open + 0.2;
    const spanZ = COVER_H + 0.2;
    const vfov = (camera.fov * Math.PI) / 180;
    const aspect = size.width / Math.max(1, size.height);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    const elev = 0.95 - open * 0.22;
    const extV = spanZ * Math.sin(elev) + STACK * Math.cos(elev);
    const fill = mode === 'render' ? 0.86 : 0.8;
    const dist = Math.max(spanX / 2 / Math.tan(hfov / 2), extV / 2 / Math.tan(vfov / 2)) / fill + spanZ * 0.35;
    camera.position.set(0, 0.05 + dist * Math.sin(elev), dist * Math.cos(elev));
    camera.lookAt(0, 0.04, 0.02);

    // En modo render se calcula el cuadrilátero del nombre para superponerlo en la imagen.
    if (mode === 'render' && onQuad && namePlane.current && coverTex && !quadSent.current && state.clock.elapsedTime > 0.5) {
      const n = COVER.name;
      const hw = COVER_W / 2;
      const hh = COVER_H / 2;
      // Rectángulo del nombre en coordenadas locales del plano de la tapa
      // (la parte de arriba del dibujo queda en +y local).
      const x0 = -hw + COVER_W * n.x;
      const x1 = x0 + COVER_W * n.maxW;
      // La caja de la letra: 1 em por encima de la línea base y 0,28 em por debajo
      // (el tamaño del nombre es proporcional al ancho de la tapa).
      const em = COVER_W * n.size;
      const yTop = hh - (COVER_H * n.y - em);
      const yBot = hh - (COVER_H * n.y + em * 0.28);
      const pts = [
        [x0, yTop], [x1, yTop], [x1, yBot], [x0, yBot],
      ].map(([x, y]) => {
        const v = new THREE.Vector3(x, y, 0);
        namePlane.current.localToWorld(v);
        v.project(camera);
        return [(v.x + 1) / 2, (1 - v.y) / 2];
      });
      quadSent.current = true;
      onQuad(pts);
    }
  });

  if (!coverTex) return null;

  const paper = (map) => (
    <meshPhysicalMaterial map={map} bumpMap={bumpTex} bumpScale={0.6} roughness={0.93} sheen={0.2} />
  );

  return (
    <group ref={root}>
      <group ref={inner}>
        {/* Tapa trasera */}
        <RoundedBox args={[COVER_W, COVER_T, COVER_H]} radius={0.006} smoothness={3} position={[COVER_X, COVER_T / 2, 0]} material={mats.board} castShadow />
        {/* Bloque de hojas: canto rayado y portadilla arriba */}
        <mesh position={[EDGE + W / 2, COVER_T + BLOCK_T / 2, 0]}>
          <boxGeometry args={[W, BLOCK_T, H]} />
          <meshStandardMaterial attach="material-0" map={edgeTex} roughness={0.95} />
          <meshStandardMaterial attach="material-1" map={edgeTex} roughness={0.95} />
          <meshPhysicalMaterial attach="material-2" map={titleTex} bumpMap={bumpTex} bumpScale={0.6} roughness={0.93} />
          <meshStandardMaterial attach="material-3" color="#F4F3F0" roughness={0.95} />
          <meshStandardMaterial attach="material-4" map={edgeTex} roughness={0.95} />
          <meshStandardMaterial attach="material-5" map={edgeTex} roughness={0.95} />
        </mesh>
        {/* Tapa delantera, que gira sobre el eje de la espiral */}
        <group ref={coverPivot} position={[0, PIVOT_Y, 0]}>
          <group position={[COVER_X, STACK - COVER_T / 2 - PIVOT_Y, 0]}>
            <RoundedBox args={[COVER_W, COVER_T, COVER_H]} radius={0.006} smoothness={3} material={mats.board} castShadow />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, COVER_T / 2 + 0.0006, 0]}>
              <planeGeometry args={[COVER_W - 0.004, COVER_H - 0.004]} />
              <meshPhysicalMaterial map={coverTex} roughness={0.58} clearcoat={0.15} clearcoatRoughness={0.55} />
            </mesh>
            <mesh ref={namePlane} rotation={[-Math.PI / 2, 0, 0]} position={[0, COVER_T / 2 + 0.0014, 0]} material={mats.foil}>
              <planeGeometry args={[COVER_W - 0.004, COVER_H - 0.004]} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -COVER_T / 2 - 0.0006, 0]}>
              <planeGeometry args={[COVER_W - 0.004, COVER_H - 0.004]} />
              {paper(endTex)}
            </mesh>
          </group>
        </group>
        {/* Espiral metálica */}
        <instancedMesh ref={ringsRef} args={[ringGeo, mats.ring, ringCount]} />
      </group>
    </group>
  );
}

function Studio() {
  // Entorno de estudio suave hecho con softboxes (sin descargas externas).
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2.2} position={[0, 5, 2]} scale={[8, 3, 1]} rotation-x={-Math.PI / 2.6} />
      <Lightformer form="rect" intensity={1.4} position={[-5, 2, 1]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" intensity={0.9} position={[5, 2, -1]} scale={[3, 6, 1]} rotation-y={-Math.PI / 2} />
      <Lightformer form="ring" intensity={1.2} position={[2, 3, 4]} scale={1.6} />
      <mesh scale={30}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshBasicMaterial color="#e9e8ec" side={THREE.BackSide} />
      </mesh>
    </Environment>
  );
}

export default function Agenda3D({ name, progressRef, pointerRef, active = true, mode = 'live', onQuad, onReady }) {
  return (
    <Canvas
      className="agenda3d__canvas"
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: mode === 'render' }}
      camera={{ fov: 26, near: 0.1, far: 60, position: [0, 6, 4] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping; // respeta los azules de Esade
        gl.toneMappingExposure = 1.02;
        gl.setClearColor(0x000000, 0);
        onReady?.();
      }}
    >
      <Studio />
      <directionalLight position={[-2.5, 6, 3]} intensity={0.7} />
      <Book name={name} progressRef={progressRef} pointerRef={pointerRef} mode={mode} onQuad={onQuad} />
      <ContactShadows position={[0, -0.001, 0]} opacity={0.42} scale={9} blur={2.4} far={1.6} resolution={512} color="#16141A" />
    </Canvas>
  );
}

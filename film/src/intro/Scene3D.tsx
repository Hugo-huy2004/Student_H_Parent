import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { random, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { at, clamp01, easeInOut, easeOut, FPS, lerp, T } from "./timeline";

/**
 * Toàn bộ phần 3D của phim intro (render offline từng khung → dùng được chất liệu nặng):
 * ngân hà, đường hầm ánh sáng, 16 mảnh pha lê khúc xạ thật ghép thành ngôi sao, camera bay vòng.
 * (Không dùng EffectComposer: không render được trong Remotion → quầng sáng làm bằng sprite cộng sáng.)
 */

/* ── Hình học: một cánh sao cắt mặt kim cương (giống web: sống giữa + mặt vát 2 mép) ── */
function armGeometry(R: number, inner: number, depth: number, a: number) {
  const pos: number[] = [];
  const P = (ang: number, r: number, z: number) => [Math.cos(ang) * r, Math.sin(ang) * r, z];
  const mid = (u: number[], v: number[], z: number) => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2, z];
  const tip = P(a, R, 0);
  const vL = P(a - Math.PI / 8, inner, 0);
  const vR = P(a + Math.PI / 8, inner, 0);
  for (const s of [1, -1]) {
    const apex = [0, 0, depth * s];
    const m1 = P(a, R * 0.38, depth * 0.72 * s);
    const m2 = P(a, R * 0.72, depth * 0.34 * s);
    const eL = mid(vL, tip, depth * 0.12 * s);
    const eR = mid(vR, tip, depth * 0.12 * s);
    const f = (x: number[], y: number[], z: number[]) => pos.push(...x, ...(s > 0 ? y : z), ...(s > 0 ? z : y));
    f(apex, vL, m1);
    f(vL, eL, m1);
    f(m1, eL, m2);
    f(m2, eL, tip);
    f(apex, m1, vR);
    f(vR, m1, eR);
    f(m1, m2, eR);
    f(m2, tip, eR);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

/** 16 mảnh: 8 cánh lớp ngoài + 8 cánh lớp giữa (lệch 22.5°, nhô lên) */
const PIECES = Array.from({ length: 16 }, (_, i) => {
  const outer = i < 8;
  const k = i % 8;
  const a = Math.PI / 2 + (k * Math.PI) / 4 + (outer ? 0 : Math.PI / 8);
  const dir = new THREE.Vector3(random(`dx${i}`) - 0.5, random(`dy${i}`) - 0.5, random(`dz${i}`) * 0.6 + 0.2).normalize();
  return {
    geo: outer ? armGeometry(2.05, 0.96, 0.46, a) : armGeometry(1.18, 0.56, 0.78, a),
    z: outer ? 0 : 0.1,
    from: dir.multiplyScalar(9 + random(`d${i}`) * 6),
    spin: new THREE.Euler(random(`rx${i}`) * 8 - 4, random(`ry${i}`) * 8 - 4, random(`rz${i}`) * 8 - 4),
    start: T.shards[0] + random(`s${i}`) * 1.5,
  };
});

/** Tinh vân + nền trời: hình cầu lớn bao quanh (vật thể đục → pha lê có thứ để khúc xạ) */
function useNebulaTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 1024;
    const g = c.getContext("2d")!;
    g.fillStyle = "#010516";
    g.fillRect(0, 0, 2048, 1024);
    for (let i = 0; i < 26; i++) {
      const x = random(`nx${i}`) * 2048;
      const y = 300 + random(`ny${i}`) * 420;
      const r = 120 + random(`nr${i}`) * 380;
      const rg = g.createRadialGradient(x, y, 0, x, y, r);
      const hue = random(`nh${i}`) < 0.7 ? "40,90,220" : "120,170,255";
      rg.addColorStop(0, `rgba(${hue},0.06)`);
      rg.addColorStop(1, `rgba(${hue},0)`);
      g.fillStyle = rg;
      g.fillRect(0, 0, 2048, 1024);
    }
    // dải sáng chân trời
    const band = g.createLinearGradient(0, 380, 0, 640);
    band.addColorStop(0, "rgba(60,110,230,0)");
    band.addColorStop(0.5, "rgba(90,140,255,0.05)");
    band.addColorStop(1, "rgba(60,110,230,0)");
    g.fillStyle = band;
    g.fillRect(0, 380, 2048, 260);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

/** "Studio" phản chiếu cho pha lê: nền sáng xanh, tấm sáng trắng / ấm / tối xen kẽ */
function useStudioEnv() {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const s = new THREE.Scene();
    s.background = new THREE.Color(0x9fb6e6);
    const panel = new THREE.PlaneGeometry(1, 1);
    const L: [number, number, number, number, number, number][] = [
      [0xffffff, 8, 0, 6, 2, 4],
      [0xffffff, 5, -6, 1, 3, 3],
      [0xbcd4ff, 4, 6, -1, 2, 3],
      [0x050b25, 1, 0, -6, 1, 5],
      [0xffd9a8, 4, 4, 4, -4, 2],
      [0xffffff, 6, -3, -3, 6, 1.5],
      [0x0a1540, 1, -5, 5, -5, 3],
      [0x050b25, 1, 5, 2, 5, 2],
      [0x2a4fb0, 2, -4, -4, -3, 3],
    ];
    for (const [c, p, x, y, z, k] of L) {
      const m = new THREE.Mesh(panel, new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(p), side: THREE.DoubleSide }));
      m.position.set(x, y, z);
      m.scale.setScalar(k);
      m.lookAt(0, 0, 0);
      s.add(m);
    }
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(s, 0.02).texture;
    scene.environment = env;
    return () => {
      env.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
}

/** Texture quầng sáng tròn và tia lấp lánh 4 cánh (vẽ 1 lần) */
function useSpriteTextures() {
  return useMemo(() => {
    const make = (paint: (g: CanvasRenderingContext2D) => void) => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      paint(c.getContext("2d")!);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    const glow = make((g) => {
      const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      r.addColorStop(0, "rgba(240,247,255,1)");
      r.addColorStop(0.15, "rgba(170,205,255,0.6)");
      r.addColorStop(0.45, "rgba(80,130,240,0.18)");
      r.addColorStop(1, "rgba(40,80,200,0)");
      g.fillStyle = r;
      g.fillRect(0, 0, 256, 256);
    });
    const twinkle = make((g) => {
      g.translate(128, 128);
      for (const rot of [0, Math.PI / 2]) {
        g.save();
        g.rotate(rot);
        const l = g.createLinearGradient(-128, 0, 128, 0);
        l.addColorStop(0, "rgba(255,255,255,0)");
        l.addColorStop(0.5, "rgba(255,255,255,1)");
        l.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = l;
        g.beginPath();
        g.moveTo(-128, 0);
        g.lineTo(0, -5);
        g.lineTo(128, 0);
        g.lineTo(0, 5);
        g.fill();
        g.restore();
      }
      const r = g.createRadialGradient(0, 0, 0, 0, 0, 30);
      r.addColorStop(0, "rgba(255,255,255,1)");
      r.addColorStop(1, "rgba(200,225,255,0)");
      g.fillStyle = r;
      g.fillRect(-30, -30, 60, 60);
    });
    return { glow, twinkle };
  }, []);
}

/** Đầu 8 cánh lớp ngoài: chỗ đặt tia lấp lánh */
const TIPS = Array.from({ length: 8 }, (_, i) => {
  const a = Math.PI / 2 + (i * Math.PI) / 4;
  return [Math.cos(a) * 1.9, Math.sin(a) * 1.9, 0.1] as const;
});

/** Đường hầm ánh sáng: các vệt sáng dài lao về phía camera */
function Tunnel({ t }: { t: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const N = 420;
  const seeds = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const ang = random(`ta${i}`) * Math.PI * 2;
        const r = 1.2 + random(`tr${i}`) * 7;
        return { x: Math.cos(ang) * r, y: Math.sin(ang) * r, z: random(`tz${i}`) * 160 };
      }),
    []
  );
  const k = clamp01((t - T.tunnel[0]) / (T.tunnel[1] - T.tunnel[0]));
  const travel = 260 * easeInOut(k); // quãng đường camera đã lao qua
  const speed = Math.sin(Math.PI * k); // nhanh nhất ở giữa
  const fade = Math.sin(Math.PI * k);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    seeds.forEach((s, i) => {
      const z = ((s.z + travel) % 160) - 150; // lặp vòng
      o.position.set(s.x, s.y, z);
      o.scale.set(1, 1, 0.5 + speed * 22); // vệt kéo dài theo tốc độ
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  if (k <= 0 || k >= 1) return null;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]}>
      <boxGeometry args={[0.025, 0.025, 1]} />
      <meshBasicMaterial color={new THREE.Color(0.75, 0.88, 1.25)} transparent opacity={fade * 0.75} toneMapped={false} />
    </instancedMesh>
  );
}

/** Ngân hà: nhiều lớp sao ở các độ sâu khác nhau */
function Stars({ opacity }: { opacity: number }) {
  const geo = useMemo(() => {
    const n = 3500;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3(random(`sx${i}`) - 0.5, random(`sy${i}`) - 0.5, random(`sz${i}`) - 0.5).normalize();
      v.multiplyScalar(18 + random(`sr${i}`) * 40);
      p.set([v.x, v.y, v.z], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  return (
    <points geometry={geo}>
      <pointsMaterial color={new THREE.Color(1.4, 1.6, 2)} size={0.09} sizeAttenuation transparent opacity={opacity} toneMapped={false} depthWrite={false} />
    </points>
  );
}

export function Scene3D() {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { camera } = useThree();
  useStudioEnv();
  const nebula = useNebulaTexture();
  const sprites = useSpriteTextures();

  const crystal = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1, // pha lê trong suốt, khúc xạ cảnh phía sau
        thickness: 1.4,
        ior: 2.3,
        dispersion: 7, // tán sắc cầu vồng như kim cương
        specularIntensity: 1,
        clearcoat: 1,
        envMapIntensity: 2.2,
        iridescence: 0.25,
        flatShading: true,
        attenuationColor: new THREE.Color(0xdfeaff),
        attenuationDistance: 5,
      }),
    []
  );

  /* ── Camera ── */
  const orbit = Math.PI * easeInOut(clamp01((t - T.orbit[0]) / (T.orbit[1] - T.orbit[0])));
  const camR = 8;
  const tunnelK = clamp01((t - T.tunnel[0]) / (T.tunnel[1] - T.tunnel[0]));
  const drift = t < T.shards[0] ? (t - T.galaxy[0]) * 0.03 : 0; // ngân hà trôi nhẹ
  camera.position.set(Math.sin(orbit) * camR, 0.3 + Math.sin(orbit) * 0.8, Math.cos(orbit) * camR);
  camera.lookAt(0, 0.3, 0); // nhìn cố định → sao bay lên thì lên đầu khung, nhường chỗ cho chữ
  camera.rotateZ(drift * 0.4 + tunnelK * 0.15);

  /* ── Ngôi sao ── */
  const sy = starY(t);
  const ss = starScale(t);
  const spinY = t > T.assemble ? (t - T.assemble) * 0.7 : 0;

  /* ── Độ sáng quầng ── */
  const flash = Math.exp(-(((t - T.assemble) / 0.35) ** 2)) * 3.5;
  const shine = Math.exp(-(((t - T.shine) / 0.9) ** 2)) * 1.6;
  const glowK = 0.6 + flash + shine; // độ sáng quầng quanh sao
  const assembled = t >= T.assemble;

  const skyOpacity = clamp01((t - T.galaxy[0]) / 1.2) * (1 - clamp01((t - T.outro[0]) / 2));

  return (
    <>
      {/* đục (không transparent) để pha lê khúc xạ được; mờ dần bằng cách giảm màu */}
      <mesh>
        <sphereGeometry args={[70, 48, 32]} />
        <meshBasicMaterial map={nebula} side={THREE.BackSide} color={new THREE.Color(skyOpacity, skyOpacity, skyOpacity)} toneMapped={false} />
      </mesh>
      <Stars opacity={skyOpacity} />
      <Tunnel t={t} />

      <group position={[0, sy, 0]} scale={ss} rotation={[Math.sin(t * 0.6) * 0.12, spinY, 0]}>
        {t >= T.shards[0] &&
          PIECES.map((p, i) => {
            // mỗi mảnh bay từ xa, xoay, rồi khớp đúng lúc T.assemble
            const k = easeOut(clamp01((t - p.start) / (T.assemble - p.start)));
            const pos = p.from.clone().multiplyScalar(1 - k);
            return (
              <mesh
                key={i}
                geometry={p.geo}
                material={crystal}
                position={[pos.x, pos.y, pos.z + p.z]}
                rotation={[p.spin.x * (1 - k), p.spin.y * (1 - k), p.spin.z * (1 - k)]}
              />
            );
          })}
        {/* tia lấp lánh ở đầu cánh, nhấp nháy lệch nhịp */}
        {assembled &&
          TIPS.map(([x, y, z], i) => {
            const tw = Math.max(0, Math.sin(t * 2.6 + i * 1.7)) ** 6;
            return (
              <sprite key={i} position={[x, y, z]} scale={0.25 + tw * 1.6}>
                <spriteMaterial map={sprites.twinkle} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={tw} toneMapped={false} />
              </sprite>
            );
          })}
      </group>

      {/* quầng sáng sau ngôi sao (thay cho bloom) */}
      {t >= T.shards[0] && (
        <sprite position={[0, sy, -1.5]} scale={ss * 9 * (0.8 + glowK * 0.5)} renderOrder={-1}>
          <spriteMaterial map={sprites.glow} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={Math.min(1, 0.25 + glowK * 0.3) * at(t, T.shards[0], T.assemble)} toneMapped={false} />
        </sprite>
      )}

      <ambientLight intensity={0.3} />
      <pointLight position={[Math.cos(t * 1.4) * 5, sy + 3, 5]} intensity={80} color="#ffffff" />
      <pointLight position={[-Math.cos(t) * 5, sy - 2, Math.sin(t) * 5]} intensity={50} color="#8fb6ff" />


    </>
  );
}

/** Ngôi sao: giữa màn (cảnh pha lê) → lên trên khi lộ chữ → thu nhỏ biến mất cuối phim */
export function starY(t: number) {
  return lerp(0.3, 2.35, easeInOut(at(t, T.title[0], T.title[0] + 1.6)));
}
export function starScale(t: number) {
  const up = lerp(0.5, 0.26, easeInOut(at(t, T.title[0], T.title[0] + 1.6)));
  return up * (1 - easeInOut(at(t, T.outro[0], T.outro[0] + 1.6)));
}

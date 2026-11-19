import { Vector3 } from "three";

const D2R = Math.PI / 180;

export function latLonToVec3(lat: number, lon: number, r = 1): Vector3 {
  const phi = lat * D2R;
  const lam = lon * D2R;
  return new Vector3(Math.cos(phi) * Math.cos(lam) * r, Math.sin(phi) * r, -Math.cos(phi) * Math.sin(lam) * r);
}

/** Points along the great circle a→b, lifted into an arc above the surface. */
export function arcPoints(a: Vector3, b: Vector3, segments = 64): Vector3[] {
  const ua = a.clone().normalize();
  const ub = b.clone().normalize();
  const omega = ua.angleTo(ub);
  const lift = 0.05 + omega * 0.2;
  const sin = Math.sin(omega) || 1;
  const pts: Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = ua
      .clone()
      .multiplyScalar(Math.sin((1 - t) * omega) / sin)
      .add(ub.clone().multiplyScalar(Math.sin(t * omega) / sin))
      .normalize();
    pts.push(p.multiplyScalar(1 + lift * Math.sin(Math.PI * t)));
  }
  return pts;
}

/** Evenly distributed points on a sphere. */
export function fibonacciSphere(n: number, radius = 1): Vector3[] {
  const out: Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    out.push(new Vector3(Math.cos(th) * r * radius, y * radius, Math.sin(th) * r * radius));
  }
  return out;
}

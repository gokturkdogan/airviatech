"""
Builds public/data/flightmap.json for the 3D flight map (src/components/three/FlightMap.tsx).

Source: Natural Earth 1:50m via the world-atlas package (public domain data, ISC package):
  curl -LO https://unpkg.com/world-atlas@2/land-50m.json
  curl -LO https://unpkg.com/world-atlas@2/countries-50m.json
  python3 scripts/build-flightmap.py land-50m.json countries-50m.json public/data/flightmap.json

Clips land and borders to Europe / Middle East / North Africa, simplifies them
(Douglas-Peucker) and projects to Istanbul-centred Mercator units.
"""
import json, math, sys
land_t = json.load(open(sys.argv[1])); ctry_t = json.load(open(sys.argv[2])); out = sys.argv[3]
BBOX = (-16.0, 14.0, 66.0, 66.0)  # lon0, lat0, lon1, lat1
K = 0.12; LON0, LAT0 = 29.0, 41.0
def decode(topo):
    sx, sy = topo['transform']['scale']; tx, ty = topo['transform']['translate']
    arcs = []
    for arc in topo['arcs']:
        x = y = 0; pts = []
        for dx, dy in arc:
            x += dx; y += dy; pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)
    return arcs
def ring(arcs, idxs):
    pts = []
    for i in idxs:
        a = arcs[i] if i >= 0 else list(reversed(arcs[~i]))
        pts.extend(a if not pts else a[1:])
    return pts
def clip(poly):  # Sutherland–Hodgman against the bbox
    lon0, lat0, lon1, lat1 = BBOX
    edges = [(lambda p: p[0] >= lon0, lambda a, b: inter_x(a, b, lon0)),
             (lambda p: p[0] <= lon1, lambda a, b: inter_x(a, b, lon1)),
             (lambda p: p[1] >= lat0, lambda a, b: inter_y(a, b, lat0)),
             (lambda p: p[1] <= lat1, lambda a, b: inter_y(a, b, lat1))]
    for inside, cut in edges:
        if not poly: break
        res = []; prev = poly[-1]
        for cur in poly:
            if inside(cur):
                if not inside(prev): res.append(cut(prev, cur))
                res.append(cur)
            elif inside(prev): res.append(cut(prev, cur))
            prev = cur
        poly = res
    return poly
def inter_x(a, b, x): t = (x - a[0]) / (b[0] - a[0]); return (x, a[1] + t * (b[1] - a[1]))
def inter_y(a, b, y): t = (y - a[1]) / (b[1] - a[1]); return (a[0] + t * (b[0] - a[0]), y)
def dp(pts, tol):
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]; dx, dy = b[0]-a[0], b[1]-a[1]; L = math.hypot(dx, dy) or 1e-12
    imax, dmax = 0, 0
    for i in range(1, len(pts)-1):
        p = pts[i]
        d = abs(dy*p[0] - dx*p[1] + b[0]*a[1] - b[1]*a[0]) / L if L > 1e-9 else math.hypot(p[0]-a[0], p[1]-a[1])
        if d > dmax: imax, dmax = i, d
    if dmax > tol: return dp(pts[:imax+1], tol)[:-1] + dp(pts[imax:], tol)
    return [a, b]
merc = lambda lat: math.degrees(math.log(math.tan(math.pi/4 + math.radians(lat)/2)))
def proj(p): return (round((p[0]-LON0)*K, 3), round(-(merc(p[1]) - merc(LAT0))*K, 3))
def inside_bbox(p): return BBOX[0] <= p[0] <= BBOX[2] and BBOX[1] <= p[1] <= BBOX[3]

arcs = decode(land_t); land = []
for g in land_t['objects']['land']['geometries']:
    polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
    for poly in polys:
        for k, r in enumerate(poly):
            pts = clip(ring(arcs, r))
            if len(pts) < 4: continue
            pts = dp(pts, 0.04)
            if len(pts) < 4: continue
            flat = [c for p in pts for c in proj(p)]
            land.append({"hole": k > 0, "pts": flat})
carcs = decode(ctry_t); use = {}
for gi, g in enumerate(ctry_t['objects']['countries']['geometries']):
    polys = g.get('arcs', [])
    if g['type'] == 'Polygon': polys = [polys]
    for poly in polys:
        for r in poly:
            for i in r: use.setdefault(i if i >= 0 else ~i, set()).add(gi)
borders = []
for i, gs in use.items():
    if len(gs) < 2: continue
    seg = []
    for p in carcs[i]:
        if inside_bbox(p): seg.append(p)
        elif seg:
            if len(seg) > 1: borders.append(seg)
            seg = []
    if len(seg) > 1: borders.append(seg)
borders = [[c for p in dp(b, 0.03) for c in proj(p)] for b in borders]
json.dump({"k": K, "origin": [LON0, LAT0], "land": land, "borders": borders}, open(out, 'w'), separators=(',', ':'))
print('land rings', len(land), 'points', sum(len(r['pts'])//2 for r in land), 'borders', len(borders), 'pts', sum(len(b)//2 for b in borders))

"""Pure-Python (no numpy) port of galilai-group/lejepa EppsPulley.forward +
SlicingUnivariateTest, on the SAME LCG input the Rust faithfulness test uses.
Prints the true mean-over-slices statistic so the Rust constant can be set to a
value that was actually computed, not guessed."""
import math

N, D, K = 64, 16, 8
T_MAX, NPTS = 3.0, 17

def lcg(seed, count):
    s = seed & ((1 << 64) - 1)
    out = []
    for _ in range(count):
        s = (s * 6364136223846793005 + 1442695040888963407) & ((1 << 64) - 1)
        out.append(((s >> 33) / (1 << 31)) - 1.0)   # matches Rust: (s>>33) as f32/2^31 - 1
    return out

zf = lcg(1, N * D)
z = [zf[r*D:(r+1)*D] for r in range(N)]
gf = lcg(999, K * D)
dirs = []
for i in range(K):
    v = gf[i*D:(i+1)*D]
    nrm = math.sqrt(sum(x*x for x in v))
    dirs.append([x/nrm for x in v])

t = [T_MAX*i/(NPTS-1) for i in range(NPTS)]
dt = T_MAX/(NPTS-1)
phi = [math.exp(-0.5*ti*ti) for ti in t]
w = [(dt if (i==0 or i==NPTS-1) else 2*dt) for i in range(NPTS)]
weights = [w[i]*phi[i] for i in range(NPTS)]

stats = []
for v in dirs:
    proj = [sum(z[r][d]*v[d] for d in range(D)) for r in range(N)]
    st = 0.0
    for p in range(NPTS):
        cm = sum(math.cos(t[p]*x) for x in proj)/N
        sm = sum(math.sin(t[p]*x) for x in proj)/N
        dc = cm - phi[p]
        st += weights[p]*(dc*dc + sm*sm)
    stats.append(st)          # NO xN (the Rust crate drops the xN constant)
print("mean_over_slices_noN = %.8f" % (sum(stats)/K))
print("per_slice:", " ".join("%.6f" % s for s in stats))

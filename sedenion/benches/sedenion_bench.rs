use criterion::{black_box, criterion_group, criterion_main, Criterion};
use sedenion::Sedenion;

fn bench_sedenion_mul(c: &mut Criterion) {
    let a = Sedenion::new([
        1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
        9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0,
    ]);
    let b = Sedenion::new([
        16.0, 15.0, 14.0, 13.0, 12.0, 11.0, 10.0, 9.0,
        8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0,
    ]);

    c.bench_function("sedenion_mul", |bench| {
        bench.iter(|| {
            let _ = black_box(a) * black_box(b);
        });
    });
}

fn bench_sedenion_pow3(c: &mut Criterion) {
    let a = Sedenion::new([
        1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
        9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0,
    ]);

    c.bench_function("sedenion_pow3", |bench| {
        bench.iter(|| {
            let _ = black_box(a).powu(3);
        });
    });
}

fn bench_sedenion_norm(c: &mut Criterion) {
    let a = Sedenion::new([
        1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
        9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0,
    ]);

    c.bench_function("sedenion_norm", |bench| {
        bench.iter(|| {
            let _ = black_box(a).norm();
        });
    });
}

fn bench_sedenion_zda(c: &mut Criterion) {
    let a = Sedenion::new([
        1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
        9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0,
    ]);

    c.bench_function("sedenion_zda_loss", |bench| {
        bench.iter(|| {
            let _ = black_box(a).zda_loss();
        });
    });
}

criterion_group!(benches, bench_sedenion_mul, bench_sedenion_pow3, bench_sedenion_norm, bench_sedenion_zda);
criterion_main!(benches);

//! nav-bakeoff: a fair, reproducible comparison of a standard UKF against the
//! sedenion-based "SUKF" proposed in TESSERACT-BR, on a MEMS dead-reckoning
//! problem. See `README.md` for the experimental design and findings.

pub mod bilinear;
pub mod filters;
pub mod linalg;
pub mod manifold;
pub mod nav_repr;
pub mod real_data;
pub mod sim;
pub mod preintegration;
pub mod iekf;
pub mod ukf;

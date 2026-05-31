//! nav-bakeoff: a fair, reproducible comparison of a standard UKF against the
//! sedenion-based "SUKF" proposed in TESSERACT-BR, on a MEMS dead-reckoning
//! problem. See `README.md` for the experimental design and findings.

pub mod filters;
pub mod linalg;
pub mod sim;
pub mod ukf;

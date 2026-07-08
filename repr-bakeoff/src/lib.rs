//! repr-bakeoff: a controlled self-supervised comparison of a sedenion-structured
//! projector (+ ZDA-Reg) against a matched real-valued baseline under VICReg-style
//! losses and the LeJEPA SIGReg objective. It measures downstream linear-probe
//! accuracy, representational collapse, and whether ZDA-Reg helps. See
//! `README.md`.

pub mod data;
pub mod deep;
pub mod linalg;
pub mod metrics;
pub mod mnist;
pub mod model;
pub mod sigreg;
pub mod train;

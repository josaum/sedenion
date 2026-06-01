//! repr-bakeoff: a controlled self-supervised comparison of a sedenion-structured
//! projector (+ ZDA-Reg) against a matched real-valued baseline, measuring
//! downstream linear-probe accuracy, representational collapse, and the tension
//! between ZDA-Reg and isotropy. See `README.md`.

pub mod data;
pub mod linalg;
pub mod metrics;
pub mod mnist;
pub mod model;
pub mod sigreg;
pub mod train;

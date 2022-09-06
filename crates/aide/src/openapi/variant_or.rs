use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(untagged)]
pub enum VariantOrUnknown<T> {
    Item(T),
    Unknown(String),
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(untagged)]
pub enum VariantOrUnknownOrEmpty<T> {
    Item(T),
    Unknown(String),
    Empty,
}

impl<T> VariantOrUnknownOrEmpty<T> {
    pub fn is_empty(&self) -> bool {
        matches!(self, VariantOrUnknownOrEmpty::Empty)
    }
}

impl<T> Default for VariantOrUnknownOrEmpty<T> {
    fn default() -> Self {
        VariantOrUnknownOrEmpty::Empty
    }
}

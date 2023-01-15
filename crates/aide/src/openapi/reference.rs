use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(untagged)]
#[derive(schemars::JsonSchema)]
pub enum ReferenceOr<T> {
    Reference {
        /// REQUIRED. The reference identifier. This MUST be in the form of a
        /// URI.
        #[serde(rename = "$ref")]
        reference: String,
        /// A short summary which by default SHOULD override that of the
        /// referenced component. If the referenced object-type does not allow a
        /// `summary` field, then this field has no effect.
        #[serde(skip_serializing_if = "Option::is_none")]
        summary: Option<String>,
        /// A description which by default SHOULD override that of the
        /// referenced component. CommonMark syntax MAY be used for rich text
        /// representation. If the referenced object-type does not allow a
        /// `description` field, then this field has no effect.
        #[serde(skip_serializing_if = "Option::is_none")]
        description: Option<String>,
    },
    Item(T),
}

impl<T> ReferenceOr<T> {
    pub fn ref_(r: &str) -> Self {
        ReferenceOr::Reference {
            reference: r.to_owned(),
            summary: None,
            description: None,
        }
    }
    pub fn boxed_item(item: T) -> ReferenceOr<Box<T>> {
        ReferenceOr::Item(Box::new(item))
    }

    /// Converts this [ReferenceOr] to the item inside, if it exists.
    ///
    /// The return value will be [Option::Some] if this was a
    /// [ReferenceOr::Item] or [Option::None] if this was a
    /// [ReferenceOr::Reference].
    ///
    /// # Examples
    ///
    /// ```
    /// # use aide::openapi::ReferenceOr;
    ///
    /// let i = ReferenceOr::Item(1);
    /// assert_eq!(i.into_item(), Some(1));
    ///
    /// let j: ReferenceOr<u8> = ReferenceOr::Reference { reference: String::new(), summary: None, description: None };
    /// assert_eq!(j.into_item(), None);
    /// ```
    pub fn into_item(self) -> Option<T> {
        match self {
            ReferenceOr::Reference { .. } => None,
            ReferenceOr::Item(i) => Some(i),
        }
    }

    /// Returns a reference to to the item inside this [ReferenceOr], if it
    /// exists.
    ///
    /// The return value will be [Option::Some] if this was a
    /// [ReferenceOr::Item] or [Option::None] if this was a
    /// [ReferenceOr::Reference].
    ///
    /// # Examples
    ///
    /// ```
    /// # use aide::openapi::ReferenceOr;
    ///
    /// let i = ReferenceOr::Item(1);
    /// assert_eq!(i.as_item(), Some(&1));
    ///
    /// let j: ReferenceOr<u8> = ReferenceOr::Reference { reference: String::new(), summary: None, description: None };
    /// assert_eq!(j.as_item(), None);
    /// ```
    pub fn as_item(&self) -> Option<&T> {
        match self {
            ReferenceOr::Reference { .. } => None,
            ReferenceOr::Item(i) => Some(i),
        }
    }

    /// Mutable version of [`as_item`](ReferenceOr::as_item).
    pub fn as_item_mut(&mut self) -> Option<&mut T> {
        match self {
            ReferenceOr::Reference { .. } => None,
            ReferenceOr::Item(i) => Some(i),
        }
    }
}

impl<T> ReferenceOr<Box<T>> {
    pub fn unbox(self) -> ReferenceOr<T> {
        match self {
            ReferenceOr::Reference {
                reference,
                summary,
                description,
            } => ReferenceOr::Reference {
                reference,
                summary,
                description,
            },
            ReferenceOr::Item(boxed) => ReferenceOr::Item(*boxed),
        }
    }
}

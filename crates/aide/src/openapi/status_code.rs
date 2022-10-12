use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Clone, Debug, Hash, PartialEq, Eq, PartialOrd, Ord, schemars::JsonSchema)]
pub enum StatusCode {
    Code(u16),
    Range(u16),
}

impl fmt::Display for StatusCode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            StatusCode::Code(n) => write!(f, "{}", n),
            StatusCode::Range(n) => write!(f, "{}XX", n),
        }
    }
}

impl<'de> Deserialize<'de> for StatusCode {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        use serde::de::{self, Unexpected, Visitor};

        struct StatusCodeVisitor;

        impl<'de> Visitor<'de> for StatusCodeVisitor {
            type Value = StatusCode;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("number between 100 and 999 (as string or integer) or a string that matches `\\dXX`")
            }

            fn visit_i64<E>(self, value: i64) -> Result<Self::Value, E>
            where
                E: de::Error,
            {
                if (100..1000).contains(&value) {
                    Ok(StatusCode::Code(value as u16))
                } else {
                    Err(E::invalid_value(Unexpected::Signed(value), &self))
                }
            }

            fn visit_u64<E>(self, value: u64) -> Result<Self::Value, E>
            where
                E: de::Error,
            {
                if (100..1000).contains(&value) {
                    Ok(StatusCode::Code(value as u16))
                } else {
                    Err(E::invalid_value(Unexpected::Unsigned(value), &self))
                }
            }

            fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
            where
                E: de::Error,
            {
                if value.len() != 3 {
                    return Err(E::invalid_value(Unexpected::Str(value), &"length 3"));
                }

                if let Ok(number) = value.parse::<i64>() {
                    return self.visit_i64(number);
                }

                if !value.is_ascii() {
                    return Err(E::invalid_value(
                        Unexpected::Str(value),
                        &"ascii, format `\\dXX`",
                    ));
                }

                let v = value.as_bytes().to_ascii_uppercase();

                match [v[0], v[1], v[2]] {
                    [n, b'X', b'X'] if n.is_ascii_digit() => {
                        Ok(StatusCode::Range(u16::from(n - b'0')))
                    }
                    _ => Err(E::invalid_value(Unexpected::Str(value), &"format `\\dXX`")),
                }
            }
        }

        deserializer.deserialize_any(StatusCodeVisitor)
    }
}

impl Serialize for StatusCode {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}

use actix_web::{get, post, web, HttpResponse, Responder};
use aide::openapi::v3::{generate_api, macros::api, macros::api::define, transform};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

const EXAMPLE_TAG: &str = "example_tag";
const EXAMPLE_TAG2: &str = "example_tag2";

define::tag! {
    name(EXAMPLE_TAG),
    description("An example tag"),
    display_name("An Example Tag")
}

define::tag! {
    name(EXAMPLE_TAG2),
    description("Another example tag"),
    display_name("Example tag 2")
}

/// User path parameters.
/// The `#[api::operation]` macro is universal for all items.
#[derive(api::Model, JsonSchema, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserPathParams {
    /// The user's name.
    user_name: String,
}

/// Greets a user with the given name.
#[api::operation]
#[get("/user/{userId}")]
#[tag(EXAMPLE_TAG)]
#[response(
    status(200),
    type(String),
    description("A user greeting"),
    example(String::from("hello Tom!"))
)]
async fn greet_user(params: web::Path<UserPathParams>) -> impl Responder {
    format!("hello {}!", params.user_name)
}

/// Updates the user with the given user ID.
#[derive(api::Model, JsonSchema, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserUpdate {
    /// The user to update.
    pub user_id: u32,
    /// Optional new user name.
    pub name: Option<String>,
    /// Optional new user phone.
    pub phone: Option<String>,
}

/// Updates a user with the given ID.
#[api::operation]
#[tag(EXAMPLE_TAG2)]
#[post("/user/{userId}")]
#[response(204)]
async fn update_user(
    _params: web::Path<UserPathParams>,
    _body: web::Json<UserUpdate>,
) -> impl Responder {
    HttpResponse::NoContent()
}

/// A generic error message.
#[derive(api::Model, JsonSchema, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenericError {
    /// A unique error code.
    error_code: u32,
    /// Error message, if available.
    error_message: Option<String>,
}

/// This struct isn't used in the API,
/// but will appear in the definitions.
#[derive(Debug, api::Model, JsonSchema, Serialize, Deserialize)]
pub struct AdditionalStruct {}

fn main() -> anyhow::Result<()> {
    let api = generate_api(None)?
        .transform(transform::default_response(
            "An unexpected error occurred",
            GenericError {
                error_code: 0,
                error_message: Some("unknown error".into()),
            },
        ))
        .transform(transform::tag_groups(&[
            ("Example Group 1", &[EXAMPLE_TAG]),
            ("Example Group 2", &[EXAMPLE_TAG2]),
            ("Models", &["AdditionalStruct"]),
        ]));

    println!("{}", serde_json::to_string_pretty(&api).unwrap());

    Ok(())
}

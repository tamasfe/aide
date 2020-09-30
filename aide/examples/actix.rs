use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use aide::openapi::v3::{generate_api, macros::api, transform, ui::ReDoc};

/// User path parameters.
/// The `#[api]` macro is universal for all items.
#[api]
#[serde(rename_all = "camelCase")]
pub struct UserPathParams {
    /// The user's name.
    user_name: String,
}

/// Greets a user with the given name.
#[api]
#[get("/user/{userId}")]
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
/// This model uses the explicit `model` macro instead of just `api`.
#[api::model]
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
/// This operation uses the explicit `operation` macro instead of just `api`.
#[api::operation]
#[post("/user/{userId}")]
#[response(204)]
async fn update_user(
    _params: web::Path<UserPathParams>,
    _body: web::Json<UserUpdate>,
) -> impl Responder {
    HttpResponse::NoContent()
}

/// A generic error message.
#[api]
#[serde(rename_all = "camelCase")]
pub struct GenericError {
    /// A unique error code.
    error_code: u32,
    /// Error message, if available.
    error_message: Option<String>,
}

#[actix_web::main]
async fn main() -> anyhow::Result<()> {
    let api = generate_api(None)?.transform(transform::default_response(
        "An unexpected error occurred",
        GenericError {
            error_code: 0,
            error_message: Some("unknown error".into()),
        },
    ));

    println!("{}", serde_json::to_string_pretty(&api).unwrap());

    HttpServer::new(move || {
        App::new().service(greet_user).service(update_user).service(
            ReDoc::new()
                .api_at("userApi.json")
                .openapi_v3(&api)
                .actix_service("/docs"),
        )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await?;

    Ok(())
}

use std::env;

static UPDATE_DOCS_DB: [(&str, &str); 2] = [
    ("./res/swagger/swagger-ui.css", "https://raw.githubusercontent.com/swagger-api/swagger-ui/refs/heads/master/dist/swagger-ui.css"),
    ("./res/swagger/swagger-ui-bundle.js", "https://raw.githubusercontent.com/swagger-api/swagger-ui/refs/heads/master/dist/swagger-ui-bundle.js"),
];

fn main() {
    if env::var("CARGO_FEATURE_UPDATE_DOCS").is_ok() {
        for entry in UPDATE_DOCS_DB.iter() {
            println!("cargo:rerun-if-changed={}", entry.0);
            update_docs(entry);
        }
    }
}

fn update_docs(entry: &(&str, &str)) {
    reqwest::blocking::get(entry.1)
        .unwrap()
        .copy_to(&mut std::fs::File::create(entry.0).unwrap())
        .unwrap();
}

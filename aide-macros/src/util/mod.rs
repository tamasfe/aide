use regex::Regex;
use syn::LitStr;

pub mod examples;

pub fn parse_path_params(path: &LitStr) -> Vec<String> {
    let re = Regex::new(r#"\{([^}]+)\}"#).unwrap();
    re.captures_iter(&path.value())
        .map(|c| c.get(1).unwrap().as_str().to_string())
        .collect()
}

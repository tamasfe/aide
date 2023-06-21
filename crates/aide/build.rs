use std::env;
#[cfg(feature = "swagger-ui")]
fn main() {
  swagger_ui::extract_swagger_ui();
}
#[cfg(not(feature = "swagger-ui"))]
fn main() {
}
#[cfg(feature = "swagger-ui")]
mod swagger_ui {
  // Adapted from https://github.com/juhaku/utoipa/blob/master/utoipa-swagger-ui/build.rs
  use std::{
    cmp::Ordering,
    env,
    fs::{self, File},
    io,
    path::PathBuf,
  };
  
  use zip::{result::ZipError, ZipArchive};

  // Define the source Swagger UI bundle to use
  // New bundles can be found at https://github.com/swagger-api/swagger-ui/releases
  const SWAGGER_UI_DIST_ZIP: &str = "swagger-ui-5.1.0";
  pub(crate) fn extract_swagger_ui() {
    let bundle_path: PathBuf = ["res", "swagger-ui", &format!("{SWAGGER_UI_DIST_ZIP}.zip")].iter().collect();
    println!(
      "cargo:rerun-if-changed={}",
      bundle_path
        .to_str()
        .expect("Bundle path contained non-unicode characters")
    );
  
    // OUT_DIR is provided by cargo at build time.
    // For more info check https://doc.rust-lang.org/cargo/reference/environment-variables.html
    let target_dir = env::var("OUT_DIR").unwrap();
    // Provides AIDE_SWAGGER_UI_DIR and AIDE_SWAGGER_UI_VERSION to the crate
    println!("cargo:rustc-env=AIDE_SWAGGER_UI_DIR={}", &target_dir);
    println!("cargo:rustc-env=AIDE_SWAGGER_UI_VERSION={SWAGGER_UI_DIST_ZIP}");
    let swagger_ui_zip = File::open(
      bundle_path,
    )
    .unwrap();
  
    let mut zip = ZipArchive::new(swagger_ui_zip).unwrap();
    extract_within_path(&mut zip, [SWAGGER_UI_DIST_ZIP, "dist"], &target_dir).unwrap();
  }

  fn extract_within_path<const N: usize>(
    zip: &mut ZipArchive<File>,
    path_segments: [&str; N],
    target_dir: &str,
  ) -> Result<(), ZipError> {
    for index in 0..zip.len() {
        let mut file = zip.by_index(index)?;
        let filepath = file
            .enclosed_name()
            .ok_or(ZipError::InvalidArchive("invalid path file"))?;
  
        if filepath
            .iter()
            .take(2)
            .map(|s| s.to_str().unwrap_or_default())
            .cmp(path_segments)
            == Ordering::Equal
        {
            let directory = [&target_dir].iter().collect::<PathBuf>();
            let out_path = directory.join(filepath);
  
            if file.name().ends_with('/') {
                fs::create_dir_all(&out_path)?;
            } else {
                if let Some(p) = out_path.parent() {
                    if !p.exists() {
                        fs::create_dir_all(p)?;
                    }
                }
                let mut out_file = fs::File::create(&out_path)?;
                io::copy(&mut file, &mut out_file)?;
            }
            // Get and Set permissions
            #[cfg(unix)]
            {
                use std::os::unix::fs::PermissionsExt;
                if let Some(mode) = file.unix_mode() {
                    fs::set_permissions(&out_path, fs::Permissions::from_mode(mode))?;
                }
            }
        }
    }
  
    Ok(())
  }
}

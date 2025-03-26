// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn check_path(path:&str) -> bool {
    return fs::metadata(path).unwrap().is_dir();
}

#[tauri::command]
fn load_folder(path:&str)-> Vec<String>{

    if !check_path(path) && !fs::metadata(path).unwrap().is_file() && !fs::metadata(path).unwrap().is_symlink() {
        println!("path: {}", "/");
        let mut files = Vec::new();
        let paths = std::fs::read_dir("/").unwrap();
        for path in paths {
            let path = path.unwrap().path();
            let path = path.to_str().unwrap().to_string();
            files.push(path);
        }
        files
    }
    else if fs::metadata(path).unwrap().is_file() && fs::metadata(path).unwrap().is_symlink() {
        vec![]
    }
    else{
        println!("path: {}", path);
        let mut files = Vec::new();
        let paths = std::fs::read_dir(path).unwrap();
        for path in paths {
            let path = path.unwrap().path();
            let path = path.to_str().unwrap().to_string();
            files.push(path);
        }
        files
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![load_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

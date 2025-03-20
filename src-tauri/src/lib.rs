// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn loadFolder(path:&str)-> Vec<String>{
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![loadFolder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

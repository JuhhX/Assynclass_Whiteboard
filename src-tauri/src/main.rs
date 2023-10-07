// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;
use std::fs;

use tauri::{Window, Manager};

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

#[tauri::command]
async fn open_windows(window: Window){
  window.get_window("main").expect("").show().unwrap();
  window.get_window("controls").expect("").show().unwrap();
}

#[tauri::command]
async fn close_splashscreen(window: Window){
  window.get_window("splashscreen").expect("").close().unwrap();
}

#[tauri::command]
fn load_preferences() -> String{
  let preferences: String;
  if Path::new("../preferences/preferences.json").exists(){
    preferences = fs::read_to_string("../preferences/preferences.json").expect("Cannot read editor preferences!");
    return preferences;
  }
  return "".into();
}

fn main() {

    tauri::Builder::default()
      .setup(|app| {
        
        let main_window = app.get_window("main").unwrap();
        
        main_window.listen("loaded", |event| {
          println!("{:?}", event.payload())
        });

        app.emit_all("preferences", Payload {message: "Respondendo".into()}).unwrap();
        Ok(())
      })
      .invoke_handler(tauri::generate_handler![open_windows,close_splashscreen,load_preferences])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}

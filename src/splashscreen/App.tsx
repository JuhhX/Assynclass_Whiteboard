import "./App.css";
import splashscreen from "../assets/splashscreen_background.png"
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { emit } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";

function App() {

    const [preferences, setPreferences] = useState<string>();

    useEffect(() => {
        invoke("load_preferences").then(pref => setPreferences(pref as string));
    }, []);

    function sendPreferences(){

        setTimeout(() => {
            invoke("open_windows").then(() => {
                appWindow.setFocus().then(() => {
                    setTimeout(
                        () => {
                            emit("preferences", {message: preferences});
                            appWindow.close();
                        },
                    1000);
                });
            });
        }, 3000)


    }

    return (
        <main style={{objectFit: "cover", userSelect: "none"}}>
            <img src={splashscreen} alt="" style={{pointerEvents: "none", width: "100%", height: "100%"}} onLoad={() => {sendPreferences()}} />
        </main>
    );
}

export default App;

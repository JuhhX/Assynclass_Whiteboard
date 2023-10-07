import "./App.css";
import { Type, Image, Presentation, MonitorPlay, Square, Circle, Trash2, Camera, Construction, Cog } from "lucide-react";
import { emit, listen } from '@tauri-apps/api/event'
import { useEffect, useState } from "react";
import { Preferences } from "../interfaces";

function App() {

    const [preferences, setPreferences] = useState<Preferences>(
    {
      theme: "light"
    }
  );

    function addText() {
        emit("add-text", {});
    }

    function addVideo() {
        emit("add-video", {});
    }

    function addSquare() {
        emit("add-square", {});
    }

    function addCircle() {
        emit("add-circle", {});
    }

    function addPaint() {
        emit("add-paint", {});
    }

    function addImage() {
        emit("add-image", {});
    }

    function takeScreenshoot() {
        emit("take-screenshot", {});
    }

    function removeComponent(){
        emit("remove-component", {});
    }

    function changeTheme(){
        setPreferences({theme: (preferences.theme == "dark") ? "light" : "dark"})
        emit("change-theme", {});
    }

    useEffect(() => {
        const init = async () => {
            await listen("preferences", (e: any) => {
                if(e.payload.message != "")
                  setPreferences(JSON.parse(e.payload.message));
            })
        }
        init();
    }, [])

    useEffect(() => {
        document.body.style.backgroundColor = (preferences?.theme == "dark") ? "#1E1E1E" : "#FFF";
    }, [preferences]);

    return (
        <main data-tauri-drag-region style={{overflow: "auto", paddingBottom: "5%"}}>
            <Type className="icons" size={"15vmin"} onClick={() => {addText()}} />
            <Image className="icons" size={"15vmin"} onClick={() => {addImage()}} />
            <Presentation className="icons" size={"15vmin"} onClick={() => {addPaint()}} />
            <MonitorPlay className="icons" size={"15vmin"} onClick={() => {addVideo()}} />
            <Square className="icons" size={"15vmin"} onClick={() => {addSquare()}} />
            <Circle className="icons" size={"15vmin"} onClick={() => {addCircle()}} />
            <Camera className="icons" size={"15vmin"} onClick={() => {takeScreenshoot()}} />
            <Trash2 className="icons" size={"15vmin"} onClick={() => {removeComponent()}} />
            <Cog className="icons" size={"15vmin"} onClick={() => {}} />
            <Construction className="icons" size={"15vmin"} onClick={() => {changeTheme()}} />
        </main>
    );
}

export default App;

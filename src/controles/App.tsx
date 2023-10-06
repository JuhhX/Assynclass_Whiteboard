import "./App.css";
import { Type, Image, Presentation, MonitorPlay, Square, Circle, Trash2, Camera } from "lucide-react";
import { emit } from '@tauri-apps/api/event'

function App() {

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
        </main>
    );
}

export default App;

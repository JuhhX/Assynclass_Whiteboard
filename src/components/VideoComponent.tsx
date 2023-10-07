import "../App.css";
import { Position, Rnd } from "react-rnd"
import ComponentMenu from "./ComponentMenu";
import { useEffect, useState } from "react";
import { CloneComponent, Components, ComponentsTypes, Dimension } from "../interfaces";

export default function VideoComponent(props: Components) {

    const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

    const [videoURL, setVideoURL] = useState<string | null>(props.content || null);
    const [isVideoLoaded, setVideoLoaded] = useState<boolean>(props.content ? true : false);

    const [dimension, setDimension] = useState<Dimension>(props.dimension || {width: 250, height: 200});
    const [position, _setPosition] = useState<Position>(props.position || {x: 0, y: 0});

    const [borderColor, setBorderColor] = useState<string>(props.style?.borderColor || "#4b0082");

    useEffect(() => {
        if(!props.style){
            if(props.preferences.theme == "dark"){
                setBorderColor("#FFF");
            }
        }
    }, []);

    function loadVideo(){

        if(videoURL){
            let videoID = videoURL.replace("https://www.youtube.com/watch?v=", "");
    
            setVideoURL("https://www.youtube.com/embed/" + videoID);
            setVideoLoaded(true);
        }
    }

    function showOrHideMenu(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        event.stopPropagation();
        event.preventDefault();
        setMenuPosition({ x: event.pageX, y: event.pageY });
        setIsMenuVisible((event.button == 0 || event.button == 1) ? false : true)
    }

    function exportComponent(){
        setIsMenuVisible(false);

        let data: CloneComponent = {
            type: ComponentsTypes.VIDEO,
            content: videoURL || "",
            style: {
                borderColor: borderColor
            },
            dimension
        }

        if(props.copy)
            props.copy(data);
    }

    return (
        <>
            <ComponentMenu visible={isMenuVisible} position={menuPosition} componentID={props.id} remove={props.remove} copy={exportComponent}>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <button>Cor da borda: </button>
                    <input type="color" name="" id="" value={borderColor} onChange={(e) => {setBorderColor(e.currentTarget.value)}} />
                </div>
                <hr />
            </ComponentMenu>

            <Rnd className="textComponent" default={{ x: position.x, y: position.y, width: dimension.width, height: dimension.height }} style={{borderColor: borderColor}} onResizeStop={(_e, _dir, ref) => {setDimension({width: ref.offsetWidth, height: ref.offsetHeight})}}>
                <div onContextMenu={showOrHideMenu} onClick={() => { setIsMenuVisible(false) }} style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                    {
                        (!isVideoLoaded) ?
                            <>
                                <input value={(videoURL) ? videoURL : ""} onInput={(text : any) => {setVideoURL(text.target.value)}} style={{height: "25%", background: "transparent", borderColor: (props.preferences.theme == "dark") ? "#FFF" : "#000", color: (props.preferences.theme == "dark") ? "#FFF" : "#000" }} placeholder="Url do video (Youtube)" />
                                <button style={{height: "25%"}} onClick={() => {loadVideo()}}>OK</button>
                            </>
                        : 
                            <div style={{width: "100%", height: "100%", padding: "5%"}}>
                                <iframe style={{width: "100%", height: "100%"}} unselectable="off" src={(videoURL) ? videoURL : ""}></iframe>
                            </div>
                    }
                </div>
            </Rnd>
        </>
    );
}
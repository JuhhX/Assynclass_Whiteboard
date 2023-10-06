import "../App.css";
import { Position, Rnd } from "react-rnd"
import ComponentMenu from "./ComponentMenu";
import { useState } from "react";
import { Components, Dimension, ComponentStyle, CloneComponent, ComponentsTypes } from "../interfaces";

export default function CircleComponent(props: Components) {

    const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

    const [dimension, setDimension] = useState<Dimension>(props.dimension ? props.dimension : {width: 100, height: 100});
    const [position, _setPosition] = useState<Position>(props.position || {x: 0, y: 0});

    const [style, setStyle] = useState<ComponentStyle>(
        {
            backgroundColor: props.style?.backgroundColor || "transparent",
            borderColor:props.style?.borderColor || "#4b0082"
        }
    );

    function showOrHideMenu(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        event.stopPropagation();
        event.preventDefault();
        setMenuPosition({ x: event.pageX, y: event.pageY });
        setIsMenuVisible((event.button == 0 || event.button == 1) ? false : true)
    }

    function exportComponent(){
        setIsMenuVisible(false);

        let data: CloneComponent = {
            type: ComponentsTypes.CIRCLE,
            content: "",
            style,
            dimension
        }

        if(props.copy)
            props.copy(data);
    }

    return (
        <>
            <ComponentMenu visible={isMenuVisible} position={menuPosition} componentID={props.id} remove={props.remove} copy={exportComponent}>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <button>Cor de fundo: </button>
                    <input type="color" name="" id="" value={style.backgroundColor} onChange={(e) => {setStyle({...style, backgroundColor: e.currentTarget.value})}} />
                </div>
                <hr />
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <button>Cor da borda: </button>
                    <input type="color" name="" id="" value={style.borderColor} onChange={(e) => {setStyle({...style, borderColor: e.currentTarget.value})}} />
                </div>
                <hr />
            </ComponentMenu>

            <Rnd 
                className="textComponent" 
                style={{borderRadius: "100px", background: style.backgroundColor, borderColor: style.borderColor}} 
                default={{ x: position.x, y: position.y, width: dimension.width, height: dimension.height}}
                onResizeStop={(_e, _dir, ref) => {setDimension({width: ref.offsetWidth, height: ref.offsetHeight})}}>
                <div onContextMenu={showOrHideMenu} onClick={() => { setIsMenuVisible(false) }} style={{ width: "100%", height: "100%" }} />
            </Rnd>
        </>
    );
}
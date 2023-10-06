import "../App.css";
import { Position, Rnd } from "react-rnd"
import ComponentMenu from "./ComponentMenu";
import { useRef, useState } from "react";

import { PlusCircle, MinusCircle } from "lucide-react";
import { CloneComponent, ComponentStyle, Components, ComponentsTypes, Dimension } from "../interfaces";

export default function TextComponent(props: Components) {

    const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

    const [style, setStyle] = useState<ComponentStyle>(
        {
            fontSize:  props.style?.fontSize || 18,
            textColor: props.style?.textColor || "#000000",
            backgroundColor: props.style?.backgroundColor || "transparent",
            borderColor: props.style?.borderColor || "#4b0082",
            fontBold: props.style?.fontBold || false,
            fontItalic: props.style?.fontItalic || false
        }
    );

    const [content, setContent] = useState<string>(props.content || "");

    const [dimension, setDimension] = useState<Dimension>(props.dimension || {width: 100, height: 100});
    const [position, _setPosition] = useState<Position>(props.position || {x: 0, y: 0});

    const rndRef = useRef<Rnd>(null);

    function showOrHideMenu(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        event.stopPropagation();
        event.preventDefault();
        setMenuPosition({ x: event.pageX, y: event.pageY });
        setIsMenuVisible((event.button == 0 || event.button == 1) ? false : true)
    }

    function exportComponent(){
        setIsMenuVisible(false);

        let data: CloneComponent = {
            type: ComponentsTypes.TEXTO,
            content,
            style,
            dimension
        }

        if(props.copy)
            props.copy(data);
    }

    function changeFontSize(op: number){
        if(style.fontSize){
            if(op == -1){
                if(style.fontSize-2 > 14)
                setStyle({...style, fontSize: style.fontSize-2})
        }
        else if(op == -2)
            setStyle({...style, fontSize: style.fontSize+2})
        else
            if(op < 14)
                setStyle({...style, fontSize: 14})
            else
                setStyle({...style, fontSize: op})
        }
    }

    return (
        <>
            <ComponentMenu visible={isMenuVisible} position={menuPosition} componentID={props.id} remove={props.remove} copy={exportComponent}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <button>Tamanho do texto</button>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <button onClick={() => {changeFontSize(-1)}}><MinusCircle /></button>
                        <input value={style.fontSize} onChange={(e) => {changeFontSize(Number(e.currentTarget.value))}} style={{padding: "5%", width: "25%", textAlign: "center"}} type="number" />
                        <button onClick={() => {changeFontSize(-2)}}><PlusCircle /></button>
                    </div>
                </div>
                <hr />
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <button>Cor do texto: </button>
                    <input type="color" name="" id="" value={style.textColor} onChange={(e) => {setStyle({...style, textColor: e.currentTarget.value})}} />
                </div>
                <hr />
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
                <button onClick={() => {setStyle({...style, fontBold: !style.fontBold}); setIsMenuVisible(false)}}>Negrito</button>
                <hr />
                <button onClick={() => {setStyle({...style, fontItalic: !style.fontItalic}); setIsMenuVisible(false)}}>Itálico</button>
                <hr />
            </ComponentMenu>

            <Rnd ref={rndRef} className="textComponent" 
                 default={{ x: position.x, y: position.y, width: dimension.width, height: dimension.height }} 
                 style={{background: style.backgroundColor, borderColor: style.borderColor}} 
                 onResizeStop={(_e, _dir, ref) => {setDimension({width: ref.offsetWidth, height: ref.offsetHeight})}}>

                <div onContextMenu={showOrHideMenu} onClick={() => { setIsMenuVisible(false) }} style={{ width: "100%", height: "100%"}}>
                    <textarea 
                        spellCheck={false} 
                        placeholder="Texto" 
                        value={content} 
                        onChange={(e) => {setContent(e.currentTarget.value)}} 
                        style={{fontSize: style.fontSize+"px", color: style.textColor, fontWeight: (style.fontBold) ? "bold" : "normal", fontStyle: (style.fontItalic) ? "italic" : "normal"}} 
                        className="textComponentTextArea" name="" id="" cols={30} rows={10} />
                </div>

            </Rnd>
        </>
    );
}
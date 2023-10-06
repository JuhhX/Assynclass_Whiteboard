import { Position, Rnd } from "react-rnd";
import ComponentMenu from "./ComponentMenu";
import { useState } from "react";
import { Components, Dimension, ComponentStyle, CloneComponent, ComponentsTypes } from "../interfaces";

export default function ImageComponent(props: Components){

    const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

    const [imageURL, setImageURL] = useState<string | null>(props.content || null);
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(props.content ? true : false);

    const [dimension, setDimension] = useState<Dimension>(props.dimension || {width: 250, height: 200});
    const [position, _setPosition] = useState<Position>(props.position || {x: 0, y: 0});

    const [style, setStyle] = useState<ComponentStyle>(
        {
            backgroundColor: props.style?.backgroundColor || "transparent",
            borderColor: props.style?.borderColor || "#4b0082"
        }
    );

    function showOrHideMenu(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        event.stopPropagation();
        event.preventDefault();
        setMenuPosition({ x: event.pageX, y: event.pageY });
        setIsMenuVisible((event.button == 0 || event.button == 1) ? false : true)
    }

    function loadImage(event: React.ChangeEvent<HTMLInputElement>){
        if(event.target.files){
            setImageURL(URL.createObjectURL(event.target.files[0]));
            setIsImageLoaded(true);
        }
    }

    function exportComponent(){
        setIsMenuVisible(false);

        let data: CloneComponent = {
            type: ComponentsTypes.IMAGE,
            content: imageURL || "",
            style,
            dimension
        }

        if(props.copy)
            props.copy(data);
    }

    return(
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
                default={{ x: position.x, y: position.y, width: dimension.width, height: dimension.height }} 
                style={{backgroundColor: style.backgroundColor, borderColor: style.borderColor}}
                onResizeStop={(_e, _dir, ref) => {setDimension({width: ref.offsetWidth, height: ref.offsetHeight})}}>
                <div onContextMenu={showOrHideMenu} onClick={() => { setIsMenuVisible(false) }} style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                    {
                        (!isImageLoaded) ?
                            <div style={{width: "100%", height: "100%", fontSize: "3vmin", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                                <input value={(imageURL) ? imageURL : ""} onInput={(text : any) => {setImageURL(text.target.value); setIsImageLoaded(true)}} id="url" style={{height: "25%"}} placeholder="Url da imagem" />
                                <p>ou</p>
                                <label htmlFor="local" style={{border: "1px solid black", padding: "2%"}}>Selecionar um arquivo</label>
                                <input type="file" accept=".png,.jpg" id="local" style={{display: "none"}} onChange={(e) => {loadImage(e)}}/>
                            </div>
                        : 
                            <div style={{width: "100%", height: "100%", padding: "5%", objectFit: "cover"}}>
                                <img src={(imageURL) ? imageURL : ""} width={"100%"} height={"100%"} style={{pointerEvents: "none"}} alt="" />
                            </div>
                    }
                </div>
            </Rnd>
        </>
    )
}
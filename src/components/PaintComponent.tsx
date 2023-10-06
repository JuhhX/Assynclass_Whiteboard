import "../App.css";
import { Position, ResizableDelta, Rnd } from "react-rnd"
import ComponentMenu from "./ComponentMenu";
import { useEffect, useRef, useState } from "react";
import { CloneComponent, Components, ComponentsTypes, Dimension } from "../interfaces";
import { MinusCircle, PlusCircle } from "lucide-react";

export default function PaintComponent(props: Components) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<any>(null);

    const [canvasContent, setCanvasContent] = useState<string>(props.content || "");

    const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
    const [prevDelta, setPrevDelta] = useState<Position>({ x: 0, y: 0 });
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const [canvasSize, setCanvasSize] = useState<Position>(props.dimension ? {x: props.dimension.width-30, y: props.dimension.height-30} : {x: 220, y: 170})

    const [drawMode, setDrawMode] = useState<string>("pen");
    const [lineColor, setLineColor] = useState<string>("black");
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
    const [showCanvasBorder, setShowCanvasBorder] = useState<boolean>(true);

    const [lineSize, setLineSize] = useState<number>(2);
    
    const [borderColor, setBorderColor] = useState<string>(props.style?.borderColor || "#4b0082");
    const [dimension, setDimension] = useState<Dimension>(props.dimension || {width: 250, height: 200});
    const [position, _setPosition] = useState<Position>(props.position || {x: 0, y: 0});

    useEffect(() => {
        if(canvasRef.current){
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if(ctx){
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = lineSize;
                ctxRef.current = ctx;
            }
        }
    }, [lineSize, lineColor])

    useEffect(() => {
        if(canvasContent) {
            restoreCanvasContent();
        }
    }, [canvasContent])

    function showOrHideMenu(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        event.stopPropagation();
        event.preventDefault();
        setMenuPosition({ x: event.pageX, y: event.pageY });
        setIsMenuVisible((event.button == 0 || event.button == 1) ? false : true)
    }

    function saveContent() {
        if(canvasRef.current){
            setCanvasContent(canvasRef.current.toDataURL());
            return canvasRef.current.toDataURL();
        }
        return "";
    }

    function restoreCanvasContent(){
        if (canvasContent) {
            const canvas = canvasRef.current;

            if(canvas){
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.src = canvasContent;
                img.onload = function() {
                    if(ctx){
                        ctx.drawImage(img, 0, 0);
                        ctx.lineCap = "round";
                        ctx.lineJoin = "round";
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = lineSize;
                    }
                };
            }
        }
        setPrevDelta({x: 0, y: 0});
    }

    function startDrawing(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>){
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(
            e.nativeEvent.offsetX, 
            e.nativeEvent.offsetY
        );
        setIsDrawing(true);
    };
    
    function endDrawing(){
        ctxRef.current.closePath();
        setIsDrawing(false);
    };
  
    function draw(e : any){
        if (!isDrawing) {
            return;
        }
        if(drawMode == "pen"){
            ctxRef.current.globalCompositeOperation="source-over";
            ctxRef.current.lineTo(
                e.nativeEvent.offsetX, 
                e.nativeEvent.offsetY
            );
                
            ctxRef.current.stroke();
        }
        else{
            ctxRef.current.globalCompositeOperation="destination-out";
            ctxRef.current.lineTo(
                e.nativeEvent.offsetX, 
                e.nativeEvent.offsetY
            );
            ctxRef.current.stroke();
        }

    };

    function resolveCanvasSize(delta: ResizableDelta){
        setCanvasSize({x: canvasSize.x+(delta.width-prevDelta.x), y: canvasSize.y+(delta.height-prevDelta.y)})
        setPrevDelta({x: delta.width, y: delta.height});
    }

    function exportComponent(){
        setIsMenuVisible(false);

        let data: CloneComponent = {
            type: ComponentsTypes.PAINT,
            content: saveContent(),
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
                <>
                    {    
                        (drawMode == "pen") ?
                            <button onClick={() => {setDrawMode("erase"); setIsMenuVisible(false)}}>Borracha</button>
                        : 
                            <button onClick={() => {setDrawMode("pen"); setIsMenuVisible(false)}}>Lápis</button>
                    }
                    <hr />
                </>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <button>Tamanho do lápis</button>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <button onClick={() => {setLineSize(lineSize-2)}}><MinusCircle /></button>
                        <input value={lineSize} onChange={(e) => {setLineSize(Number(e.currentTarget.value))}} style={{padding: "5%", width: "25%", textAlign: "center"}} type="number" />
                        <button onClick={() => {setLineSize(lineSize+2)}}><PlusCircle /></button>
                    </div>
                </div>
                <hr />
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <button>Cor do lápis</button>
                    <input type="color" name="" id="" value={lineColor} onChange={(e) => {setLineColor(e.currentTarget.value)}} />
                </div>
                <hr />
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <button>Cor da borda: </button>
                    <input type="color" name="" id="" value={borderColor} onChange={(e) => {setBorderColor(e.currentTarget.value)}} />
                </div>
                <hr />
                <button onClick={() => {setShowCanvasBorder(!showCanvasBorder); setIsMenuVisible(false)}}>{(!showCanvasBorder) ? "Mostrar borda do canvas" :"Esconder borda do canvas"}</button>
                <hr />
                <button onClick={() => {setShowCanvasBorder(false); setBorderColor("#FFFFFF"); setIsMenuVisible(false)}}>{"Somente o desenho"}</button>
                <hr />
            </ComponentMenu>
            
            <Rnd 
                className="textComponent" 
                default={{ x: position.x, y: position.y, width: dimension.width, height: dimension.height }} 
                style={{borderColor}} disableDragging={isMouseOver} 
                onResize={(_e, _dir, _ref, delta) => {resolveCanvasSize(delta)}} onResizeStart={() => {saveContent()}} onResizeStop={(_e, _dir, ref) => {restoreCanvasContent(); setDimension({width: ref.offsetWidth, height: ref.offsetHeight})}} 
                enableResizing={{bottomRight: true, topRight: true}}>

                <div onContextMenu={showOrHideMenu} onClick={() => { setIsMenuVisible(false) }} style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                    <div style={{width: "100%", height: "100%", padding: "5%", display: "flex", alignItems: "center"}}>
                        <canvas 
                            onMouseDown={startDrawing}
                            onMouseUp={endDrawing}
                            onMouseMove={draw}
                            ref={canvasRef}
                            width={canvasSize.x}
                            height={canvasSize.y}
                            style={{border: `${!showCanvasBorder ? "0px" : "1px"} solid black`}}    
                            onMouseOver={() => {setIsMouseOver(true)}}
                            onMouseOut={() => {setIsMouseOver(false)}}
                        >
                        </canvas>
                    </div>
                </div>
            </Rnd>
        </>
    );
}
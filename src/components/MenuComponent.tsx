import { WebviewWindow } from "@tauri-apps/api/window";
import { Position } from "../interfaces"

interface MenuComponentProps{
    visible: boolean,
    position: Position,
    paste?: Function,
    clearAll?: Function
}

export default function MenuComponent(props: MenuComponentProps){

    function showControllers(){
        const controlsWindow = WebviewWindow.getByLabel('controls');
        
        if(controlsWindow)
          controlsWindow.setFocus();
    }

    return (
        (props.visible) &&
            <div className="menu-right-click" style={{top: props.position.y, left: props.position.x}}>
                <button className="menu-right-click-sub" onClick={() => {showControllers()}}>Novo</button>
                <hr />
                <button onClick={() => {(props.paste) ? props.paste() : null}}>Colar</button>
                <hr />
                <button onClick={() => {(props.clearAll) ? props.clearAll() : null}}>Limpar tudo</button>
            </div>
    )
}
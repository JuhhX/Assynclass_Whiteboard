import { Position } from "../interfaces"
import { ReactNode } from "react";

interface ComponentMenuProps{
    componentID: number,
    visible: boolean,
    position: Position,
    remove?: Function,
    copy?: Function,
    children?: ReactNode
}

export default function ComponentMenu(props: ComponentMenuProps){

    return (
        (props.visible) &&
            <div className="menu-right-click" style={{top: props.position.y, left: props.position.x}}>
                {props.children}
                <button onClick={() => {(props.copy) ? props.copy() : null}}>Copiar</button>
                <hr />
                <button className="menu-right-click-sub" onClick={() => {(props.remove) ? props.remove(props.componentID) : null}}>Excluir</button>
            </div>
    )
}
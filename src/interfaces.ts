export enum ComponentsTypes {
    TEXTO,
    VIDEO,
    SQUARE,
    CIRCLE,
    PAINT,
    IMAGE
}

export interface ComponentInterface {
    id: number,
    type: ComponentsTypes,
    content: string,
    style?: ComponentStyle,
    dimension?: Dimension,
    position?: Position
}

export interface Position {
    x: number,
    y: number
}

export interface Components {
    id: number,
    content?: string,
    remove?: Function
    copy?: Function,
    style?: ComponentStyle,
    dimension?: Dimension,
    position?: Position
}

export interface Dimension {
    width: number,
    height: number
}

export interface CloneComponent {
    type: ComponentsTypes,
    content: string,
    style: ComponentStyle,
    dimension: Dimension
}

export interface ComponentStyle {
    textColor?: string,
    backgroundColor?: string,
    borderColor?: string,
    fontSize?: number,
    fontBold?: boolean,
    fontItalic?: boolean
}

export interface Preferences {
    theme: string
}

export type RRef = {
    Id: string,
    HostElementId?: string | undefined | null
}


export type RChartRef = RRef & {
    Render: () => void,
    IsRendered: boolean
}

export type PropsEvents<T> = {
    ValueChanged?: (e: T) => void,
    Click?: (e: React.MouseEvent<HTMLInputElement>) => void,
    Focus?: (e: React.FocusEvent<HTMLInputElement>) => void,
    Blur?: (e: React.FocusEvent<HTMLInputElement>) => void,
    Cut?: (e: React.ClipboardEvent<HTMLInputElement>) => void,
    Copy?: (e: React.ClipboardEvent<HTMLInputElement>) => void,
    Paste?: (e: React.ClipboardEvent<HTMLInputElement>) => void,
    KeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    KeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    KeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    MouseEnter?: (e: React.MouseEvent<HTMLInputElement>) => void,
    MouseDown?: (e: React.MouseEvent<HTMLInputElement>) => void,
    MouseUp?: (e: React.MouseEvent<HTMLInputElement>) => void,
    MouseLeave?: (e: React.MouseEvent<HTMLInputElement>) => void,
    MouseMove?: (e: React.MouseEvent<HTMLInputElement>) => void,
    MouseOut?: (e: React.MouseEvent<HTMLInputElement>) =>  void,
    MouseOver?: (e: React.MouseEvent<HTMLInputElement>) => void,
    DblClick?: (e: React.MouseEvent<HTMLInputElement>) => void,
    Drag?: (e: React.DragEvent<HTMLInputElement>) => void,
    DragEnd?: (e: React.DragEvent<HTMLInputElement>) => void,
    DragEnter?: (e: React.DragEvent<HTMLInputElement>) => void,
    DragLeave?: (e: React.DragEvent<HTMLInputElement>) => void,
    DragOver?: (e: React.DragEvent<HTMLInputElement>) => void,
    DragStart?: (e: React.DragEvent<HTMLInputElement>) => void,
    Drop?: (e: React.DragEvent<HTMLInputElement>) => void,
    Input?: (e: React.FormEvent<HTMLInputElement>) => void,
    Change?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export class BarChartItem {
    constructor(public DisplayName: string,         
        public Values: number[],
        public barItemsBackColor: string[] | string,
        public barItemsForeColor: string[] | string
    ) {

    }
}

export class Graph {
    constructor(public xPoint: number, public yPoint: number) {

    }
}

export class PopupChartItem {
    constructor(public x1: number, public y1: number, public x2: number, public y2: number, 
        public Item: any, public ValueIndex: number, public ItemIndex: number,
        public ItemColor: string = 'gray'){

    }
}

export class DrawTextItem {
    constructor(public value: string, public x: number, public y: number, public color: string, public rotate: boolean = false) {

    }
}
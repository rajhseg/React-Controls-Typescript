
export type RRef = {
    Id: string,
    HostElementId?: string | undefined | null
}


export type RChartRef = RRef & {
    Render: () => void,
    IsRendered: boolean
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
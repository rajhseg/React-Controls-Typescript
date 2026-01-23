

import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { PopupChartItem, RChartRef } from '../Models/models';
import './RLineChart.css';

export type RLineChartRef = RChartRef & {

}

type Props = {
    Style?: React.CSSProperties,
    PlotItemSize?: number,
    TextColor?: string,
    XAxisTitle?: string,
    YAxisTitle?: string,
    XAxisItemNames?: string[],
    NoOfSplitInYAxis?: number,
    Width?: number,
    MarginX?: number,
    MarginY?: number,
    Height?: number,
    DataListHeight?: number,
    PopupBackColor?: string,
    PopupForeColor?: string | undefined,
    PopupBackgroundOpacity: number
    ChartItems?: RLineChartItem[]
}

export class RLineChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: number[] = []){

    }
}

const RLineChart = forwardRef<RLineChartRef, Props>(({
    Style,
    PlotItemSize = 3,
    TextColor =  "gray",
    XAxisTitle = "",
    YAxisTitle = "",
    XAxisItemNames = [],
    NoOfSplitInYAxis = 4,
    Width = 300,
    Height = 300,
    MarginX = 50,
    MarginY = 50,
    DataListHeight = 50,
    PopupBackColor = "lightgray",
    PopupForeColor = undefined,
    PopupBackgroundOpacity = 1,
    ChartItems = []
}: Props, ref) => {

    
    let context: CanvasRenderingContext2D | null = null;
    let PopupItems: PopupChartItem[] = [];
    let Id = useId();
    let HostElementId = useId();

    const [IsRendered, setIsRendered] = useState(false);
    const [RenderItems, setRenderItems] = useState<RLineChartItem[]>([]);

    const bar = useRef<HTMLCanvasElement | null>(null);
    
    useImperativeHandle(ref, ()=>({
        Id:Id,
        HostElementId: HostElementId,
        IsRendered : IsRendered,
        Render() {
            RenderedLineChart();
        },
    }))

    useEffect(()=>{
        setRenderItems((prevState) => []);
        
        let itms: RLineChartItem[] = [];

        for(let i = 0; i < ChartItems.length; i++){
            let itm = ChartItems[i];
            itms.push(itm);
        }
        
        setRenderItems((prevState) => [...prevState, ...itms])
    },[
        PlotItemSize,
        XAxisItemNames,
        TextColor,
        XAxisTitle,
        YAxisTitle,
        NoOfSplitInYAxis,
        Width,
        Height,
        MarginX,
        MarginY,
        DataListHeight,
        PopupBackColor,
        PopupForeColor,
        PopupBackgroundOpacity,
        ChartItems
    ]);

    useEffect(()=>{
        
        if(bar.current == null)
            return;

        context = bar.current.getContext('2d');
        bar.current.onmousemove = MouseMove.bind(this);
        
        RenderedLineChart();

    }, [RenderItems]);

    const MouseMove = () => {

    }

    const RenderedLineChart = () => {

    }

    return (
        <>
        <div id={HostElementId} style={Style} className='host'>
            <div id={Id}>
                <canvas ref={bar} width={Width} height={Height}>

                </canvas>
                {
                    IsRendered && 

                    <div style={{position: 'relative', alignContent: 'center', bottom:  '10px',  height: DataListHeight+'px' }}>
                    <div className="dataContainer" style={{'width': (Width - MarginX) +'px'}}>
                        {
                            RenderItems.map((itm, index) => (
                                <div key={index} className="data">
                                    <div className="indicator" style={{ backgroundColor: itm.ItemColor}}>                    
                                    </div>
                                    <span className="title" style={{width: '50px'}}>{itm.ItemName}</span>                
                                </div>
                            ))
                        }

                    </div>        
                    </div>
                }
                
            </div>
         </div>
        </>
    );
});
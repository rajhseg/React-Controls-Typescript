
import { useId, useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'

import './RPieChart.css'
import { RChartRef } from '../Models/models';

export class RPieChartItem {
  constructor(
     public Value: number,
     public Title: string,
     public BackgroundColor: string,
     public ForeColor: string) {
        this.Value = Value;
        this.Title = Title;
        this.BackgroundColor = BackgroundColor;
        this.ForeColor = ForeColor;
  }
}

export class RRenderPieChartItem extends RPieChartItem {
 
    Percentage = 0;

    constructor(Value: number,
     Title: string,
     BackgroundColor: string,
     ForeColor: string){
        super(Value, Title, BackgroundColor, ForeColor);
    }

    ConvertToRenderItem(item: RPieChartItem) {
        this.Value = item.Value;
        this.Title = item.Title;
        this.BackgroundColor = item.BackgroundColor;
        this.ForeColor = item.ForeColor;
    }

    ConverToItem() {
        return new RPieChartItem(this.Value, this.Title, this.BackgroundColor, this.ForeColor);
    }
}

export type RPieChartRef = RChartRef & {

}

type Props = {
    FontSize?: number,
    TextForeColor?: string,
    LineColorBetweenBars?: string,
    RotateTextToInlineAngle?: boolean,
    ShowTextOnTopOfChartItem?: boolean,
    MoveTextUpwardsFromCenterInPx?: number,
    ChartWidth?: number,
    DataListHeight?: number,
    ShadowColor?: string,
    ShadowBlur?: number,
    Opacity?: string,
    ChartItems: RPieChartItem[]
};


const RPieChart = forwardRef<RPieChartRef, Props>(({
        FontSize = 10,
        TextForeColor = 'white',
        LineColorBetweenBars = 'white',
        RotateTextToInlineAngle = false,
        ShowTextOnTopOfChartItem = true,
        MoveTextUpwardsFromCenterInPx = 0,
        ChartWidth = 200,
        DataListHeight = 100,
        ShadowColor = 'blue',
        ShadowBlur = 10,
        Opacity = '1',
        ChartItems = []
    } : Props,
    ref
) => {


    const[IsRendered, setIsRendered] = useState(false);

    const [RenderItems, setRenderItems] = useState<RRenderPieChartItem[]>([]);

    const progressCanvas = useRef<HTMLCanvasElement|null>(null);

    let Id = useId();
    let HostElementId = useId();
    
    let _lineWidth = 0;
    
    let context : CanvasRenderingContext2D | null = null;
  
    const LineWidth = () => {
        _lineWidth = (ChartWidth / 3) - 12;
        return _lineWidth;
    }

    useImperativeHandle(ref, () => ({
        Id: Id,
        HostElementId: HostElementId,
        IsRendered: IsRendered,
        Render() {
            RenderChart();
        },
    }));

    useEffect(()=>{
        
        setRenderItems((prevState) => []);

        let _itms: RRenderPieChartItem[] = [];

        if (ChartItems) {
            for (let index = 0; index < ChartItems.length; index++) {
                const element = ChartItems[index];
                let itm = new RRenderPieChartItem(element.Value, element.Title, element.BackgroundColor, element.ForeColor);
                _itms.push(itm);
            }

            setRenderItems((prevState)=> [...prevState, ..._itms]);
            
            }

    }, [
        ChartItems,
        FontSize,
        TextForeColor,
        LineColorBetweenBars,
        RotateTextToInlineAngle,
        ShowTextOnTopOfChartItem,
        MoveTextUpwardsFromCenterInPx,
        ChartWidth,
        DataListHeight,
        ShadowColor,
        ShadowBlur,
        Opacity
    ]);

    
    useEffect(()=>{

        if(progressCanvas.current == null)
            return;

        context = progressCanvas.current.getContext('2d');
        RenderChart();   

    }, [RenderItems])
    
    const Items = () => {
        return RenderItems.map(x => x.ConverToItem());
    }

       
    const GetXYForText = (x: number, y: number, length: number, angle: number): { X: number, Y: number } => {
        let x2 = x + length * Math.cos(angle);
        let y2 = y + length * Math.sin(angle);
        return { X: x2, Y: y2 };
    }

    const DrawText = (context: CanvasRenderingContext2D, x: number, y: number, length: number, angle: number, color: string) => {
        let rad = (angle * Math.PI) / 180;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + length * rad, y + length * rad);
        context.strokeStyle = color;
        context.stroke();
        context.closePath();
    }

    const RenderChart = () => {

        setIsRendered((prevState) => false);

        if (progressCanvas && progressCanvas.current && context && RenderItems.length > 0) {
        
        context.clearRect(0, 0, progressCanvas.current.width, progressCanvas.current.height);

        let x = ChartWidth / 2;
        let y = ChartWidth / 2;
        let radius = ChartWidth / 2;

        let totalValues = RenderItems.map(x => x.Value);
        let TotalCount = 0;

        for (let index = 0; index < totalValues.length; index++) {
            const element = totalValues[index];
            TotalCount = TotalCount + element;
        }

        let start = 0 * Math.PI / 180;
        let previousAngle = start;

        for (let index = 0; index < RenderItems.length; index++) {
            const element = RenderItems[index];

            let percentage = (element.Value * 100) / TotalCount;
            let end1 = (percentage / 100) * 359.85 * (Math.PI / 180);

            element.Percentage = percentage;
            context.fillStyle = element.BackgroundColor;
            context?.beginPath();
            context.lineWidth = 2;

            context.moveTo(x, y);
            context?.arc(x, y, radius - 10, previousAngle, (previousAngle + end1), false);
            context.fillStyle = element.BackgroundColor; 
            context.lineWidth = 0.4;       
            context.strokeStyle = LineColorBetweenBars;
            context.shadowBlur = ShadowBlur;
            context.shadowColor = ShadowColor;

            context.fill();
            context?.stroke();
            context.closePath();

            if (ShowTextOnTopOfChartItem) {
            let endAngle = previousAngle + end1;
            let avgAngle = (previousAngle + (endAngle > previousAngle ? endAngle : endAngle + ((Math.PI * 359.58) / 180))) / 2;

            let metrics = context.measureText(element.Title);
            let textRadiusLength = radius - metrics.width - 5 + MoveTextUpwardsFromCenterInPx;

            let pos = GetXYForText(x, y, textRadiusLength, avgAngle);

            context.beginPath();

            context.save();
            context.textAlign = "center";
            context.textBaseline = "middle";

            context.translate(pos.X, pos.Y);

            if (RotateTextToInlineAngle) {
                context.rotate(avgAngle);
            } else {
                context.rotate(Math.PI / 2);
            }

            context.font = FontSize + 'px verdana';
            context.fillStyle = TextForeColor;
            context.fillText(element.Title, 0, 0);

            context.stroke();
            context.restore();
            context.closePath();
            }
            
            previousAngle = previousAngle + end1;
        }

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + x - 10, y);      
        context.lineWidth = 0.4;
        context.strokeStyle = LineColorBetweenBars;
        context.shadowBlur = 10;
        context.shadowColor = ShadowColor;
        context.stroke();
        context.fill();
        context.closePath();

        progressCanvas.current.style.transform = "rotate(-90deg)";
        progressCanvas.current.style.opacity = Opacity;

        setIsRendered((prevState) => true);

        }
    }


    return (
        <>
            <div id={HostElementId} className='host'> 
                <div id={Id} style={{position: 'relative', width: ChartWidth+'px', height: (ChartWidth + DataListHeight) +'px'}}>
                    <canvas style={{position: 'absolute' }} ref={progressCanvas} width={ChartWidth} height={ChartWidth} 
                        className="canvasCenter">

                    </canvas>  
                    {
                        IsRendered &&
                            <div style={{position: 'relative', bottom:-ChartWidth+'px', height: DataListHeight+'px'}}>
                                <div className="dataContainer">
                                    {
                                        RenderItems.map((itm, index) => (
                                            <div key={index} className="data">
                                                <div className="indicator" style={{backgroundColor: itm.BackgroundColor}}>                    
                                                </div>
                                                <span className="title" style={{width: '50px'}}>{itm.Title}</span>
                                                <span className="title" style={{width: '30px'}}>({itm.Value})</span>
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

export default RPieChart;
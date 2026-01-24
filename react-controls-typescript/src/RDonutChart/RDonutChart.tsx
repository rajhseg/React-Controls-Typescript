import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import PropTypes from "prop-types";

import styles from './RDonutChart.module.css';
import { RChartRef, RRef } from "../Models/models";

export class RDonutChartItem {
  constructor(
    public Value: number,
    public Title: string,
    public BackgroundColor: string,
    public ForeColor: string) {

  }
}

class RRenderDonutChartItem extends RDonutChartItem {
   
   Percentage = 0;

   constructor(value: number, title: string, backgroundColor: string, forecolor: string){
    super(value, title, backgroundColor, forecolor);
   }

  ConvertToRenderItem(item: RDonutChartItem) {
    this.Value = item.Value;
    this.Title = item.Title;
    this.BackgroundColor = item.BackgroundColor;
    this.ForeColor = item.ForeColor;
  }

  ConverToItem() {
    return new RDonutChartItem(this.Value, this.Title, this.BackgroundColor, this.ForeColor);
  }
}

export type RDonutChartRef = RChartRef & {

}

type Props = {
    Style?: React.CSSProperties,
    FontSize?: number,
    TextForeColor?: string,
    RotateTextToInlineAngle?: boolean,
    ShowTextOnTopOfChartItem?: boolean,
    MoveTextUpwardsFromCenterInPx?: number,
    ChartWidth?: number,
    DataListHeight?: number,
    ShadowColor?: string,
    ShadowBlur?: number,
    Opacity?: string,
    ChartItems: RDonutChartItem[]

}

const RDonutChart = forwardRef<RDonutChartRef, Props>(({
    Style,
    FontSize = 10,
    TextForeColor = 'white',
    RotateTextToInlineAngle = false,
    ShowTextOnTopOfChartItem = true,
    MoveTextUpwardsFromCenterInPx = 0,
    ChartWidth = 200,
    DataListHeight = 100,
    ShadowColor = 'blue',
    ShadowBlur = 10,
    Opacity = '1',
    ChartItems = []
}: Props, ref) => {

    const [IsRendered, setIsRendered] = useState(false);
    const [RenderItems, setRenderItems] = useState<RRenderDonutChartItem[]>([]);
    const [titleLength, setTitleLength]= useState<string>("");
    const [valueLength, setValueLength] = useState<string>("");

    let _lineWidth: number = 0;
    
    let context: CanvasRenderingContext2D | null = null;
  
    const Id: string = useId();

    const HostElementId : string = useId();

    const progressCanvas = useRef<HTMLCanvasElement|null>(null);

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
        let _itms: RRenderDonutChartItem[] = [];

        if (ChartItems) {
            for (let index = 0; index < ChartItems.length; index++) {
                const element = ChartItems[index];
                let itm = new RRenderDonutChartItem(element.Value, element.Title, element.BackgroundColor, element.ForeColor);
               _itms.push(itm);
            }

            setRenderItems((prevState)=> [...prevState, ..._itms]);
            
         }

    }, [
        ChartItems,
        FontSize,
        TextForeColor,
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

        calculateTitleWidth()
        RenderChart();  
        
        setTitleLength((prev)=> calculateTitleWidth()+'px');
        setValueLength((prev)=> calculateValueWidth()+'px');

    }, [RenderItems])

    const Items = () => {
        return RenderItems.map(x => x.ConverToItem());
    }

        
    const GetXYForText = (x: number, y: number, length: number, angle: number): { X: number, Y: number } => {
        let x2 = x + length * Math.cos(angle);
        let y2 = y + length * Math.sin(angle);
        return { X: x2, Y: y2 };
    }

    const calculateTitleWidth = () => {
        var names = ChartItems.map(x=>x.Title);
        var length = 0;

        if(context){
        for (let index = 0; index < names.length; index++) {
            const element = names[index];
            var mText = context?.measureText(element);
            if(mText.width > length){
                length = mText.width
            }
        }
        }

        if(length > 0)
        length = length+5;

        return length;
    } 

  
  const calculateValueWidth = () => {
    var names = ChartItems.map(x=>x.Value.toString());
    var length = 0;

    if(context){
      for (let index = 0; index < names.length; index++) {
        const element = names[index];
        var mText = context?.measureText(element);
        if(mText.width > length){
            length = mText.width
        }
      }
    }

    if(length > 0)
      length = length+10;
    
    return length;
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
            let radiusLength = (ChartWidth / 3) + (LineWidth() / 2);

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
                let end1 = (percentage / 100) * 359.98 * (Math.PI / 180);

                element.Percentage = percentage;
                context.fillStyle = element.BackgroundColor;
                context?.beginPath();
                context.lineWidth = LineWidth();

                context?.arc(x, y, ChartWidth / 3, previousAngle, (previousAngle + end1), false);
                context.strokeStyle = element.BackgroundColor;

                context.shadowBlur = ShadowBlur;
                context.shadowColor = ShadowColor;
                context?.stroke();
                context.closePath();

                if (ShowTextOnTopOfChartItem) {
                let endAngle = previousAngle + end1;
                let avgAngle = (previousAngle + (endAngle > previousAngle ? endAngle : endAngle + ((Math.PI * 359.58) / 180))) / 2;

                let metrics = context.measureText(element.Title);
                let textRadiusLength = radiusLength - metrics.width - 5 + MoveTextUpwardsFromCenterInPx;

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

            progressCanvas.current.style.transform = "rotate(-90deg)";
            progressCanvas.current.style.opacity = Opacity;
        
            setIsRendered((prevState) => true);
    
        }
    }


    return (
        <>
        <div id={HostElementId} className={styles.host} style={Style}>
            <div id={Id} style={{position: 'relative', width: (ChartWidth+'px'), height: ((ChartWidth + DataListHeight) +'px') }}>
                <canvas style={{position: 'absolute'}} ref={progressCanvas} width={ChartWidth} height={ChartWidth}>

                </canvas>    
                {
                    IsRendered  &&
                        <div style={{position: 'relative', bottom:-ChartWidth+'px', height: DataListHeight+'px' }}>
                            <div className={styles.ddataContainer}>
                                {
                                    RenderItems.map((itm, index) => (
                                        <div className={styles.data} key={index}>
                                            <div className={styles.indicator} style={{backgroundColor: itm.BackgroundColor}}>                    
                                            </div>
                                            <span className={styles.title} style={{width: titleLength}}>{itm.Title}</span>
                                            <span className={styles.title} style={{width: valueLength}}>({itm.Value})</span>
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

export default RDonutChart;
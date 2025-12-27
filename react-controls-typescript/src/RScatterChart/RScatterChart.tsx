
import { useEffect, useId, useRef, useState } from 'react';
import { BarChartItem, Graph, PopupChartItem } from '../Models/models';
import './RScatterChart.css';


type Props = {
    PlotItemSize?: number,
    TextColor?: string,
    XAxisTitle?: string,
    YAxisTitle?: string,
    NoOfSplitInXAxis?: number,
    NoOfSplitInYAxis?: number,
    Width?: number,
    Height?: number,
    MarginX?: number,
    MarginY?: number,
    DataListHeight?: number,
    PopupBackColor?: string,
    PopupForeColor?: string | undefined,
    PopupBackgroundOpacity?: number,
    ChartItems?: RScatterChartItem[]
};

export class RScatterChartItem {
    constructor(public ItemName: string, public ItemColor: string, public Values: Graph[] = []) {

    }
}


const RScatterChart = ({
    PlotItemSize = 3,
    TextColor = 'gray',
    XAxisTitle = '',
    YAxisTitle = '',
    NoOfSplitInXAxis = 4,
    NoOfSplitInYAxis = 4,
    Width = 300,
    Height = 300,
    MarginX = 50,
    MarginY = 50,
    DataListHeight = 50,
    PopupBackColor = 'lightgray',
    PopupForeColor = undefined,
    PopupBackgroundOpacity = 1,
    ChartItems = []
}: Props) => {

    let context: CanvasRenderingContext2D | null = null;
    let PopupItems: PopupChartItem[] = [];
    let Id = useId();
    let HostElementId = useId();

    const [IsRendered, setIsRendered] = useState(false);
    const [RenderItems, setRenderItems] = useState<RScatterChartItem[]>([]);

    const bar = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        
        setRenderItems((prevState) => []);

        let itms: RScatterChartItem[] = [];

        for(let i = 0; i < ChartItems.length; i++){
            let itm = ChartItems[i];
            itms.push(itm);
        }
        
        setRenderItems((prevState) => [...prevState, ...itms])

    }, [ 
        PlotItemSize,
        TextColor,
        XAxisTitle,
        YAxisTitle,
        NoOfSplitInXAxis,
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
        
        RenderScatterChart();

    }, [RenderItems])

      
  const MouseMove = (event: MouseEvent) => {

    if(context && bar){            
      context?.beginPath();      
      context.clearRect(0, 0, Width, Height);
      context.closePath();

      RenderScatterChart();

      let item = MouseOnTopOfItem(event.offsetX, event.offsetY);

      if(item) {      
        let lineItem = item.Item;
        let x = event.offsetX + 10;
        let y = event.offsetY;
        let met = context.measureText(lineItem.Values[item.ValueIndex].xPoint.toString());
        let met1 = context.measureText(lineItem.Values[item.ValueIndex].yPoint.toString());

        let xtitle = context.measureText(XAxisTitle);
        let ytitle = context.measureText(YAxisTitle);

        let w1 = met.width + xtitle.width;
        let w2 = met1.width + ytitle.width;

        let width = Math.max(w1, w2);

        let textWidth =  25 + width;

        if(x + textWidth > Width) {          
          x = x - textWidth - 20;
        }
               
        let height = 40;
        if(y + height > Height) {
          y = y - height;
        }

        context.beginPath();
        context.save();
        context.globalAlpha = PopupBackgroundOpacity;
        context.fillStyle = PopupBackColor;
        context.rect(x, y, textWidth, 40); 
        context.fill();
        context.restore();
        context.closePath();
        
        context.beginPath();      
        context.save();
        
        context.strokeStyle = PopupForeColor ?? item.ItemColor;
        context.fillStyle = PopupForeColor ?? item.ItemColor;
        context.fillText(" "+XAxisTitle+" : "+ lineItem.Values[item.ValueIndex].xPoint, x + 5, y + 15);
        context.fillText(" "+YAxisTitle+" : "+ lineItem.Values[item.ValueIndex].yPoint, x + 5, y + 35);

        context.stroke();
        context.restore();
        context?.closePath();  
      }
    }
  }

  const MouseOnTopOfItem = (x: number, y: number): PopupChartItem | undefined  => {

    let boundaryRange = 3;

    for (let index = 0; index < PopupItems.length; index++) {
      const element = PopupItems[index];
      if(x>= element.x1 - boundaryRange && x<= element.x2 + boundaryRange 
        && y>= element.y1 - boundaryRange && y <= element.y2 + boundaryRange){
        return element;
      }
    }

    return undefined;
  }

   const getWidthFromString = (value: string) : number => {
    if (context) {
      let metrics = context.measureText(value);
      return metrics.width;
    }

    return 50;
  }

  const getTextHeight = (met: TextMetrics) => {
    return met.actualBoundingBoxAscent + met.actualBoundingBoxDescent;
  }

  const getNameIndicator = (itm: BarChartItem) => {
    return typeof itm.barItemsBackColor === 'string' ? itm.barItemsBackColor : itm.barItemsBackColor.length > 0 ?
      itm.barItemsBackColor[0] : "orangered";
  }

  const isPropString = (prop: any) => {
    return typeof prop === 'string';
  }

  const RenderScatterChart = () => {

    setIsRendered((prevState) => false);

    if (bar && context && RenderItems && RenderItems.length > 0) {
      let min: number | undefined = undefined;
      let max: number | undefined = undefined;
      context.clearRect(0, 0, Width, Height);
      
      let spaceFromTopYAxis = 25;
      let spaceFromRightXAxis = 25;

      let xValues : number[] = [];
      let yValues : number[] = [];

      for (let index = 0; index < RenderItems.length; index++) {
        const element = RenderItems[index];
        let _x = element.Values.map(x => x.xPoint);
        let _y = element.Values.map(y => y.yPoint);

        xValues = [...xValues, ..._x];
        yValues = [...yValues, ..._y];
      }

      if (xValues && yValues) {

        min = MinArray(yValues);
        max = MaxArray(yValues);

        let ydistance = 0;
        if (min != undefined && max != undefined) {
          ydistance = (max) / NoOfSplitInYAxis;
        }

        ydistance = GetRoundToTenDigit(ydistance);

        var MinLimit = 0;
        var MaxLimit = ydistance * (NoOfSplitInYAxis);

        var StartX: number = MarginX;
        var StartY: number = Height - MarginY;

        /* Draw Vertical Line */
        context.beginPath();
        context.moveTo(StartX, StartY);
        context.lineTo(StartX, 0);
        context.strokeStyle = TextColor;
        context.stroke();

        /* Draw Horizontal Line */
        context.moveTo(StartX, StartY);
        context.lineTo(Width, StartY);
        context.strokeStyle = TextColor;
        context.stroke();
        context.closePath();


        /* Draw Title on x-axis */
        context.beginPath();

        let met = context.measureText(XAxisTitle);
        let xTextPoint = (Width - MarginX) / 2 + MarginX;
        xTextPoint = xTextPoint - (met.width / 2);
        let yTextPoint = Height - 10;

        context.save();
        context.fillStyle = TextColor;
        context.fillText(XAxisTitle, xTextPoint, yTextPoint);
        context.restore();

        context.closePath();

        /* Draw Title On Y axis */
        context.beginPath();
        context.save();

        met = context.measureText(XAxisTitle);
        yTextPoint = (Height - MarginY) / 2;
        yTextPoint = yTextPoint + (met.width / 2);
        xTextPoint = 15;
        context.fillStyle = TextColor;
        context.translate(xTextPoint, yTextPoint);
        context.rotate((Math.PI / 180) * 270);
        context.fillText(YAxisTitle, 0, 0);

        context.restore();
        context.closePath();


        /* Draw y axis line */
        let yvDistance = (StartY - spaceFromTopYAxis) / NoOfSplitInYAxis;

        /* Draw Y Axis */
        for (let index = 0; index <= NoOfSplitInYAxis; index++) {
          let yDisplayValue = Math.round(ydistance * (NoOfSplitInYAxis - index));
          let yPoint = Math.round((yvDistance * index) + spaceFromTopYAxis);

          HorizontalLineInYAxis(StartX, yPoint);
          DrawHorizontalLine(StartX, yPoint);
          HorizontalLineDisplayValueInYAxis(yDisplayValue.toString(), StartX, yPoint);
        }

        /* Draw X Axis Line */
        let xmin = MinArray(xValues);
        let xmax = MaxArray(xValues);

        let xdistance = 0;
        if (xmin != undefined && xmax != undefined) {
          xdistance = (xmax) / NoOfSplitInXAxis;
        }

        xdistance = GetRoundToTenDigit(xdistance);
        let xvDistance = (Width - StartX - spaceFromRightXAxis) / NoOfSplitInXAxis;

        for (let index = 1; index <= NoOfSplitInXAxis; index++) {
          let xDisplayValue = xdistance * index;
          let xPoint = (xvDistance * index) + StartX;
          let yPoint = Height - MarginY;

          DrawVerticalLine(xPoint, yPoint);
          DrawVerticalLineInXAxis(xPoint, yPoint);
          DrawVerticalLineDisplayValueInXAxis(xDisplayValue.toString(), xPoint, yPoint);
        }

        for (let index = 0; index < RenderItems.length; index++) {
          const element = RenderItems[index];

          for (let v = 0; v < element.Values.length; v++) {
            const item = element.Values[v];

            let indx = item.xPoint / xdistance
            let xPoint = xvDistance * indx + StartX;

            let yindx = -(item.yPoint / ydistance) + NoOfSplitInYAxis;
            let yPoint = Math.round((yvDistance * yindx) + spaceFromTopYAxis);
            
            Plot(xPoint, yPoint, element.ItemColor);

            PopupItems.push(new PopupChartItem(xPoint, yPoint, xPoint + PlotItemSize,
              yPoint + PlotItemSize, element, v, index, element.ItemColor
            ));

          }

        }

      }

      setIsRendered((prevState) => true);
    
    }
  }

  const Plot = (x: number, y: number, color: string) => {
    if (context) {
      context.beginPath();
      context.strokeStyle = color;
      context.fillStyle = color;
      context.ellipse(x, y, PlotItemSize, PlotItemSize, 0, 0, 2 * Math.PI);
      context.stroke();
      context.fill();
      context.closePath();
    }
  }

  const DrawVerticalLine = (xPoint: number, yPoint: number) => {
    if (context) {
      context.beginPath();
      context.lineWidth = 0.2;
      context.strokeStyle = TextColor;
      context.moveTo(xPoint, yPoint);
      context.lineTo(xPoint, 0);
      context.stroke();
      context.closePath();
    }
  }

  const DrawVerticalLineDisplayValueInXAxis = (value: string, xPoint: number, yPoint: number) => {
    if (context) {
      context.beginPath();

      let met = context.measureText(value);
      let endY = yPoint + 15;

      context.fillStyle = TextColor;
      context.fillText(value, (xPoint - (met.width / 2)), endY);
      context.fill();
      context.stroke();
      context.closePath();
    }
  }

  const DrawVerticalLineInXAxis = (xPoint: number, yPoint: number) => {
    if (context) {
      context.beginPath();
      let startY = yPoint - 5;
      let endY = yPoint + 5;
      context.lineWidth = 1;
      context.strokeStyle = TextColor;
      context.moveTo(xPoint, startY);
      context.lineTo(xPoint, endY);
      context.stroke();
      context.closePath();
    }
  }

  const GetRoundToTenDigit = (distance: number) => {
    let j = distance / 10;
    let roundedJ = Math.ceil(j);
    distance = roundedJ * 10;

    return distance;
  }

  const GetYStartPoint = (displayValue: number, distance: number, itemcount: number, vDistance: number, spaceFromTopYAxis: number) => {
    let index = -(displayValue / distance) + NoOfSplitInXAxis;
    let yPoint = Math.round((vDistance * index) + spaceFromTopYAxis);
    return yPoint;
  }

  const DrawXAxisName = (name: string, xPoint: number, yPoint: number) => {
    if (context) {
      let startY = yPoint;
      context.beginPath()
      context.moveTo(xPoint, startY);
      context.fillStyle = TextColor;
      context.fillText(name, xPoint, startY);
      context.fill();
      context.strokeStyle = TextColor;
      context.stroke();
      context.closePath();
    }
  }

  const DrawBar = (startX: number, startY: number, xdistance: number, yDistance: number, color: string) => {
    if (context) {
      context.beginPath();
      context.fillStyle = color;
      context.fillRect(startX, startY, xdistance, yDistance);
      context.fill();
      context.closePath();
    }
  }

  const HorizontalLineDisplayValueInYAxis = (value: string, x: number, ypoint: number) => {
    if (context) {
      context.beginPath();
      let metrics = context.measureText(value);

      let StartX = x - 7 - metrics.width;
      let StartY = ypoint + 3;
      let EndX = x - 7;
      let EndY = ypoint;

      context.fillStyle = TextColor;
      context.moveTo(StartX, StartY);
      context.fillText(value, StartX, StartY);
      context.fill();
      context.stroke();
      context.closePath();
    }
  }

  const DrawHorizontalLine = (x: number, ypoint: number) => {
    if (context) {
      context.beginPath();
      let startX = x;
      let endX = x + Width - MarginX;
      context.lineWidth = 0.2;
      context.strokeStyle = TextColor;
      context.moveTo(startX, ypoint);
      context.lineTo(endX, ypoint);
      context.stroke();
      context.closePath();
    }
  }

  const HorizontalLineInYAxis = (x: number, ypoint: number) => {
    if (context) {
      context.beginPath();
      let StartX = x - 5;
      let StartY = ypoint;
      let EndX = x + 5;
      let EndY = ypoint;

      context.strokeStyle = TextColor;
      context.moveTo(StartX, StartY);
      context.lineTo(EndX, EndY);

      context.stroke();
      context.closePath();
    }
  }

  const DrawText = (text: string, x: number, y: number, forecolor: string, rotate: number | undefined = undefined) => {
    if (context) {
      context.beginPath();
      context.strokeStyle = forecolor;
      context.fillStyle = forecolor;
      context.fillText(text, x, y);
      context.fill();
      context.stroke();
      context.closePath();
    }
  }

  const MinArray = (array: number[]) => {
    return array.reduce((x, y) => {
      return x < y ? x : y;
    });
  }

  const MaxArray = (array: number[]) => {
    return array.reduce((x, y) => {
      return x > y ? x : y;
    })
  }


    return (
        <>
        <div>
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
}


export default RScatterChart;
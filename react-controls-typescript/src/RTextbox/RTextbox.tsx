import React, { ChangeEvent, forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { RRef } from "../Models/models";

import './RTextbox.css';

export type RTextboxRef = RRef & {
    Value: string,
    InputElement: HTMLInputElement | null
}

type Props = {
    Style?: React.CSSProperties,
    LabelText?: string,
    PlaceholderText?: string,
    LabelForeColor?: string,
    BottomLineColor?: string,
    ReadOnly?: boolean,
    Disabled?: boolean,
    TextBoxWidth?: string,
    TextBoxHeight?: string,
    Font?: string,
    EnableMarginTextBottom?: boolean,
    MarginTextBottom?: string,
    IsPasswordBox?: boolean,
    TextboxValue?: string,
    ValueChanged?: (e: string) => void,
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
    Drop?: (e: React.DragEvent<HTMLInputElement>) => void
};

const RTextbox = forwardRef<RTextboxRef, Props>(({
    Style,
    LabelText = "",
    PlaceholderText = "",
    LabelForeColor = "blue",
    BottomLineColor = "blue",
    ReadOnly = false,
    Disabled = false,
    TextBoxWidth = "200px",
    TextBoxHeight = "30px",
    Font = "",
    EnableMarginTextBottom = true,
    MarginTextBottom = "10px",
    IsPasswordBox = false,
    TextboxValue = '',
    ValueChanged =  (e: string) => { },
    Click =  (e: React.MouseEvent<HTMLInputElement>) => {},
    Focus = (e: React.FocusEvent<HTMLInputElement>) => {},
    Blur = (e: React.FocusEvent<HTMLInputElement>) => {},
    Cut = (e: React.ClipboardEvent<HTMLInputElement>) => {},
    Copy = (e: React.ClipboardEvent<HTMLInputElement>) => {},
    Paste = (e: React.ClipboardEvent<HTMLInputElement>) => {},
    KeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {},
    KeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {},
    KeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {},
    MouseEnter = (e: React.MouseEvent<HTMLInputElement>) => {},
    MouseDown = (e: React.MouseEvent<HTMLInputElement>) => {},
    MouseUp = (e: React.MouseEvent<HTMLInputElement>) => {},
    MouseLeave = (e: React.MouseEvent<HTMLInputElement>) => {},
    MouseMove = (e: React.MouseEvent<HTMLInputElement>) => {},
    MouseOut = (e: React.MouseEvent<HTMLInputElement>) =>  {},
    MouseOver = (e: React.MouseEvent<HTMLInputElement>) => {},
    DblClick = (e: React.MouseEvent<HTMLInputElement>) => {},
    Drag = (e: React.DragEvent<HTMLInputElement>) => {},
    DragEnd = (e: React.DragEvent<HTMLInputElement>) => {},
    DragEnter = (e: React.DragEvent<HTMLInputElement>) => {},
    DragLeave = (e: React.DragEvent<HTMLInputElement>) => {},
    DragOver = (e: React.DragEvent<HTMLInputElement>) => {},
    DragStart = (e: React.DragEvent<HTMLInputElement>) => {},
    Drop = (e: React.DragEvent<HTMLInputElement>) => {}
}:Props, ref) => {

    let HostElementId: string = useId();
    let Id: string = useId();

    const [tValue, setTValue] = useState("");
    const inpRef = useRef<HTMLInputElement|null>(null);

    useEffect(() => {
        setTValue((prevState)=> TextboxValue);
    }, [TextboxValue]);

    useImperativeHandle(ref, () => ({
        Id: Id,
        HostElementId: HostElementId,
        InputElement: inpRef.current,
        Value: tValue
    }));

    const textBoxValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value }  = e.target;
        setTValue((prevState)=> value);
        ValueChanged(value);
    }

    return (
        <>
        <div id={HostElementId} className="host" style={Style}>
            <div id={Id} className="txtroot">

                <span className="span" style={{ width: TextBoxWidth, color: LabelForeColor}}> 
                    {LabelText}
                </span>
                
                <input ref={inpRef}  readOnly={ReadOnly}  
                        disabled={Disabled}
                        type={IsPasswordBox ? 'password' : 'text'}
                        value={tValue} className="txtbox" 
                
                        style={{ height: TextBoxHeight, 
                                width: TextBoxWidth,
                                borderBottomColor: BottomLineColor,       
                                marginBottom: EnableMarginTextBottom ? MarginTextBottom : '', 
                                font: Font, 
                                pointerEvents:(Disabled || ReadOnly) ? 'none': undefined
                            }}

                    onDrag={(e) => Drag(e)}  onDragEnd={(e) => DragEnd(e)} 
                    onDragEnter={(e)=> DragEnter(e)} onDragLeave={(e) => DragLeave(e)}
                    onDragOver={(e) => DragOver(e)} onDragStart={(e) => DragStart(e)}
                    onDrop={(e) => Drop(e)}
                    
                    onClick={(e)=> Click(e)} onDoubleClick={(e)=> DblClick(e)}
                    onBlur={(e)=>Blur(e)} onFocus={(e)=> Focus(e)}
                    
                    onCut={(e)=> Cut(e)} onCopy={(e)=>Copy(e)} onPaste={(e)=> Paste(e)}

                    onKeyDown={(e)=> KeyDown(e)} onKeyUp={(e)=> KeyUp(e)} onKeyPress={(e)=>KeyPress(e)}
                    
                    onMouseDown={(e)=> MouseDown(e)} onMouseEnter={(e)=>MouseEnter(e)} onMouseUp={(e)=> MouseUp(e)}
                    onMouseLeave={(e)=>MouseLeave(e)} onMouseMove={(e)=>MouseMove(e)}
                    onMouseOut={(e)=>MouseOut(e)} onMouseOver={(e)=>MouseOver(e)}
                    
                    placeholder={PlaceholderText}
                    onChange={(e)=> textBoxValueChange(e)}
                    />     

            </div>
        </div>
        </>
    );

});

export default RTextbox;
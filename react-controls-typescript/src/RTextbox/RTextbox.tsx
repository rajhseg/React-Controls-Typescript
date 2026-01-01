import React, { ChangeEvent, forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { PropsEvents, RRef } from "../Models/models";

import './RTextbox.css';

export type RTextboxRef = RRef & {
    Value: string,
    InputElement: HTMLInputElement | null
}

type Props = PropsEvents<string> & {
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
    TextboxValue?: string
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
    Drop = (e: React.DragEvent<HTMLInputElement>) => {},
    Input = (e: React.FormEvent<HTMLInputElement>) => {},
    Change = (e: React.ChangeEvent<HTMLInputElement>) => {}
}:Props, ref) => {

    let HostElementId: string = useId();
    let Id: string = useId();
    let InputId: string = useId();

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
        Change(e);
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
                
                <input ref={inpRef}  readOnly={ReadOnly} id={InputId}
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

                    onInput={(e)=> Input(e)} 

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
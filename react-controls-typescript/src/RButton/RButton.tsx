import propTypes from "prop-types";
import { RRef } from '../Models/models';

import "./RButton.css";

import React, { forwardRef, useId, useImperativeHandle, useRef } from "react";

type Props = {
    IsDisabled? : boolean,
    onClick : (e: React.MouseEvent<HTMLButtonElement>) => void,
    ButtonType?: "button" | "submit" | "reset",
    ButtonHeight?: string,
    ButtonWidth?: string,
    ForeColor?: string,
    BackgroundColor?: string,
    children: React.ReactNode
}

export type RButtonRef = RRef & { 
    Click: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const RButton = forwardRef<RButtonRef, Props>(({
    IsDisabled = false,
    onClick,
    ButtonType = "button",
    ButtonHeight = "32px",
    ButtonWidth = "100px",
    ForeColor = "whitesmoke",
    BackgroundColor = "blue",
    children
}: Props, ref) => {

    let compId = useId();
    let bRef = useRef<HTMLButtonElement | null>(null);

    useImperativeHandle(ref, () => ({
        Click() {
            bRef?.current?.click();
        },
        Id : compId
    }));

    const ButtonClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        onClick(e);
    }

    return (
        <>
        <div className="host">
        <button ref={bRef} id={compId} className="btn" disabled={IsDisabled}
                onClick={(e) => ButtonClick(e)} type={ButtonType}
                style={{'height': ButtonHeight, 
                        'width': ButtonWidth,
                        'color':ForeColor,
                        'backgroundColor':BackgroundColor, 
                        'border': '1px solid '+BackgroundColor}}>
            {children}
        </button>
        </div>
        </>
    );
});

export default RButton;
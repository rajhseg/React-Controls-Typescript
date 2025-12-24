import propTypes from "prop-types";

import "./RButton.css";

import React, { useId } from "react";

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

const RButton = ({
    IsDisabled = false,
    onClick,
    ButtonType = "button",
    ButtonHeight = "32px",
    ButtonWidth = "100px",
    ForeColor = "whitesmoke",
    BackgroundColor = "blue",
    children
}: Props) => {

    let compId = useId();

    return (
        <>
        <button id={compId} className="btn" disabled={IsDisabled}
                onClick={(e) => onClick(e)} type={ButtonType}
                style={{'height': ButtonHeight, 
                        'width': ButtonWidth,
                        'color':ForeColor,
                        'backgroundColor':BackgroundColor, 
                        'border': '1px solid '+BackgroundColor}}>
            {children}
        </button >
        </>
    );
}

export default RButton;
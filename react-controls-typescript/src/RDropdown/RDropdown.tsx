import { forwardRef, useImperativeHandle } from "react";
import "./RDropdown.css"; 
import { RRef } from "../Models/models";

export type RDropdownRef = RRef & {
    
}

type Props = {
    IsMulti: boolean,
    BackgroundColor: string,
    ForeColor: string,
    IsChildOfAnotherControl: boolean,
    IsChildOfAnotherControlClicked: boolean,
    ParentComponent: any | undefined,
    EnableFilterOption: boolean,
    Width: string,
    DropDownContentWidth: string

    Opened: (val: boolean) => void,
    Closed: (val: boolean) => void
};

const RDropdown = forwardRef<RDropdownRef, Props>(({

}: Props, ref) => {

    useImperativeHandle(ref, () => ({
        Id: "",
        HostElementId:"",
        Value:""
    }));

    return (
        <>

        </>
    );

});


export default RDropdown;
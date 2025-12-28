
import { createContext } from "react";


export type ThemeContextType = {
    EnableFlexOnHost: boolean
}

export const ThemeContext = createContext<ThemeContextType | null>(null);
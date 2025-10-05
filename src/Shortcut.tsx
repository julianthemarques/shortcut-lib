import React from "react"
import { useShortCut } from "./use-shortcut"

export const Shortcut = ({ children, keys, onKey }: { children: React.ReactNode, keys: string | string[], onKey: (key: string, ev: KeyboardEvent) => void }) => {

    const shortcutHandler = useShortCut(keys, onKey)

    return (
        <div onKeyDown={(ev) => shortcutHandler(ev as unknown as KeyboardEvent)}>
            {children}
        </div >
    )
}
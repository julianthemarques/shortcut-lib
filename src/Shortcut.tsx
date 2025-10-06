import React from "react";
import { IShortcutOptions, useShortCut } from "./use-shortcut";

type ShortcutProps = {
    children?: React.ReactNode;
    keys: string | string[];
    onKey: (key: string, ev: KeyboardEvent) => void;
    options?: IShortcutOptions;
    global?: boolean;
};

export const Shortcut = ({ children, keys, onKey, options }: ShortcutProps) => {
    const shortcutHandler = useShortCut(keys, onKey, options);

    return (
        <div
            onKeyDown={(ev: React.KeyboardEvent) => shortcutHandler(ev.nativeEvent)}
        >
            {children}
        </div>
    );

};
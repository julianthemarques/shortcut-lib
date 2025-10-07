import React from "react";
import { IShortcutOptions, useShortCut } from "./use-shortcut";

type IShortcutProps = {
    children?: React.ReactNode;
    keys: string | string[];
    onKey: (key: string, ev: KeyboardEvent) => void;
    options?: IShortcutOptions;
};

export const Shortcut = ({ children, keys, onKey, options }: IShortcutProps) => {
    const shortcutHandler = useShortCut(keys, onKey, options);

    return (
        <div
            onKeyDown={(ev: React.KeyboardEvent) => shortcutHandler(ev.nativeEvent)}
        >
            {children}
        </div>
    );

};
import { FC, useLayoutEffect } from "react";
import { useApp } from "../hooks";
import { Application, Asset } from "playcanvas";

interface EnvAtlasProps {
    asset: Asset;
}

export const EnvAtlas: FC<EnvAtlasProps>= ({ asset }) => {

    const app: Application = useApp();
    
    useLayoutEffect(() => {
        if (!asset?.resource) return;
        
        app.scene.envAtlas = asset.resource;

        return () => {
            if(app && app.scene) {
                // @ts-ignore
                app.scene.envAtlas = null
            }
        }

    }, [app, asset?.resource]);

    return null

}
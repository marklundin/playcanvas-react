import { FILLMODE_NONE, Application as PlayCanvasApplication, RESOLUTION_AUTO, Mouse, TouchDevice } from "playcanvas";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ParentContext } from "./Entity";

const AppContext = createContext(null);

export const useApp = () => {
    return useContext(AppContext);
}

export const Application = ({ children }) => {
    const canvas = useRef();
    return <>
        <canvas className="pc-app" style={{ width: '100%', height: '100%' }} ref={canvas}/>
        <ApplicationWithoutCanvas canvasRef={canvas}>
            { children }
        </ApplicationWithoutCanvas>
    </>
}

export const ApplicationWithoutCanvas = ({ children, canvasRef }) => {

    const [app, setApp] = useState();

    useEffect(() => {
        if(canvasRef.current){

            const opts = {
                mouse: new Mouse(document.body),
                touch: new TouchDevice(document.body)
            }

            const localApp = new PlayCanvasApplication(canvasRef.current, opts);
            
            setApp(localApp);
            localApp.start();

            localApp.setCanvasFillMode(FILLMODE_NONE);
            localApp.setCanvasResolution(RESOLUTION_AUTO);

        }
    
        return () => {};
    }, [canvasRef]);

    
    if(!app) return null;
    
    return (
        <AppContext.Provider value={app}>
            <ParentContext.Provider value={app.root}>
                { children }
            </ParentContext.Provider>
        </AppContext.Provider>
    )
}
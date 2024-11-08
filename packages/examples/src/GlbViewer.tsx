import { Container, Entity } from "@pc-react";
import { Align, Camera, EnvAtlas, Script } from "@pc-react/components";
import { useEnvAtlas, useModel } from "./utils/hooks";
import { AutoRotator, CameraFrame, Grid, OrbitControls, ShadowCatcher } from "@pc-react/scripts";
import { FC, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@pc-react/hooks";
import { usePostControls } from "./utils/post-controls";
import { CameraComponent, Gizmo, Entity as PcEntity, TranslateGizmo } from "playcanvas";
import { SyntheticMouseEvent, SyntheticPointerEvent } from "@pc-react/utils/synthetic-event";

type GlbViewerProps = {
  /** The url to the glb */
  src: string
  /** The url to an environment atlas texture, which is used for lighting */
  envMapSrc: string,
}

const useGizmo = (entities: PcEntity[] = [], camera?: CameraComponent) => {

  const app = useApp();
  const parent = useApp();
  const entityIds : String = entities.reduce((str, e) => `${str}-${e.getGuid()}`, '');
  const gizmoRef = useRef<Gizmo | null>(null)
  const [gizmo, setGizmo] = useState<Gizmo | null>(null)
  
  const activeCamera = camera ?? (app.root.findComponents('camera') as CameraComponent[])
    .filter((camera: CameraComponent) => !camera.renderTarget)
    .sort((a: CameraComponent, b: CameraComponent) => a.priority - b.priority)
    .shift();

  console.log('active', activeCamera)

  useLayoutEffect(() => {

    if (!activeCamera) return;

    const layer = Gizmo.createLayer(app);
    gizmoRef.current = new TranslateGizmo(activeCamera, layer);
    setGizmo(gizmoRef.current);

    return () => {
      // gizmoRef.current?.destroy();
      // app.scene.layers.remove(layer);
    }

  }, [app, parent, activeCamera]);


  useLayoutEffect(() => {
    console.log('attaching', entities)
    if (entities.length > 0 ) gizmoRef.current?.attach(entities)
    return () => {
      // gizmoRef.current?.detach()
    }
  }, [gizmo, entityIds])

}

export const GlbViewer: FC<GlbViewerProps> = ({ 
  src = '/environment-map.png',
  envMapSrc = '/lamborghini_vision_gt.glb'
}) => {

  const app = useApp();
  const postSettings = usePostControls();
  
  const { data: envMap, isPending: isEnvLoading } = useEnvAtlas(envMapSrc);
  const { data: model, isPending: isModeLoading } = useModel(src);
  const [selectedEntities, setSelectedEntities] = useState<PcEntity[]>([])
  useGizmo(selectedEntities);


  const selectEntity = (entity : PcEntity) => {
    console.log(entity)
    setSelectedEntities((prev) => [...prev, entity]);
  };

  const deselectEntity = (entity : PcEntity) => {
    setSelectedEntities((prev) => prev.filter((e) => e !== entity));
  };

  useLayoutEffect(() => {
    const layer = app?.scene?.layers?.getLayerByName('Skybox');
    if(layer){
      layer.enabled = false;
    }
  }, [app]);

  const onEntitySelect = (e : SyntheticMouseEvent) => {
    const selectedEntity: PcEntity | null = e.currentTarget;
    if (selectedEntity) {
      selectEntity(selectedEntity);
    }
    // if (e.currentTarget) setActive(e.currentTarget);
  };

  const isLoading = isEnvLoading || isModeLoading;
  // if (isLoading) return null;

  return (
    <Entity>
      <EnvAtlas asset={envMap} />
      <Script script={Grid} />

      {/* The Camera with some default post */}
      <Entity name='camera' position={[4, 2, 4]}>
        <Camera clearColor='#090707' fov={28} nearClip={1} farClip={100} exposure={1}/>
        <OrbitControls inertiaFactor={0.07} distanceMin={6} distanceMax={10} pitchAngleMin={1} pitchAngleMax={90}/>
        {/* <Script script={AutoRotator} /> */}
        <Script script={CameraFrame} {...postSettings}/>
      </Entity>

      {/* The GLB Asset to load */}
      <Entity name='asset'>
        <Script script={ShadowCatcher} intensity={0.9}/>
        <Align bottom>
          <Container 
            onClick={onEntitySelect}
            asset={model} 
            castShadows
          />
         </Align>
      </Entity>
    </Entity>
  );
  
};

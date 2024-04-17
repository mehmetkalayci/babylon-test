import {
  Engine,
  Scene,
  Vector3,
  ArcRotateCamera,
  Color3,
  ActionManager,
  ExecuteCodeAction,
  Color4,
  Layer,
} from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

import "@babylonjs/loaders";

(async () => {
  const canvas = <HTMLCanvasElement>document.getElementById("canvas");
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  const camera = new ArcRotateCamera(
    "camera",
    0,
    0,
    0,
    new Vector3(0, 0, 0),
    scene
  );

  camera.attachControl(canvas, true);
  engine.setSize(canvas.width, canvas.height);

  // ActionManager'ı sahne düzeyinde oluştur
  var actionManager = new ActionManager(scene);

  // Pointer üzerine geldiğinde çalışacak işlemi tanımla
  actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, function (ev) {
      console.log("Mouse over mesh:", ev.meshUnderPointer.name);
    })
  );

  // Pointer dışına çıkıldığında çalışacak işlemi tanımla
  actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, function (ev) {
      console.log("Mouse out from mesh:", ev.meshUnderPointer.name);
    })
  );

  // Sahne yüklemesi tamamlandığında çalışacak işlem
  SceneLoader.Append(
    "",
    "https://fineproject.com.tr/obj/ablokobj/animation.babylon",
    scene,
    async function (meshes) {
      // Meshler üzerinde ActionManager'ı kullan
      meshes.meshes.forEach((mesh) => {
        mesh.isPickable = true;
        mesh.actionManager = actionManager;
      });
    }
  );

  // Motoru yeniden boyutlandır
  window.addEventListener("resize", function () {
    engine.resize();
  });

  engine.runRenderLoop(() => {
    if (scene.activeCamera) {
      scene.render();
    }
  });
})();

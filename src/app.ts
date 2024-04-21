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
  DynamicTexture,
  MeshBuilder,
  StandardMaterial,
} from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

import "@babylonjs/loaders";

(async () => {
  // Fetch JSON data from a URL
  const fetchData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  // Load JSON data before the scene is created
  const jsonData = await fetchData("https://localhost:8080/flats.json");

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

  var background = new Layer("background", "/1.webp", scene);


  // ActionManager'ı sahne düzeyinde oluştur
  var actionManager = new ActionManager(scene);

  let originalOverlayColor;

  // Pointer üzerine geldiğinde çalışacak işlemi tanımla
  actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, function (ev) {
      console.log("Mouse over mesh:", ev.meshUnderPointer.name);

      const filteredData = jsonData.find(
        (item) => item.name === ev.meshUnderPointer.name
      );
      console.log(filteredData);

      if (filteredData) {
        const popup = document.getElementById("popup");
        popup.style.left = ev.pointerX + "px";
        popup.style.top = ev.pointerY + "px";
        popup.style.display = "block";

        popup.innerHTML =
          filteredData.displayName + "<br />" + "<img src='" + filteredData.coverPhoto +"' style='width: 100%;'>" + filteredData.status;

        originalOverlayColor = ev.meshUnderPointer.overlayColor;
        ev.meshUnderPointer.overlayColor = Color3.Blue();
      }
    })
  );

  // Pointer dışına çıkıldığında çalışacak işlemi tanımla
  actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, function (ev) {
      console.log("Mouse out from mesh:", ev.meshUnderPointer.name);

      const filteredData = jsonData.find(
        (item) => item.name === ev.meshUnderPointer.name
      );

      if (filteredData) {
        ev.meshUnderPointer.overlayColor = originalOverlayColor;
        const popup = document.getElementById("popup");
        popup.style.left = ev.pointerX + "px";
        popup.style.top = ev.pointerY + "px";
        popup.style.display = "none";
      }
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


  // Keyboard events to move camera
  window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp" || event.key === "w") {
        scene.activeCamera.position.z += 0.5;
    } else if (event.key === "ArrowDown" || event.key === "s") {
        scene.activeCamera.position.z -= 0.5;
    } else if (event.key === "ArrowLeft" || event.key === "a") {
        scene.activeCamera.position.x -= 0.5;
    } else if (event.key === "ArrowRight" || event.key === "d") {
        scene.activeCamera.position.x += 0.5;
    }
});


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

import "./App.css";
import { useEffect, useState } from "react";
import { XCircle, Minimize2, Maximize } from "lucide-react";

import { appWindow } from "@tauri-apps/api/window";
import { listen } from '@tauri-apps/api/event'
import { WebviewWindow } from '@tauri-apps/api/window'

import TextComponent from "./components/TextComponent";
import MenuComponent from "./components/MenuComponent";
import VideoComponent from "./components/VideoComponent";
import SquareComponent from "./components/SquareComponent";
import CircleComponent from "./components/CircleComponent";
import PaintComponent from "./components/PaintComponent";
import ImageComponent from "./components/ImageComponent";

import html2canvas from "html2canvas";
import { Position } from "react-rnd";
import { ComponentInterface, CloneComponent, Preferences, ComponentsTypes } from "./interfaces";

function App() {

  const [queue, setInQueue] = useState<ComponentInterface | null>(null);
  const [removeRequest, setRemoveRequest] = useState<number>(0);

  const [components, setComponents] = useState<ComponentInterface[]>([]);

  const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  const [requestScreenshoot, setRequestScreenShoot] = useState<number>(-1);

  const [cloneData, setCloneData] = useState<CloneComponent | null>(null);

  const [preferences, setPreferences] = useState<Preferences | null>(null);

  function closeApp() {
    const controlsWindow = WebviewWindow.getByLabel('controls');

    if (controlsWindow)
      controlsWindow.close();

    appWindow.close();
  }

  function showOrHideMenu(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    event.preventDefault();
    setMenuPosition({ x: event.pageX, y: event.pageY });
    setIsMenuVisible((event.button == 0 || event.button == 1) ? false : true)
  }

  function removeComponent(id: number) {
    setComponents(prev => {
      const updated = [...prev].filter(c => c.id != id);
      return updated;
    });
  }

  function captureScreenshot() {
    html2canvas(document.body).then((canvas) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'screenshot.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    });
  };

  function cloneComponent(){
    if(cloneData)
      setComponents([...components, { id: Math.random(), type: cloneData.type, content: cloneData.content, style: cloneData.style, dimension: cloneData.dimension, position: menuPosition }]);
  }

  function setClone(data: CloneComponent){
    setCloneData(data);
  }

  //Como os listens são assincronos, o react não sentira a mudança nas variaveis
  //Então preciso do useEffect para fazer algo quando o listen mudar o valor
  async function initListeners() {
    await listen("add-text", (_e) => {
      setInQueue({ id: Math.random(), type: ComponentsTypes.TEXTO, content: "" });
    })

    await listen("add-video", (_e) => {
      setInQueue({ id: Math.random(), type: ComponentsTypes.VIDEO, content: "" });
    })

    await listen("add-square", (_e) => {
      setInQueue({ id: Math.random(), type: ComponentsTypes.SQUARE, content: "" });
    })

    await listen("add-circle", (_e) => {
      setInQueue({ id: Math.random(), type: ComponentsTypes.CIRCLE, content: "" });
    })

    await listen("add-paint", (_e) => {
      setInQueue({ id: Math.random(), type: ComponentsTypes.PAINT, content: "" });
    })

    await listen("add-image", (_e) => {
      setInQueue({ id: Math.random(), type: ComponentsTypes.IMAGE, content: "" });
    })

    await listen("take-screenshot", (_e) => {
      setRequestScreenShoot(Math.random());
    })

    await listen("remove-component", (_e) => {
      setRemoveRequest(Math.random());
    })

    await listen("preferences", (e: any) => {
      console.log(JSON.parse(JSON.parse(e.payload+"").message));
      setPreferences(JSON.parse(JSON.parse(e.payload+"").message));
    })
    
  }

  useEffect(() => {
    if (queue)
      setComponents([...components, { id: queue.id, type: queue.type, content: ""}]);
  }, [queue]);

  useEffect(() => {
    setComponents(prev => {
      const updated = [...prev].slice(0, prev.length - 1)
      return updated;
    });
  }, [removeRequest]);

  useEffect(() => {
    if (requestScreenshoot != -1) {
      captureScreenshot();
    }
  }, [requestScreenshoot])

  useEffect(() => {
    console.log(preferences);
  }, [preferences]);

  useEffect(() => {
    initListeners();
  }, [])

  useEffect(() => {
    console.log(`
      LEMBRETES: 
        => Separar os menus dos componentes
    `);

    window.addEventListener("contextmenu", (e: any) => {showOrHideMenu(e)});
    window.addEventListener("click", (_e) => {setIsMenuVisible(false)});
  }, [])

  return (
    <main>
      <header data-tauri-drag-region className="headerbar">
        <button onClick={() => { closeApp() }}>
          <XCircle className="iconsheader" size={"5vmin"} />
        </button>
        <button onClick={() => { appWindow.toggleMaximize() }}>
          <Maximize className="iconsheader" size={"5vmin"} />
        </button>
        <button onClick={() => { appWindow.minimize() }}>
          <Minimize2 className="iconsheader" size={"5vmin"} />
        </button>
        <div data-tauri-drag-region style={{ width: "15%" }} />
      </header>

      <section>
        <MenuComponent visible={isMenuVisible} position={menuPosition} clearAll={() => { setComponents([]) }} paste={cloneComponent} />
        {
          components.map(c => {
            if (c.type == ComponentsTypes.TEXTO)
              return <TextComponent key={c.id} id={c.id} content={c.content} style={c.style} dimension={c.dimension} position={c.position} remove={removeComponent} copy={setClone} />
            else if (c.type == ComponentsTypes.VIDEO)
              return <VideoComponent key={c.id} id={c.id} content={c.content} style={c.style} dimension={c.dimension} position={c.position} remove={removeComponent} copy={setClone} />
            else if (c.type == ComponentsTypes.SQUARE)
              return <SquareComponent key={c.id} id={c.id} content={c.content} style={c.style} dimension={c.dimension} position={c.position} remove={removeComponent} copy={setClone} />
            else if (c.type == ComponentsTypes.CIRCLE)
              return <CircleComponent key={c.id} id={c.id} content={c.content} style={c.style} dimension={c.dimension} position={c.position} remove={removeComponent} copy={setClone} />
            else if (c.type == ComponentsTypes.PAINT)
              return <PaintComponent key={c.id} id={c.id} content={c.content} style={c.style} dimension={c.dimension} position={c.position} remove={removeComponent} copy={setClone} />
            else if (c.type == ComponentsTypes.IMAGE)
              return <ImageComponent key={c.id} id={c.id} content={c.content} style={c.style} dimension={c.dimension} position={c.position} remove={removeComponent} copy={setClone} />
          })
        }
      </section>
    </main>
  );
}

export default App;

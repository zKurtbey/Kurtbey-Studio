import slipboard from "./assets/Slipboard.png"
import cameratio from "./assets/Cameratio.png"
import routinacci from "./assets/Routinacci.png"
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Detail from "./Detail";
import { useEffect, useState } from "react";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return width
}

function App() {

 const width = useWindowWidth()

  let apps = [
    {name: "Slipboard", promoText: "Clipboard for your Mac", download: "macOS", link: "https://apps.apple.com/app/slipboard/id6761312866", image: slipboard, description: "Clipboard, but better.\nSlipboard turns your clipboard into a workspace.\nCreate multiple boards to organize what you copy — then drag content directly between any apps on your Mac. No shortcuts to memorize or paste menus to dig through. Just pick it up, drop it where it belongs!\nSeparate boards for separate contexts. Keep your code snippets away from your design notes, and your research away from your drafts.\nSlipboard works the way macOS was designed to. Grab any clipping and drop it straight into Pages, Xcode, Mail, Finder — wherever you're working!\nNo clutter or subscriptions. Just a clean, fast tool that lives quietly on your Mac until you need it!"},
    {name: "Cameratio", promoText: "Capture Like A Pro", download: "iOS", link: "https://apps.apple.com/app/cameratio/id6753105833", image: cameratio, description: "Capture The Best, Like A Pro\nUse professional compositions and a fully resizable camera view to capture your moments exactly the way you want!\nWhether you prefer classic layouts like the rule of thirds, the golden ratio, or custom grids, you have full control over your framing. Resize and adjust your view intuitively to focus on the details that matter most.\nWith simple controls and a variety of composition options, every shot feels effortless and professional. Capture stunning portraits, landscapes, or everyday moments with precision and creativity. This app makes it easy to frame, compose, and snap the perfect picture so you can always preserve life’s best moments beautifully.\nNow you can record moments professionally with the composition tools!\nThe trend 5128x1080 resolution choice!"},
    {name: "Routinacci", promoText: "Shape Your Day the Natural Way", download: "iOS", link: "https://apps.apple.com/app/routinacci/id6751642703", image: routinacci}
  ]

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home width={width} apps={apps} />} />
        <Route path="/:id" element={<Detail width={width} apps={apps} />} />
      </Routes>
    </HashRouter>
  )
}

export default App

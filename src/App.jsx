import slipboard from "./assets/Slipboard.png"
import cameratio from "./assets/Cameratio.png"
import routinacci from "./assets/Routinacci.png"
import tailspell from "./assets/Tailspell.png"
import foldAndCrush from "./assets/FoldAndCrush.png"
import eldrowIcon from "./assets/eldrow.svg"
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
    {name: "Slipboard", promoText: "Clipboard for your devices", download: "macOS/iOS", link: "https://apps.apple.com/app/slipboard/id6761312866", image: slipboard, description: "Slipboard turns your clipboard into a workspace among all your devices.\n\nCreate multiple boards to organize what you copy — then drag content directly between any app on your Mac. No shortcuts to memorize or paste menus to dig through. Just pick it up, drop it where it belongs!\n\nSeparate boards for separate contexts. Keep your code snippets away from your design notes, and your research away from your drafts.\n\nSlipboard works the way macOS was designed to. Grab any clipping and drop it straight into Pages, Xcode, Mail, Finder — wherever you're working!\n\nNo clutter or subscriptions. Just a clean, fast tool that lives quietly on your Mac until you need it!"},
    {name: "Cameratio", promoText: "Capture Like A Pro", download: "iOS", link: "https://apps.apple.com/app/cameratio/id6753105833", image: cameratio, description: "Capture The Best, Like A Pro\n\nUse professional compositions and a fully resizable camera view to capture your moments exactly the way you want!\n\nWhether you prefer classic layouts like the rule of thirds, the golden ratio, or custom grids, you have full control over your framing. Resize and adjust your view intuitively to focus on the details that matter most.\n\nWith simple controls and a variety of composition options, every shot feels effortless and professional. Capture stunning portraits, landscapes, or everyday moments with precision and creativity. This app makes it easy to frame, compose, and snap the perfect picture so you can always preserve life’s best moments beautifully.\n\nNow you can record moments professionally with the composition tools!\n\nThe trend 5128x1080 resolution choice!"},
    {name: "Routinacci", promoText: "Shape Your Day the Natural Way", download: "macOS/iOS", link: "https://apps.apple.com/app/routinacci/id6751642703", image: routinacci, description: "Most people struggle with two things: finding motivation and knowing how much to work. Should you work for hours straight, or take more breaks? Without a clear plan, it’s easy to lose focus, burn out, or never even start.\n\nThat’s where Routinacci comes in. Inspired by the Fibonacci sequence and the golden ratio, Routinacci helps you plan your day with natural, balanced time blocks. Instead of guessing when to work or rest, you get a structured routine designed to keep you motivated and efficient.\n\n\nRoutinacci is a smart, Fibonacci-based routine planner designed to help you focus, stay motivated, and make the most of your day. By analyzing your daily free time and personal efficiency, Routinacci recommends optimal work hours based on the Fibonacci sequence, ensuring a balanced and productive workflow.\n\n\nWhether you’re a student, freelancer, or professional, Routinacci helps you work smarter, not harder, while maintaining a healthy balance between work and free time. Start using the golden ratio to unlock your most productive self today!"},
    {name: "Tailspell", promoText: "Start every word with the last letter", download: "iOS", link: "https://apps.apple.com/app/tailspell/id6832078855", image: tailspell, demo: "tailspell-demo/", privacy: "Tailspell does not ask you to create an account, and we do not collect your name, email or any other personal details. Your progress is stored on your device. The free version shows ads served by Google AdMob, which may collect device identifiers, ad interaction and diagnostic data to deliver and measure ads; you can decline tracking when the app asks, and Premium removes all ads. Purchases are handled by Apple. See Google's privacy policy for details on how AdMob handles data.", description: "Tailspell is a cosy, relaxing take on the classic word-link game. The rule is simple: start every word with the last letter of the previous one. How long a chain can you build?\n\nPlay in 6 languages — English, Turkish, Italian, German, French and Spanish — each with its own dictionary, in a calm Relaxed mode or a Timed mode that races the clock.\n\nBuild streaks to raise your multiplier and earn coins and surprise prizes. Unlock animated worlds and cute companions, take on the daily challenge, spin the daily wheel, or pass and play with a friend on the same device. Mix mode combines words from several languages in one game, and it all works offline.\n\nPremium is a one-time purchase that unlocks every world, companion and celebration and removes all ads. No subscription."},
    {name: "Fold and Crush", promoText: "Don't tap. Fold.", download: "iOS", link: "https://apps.apple.com/app/fold-and-crush/id6833807013", image: foldAndCrush, description: "Fold and Crush is the first game you play with the hinge. Your iPhone Duo becomes the weapon: don't tap, fold. Snap the phone shut at just the right moment and squash whatever is caught between the screens.\n\nThree games in one. In Roach Crush, waves of cockroaches raid both screens. Tap to squash one, or fold your Duo shut and a black cotton slipper slaps down on the whole swarm. In Mouse Trap, a giant trap sits right across the fold: let the mouse creep in and start nibbling the cheese, then fold to spring the bar. In Book & Fly, the open book is your phone. Wait for the fly to land on a page, then close the cover on it.\n\nMade for the fold. The trap's kill bar and the book's cover follow your hinge degree for degree, and fold speed matters: fold too slowly and they see you coming. Close the phone and the cover screen shows what just happened, from a leather-bound book to the slipper that just landed. Every layout keeps the crease clear.\n\n3D spatial sound lets you hear the mouse scurry and the fly buzz around you, all in a glossy, bubbly Aero style, with best scores for each game. No ads. No in-app purchases.\n\nPlays best on iPhone Duo. On other iPhones, an on-screen button stands in for the fold."},
    {name: "eldrow", promoText: "The daily five-letter word game, played backwards", download: "", link: "", image: eldrowIcon, demo: "eldrow/", privacy: "eldrow is made by Kurtbey Studio. Questions about privacy? Contact kurtbeystudio@gmail.com. eldrow does not ask you to create an account. Your game and statistics are stored in your browser's local storage and stay on your device. The site shows ads provided by Google AdSense, which use cookies and similar technologies to show and measure ads. You can turn off personalised ads in Google's Ad Settings. The site loads its fonts from Google Fonts. Last updated: 23 November 2026.", description: "eldrow is the daily five-letter word game, played backwards. Every day there is one new puzzle, the same for everyone. The answer is always a real word, but spelled in reverse: if the word of the day is PUNCH, you are looking for HCNUP. You have six guesses, and the tiles turn green and yellow to show how close you got.\n\nEverything else is reversed too, so if you win, don't be surprised to see !didnelpS."},
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

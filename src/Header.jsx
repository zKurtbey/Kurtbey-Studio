import kurtbeystudio from "./assets/Kurtbey Studio.svg"
import { useEffect, useState } from "react"
import { motion, useScroll } from "framer-motion"
import { Link } from "react-router-dom"

export default function Header({width}) {
    
    const { scrollY } = useScroll()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
    const unsubscribe = scrollY.on("change", (value) => {
        setScrolled(value > 16.18)
    })

    return unsubscribe
    }, [scrollY])

    return (
        <motion.header style={scrolled && {
        borderBottom: "1.618px solid rgb(230, 230, 230)",
        backgroundColor: "rgba(255, 255, 255, 1)"
      }}
      >
        
        <div className="t" style={width < 840 ? {alignItems: "center", justifyContent: "center", paddingTop: "0.382em", paddingBottom: "0.382em"} : null}>

            <Link to="/" style={{gap: "0.618em"}}>

                <img src={kurtbeystudio} />

                {width > 840 &&

                    <h1>Kurtbey Studio</h1>

                }

            </Link>

        </div>

      </motion.header>
    )

}
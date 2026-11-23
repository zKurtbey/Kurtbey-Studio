import Header from "./Header";
import "./Detail.css"
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import BorderGlow from "./component/BorderGlow";

export default function Detail({width, apps}) {

    const { id } = useParams();

    const item = apps.find(a => a.name.toLowerCase() === id);

    if (!item) {
        return <div>App not found</div>;
    }

    return (

        <>

            <Header width={width} />

            <main className="detmain">

                <div className="det"
                style={width < 840 ? {flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.618em"} : null}
                >

                    <img style={width < 840 ? {width: "100%"} : null} src={item.image} />

                    <div className="txt"
                    style={width < 840 ? {flexDirection: "column", alignItems: "center", justifyContent: "center"} : null}
                    >

                        <h1>{item.name}</h1>

                        <h4>{item.promoText}</h4>

                        <p>{item.description}</p>

                    </div>

                </div>

                {item.link && (
                <BorderGlow
                    edgeSensitivity={30}
                    glowColor="40 80 80"
                    backgroundColor="rgb(124, 255, 218)"
                    borderRadius={3.82}
                    glowRadius={40}
                    glowIntensity={1}
                    coneSpread={25}
                    animated={false}
                    colors={['#c084fc', '#f472b6', '#38bdf8']}
                >

                    <a href={item.link}
  onClick={(e) => e.stopPropagation()}>
                    <button>
                        Download for {item.download}
                    </button>
                </a>

                </BorderGlow>
                )}

                {item.demo && (

                    <BorderGlow
                        edgeSensitivity={30}
                        glowColor="40 80 80"
                        backgroundColor="rgb(124, 255, 218)"
                        borderRadius={3.82}
                        glowRadius={40}
                        glowIntensity={1}
                        coneSpread={25}
                        animated={false}
                        colors={['#c084fc', '#f472b6', '#38bdf8']}
                    >

                        <a href={item.demo}
                            onClick={(e) => e.stopPropagation()}>
                            <button>
                                Play in your browser
                            </button>
                        </a>

                    </BorderGlow>

                )}

                <div className="pp">

                    <h1>Privacy Policy</h1>

                    <h4>Information We Collect</h4>

                    {item.privacy ? <span>{item.privacy}</span> : <span>We do <b>not</b> collect any data from users.</span>}

                    <h4>Security</h4>

                    <span>We take reasonable measures to keep your information safe within the app.</span>

                    <h4>Contact</h4>

                    <span>If you have any questions about your privacy, contact us at: kurtbeystudio@gmail.com</span>

                </div>

            </main>

            <Footer />

        </>

    )

}
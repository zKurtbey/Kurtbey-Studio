import Header from "./Header";
import "./Detail.css"
import Footer from "./Footer";
import { useParams } from "react-router-dom";

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

                <div className="pp">

                    <h1>Privacy Policy</h1>

                    <h4>Information We Collect</h4>

                    <span>We do <b>not</b> collect any data from users.</span>

                    <h4>Security</h4>

                    <span>We take reasonable measures to keep your information safe within the app.</span>

                    <h4>Contact</h4>

                    <span>If you have any questions about your privacy, contact us at: kurtbey@phibonacci.app</span>

                </div>

            </main>

            <Footer />

        </>

    )

}
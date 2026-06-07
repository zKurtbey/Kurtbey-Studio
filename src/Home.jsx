import { Link } from 'react-router-dom';
import BorderGlow from './component/BorderGlow';
import Footer from './Footer';
import Header from "./Header"

function Home({width, apps}) {

  return (
    <>

      <Header width={width} />

      <main className='homemain'>

        {width < 840 &&

          <h1 className="sm">Kurtbey Studio</h1>

        }

        {apps.map((item, index) => (

            <Link to={item.name == "Routinacci" ? "https://phibonacci.app" : `/${item.name.toLowerCase()}`} className="app" style={{flexWrap: index % 2 == 0 ? "wrap-reverse" : "wrap"}}>

                {index % 2 != 0 ?

                <img src={item.image} 
                style={width < 840 ? {
                width: "100%",
                marginBottom: "1.618em"
                } : null}
                />

                : null}

                <div className="txt" style={ width < 840 ? {alignItems: "center", width: "100%"} : null}>

                <div className="ts" style={ width < 840 ? {alignItems: "center", width: "100%", marginBottom: "0.618em"} : null}>

                    <h1>{item.name}</h1>

                    <span>{item.promoText}</span>

                </div>

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
                </div>

                {index % 2 == 0 ?

                <img src={item.image}
                style={width < 840 ? {
                width: "100%",
                marginBottom: "1.618em"
                } : null}
                />

                : null}

          </Link>

        ))}

      </main>

      <Footer />

    </>
  )
}

export default Home

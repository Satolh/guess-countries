import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { FaXTwitter,FaInstagram,FaGithub, FaTwitter } from "react-icons/fa6";

const App = () => {
  const [setContinente, continente] = useState(["North America, South America, Europe, Asia, Africa, Oceania"])
  const [randomNumber, setRandomNumber] = useState(0);
  const [randomNameFlag, setRandomNameFlag] = useState("");
  const [infoCountries, setInfoCountries] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeScore, setTimeScore] = useState(0);
  const [porcentaje, setPorcentaje] = useState("0");
  const [nameFlags, setNameFlags] = useState([]);
  const [flagSelected, setFlagSelected] = useState(null);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [intentos, setIntentos] = useState(0);
  const [totalIntentos, setTotalIntentos] = useState(0)
  const [aciertos, setAciertos] = useState(0)
  const [flagAdivinadas, setFlagAdivinadas] = useState(new Array(1).fill(false))
  const [msjWin, setMsjWin] = useState(false)
  const [paused, setPaused] = useState(false)
  const [dificultad, setDificultad] = useState("South America")
  const [formattedTime, setFormattedTime] = useState("0:00")

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then(res => res.json())
      .then(data => {
        // Lista de continentes que deseas procesar
        const continents = [
          "South America",
          "North America",
          "Asia",
          "Africa",
          "Europe",
          "Oceania"
        ];
  
        if (dificultad === "op7") {
          // Usar todos los países para "All Countries"
          const allCountries = data.filter(country => {
            const normalizedName = country.translations.spa.common.trim().toLowerCase();
            return !/\bisla(s)?\b/i.test(normalizedName);
          });
          
          const allCountryNames = allCountries.map(e => e.translations.spa.common);
  
          setInfoCountries(allCountries);
          setNameFlags(allCountryNames);
        } else{
          const countriesByContinent = continents.reduce((acc, continent) => {
            acc[continent] = data.filter(country => {
              const normalizedName = country.translations.spa.common.trim().toLowerCase();
              return (
                country.continents.includes(continent) &&
                !/\bisla(s)?\b/i.test(normalizedName)
              );
            });
            return acc;
          }, {});
          
          // Ejemplo: Obtener nombres para un continente específico
          const southAmericaNames = countriesByContinent[dificultad].map(
            e => e.translations.spa.common
          );
          
          setInfoCountries(countriesByContinent[dificultad]);
          setNameFlags(southAmericaNames);
          console.log(countriesByContinent);
        }
      });
  }, [dificultad]);
  
  useEffect(() => {
    let interval = null;
  
    if (gameStarted && !paused) {
      interval = setInterval(() => {
        setTimeScore(prevTime => {
          const newTime = prevTime + 1;
          const minutes = Math.floor(newTime / 60);  // Dividir por 60 para obtener los minutos
          const seconds = newTime % 60;  // El resto es el número de segundos
          setFormattedTime(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);  // Actualizar el tiempo en formato 'minutos:segundos'
          return newTime;
        });
      }, 1000);
    } else if (!gameStarted && timeScore !== 0) {
      clearInterval(interval);
    }
  
    return () => clearInterval(interval);
  }, [gameStarted, timeScore]);
  


  const handleStartGame = () => {
    setGameStarted(true);
    const randomNumber = Math.floor(Math.random() * nameFlags.length);
    setRandomNameFlag(nameFlags[randomNumber]);
    setCorrectIndex(null);
    setIntentos(0);
    setTotalIntentos(0)
    setPaused(false)
  };

  const handleStopGame = () => {
    setRandomNameFlag(null);
    setGameStarted(false);
    setCorrectIndex(null);
    setTimeScore(0);
    setFlagAdivinadas(flagAdivinadas.map(()=> false))
    setTimeScore(0)
    setAciertos(0)
    setPorcentaje(0)
  };

  const handleFlagSelected = (country, index) => {
    
    if (gameStarted && !flagAdivinadas[index]) {
      const flag = country.translations.spa.common;
      setFlagSelected(flag);

      setTotalIntentos(prevTotal => {
        const newTotal = prevTotal + 1;
        setPorcentaje(((aciertos + (flag === randomNameFlag ? 1 : 0)) / newTotal).toFixed(2) * 100);
        return newTotal;
      });
      

      if (flag === randomNameFlag) {

        setNameFlags(prevFlags => {
          const updatedFlags = prevFlags.filter(ele => ele !== randomNameFlag); 
          const randomNumber = Math.floor(Math.random() * updatedFlags.length);
          setRandomNameFlag(updatedFlags[randomNumber])
          return updatedFlags;
        });

        setCorrectIndex(index);
        setIntentos(0);
        setAciertos(prevAci => prevAci + 1);

        setFlagAdivinadas(prevArray => {
          const newArray = [...prevArray];  
          newArray[index] = true;           
          return newArray})
      } else {
        setIntentos(prevInt => prevInt + 1);
        console.log(intentos)
      }
    }
  };

  useEffect(() => {
    if (nameFlags.length <= 3) {
      const randomNumber = Math.floor(Math.random() * nameFlags.length);
      setRandomNameFlag(nameFlags[randomNumber]);
    }
  }, [nameFlags]);


  const handleCloseWin = () =>{
    setMsjWin(false)
    setIntentos(0)
    setGameStarted(false)
    const allFalse = flagAdivinadas.map(()=> false)
    setFlagAdivinadas(allFalse)
    setTimeScore(0)
    setPorcentaje(0)
    setAciertos(0)
    setNameFlags()
    const nameCountries = infoCountries.map(e => e.translations.spa.common);
    setNameFlags(nameCountries)
  }

  useEffect(()=>{

     if(flagAdivinadas.every(e => e === true)){
        setMsjWin(true)
        setPaused(prevPaused => !prevPaused)
      } 
      console.log(flagAdivinadas)

  },[flagAdivinadas])
  

  const SelectDifucultad = (e) =>{
    const value = e.target.value;
    setDificultad(value)
    setGameStarted(false)
    setTimeScore(0)
    setPorcentaje(0)
    setAciertos(0)
  }
  useEffect(() => {
    if (infoCountries.length > 0) {
      setFlagAdivinadas(new Array(infoCountries.length).fill(false));
    }
  }, [infoCountries]);
  


  return (
    <div>
      <header className='header'>
        <h1 className='title'>Game Flags</h1>
      </header>

      <section className='section-dificultad'>
        <select className='select-dificultad' onChange={SelectDifucultad}>
          <option value="South America">South America</option>
          <option value="North America">North America</option>
          <option value="Europe">Europe</option>
          <option value="Asia">Asia</option>
          <option value="Africa">Africa</option>
          <option value="Oceania">Oceania</option>
          <option value="op7">All Countries</option>
        </select>
      </section>

      <section className='section-game'>
        <div className='container-btn'>
          <button className='btn-game' onClick={gameStarted ? handleStopGame : handleStartGame}>
            {gameStarted ? 'Detener' : 'Iniciar'}
          </button>
        </div>
        <div className='container-data-game'>
          <p className='p-data-game'>Tiempo: {formattedTime}</p>
          <p className='p-data-game'>Porcentaje de Acierto: {Math.round(porcentaje)} % </p>
          <p className='p-data-game'>Paises Adivinados: {aciertos} / {infoCountries.length} </p>
        </div>
      </section>

      <div className='container-msj'>
        { gameStarted &&
          <p className='p-msj'>
          Seleccione la bandera de <span className='span-msj'>{randomNameFlag}</span>
        </p>
        }
      </div>

      <main className='main'>
        {infoCountries.map((country, index) => (
          <div
            className={`container-country `}
            key={index}
          >
            <div className={`container-img ${flagAdivinadas[index] ? 'correct-flag' : ""}`}>
              <img
                className='img-flag'
                src={country.flags.png}
                alt="imagen de paises"
                onClick={() => handleFlagSelected(country, index)}
              />
            </div>
            { gameStarted &&
              (intentos >= 3 && randomNameFlag === country.translations.spa.common &&(
                <p className={"name-country animated"}>{country.translations.spa.common}</p>
              ))
            }
            { !gameStarted &&
                <p className={"name-country"}>{country.translations.spa.common}</p>
            }
            {flagAdivinadas[index] && (
              <p className="name-country">
                {country.translations.spa.common}
              </p>
            )}
          </div>
        ))}
      </main>
        { msjWin &&
          <section className='section-win'>
            <IoMdClose className='icon-close' onClick={ handleCloseWin }/>
            <h2 className='h2-win'> Ganaste </h2>
            <p className='p-data-game'>Tiempo: {formattedTime}</p>
            <p className='p-data-game'>Porcentaje de Acierto: {Math.round(porcentaje)} % </p>
            <p className='p-data-game'>Paises Adivinados: {aciertos} / {infoCountries.length} </p>
          </section>
        }

<footer className='footer'>

<div className='container-made'>
    <p className='made'>  Made by Satolh </p>
</div>
<div className='container-redes'>
  <a  className='a-icon-redes' href='#'><FaInstagram className='icon-redes' /></a>
  <a  className='a-icon-redes' href='#'><FaTwitter className='icon-redes' /></a>
  <a target='_blank' className='a-icon-redes' href='https://github.com/satolh'><FaGithub className='icon-redes'  /></a>
</div>

</footer>
      
    </div>
  );
}

export default App;

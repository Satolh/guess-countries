import React from 'react'











const handleFlagSelected = (country, index) => {
    if (gameStarted && !flagAdivinadas[index]) {
      const flag = country.translations.spa.common;
      setFlagSelected(flag);
  
      setTotalIntentos(prevTotal => {
        const newTotal = prevTotal + 1;
        const newAciertos = flag === randomNameFlag ? aciertos + 1 : aciertos;
        setPorcentaje(((newAciertos) / newTotal).toFixed(2) * 100);
        return newTotal;
      });
  
      if (flag === randomNameFlag) {
        setNameFlags(prevFlags => {
          const updatedFlags = prevFlags.filter(ele => ele !== randomNameFlag);
          const randomNumber = Math.floor(Math.random() * updatedFlags.length);
          setRandomNameFlag(updatedFlags[randomNumber]); // Actualizamos el siguiente nombre aleatorio
          return updatedFlags;
        });
  
        setCorrectIndex(index);
        setIntentos(0);
        setAciertos(prevAci => prevAci + 1);
  
        // Asegurar actualización del array de adivinadas
        setFlagAdivinadas(prevArray => {
          const newArray = [...prevArray];
          newArray[index] = true;
          return newArray;
        });
      } else {
        setIntentos(prevInt => prevInt + 1);
      }
    }
  };
  

const test = () => {
  return (
    <div>test</div>
  )
}

export default test
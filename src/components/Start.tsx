import * as React from 'react';
import Wheel from './Wheel';
import { useEffect } from 'react';
import { Loader } from './Loader';
import { Spinner } from './Spinner';
import styled from 'styled-components';

const TopLeft = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  font-size: 6rem;
  font-family: 'Roboto',sans-serif;
`


export type Sector = {
  label: string
  color: string
}

const randomNumberBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

const playerWinSound = new Audio('assets/win.mp3')
const gameWinSound = new Audio('assets/victory.mp3')
const radSound = new Audio('assets/rad.mp3')

export function Start() {
  const [winner, setWinner] = React.useState<Sector>()
  const [game, setGame] = React.useState<Sector>()
  const [state, setState] = React.useState(0);

  const [players, setPlayers] = React.useState<string[]>([
    "Gerben",
    "Tim",
    "Nick",
    // "Rian",
    "Maaike",
    "Ciska",
    // "Lotte",
    "Rikus",
    "Danique",
    "Sjoerd",
    "Simon",
    "Jesper",
    "Gertrude",
    // "Britt",
    "Twan",
    "Robert-Jan",
    "Jesse",
    "Esther",
    "Marnix",
    "Annemarie",
    "Margo",
    "Olav",
    
    "Bert",
    "Jannie",
    "Frouwke",
    "Thijs",

  ].sort(() => Math.random() - 0.5))

  const [games, setGames] = React.useState<string[]>([
    "Shotje uitdelen",
    "Shotje nemen",
    "Shotje uitdelen",
    "Shotje nemen",
    "Shotje uitdelen",
    "Shotje nemen",
    "Iedereen een shotje",
    "Creme shotje pakken"
  ].sort(() => Math.random() - 0.5))

  const restart = () => {
    setWinner(undefined);
    setGame(undefined);
    setState(0);
  }

  const finishPlayer = (player: Sector) => {
    try {
      playerWinSound.play();
    } catch (error) {
    }
    localStorage.setItem("lastWinner", player.label);
    localStorage.setItem(player.label, (Number(localStorage.getItem(player.label)) + 1).toString());
    setWinner(player);
  }

  const finishGame = (game: Sector) => {
    try {
      gameWinSound.play();      
    } catch (error) {
    }
    setGame(game)
    setTimeout(() => {
      // 15 min = 900_000
      // 30 min = 1_800_000
      let lastTimeout = randomNumberBetween(900_000, 1_200_000);
      window.lasttimeout = () => lastTimeout / 1000 + " seconds";

      setTimeout(()=>{
        radSound.play();
      }, lastTimeout - 10_000)

      setTimeout(restart, lastTimeout);
    }, 10_000)
  }

  useEffect(() => {
    window.addPlayer = (player: string) => {
      setPlayers([...players, player])
    }
    window.removePlayer = (player: string) => {
      setPlayers(players.filter(p => p !== player))
    }
    window.reset = (player: string) => {
      localStorage.clear();
    }
   
    window.spin = restart;

  }, []);

  return (
    <>
      { state === 0 && <Wheel finish={finishPlayer} options={players} />}
      { state === 1 && <Wheel finish={finishGame} options={games} />}
      { state === 1 && <TopLeft>{winner?.label}</TopLeft>}
      { state === 0 && winner && <Loader time={10000} finish={()=>setState(1)}></Loader>}
      { state === 0 && winner && game && <Spinner/>}
    </>
  );
}

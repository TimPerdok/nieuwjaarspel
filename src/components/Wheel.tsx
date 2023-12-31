import * as React from 'react';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Label } from './Label';
import { Sector } from './Start';
import { Howl } from 'howler';
import { Loader } from './Loader';

const Arrow = styled.div`
  height: 0;
  width: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-top: 100px solid black;
  position: absolute; 
  top: 9vh;
  z-index: 9999;
`


const Canvas = styled.canvas`
  width: 100vw;
  position: absolute;
  top: 10vh;
`



const Container = styled.div`
  display: flex;
  flex-direction: column;  
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  position: relative;
`

const randomNumberBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}


export default function Wheel({finish, options }: any) {
  const [currentChoice, setCurrentChoice] = React.useState<Sector>()
  const [velocity, setVelocity] = React.useState(1)
  const [spinning, setSpinning] = React.useState(true)
  const sound = useRef(new Howl({
    src: ['assets/spin.mp3'],
    volume: 0.5
  }));
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const sectors = options.map((option: any, index:any) => {
    const color = `hsl(${index * (360 / options.length)}, 100%, 50%)`
    return { label: option, color }
  });


  useEffect(() => {


    const rand = (m: any, M: any) => Math.random() * (M - m) + m
    const tot = sectors.length
    const context = canvasRef.current.getContext('2d')
    const dia = context.canvas.width
    const rad = dia / 2
    const PI = Math.PI
    const TAU = 2 * PI
    const arc = TAU / sectors.length
    let previousChoice: null = null;


    let friction = randomNumberBetween(0.985, 0.992) // 0.995=soft, 0.99=mid, 0.98=hard
    let ang = 0 // Angle in radians
    let angVel = 0 // Angular velocity

    const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot

    function drawSector(sector: any, i: any) {
      const ang = arc * i
      context.save()
      // COLOR
      context.beginPath()
      context.fillStyle = sector.color
      context.moveTo(rad, rad)
      context.arc(rad, rad, rad, ang, ang + arc)
      context.lineTo(rad, rad)
      context.fill()
      // TEXT
      context.translate(rad, rad)
      context.rotate(ang + arc / 2)
      context.textAlign = 'right'
      context.fillStyle = '#fff'
      context.font = 'bold 30px sans-serif'
      context.fillText(sector.label, rad - 10, 10)

      context.restore()
    }

    function rotate() {
      const sector = sectors[getIndex()]
      context.canvas.style.transform = `rotate(${ang - PI / 2}rad)`
      if (previousChoice != sector) {
        sound.current.play();
      }
      previousChoice = sector
      setCurrentChoice(sector)
    }

    function stop() {
      angVel = 0 // Bring to stop
      setSpinning(false)
      setCurrentChoice(sectors[getIndex()])
      finish(sectors[getIndex()]);
    }
    let framecount = 0
    function frame() {
      framecount++;
      if (!angVel) return
      angVel *= friction // Decrement velocity by friction
      if (angVel < 0.0002) {
        stop();
        return;
      }
      if (framecount % 50 == 0) setVelocity(angVel)
      ang += angVel // Update angle
      ang %= TAU // Normalize angle
      
      rotate()
      
    }

    function engine() {
      frame()
      requestAnimationFrame(engine)
    }

    function spin() {
      if (angVel) return console.log("already spinning");
      let randomnumber = rand(0.1, 0.8);
      console.log(randomnumber)
      if (!angVel) angVel = randomnumber
    }

    sectors.forEach(drawSector)
    rotate() // Initial rotation
    engine() // Start engine
    spin();
    
  }, [canvasRef, options])

  return (
    <>
      <Container>
        <Arrow></Arrow>
        <Canvas width="1000" height="1000" ref={canvasRef} ></Canvas>
        <Label blur={velocity * 250} winner={currentChoice}></Label>
      </Container>
    </>
  );
}

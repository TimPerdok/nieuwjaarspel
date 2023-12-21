import * as React from 'react';
import styled from 'styled-components';
import { Sector } from './Start';

const Container = styled.div.attrs(props => ({
  style: {
    filter: `blur(${({ blur }: any) => blur < 3 ? 0 : blur}px)`
  },
}))`

font-family: 'Roboto', sans-serif;
position: absolute;
bottom: 10rem;
font-size: 20rem;

text-align: center;
text-shadow: 0px 0px 20px black;

user-select: none;



transition: filter 0.1s ease-out;

color: ${({ color }: any) => color};

`

const Shadow = styled.div`
  box-shadow: 0px 0px 99999px 500px BLACK;
  position: absolute;
  bottom: 0;
  height: 0px;
  width: 100vw;
`

export function Label({winner, blur}: any) {
  return (
    <>
      <Shadow></Shadow>
      <Container blur={blur} color={winner?.color}>
        {winner?.label}
      </Container>
    </>
  );
}

import React from 'react';
import logo from './logo.svg';
import './App.css';
import RButton from './RButton/RButton';

function App() {

  const handleSubmit = (e:React.MouseEvent<HTMLButtonElement>) => {
    alert("Hi");
  }

  return (
    <>
      <RButton onClick={(e:React.MouseEvent<HTMLButtonElement>)=> handleSubmit(e)}>Submit</RButton>
    </>
  );

}

export default App;

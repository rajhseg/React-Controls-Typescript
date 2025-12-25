import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import RButton from './RButton/RButton';
import RDonutChart, { RDonutChartItem } from './RDonutChart/RDonutChart';


function App() {

  
  const [chartItems, setChartItems] = useState<RDonutChartItem[]>([]);

  
  const [ButtonHeight, setButtonHeight] = useState('32px');

  const handleSubmit = (e:React.MouseEvent<HTMLButtonElement>) => {

      let pieItem1 = new RDonutChartItem(24,'Batminton', 'darkgreen', 'white');
      setChartItems((prev)=> [...prev, pieItem1]);

      setButtonHeight((prevState) => '40px');
  }

  const CreateDonutItems = () => {

    let pieItem1 = new RDonutChartItem(24,'Cricket', 'grey', 'white');
    let pieItem2 = new RDonutChartItem(35,'Volleyball', 'purple', 'white');
    let pieItem3 = new RDonutChartItem(12,'Tennis', 'gray', 'white');
    let pieItem4 = new RDonutChartItem(44,'BaseBall', 'teal', 'white');
    let pieItem5 = new RDonutChartItem(14,'Hockey', 'darkblue', 'white');
    let pieItem6 = new RDonutChartItem(44,'Football', '#13297A', 'white');
    
    setChartItems((prev)=>[]);

    let donutItems: RDonutChartItem[] = [];
    
    donutItems.push(pieItem1);
    donutItems.push(pieItem2);
    donutItems.push(pieItem3);
    donutItems.push(pieItem4);
    donutItems.push(pieItem5);
    donutItems.push(pieItem6);

    setChartItems((prev)=> [...prev, ...donutItems]);
  }

  
  useEffect(()=>{
    CreateDonutItems();
  }, []);

  return (
    <>
      <RButton ButtonHeight={ButtonHeight} onClick={(e:React.MouseEvent<HTMLButtonElement>)=> handleSubmit(e)}>Submit</RButton>
    
      <RDonutChart DataListHeight={100} ChartWidth={300} ShadowColor={'blue'} ChartItems={chartItems} Opacity={'0.8'}></RDonutChart>
      
    </>
  );

}

export default App;

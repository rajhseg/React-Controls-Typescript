import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import RButton, { RButtonRef } from './RButton/RButton';
import RDonutChart, { RDonutChartItem } from './RDonutChart/RDonutChart';
import RPieChart, { RPieChartItem } from './RPieChart/RPieChart';
import RScatterChart, { RScatterChartItem } from './RScatterChart/RScatterChart';
import { Graph } from './Models/models';


function App() {

  
  const [chartItems, setChartItems] = useState<RDonutChartItem[]>([]);
  const [piechartItems, setPieChartItems] = useState<RPieChartItem[]>([]);

  const [scatterChartItems, setScatterChartItems] = useState<RScatterChartItem[]>([]);
  
  const [ButtonHeight, setButtonHeight] = useState('32px');

  const bref = useRef<RButtonRef>(null);

  const handleSubmit = (e:React.MouseEvent<HTMLButtonElement>) => {

      let pieItem1 = new RDonutChartItem(24,'Batminton', 'darkgreen', 'white');
      setChartItems((prev)=> [...prev, pieItem1]);

      let pieItem2 = new RPieChartItem(24, 'Batminton', 'darkgreen', 'white');
      setPieChartItems((prev)=> [...prev, pieItem2]);

      setButtonHeight((prevState) => '40px');

      console.log('Button Id : '+ bref.current?.Id);
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

  const CreatePieChartItems = () => {

      let pieItem1 = new RPieChartItem(24,'Cricket', 'grey', 'white');
      let pieItem2 = new RPieChartItem(35,'Volleyball', 'purple', 'white');
      let pieItem3 = new RPieChartItem(12,'Tennis', 'gray', 'white');
      let pieItem4 = new RPieChartItem(44,'BaseBall', 'teal', 'white');
      let pieItem5 = new RPieChartItem(14,'Hockey', 'darkblue', 'white');
      let pieItem6 = new RPieChartItem(44,'Football', '#13297A', 'white');
      
      setPieChartItems((prev)=>[]);

      let pieItems: RPieChartItem[] = [];
      
      pieItems.push(pieItem1);
      pieItems.push(pieItem2);
      pieItems.push(pieItem3);
      pieItems.push(pieItem4);
      pieItems.push(pieItem5);
      pieItems.push(pieItem6);

      setPieChartItems((prev)=> [...prev, ...pieItems]);
  }

   const CreateScatterChart = () => {
    
    let item1 = new RScatterChartItem("City 1", 'blue', [
       new Graph(2,8), new Graph(15,35), new Graph(20,65), new Graph(14, 30)
      ,new Graph(30,63), new Graph(35,78), new Graph(24,53), new Graph(26, 56)
      ,new Graph(20,42), new Graph(14,31), new Graph(34,75), new Graph(48, 72)
    ]);
    
    let item2 = new RScatterChartItem("City 2", "red", [
      new Graph(15,40), new Graph(18,55), new Graph(20,58)
      ,new Graph(45,83), new Graph(28,48), new Graph(44,83), new Graph(16, 26)
      ,new Graph(60,62), new Graph(64,61), new Graph(54,75), new Graph(68, 72)
    ]);

    let item3 = new RScatterChartItem("City 3", 'teal', [
      new Graph(14,35), new Graph(25,45), new Graph(40,85)
      ,new Graph(40,63), new Graph(55,78), new Graph(54,53), new Graph(66, 56)
      ,new Graph(20,32), new Graph(14,41), new Graph(34,75), new Graph(68, 72)
    ]);    

    setScatterChartItems((prevState)=>[item1, item2, item3]);

  }


  useEffect(()=>{
    CreateDonutItems();
    CreatePieChartItems();
    CreateScatterChart();
  }, []);

  return (
    <>
      <RButton ref={bref} ButtonHeight={ButtonHeight} onClick={(e:React.MouseEvent<HTMLButtonElement>)=> handleSubmit(e)}>Submit</RButton>
    
      <RDonutChart DataListHeight={100} ChartWidth={300} ShadowColor={'blue'} ChartItems={chartItems} Opacity={'0.8'}></RDonutChart>
      
      <RPieChart DataListHeight={100} ChartWidth={300} ShadowColor={'blue'} ChartItems={piechartItems} Opacity={'0.8'}></RPieChart>

      <RScatterChart XAxisTitle={'Age'} YAxisTitle={'Weight'} ChartItems={scatterChartItems} Width={400} Height={400}></RScatterChart>
    </>
  );

}

export default App;

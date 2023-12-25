import "./App.css"
import React, { useState, useRef, useEffect } from 'react';
import {useLocalStorage} from "./UseLocalStorage";


function App() {
  
  const largoFocus = useRef(null);
  const [largoDeLaPlancha, setLargoDeLaPlancha ] = useLocalStorage('largoDeLaPlancha', '');
  const [anchoDeLaPlancha, setAnchoDeLaPlancha] = useLocalStorage('anchoDeLaPlancha', '');
  const [espesorDeLaPlancha, setEspesorDeLaPlancha] = useLocalStorage('espesorDeLaPlancha','');
  const [largo, setLargo] = useState('');
  const [ancho, setAncho] = useState('');
  const [espesor, setEspesor] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useLocalStorage('data',[]);
  const [sumaPesoUnitario, setSumaPesoUnitario] = useLocalStorage('sumaPesoUnitario',0);
  const [sumaPesoReal, setSumaPesoReal] = useState(0);
  const [sumaPorcentajeMerma, setSumaPorcentajeMerma] = useLocalStorage('sumaPorcentajeMerma ',0);
  const [kgMerma, setKgMerma] = useLocalStorage('kgMerma',0);
  const [pesoPlanchaInicial, setPesoPlanchaInicial] = useLocalStorage('pesoPlanchaInicial ',0);
  const [sumaKgMerma, setSumaKgMerma] = useLocalStorage('sumaKgMerma',0);
  const [sumaConsumoOf, setSumaConsumoOf] = useLocalStorage('sumaConsumoOf',0);
  
   
  const setLocalStorage = value => {
    try {
      setLargoDeLaPlancha(value)
      window.localStorage.setItem('largoDeLaPlancha', value)

 } catch (error) {
    console.log(error)
   }
} 

  useEffect(() => {
    let sumaPesoUnitario = 0;
    let sumaPesoReal = 0;
    let sumaKgMerma = 0;
    let sumaConsumoOf = 0;

    data.forEach((row) => {
      sumaPesoUnitario += parseFloat(row.pesoUnitario);
      sumaPesoReal += parseFloat(row.pesoReal);
      sumaKgMerma += parseFloat(row.kgMerma);
      sumaConsumoOf += parseFloat(row.consumoOf);
      
    });;

  setSumaPesoUnitario(sumaPesoUnitario.toFixed(2));
    setSumaPesoReal(sumaPesoReal.toFixed(2));
    setSumaKgMerma(sumaKgMerma.toFixed(2));

    setSumaConsumoOf(sumaConsumoOf.toFixed(2));


  }, [data]);

  const calcularPeso = () => {
    const largoDeLaPlanchaNum = parseFloat(largoDeLaPlancha);
    const anchoDeLaPlanchaNum = parseFloat(anchoDeLaPlancha);
    const espesorDeLaPlanchaNum = parseFloat(espesorDeLaPlancha);
    const largoNum = parseFloat(largo);
    const anchoNum = parseFloat(ancho);
    const espesorNum = parseFloat(espesor);
    const cantidadNum = parseInt(cantidad);

    if (
      isNaN(largoDeLaPlanchaNum) ||
      isNaN(anchoDeLaPlanchaNum) ||
      isNaN(espesorDeLaPlanchaNum) ||
      isNaN(largoNum) ||
      isNaN(anchoNum) ||
      isNaN(espesorNum) ||
      isNaN(cantidadNum)
    ) {
      setError('Por favor, ingresa valores numéricos válidos.');
      return;
    }

    const pesoUnitarioResult = (largoNum * anchoNum * espesorNum * 0.000008).toFixed(2);

    const pesoRealResult = (pesoUnitarioResult * cantidadNum).toFixed(2);

    const pesoPlanchaInicialResult = (largoDeLaPlanchaNum * anchoDeLaPlanchaNum * espesorDeLaPlanchaNum * 0.000008).toFixed(2);

    setPesoPlanchaInicial(pesoPlanchaInicialResult);

    const newRow = {
      largoDeLaPlancha: largoDeLaPlancha,
      anchoDeLaPlancha: anchoDeLaPlancha,
      espesorDeLaPlancha: espesorDeLaPlancha,
      largo: largoNum,
      ancho: anchoNum,
      espesor: espesorNum,
      cantidad: cantidadNum,
      pesoUnitario: pesoUnitarioResult,
      pesoReal: pesoRealResult,
      porcentajeMerma: 0,
      kgMerma: 0,
    };

    const newData = [...data, newRow];

    const sumaPorcentajeMermaActualizada =
      sumaPorcentajeMerma === 0
        ? '100'
        : data.reduce((total, item) => total + parseFloat(item.porcentajeMerma), 0).toFixed(2);

    setSumaPorcentajeMerma(sumaPorcentajeMermaActualizada);

    let newSumaPesoReal = 0;
    let newSumaPesoUnitario = 0;
    let newSumaConsumoOf = 0;

    newData.forEach((row) => {
      newSumaPesoReal += parseFloat(row.pesoReal);
      newSumaPesoUnitario += parseFloat(row.pesoUnitario);
      newSumaConsumoOf += parseFloat(row.consumoOf);
    });

    

    // Actualización del porcentaje de merma para cada fila
    newData.forEach((row) => {
 row.porcentajeMerma = ((row.pesoReal / newSumaPesoReal) * 100).toFixed(2)

row.kgMerma = (row.porcentajeMerma * (pesoPlanchaInicialResult - newSumaPesoReal) * 0.01).toFixed(2);

row.consumoOf = (parseFloat(row.kgMerma) + parseFloat(row.pesoReal)).toFixed(2);

row.sumaConsumoOf += parseFloat(row.consumoOf);
    });

    setData(newData);
    setSumaPesoUnitario(newSumaPesoUnitario.toFixed(2));
    setSumaPesoReal(newSumaPesoReal.toFixed(2));

    setSumaConsumoOf(newSumaConsumoOf.toFixed(2));



    
    setError('');
    setLargo('');
    setAncho('');
    setEspesor('');
    setCantidad('');
    largoFocus.current.focus();
  };

  const eliminarFila = (fila) => {
    const newTableData = data.filter((row) => row !== fila);
    setData(newTableData);
  };
    
  
  
  return (
    
    <div className=" animate-fade-left contenedor text-white font-bold p-3 mt-20 mx-auto  sm:border-2 sm:border-green-400  sm:p-4 sm:w-[97%]  sm:align-middle sm:mx-auto sm:flex sm:items-center">
    
      
     <div className="overflow-x-auto    sm:space-y-[900px] sm:mx-auto  sm:bg-[#31304D] sm:h-full ">
       
       <div className="absolute mt-1 mx-3.5    sm:w-[800px]  sm:bg-blue-400 sm:mt-[250px] md:mx-auto ">

       
      <h1 className="text-3xl font-bold  bg-[#0085ff]   p-3 rounded-xl drop-shadow-2xl">Calculadora de Peso</h1>
       
      <div className="flex flex-col-2 flex-grow   pt-2 pb-1 space-x-3 ">
       
        
        <label className="text-start font-bold  mr-4 pt-2  text-justify space-x-3.5 md:w-30  ">Largo de la plancha:</label>
        <input
          type="number"
          value={largoDeLaPlancha}
          onChange={(e) => setLargoDeLaPlancha(e.target.value)}
          ref={largoFocus}
          className="w-40 grow h-8 my-1  border border-slate-300 rounded-md py-0.5 pl-3 pr-2 shadow-sm focus:outline-none border-2  focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-[#4A4A4A]"
        />
      </div>
      <div className="flex flex-col-2   pt-1 pb-1 space-x-6">
        
        <label className="flex  flex-col-2   pt-2 pb-2" >Ancho de la plancha:</label>
        <input
          type="number"
          value={anchoDeLaPlancha}
          onChange={(e) => setAnchoDeLaPlancha(e.target.value)}
          className="w-40 grow h-8 my-1  border border-slate-300 rounded-md py-0.5 pl-3 pr-2 shadow-sm focus:outline-none border-2  focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-[#4A4A4A]"
        />
      </div>
      <div className="flex flex-col-2   pt-1 pb-1 space-x-3">
        <label className="flex flex-col-2  pt-2 pb-2" >Espesor de la plancha:</label>
        <input
          type="number"
          value={espesorDeLaPlancha}
          onChange={(e) => setEspesorDeLaPlancha(e.target.value)}
          className="w-40 grow h-8 my-1  border border-slate-300 rounded-md py-0.5 pl-3 pr-2 shadow-sm focus:outline-none border-2  focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-[#4A4A4A]"
        />
      </div>
      
<strong className="text-3xl font-bold text-[#0085ff] p-3">{pesoPlanchaInicial} Kg</strong>

<h2 className="text-xl font-bold  bg-[#0085ff] flex justify-center p-2 
  mb-3 mt-4 rounded-xl">Pieza Requerida</h2>

      <div className="flex flex-col-2   pt-1 pb-1 space-x-[85px]">
        <label className="flex flex-col-2  pt-2 pb-2" >Largo:</label>
        <input
          type="number"
          value={largo}
          onChange={(e) => setLargo(e.target.value)}
          ref={largoFocus}
          className="w-40 grow h-8 my-1  border border-slate-300 rounded-md py-0.5 pl-3 pr-2 shadow-sm focus:outline-none border-2  focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-[#4A4A4A]"
        />
      </div>
      <div className="flex flex-col-2   pt-1 pb-1 space-x-20">
        <label className="flex flex-col-2  pt-2 pb-2" >Ancho:</label>
        <input 
          type="number" 
          value={ancho} 
          onChange={(e) => setAncho(e.target.value)}
          className="w-40 grow h-8 my-1  border border-slate-300 rounded-md py-0.5 pl-3 pr-2 shadow-sm focus:outline-none border-2  focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-[#4A4A4A]"
          />
      </div>
      <div className="flex flex-col-2   pt-1 pb-1 space-x-[69px]">
        <label className="flex flex-col-2 pt-2 pb-2" >Espesor:</label>
        <input type="number" value={espesor} onChange={(e) => setEspesor(e.target.value)} 
          className="w-40 grow h-8 my-1  border border-slate-300 rounded-md py-0.5 pl-3 pr-2 shadow-sm focus:outline-none border-2  focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-[#4A4A4A]"
          />
      </div>
      <div className="flex flex-col-2   pt-1 pb-1 space-x-16">
        <label className="flex  flex-col-2 pt-2 pb-2" >Cantidad:</label>
        <input type="number" 
          value={cantidad} 
          onChange={(e) => setCantidad(e.target.value)} 
          className="w-40 grow h-8 my-1  border border-slate-300 rounded-md py-0.5 pl-3 pr-2 shadow-sm focus:outline-none border-2  focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm text-[#4A4A4A]"
          />
      </div>
      
      <button className="text-3xl animate-duration-75 font-bold  bg-blue-500 shadow-lg shadow-blue-500/50 drop-shadow-2xl flex justify-center p-2 w-full rounded-xl mt-1.5 mb-8 mt-3 border-green-500" onClick={calcularPeso}>Calcular</button>

     </div>
     
      
{error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="scrool-x-auto  border-separate border border-cyan-500 border-spacing-0.5 pt-2 mt-[80vh]  ">
        <thead className=" ">
          <tr className="bg-[#0081B9]  ">
            <th className="border border-cyan-700 p-0.5 px-4">Largo</th>
            <th className="border border-slate-600 p-3">Ancho</th>
            <th className="border border-slate-600  p-2 px-4">Espesor</th>
            <th className="border border-slate-600  p-2 px-4">Cantidad</th>
            <th className="border border-slate-600  p-2 px-4">Peso Unitario</th>
            <th className="border border-slate-600  p-2 px-4">Peso Real</th>
            <th className="border border-slate-600  p-2 px-4">% Merma</th>
            <th className="border border-slate-600  p-2 px-4">Kg Merma</th>
            <th className="border border-slate-600  p-2 px-4">consumo en of</th>
            <th className="border border-slate-600  p-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="border border-slate-600 p-2 px-4">{row.largo}</td>
              <td className="border border-slate-600 p-2 px-4">{row.ancho}</td>
              <td className="border border-slate-600 p-2 px-4">{row.espesor}</td>
              <td className="border border-slate-600 p-2 px-4">{row.cantidad}</td>
              <td className="border border-slate-600 p-2 px-4">{row.pesoUnitario}</td>
              <td className="border border-slate-600 p-2 px-4">{row.pesoReal}</td>
              <td className="border border-slate-600 p-2 px-4">{row.porcentajeMerma}%</td>
              <td className="border border-slate-600 p-2 px-4">{row.kgMerma}</td>
              <td className="border border-slate-600 p-2 px-4 bg-[green]">{row.consumoOf}</td>
              <td className="danger">
                <button onClick={() => eliminarFila(row)} className="border-2 border-rose-500 rounded-md py-0.5 px-2 mx-2.5">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-[#7DCE13]">
          <tr>
            <td className =" p-2 px-4"colSpan="4">Total:</td>
            <td className=" p-2 px-4">{sumaPesoUnitario}</td>
            <td className=" p-2 px-4">{sumaPesoReal}</td>
            <td className=" p-2 px-4">{sumaPorcentajeMerma}%</td> 
            <td className=" p-2 px-4">{sumaKgMerma}</td>
            <td className="p-2 px-4 bg-[green]">{sumaConsumoOf}</td>
            
          </tr>
        </tfoot>
      </table>
         
       </div>
    </div>
  );
}

export default App;

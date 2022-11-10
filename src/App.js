import { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  MarkerType,
} from 'react-flow-renderer';

import initialNodes from './nodes.jsx';
import initialEdges from './edges.jsx';
import { v4 as uuidv4 } from 'uuid';


const rfStyle = {
  backgroundColor: '#D0C0F7',
};

let newstates = new Set('A');


function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodesDeterministico, setNodesDeterministico] = useState([]);
  const [edgesDeterministico, setEdgesDeterministico] = useState([]);

  const actualizarEntradas = (event, entrada, currentState) =>{

    if(event.key === 'Enter'){
      var newnodes = [];
      var position = 0;
      var newedges = [];
      let value =  event.target.value;

      states.map(state => {
         newnodes = [...newnodes,
          {
           id: state,
           data: {label: state},
           position: {x: position, y:10}
         }
        ]
        position += 190;

      })

      newedges = [...edges, value.split(',')
      .flatMap(valueNoD => [
        {
          id: currentState.concat('-').concat(valueNoD).concat(uuidv4()),
          source: currentState,
          target: valueNoD,
          label: entrada,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#FF0072',
          }
        }])].flatMap(edge => edge);

      setNodes(newnodes);
      setEdges(newedges);
      position = 0;
    }
  }

  const convertirNoDeterministico = () =>{
    let statesConverted = [];
    do{
      statesConverted = Array.from(newstates).flatMap(newstate => newstate.length > 1?
      [Array.from(new Set(newstate.split('')
      .flatMap(state => edges
                .filter(edge => edge.source === state && edge.label === '0')
                .map(edge => edge.target))))
      .sort()
      .reduce((previewEdge, currentEdge) => previewEdge.concat(currentEdge), "")
      , 
      Array.from(new Set(newstate.split('')
      .flatMap(state => edges
        .filter(edge => edge.source === state && edge.label === '1')
        .map(edge => edge.target))))
      .sort()
      .reduce((previewEdge, currentEdge) => previewEdge.concat(currentEdge), "")
    ]
        
    : [edges.filter(edge => edge.source === newstate && edge.label === '0')
        .map(edge => edge.target)
        .reduce((previewEdge, currentEdge) => previewEdge.concat(currentEdge), "")
        , 
        edges.filter(edge => edge.source === newstate && edge.label === '1')
        .map(edge => edge.target)
        .reduce((previewEdge, currentEdge) => previewEdge.concat(currentEdge), "")])

      newstates = new Set(['A', statesConverted].flatMap(state => state));

    }while(Array.from(newstates).length * 2 !== statesConverted.length)

    console.log(Array.from(newstates));
    console.log(statesConverted);

    /*console.log(Array.from(newstates)
      .map(newstate => newstate.replace(",", ""))
      .flatMap((newstate, index) => [{
        id: newstate,
        data: {label: newstate},
        position: {x: nodes[index], y: 90}
    }]))
    setNodesDeterministico(Array.from(newstates)
      .map(newstate => newstate.replace(",", ""))
      .flatMap((newstate, index) => [{
        id: newstate,
        data: {label: newstate},
        position: {x: nodes[index], y: 90}
    }]));*/
  }

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const states = ['A','B', 'C','D','E']

  return (
    <div style={{ height: 500 }}>
      <table>
        <tr>
          <th>Estados</th>
          <th>0</th>
          <th>1</th>

        </tr>

        {
          states
          .map(state => {
            return(
            <tr>
              <td>{state}</td>
              <td><input type="text" onKeyDown={(e) => actualizarEntradas(e, "0", state)} /></td>
              <td><input type="text" onKeyDown={(e) => actualizarEntradas(e, "1", state)} /></td>
            </tr>)
          })
            
        }
      </table>

    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      style={rfStyle}
      attributionPosition="top-right"
    >
      <Background />
    </ReactFlow>

    <button onClick={convertirNoDeterministico}>Convertir automata a deterministico</button>

    </div>
  );
}

export default Flow;

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

const rfStyle = {
  backgroundColor: '#D0C0F7',
};

const newstates = ['A'];


function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const actualizarEntradas = (event, entrada, currentState) =>{

    if(event.key === 'Enter'){
      var newnodes = [];
      var position = 0;
      var newedges = [];
      const value = event.target.value;

      states.map(state => {
        console.log(state);
         newnodes = [...newnodes,
          {
           id: state,
           data: {label: state},
           position: {x: position, y:10}
         }
        ]
        position += 190;

      })
      
      newedges = value.split(',')
      .flatMap(valueNoD => [...edges,
        {
          id: currentState.concat('-').concat(valueNoD),
          source: currentState,
          target: valueNoD,
          label: entrada,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#FF0072',
          }
        }]);


      setNodes(newnodes);
      setEdges(newedges);
      position = 0;
      newstates.push(value);
    }
  }

  const convertirNoDeterministico = () =>{
    newstates.filter(newstate => newstate.includes(','))
    .map(newstate => newstate.split(',')
          .map())
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

  const states = ['A','B', 'C','D','E','F']

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

    </div>
  );
}

export default Flow;

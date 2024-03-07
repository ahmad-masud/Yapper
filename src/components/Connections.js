import { useEffect, useRef } from 'react';
import { jsPlumb } from 'jsplumb';

function Connections({ onUpdatePosition, connections, children, snapToGrid, connector }) {
    const jsPlumbContainerRef = useRef(null);

    useEffect(() => {
        jsPlumb.importDefaults({
            ConnectionsDetachable: false,
        });
        
        if (!snapToGrid) {
            jsPlumb.setContainer(jsPlumbContainerRef.current);

            connections.forEach((connection) => {
                const sourceId = connection.source
                const targetId = connection.target;
                if (document.getElementById(sourceId) && document.getElementById(targetId)) {
                    jsPlumb.connect({
                        source: sourceId,
                        target: targetId,
                        connector: connector === 1 ? ["Flowchart", { cornerRadius: 5 }] : ["Bezier"],
                        overlays: [
                            ['Arrow', { location: 1, width: 12, length: 12 }]
                        ],
                        endpoints: [['Dot', { radius: 8 }], 'Blank'],
                        paintStyle: { stroke: '#7f8c8d', strokeWidth: 2 },
                        endpointStyle: { fillStyle: '#7f8c8d' },
                        anchor: ['Continuous', { faces: ['left', 'right'] }],
                    });
                }
            }); 
        }

        return () => {
          jsPlumb.reset();
        };
    }, [onUpdatePosition, connections, snapToGrid, connector]); 

    return (
        <div ref={jsPlumbContainerRef}>
            {children}
        </div>
    );
}

export default Connections;

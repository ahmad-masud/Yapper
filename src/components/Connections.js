import { useEffect, useRef } from 'react';
import { jsPlumb } from 'jsplumb';

function Connections({ onUpdatePosition, connections, children, snapToGrid }) {
    const jsPlumbContainerRef = useRef(null);

    useEffect(() => {
        if (!snapToGrid) {
            jsPlumb.setContainer(jsPlumbContainerRef.current);

            connections.forEach((connection) => {
                const sourceId = connection.source
                const targetId = connection.target;
                if (document.getElementById(sourceId) && document.getElementById(targetId)) {
                    jsPlumb.connect({
                        source: sourceId,
                        target: targetId,
                        connector: ["Flowchart", { cornerRadius: 5 }],
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
    }, [onUpdatePosition, connections, snapToGrid]); 

    return (
        <div ref={jsPlumbContainerRef}>
            {children}
        </div>
    );
}

export default Connections;

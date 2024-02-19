import React, { useEffect, useRef } from 'react';
import './Content.css';
import Table from '../Table/Table.js';
import { jsPlumb } from 'jsplumb';

function Content({ tables, onDeleteTable, onUpdateTable, allTableNames, onAddAttribute, onDeleteAttribute, onUpdatePosition, connections }) {

    const jsPlumbRef = useRef(null);
    const jsPlumbContainerRef = useRef(null);

    useEffect(() => {
        jsPlumbRef.current = jsPlumb.getInstance();
        jsPlumbRef.current.setContainer(jsPlumbContainerRef.current);

        connections.forEach((connection) => {
            const sourceId = connection.source
            const targetId = connection.target;
            if (document.getElementById(sourceId) && document.getElementById(targetId) && window.innerWidth >= 600) {
                jsPlumbRef.current.connect({
                    source: sourceId,
                    target: targetId,
                    connector: ["Flowchart", { stub: [30, 30], cornerRadius: 5 }],
                    overlays: [
                        ['Arrow', { location: 1, width: 12, length: 12 }]
                    ],
                    endpoints: [['Dot', { radius: 6 }], 'Blank'],
                    paintStyle: { stroke: '#7f8c8d', strokeWidth: 2 },
                    endpointStyle: { fillStyle: '#7f8c8d' },
                    anchor: ['Continuous', { faces: ['left', 'right'] }],
                });
            }
        }); 

        return () => {
          jsPlumbRef.current.deleteEveryConnection();
        };
    }, [onUpdatePosition, connections]); 

    return (
        <div ref={jsPlumbContainerRef}>
            <div className="content">
                {tables.map((table) => (
                    <Table
                        key={table.id}
                        table={table}
                        tables={tables}
                        onDeleteTable={onDeleteTable}
                        onUpdateTable={onUpdateTable}
                        allTableNames={allTableNames}
                        onAddAttribute={onAddAttribute}
                        onDeleteAttribute={onDeleteAttribute}
                        color={table.color}
                        positionX={table.positionX}
                        positionY={table.positionY}
                        onUpdatePosition={onUpdatePosition}
                    />
                ))}
            </div>
        </div>
    );
}

export default Content;

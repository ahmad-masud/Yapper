import React, { useEffect, useState } from 'react';
import './Content.css';
import Table from '../Table/Table.js';

function Content({ tables, onDeleteTable, onUpdateTable, allTableNames, onAddAttribute, onDeleteAttribute, onUpdatePosition, onUpdateWidth }) {
    const [linePositions, setLinePositions] = useState([]);
    useEffect(() => {
        const calculateLinePositions = () => {
            let newLinePositions = [];
            tables.forEach(table => {
                table.attributes.forEach((attribute, index) => {
                    if (attribute.constraints.foreignKey) {
                        const fkTable = tables.find(t => t.name === attribute.constraints.foreignKey.table);
                        if (fkTable) {
                            fkTable.attributes.forEach((fkAttribute, fkIndex) => {
                                if (fkAttribute.constraints.primaryKey) {
                                    
                                    // Calculate start and end points for the line
                                    var startX = table.positionX;  // Assuming width property exists
                                    var endX = fkTable.positionX;
            
                                    if (startX < endX) {
                                        startX += table.width;
                                    } else {
                                        endX += fkTable.width;
                                    }
            
                                    const startY = table.positionY + (index+1)*42+21;// Start from the vertical center of the table
                                    const endY = fkTable.positionY + (fkIndex+1)*42+21;// End at the vertical center of the fkTable
            
                                    // Calculate the midpoint for the 90-degree turn
                                    const midX = (startX + endX) / 2; // Halfway between startX and endX
            
                                    // Points for creating the L-shaped line with a turn at the midpoint
                                    const points = `${startX},${startY} ${midX},${startY} ${midX},${endY} ${endX},${endY}`;
            
                                    newLinePositions.push({ points });
                                }
                            });
                        }
                    }
                });
            });
            setLinePositions(newLinePositions);
        };
        calculateLinePositions();
    }, [tables]);          

    return (
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
                    onUpdateWidth={onUpdateWidth}
                />
            ))}
            <svg className="connections-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="black"/>
                    </marker>
                </defs>
                {linePositions.map((line, index) => {
                    // Assuming line.points is a string like "x1,y1 x2,y2 x3,y3"
                    // Split to get the individual points as ["x1,y1", "x2,y2", "x3,y3"]
                    const pointsArray = line.points.split(' ');
                    // Extract the starting point (assuming it's the first in the array)
                    const [startX, startY] = pointsArray[0].split(',').map(Number);

                    return (
                        <g key={index}>
                            <circle cx={startX} cy={startY} r="5" fill="black" />
                            <polyline points={line.points} stroke="black" fill="none" marker-end="url(#arrowhead)" />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default Content;

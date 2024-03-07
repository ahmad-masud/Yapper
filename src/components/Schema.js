import '../styles/Schema.css';
import Table from './Table.js';
import Connections from './Connections.js';

function Schema({ tables, onDeleteTable, onUpdateTable, allTableNames, onAddAttribute, onDeleteAttribute, onUpdatePosition, connections, snapToGrid, connector }) {
    return (
        <Connections onUpdatePosition={onUpdatePosition} connections={connections} snapToGrid={snapToGrid} connector={connector} >
            <div className={snapToGrid ? 'snap-to-grid' : ''}>
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
                        snapToGrid={snapToGrid}
                    />
                ))}
            </div>
        </Connections>
    );
}

export default Schema;

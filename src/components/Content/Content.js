import './Content.css';
import Table from '../Table/Table.js';

function Content({ tables, onDeleteTable, onUpdateTable, allTableNames, onAddAttribute, onDeleteAttribute, onUpdatePosition }) {
    return (
        <div className="content">
            {tables.map((table) => (
                <Table
                    key={table.id}
                    table={table}
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
    );
}

export default Content;
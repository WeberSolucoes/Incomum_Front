import React from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useCodigo } from '../../contexts/CodigoProvider';

interface GenericTableProps {
    filteredItems: any[];
    emptyMessage: string;
}

const GenericTable: React.FC<GenericTableProps> = ({ filteredItems, emptyMessage }) => {
    const { codigo, setCodigo, setView } = useCodigo();

    const createColumns = () => {
        const keys = filteredItems.length > 0 ? Object.keys(filteredItems[0]) : [];

        function onIdClick(rowData: any) {
            setCodigo(rowData['codigo']);
            setView('create');
        }

        return keys.map(key => (
            <Column
                key={key}
                field={key}
                sortable
                header={capitalizeFirstLetter(key)}
                body={key === 'codigo' ? (rowData: any) => <Button label={rowData[key]} onClick={() => onIdClick(rowData)} /> : undefined}
            />
        ));
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div>
            <DataTable
                paginator
                rows={5}
                emptyMessage={emptyMessage}
                removableSort
                rowsPerPageOptions={[5, 10, 25, 50]}
                value={filteredItems.length > 0 ? filteredItems : []} // Garante que a tabela não quebre
                tableStyle={{ minWidth: '10rem' }}
                className="custom-data-table" // Classe para estilização
            >
                {createColumns()}
            </DataTable>
        </div>
    );
};

export default GenericTable;

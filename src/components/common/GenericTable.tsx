import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

interface GenericTableProps<T> {
    filteredItems: T[];
    emptyMessage: string;
    onCodeClick?: (codigo: number) => void; // Função chamada ao clicar no código
}

const GenericTable = <T,>({ filteredItems, emptyMessage, onCodeClick }: GenericTableProps<T>) => {
    // Template para renderizar o item
    const itemTemplate = (item: any) => {
        return (
            <span 
                style={{ cursor: 'pointer', color: 'blue' }} 
                onClick={() => onCodeClick && onCodeClick(item.codigo)} // Chama a função ao clicar no código
            >
                {item.codigo}
            </span>
        );
    };

    return (
        <DataTable 
            value={filteredItems} 
            emptyMessage={emptyMessage} 
            paginator 
            rows={10} // Número padrão de itens por página
            rowsPerPageOptions={[5, 10, 25, 50]} // Opções de quantidade de itens por página
        >
            <Column 
                field="codigo" 
                header="Código" 
                body={itemTemplate} // Usa a função de template para renderizar o código
            />
            <Column field="descricao" header="Descrição" />
            <Column field="responsavel" header="Responsável" />
            <Column field="email" header="E-mail" />
            <Column
                header="Editar" // Header do botão de editar
                body={(rowData) => (
                    <Button 
                        icon="pi pi-pencil" 
                        className="p-button-text p-button-rounded p-button-sm" 
                        tooltip="Editar"
                        tooltipOptions={{ position: 'top' }}
                        onClick={() => onCodeClick && onCodeClick(rowData.codigo)} // Chama a mesma função ao clicar no botão
                    />
                )}
                style={{ textAlign: 'center', width: '5rem' }}
            />
        </DataTable>
    );
};

export default GenericTable;

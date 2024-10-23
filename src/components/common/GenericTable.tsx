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
    // Template para renderizar o item do código, agora sem função de clique
    const itemTemplate = (item: any) => {
        return (
            <span style={{ cursor: 'default', color: 'black' }}>
                {item.codigo}
            </span>
        );
    };

    return (
        <DataTable 
            value={filteredItems}
            stripedRows 
            emptyMessage={emptyMessage} 
            paginator 
            rows={10} // Número padrão de itens por página
            rowsPerPageOptions={[5, 10, 25, 50]} // Opções de quantidade de itens por página
        >
            {/* Coluna do Código sem ação de clique */}  
            <Column 
                field="codigo" 
                header="Código" 
                body={itemTemplate} // Usa o template de item sem ação de clique
            />
            
            {/* Outras colunas da tabela */}
            <Column field="descricao" header="Descrição" />
            <Column field="responsavel" header="Responsável" />
            <Column field="email" header="E-mail" />
            
            {/* Coluna do botão Editar */}
            <Column
                header="Editar" // Header do botão de editar
                body={(rowData) => (
                    <Button 
                        icon="pi pi-pencil" 
                        className="p-button-text p-button-rounded p-button-sm" 
                        tooltip="Editar"
                        tooltipOptions={{ position: 'top' }}
                        onClick={() => {
                            // Ação de clique associada apenas ao botão de editar
                            if (onCodeClick) {
                                onCodeClick(rowData.codigo);
                            }
                        }}
                    />
                )}
                style={{ textAlign: 'center', width: '5rem' }} // Estilização do botão
            />
        </DataTable>
    );
};

export default GenericTable;

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

interface GenericTableProps<T> {
    filteredItems: T[];
    emptyMessage: string;
    onCodeClick?: (codigo: number) => void; // Função chamada ao clicar no código
    columns?: { field?: string; header?: string }[]; // Colunas dinâmicas, com valores opcionais
}

const GenericTable = <T,>({ filteredItems, emptyMessage, onCodeClick, columns }: GenericTableProps<T>) => {
    // Template para renderizar o item do código
    const itemTemplate = (item: any) => {
        return (
            <span style={{ cursor: 'default', color: 'black' }}>
                {item.codigo}
            </span>
        );
    };

    // Colunas padrão (caso não sejam passadas colunas)
    const defaultColumns = [
        { field: 'descricao', header: 'Descrição' },
        { field: 'responsavel', header: 'Responsável' },
        { field: 'email', header: 'E-mail' },
    ];

    // Se as colunas não forem passadas, usa as colunas padrão
    const finalColumns = columns?.length ? columns : defaultColumns;

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
            
            {/* Colunas dinâmicas passadas como parâmetro ou as colunas padrão */}
            {finalColumns.map((col, index) => (
                <Column 
                    key={index} 
                    field={col.field || 'defaultField'} // Valor padrão para field
                    header={col.header || 'Default Header'} // Valor padrão para header
                />
            ))}
            
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

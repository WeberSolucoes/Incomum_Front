import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

interface GenericTableProps<T> {
    filteredItems: T[];
    emptyMessage: string;
    onCodeClick?: (codigo: number) => void; // Função chamada ao clicar no código
    columns?: { field?: string; header?: string }[]; // Colunas dinâmicas, com valores opcionais
    showEditButton?: boolean; // Parâmetro para controlar se o botão de editar deve ser exibido
}

const GenericTable = <T,>({ filteredItems, emptyMessage, onCodeClick, columns, showEditButton = true }: GenericTableProps<T>) => {
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
        { field: 'codigo', header: 'Código', body:{itemTemplate} },
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
            className="custom-table"
        >
            {/* Colunas dinâmicas passadas como parâmetro ou as colunas padrão */}
            {finalColumns.map((col, index) => (
                <Column 
                    key={index} 
                    field={col.field || 'defaultField'} // Valor padrão para field
                    header={col.header || 'Default Header'} // Valor padrão para header
                    className="custom-first-column"
                    style={col.style || {}} // Aplica o estilo específico de cada coluna, se existir
                />
            ))}
            
            {/* Coluna do botão Editar, que só será exibida se showEditButton for true */}
            {showEditButton && (
                <Column
                    header="Editar" // Header do botão de editar
                    body={(rowData) => (
                        <Button 
                            icon="fas fa-edit"
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
            )}
        </DataTable>
    );
};

export default GenericTable;

import React, { useState, useEffect } from 'react';
import { DataTable, DataTableCellEditParams } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

interface GenericTableProps<T> {
    filteredItems: T[];
    emptyMessage: string;
    onCodeClick?: (codigo: number) => void;
    columns?: { field?: string; header?: string }[];
    showEditButton?: boolean;
    isEditable?: boolean;
    onSave?: (editedItems: T[]) => void;
    editedItems: T[];  // Recebe os itens editados do componente pai
    setEditedItems: React.Dispatch<React.SetStateAction<T[]>>;  // Função para atualizar os itens editados
}

const GenericTable = <T extends { codigo: number }>({
    filteredItems,
    emptyMessage,
    onCodeClick,
    columns,
    showEditButton = true,
    isEditable = false,
    onSave,
    editedItems,
    setEditedItems,
}: GenericTableProps<T>) => {
    const [items, setItems] = useState<T[]>(filteredItems);

    useEffect(() => {
        setItems(filteredItems);
    }, [filteredItems]);

    const textEditor = (options: any) => (
        <InputText
            type="text"
            value={options.value}
            onChange={(e) => options.editorCallback(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box' }}
        />
    );


    const dropdownEditor = (options: any, dropdownOptions: { label: string, value: number }[]) => (
        <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Selecione"
            style={{ width: '100%' }}
        />
    );

    const handleEditComplete = (e: DataTableCellEditParams) => {
        const { field, rowData, newValue } = e;
    
        if (rowData[field] === newValue) return;
    
        const updatedItem = { ...rowData, [field]: newValue, salvo: false };
    
        setEditedItems(prevEditedItems => {
            const existingIndex = prevEditedItems.findIndex(item => item.id === rowData.id);
    
            if (existingIndex !== -1) {
                // Se já existe, substitui pelo atualizado
                return prevEditedItems.map((item, index) =>
                    index === existingIndex ? updatedItem : item
                );
            } else {
                // Se não existe, adiciona à lista de editados
                return [...prevEditedItems, updatedItem];
            }
        });
    
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === rowData.id ? updatedItem : item
            )
        );
    };

    const defaultColumns = [
        { field: 'codigo', header: 'Código' },
        { field: 'descricao', header: 'Descrição' },
        { field: 'responsavel', header: 'Responsável' },
        { field: 'email', header: 'E-mail' }
    ];

    const finalColumns = columns?.length ? columns : defaultColumns;

    return (
        <div style={{width:'100%'}}>
            <DataTable
                value={items}
                stripedRows
                emptyMessage={emptyMessage}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                editMode={isEditable ? 'cell' : undefined}
                className="custom-table"
                style={{ width: '100%' }}
            >
                {finalColumns.map((col, index) => (
                    <Column
                        key={index}
                        field={col.field || 'defaultField'}
                        header={col.header || 'Default Header'}
                        body={(rowData) =>
                            col.type === 'dropdown'
                                ? col.options?.find(option => option.value === rowData[col.field])?.label || 'N/A'
                                : rowData[col.field]
                        }
                        editor={isEditable ? (col.type === 'dropdown' ? (options) => dropdownEditor(options, col.options || []) : textEditor) : undefined}
                        onCellEditComplete={isEditable ? handleEditComplete : undefined}
                        style={{ minWidth: '96px' }}
                    />
                ))}

                {showEditButton && (
                    <Column
                        header="Editar"
                        body={(rowData) => (
                            <Button
                                icon="fas fa-edit"
                                className="p-button-text p-button-rounded p-button-sm"
                                tooltip="Editar"
                                onClick={() => onCodeClick?.(rowData.codigo)}
                            />
                        )}
                    />
                )}
            </DataTable>

            {isEditable && editedItems.length > 0 && (
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', marginRight: '10px' }}>
                    <button onClick={() => onSave?.(editedItems)} // Agora envia os itens editados
                        style={{ width: '100px', height: '34px', padding: 'inherit' }}
                        type="button"
                        className="submit-btn">
                        <i style={{ marginRight: '10px' }} className="fas fa-save"></i>Salvar
                    </button>
                </div>
            )}
        </div>
    );
};

export default GenericTable;
















import { Button } from "primereact/button";
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { useCodigo } from "../../contexts/CodigoProvider";
import { useEffect } from "react";

const GenericTable = (filteredItems: any, emptyMessage: string) => {

    const {codigo,setCodigo,setView} = useCodigo();
    useEffect(() => {
        if(codigo) setCodigo(null)
    },[])
    const createColumns = () => {
        // Obtenha as chaves do primeiro item (assumindo que todos os itens têm a mesma estrutura)
        const keys = filteredItems.length > 0 ? Object.keys(filteredItems[0]) : [];

        function onIdClick(rowData: any) {
            setCodigo(rowData['codigo'])
            setView('create')
        }
        // Crie uma coluna para cada chave
        return keys.map(key => {
            if (key === 'codigo') {
                return (
                    <Column
                        key={key}
                        field={key}
                        sortable
                        header={capitalizeFirstLetter(key)}
                        body={(rowData: any) => <Button link label={rowData[key]} onClick={() => onIdClick(rowData)}/>}
                    />
                );
            }
            return (
                <Column
                    key={key}
                    field={key}
                    sortable
                    header={capitalizeFirstLetter(key)}
                />
            );
        });
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div>
            <DataTable paginator rows={5} emptyMessage={emptyMessage} removableSort rowsPerPageOptions={[5, 10, 25, 50]} value={filteredItems} tableStyle={{ minWidth: '10rem' }}>
                {createColumns()}
            </DataTable>
        </div>
    )
}

export default GenericTable
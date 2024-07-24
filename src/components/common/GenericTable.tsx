import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"

const GenericTable = (filteredItems: any, emptyMessage: string) => {

    const createColumns = () => {
        // Obtenha as chaves do primeiro item (assumindo que todos os itens têm a mesma estrutura)
        const keys = filteredItems.length > 0 ? Object.keys(filteredItems[0]) : [];

        // Crie uma coluna para cada chave
        return keys.map(key => (
            <Column
                key={key}
                field={key}
                sortable
                header={capitalizeFirstLetter(key)}
            />
        ));
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div>
            <DataTable paginator rows={5} emptyMessage={emptyMessage} removableSort rowsPerPageOptions={[1, 5, 10, 25, 50]} value={filteredItems} tableStyle={{ minWidth: '10rem' }}>
                {createColumns()}
            </DataTable>
        </div>
    )
}

export default GenericTable
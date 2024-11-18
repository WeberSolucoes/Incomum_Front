import React, { useEffect, useState } from "react";
import { LojaResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetLojaByAreaComercial } from '../../services/Api';
import { toastError } from "../../utils/customToast";

interface UnidadesProps {
    acoCodigo: number; // Recebe o código da área comercial selecionada
}

const Unidades: React.FC<UnidadesProps> = ({ acoCodigo }) => {
    const [items, setItems] = useState<LojaResponse[]>([]);

    useEffect(() => {
        // Função para buscar as lojas vinculadas à área comercial
        const fetchData = async () => {
            try {
                // Busca as lojas que têm ligação com a área comercial através da tabela lojacomercial
                const response = await apiGetLojaByAreaComercial(acoCodigo);
                setItems(response.data); // Define os dados recebidos para exibição na tabela
            } catch (error) {
                toastError('Erro ao buscar as Unidades');
            }
        };

        fetchData();
    }, [acoCodigo]);

    // Definindo as colunas da tabela
    const columns = [
        { field: 'loj_descricao', header: 'Unidade' }
    ];

    return (
        <div>
            <GenericTable 
                filteredItems={items} 
                emptyMessage="Nenhuma Unidade Vinculada" 
                columns={columns}
                showEditButton={false}
            />
        </div>
    );
};

export default Unidades;

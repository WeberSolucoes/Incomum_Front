import React, { useEffect, useState } from 'react';
import { AgenciaListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetAgencia } from '../../services/Api';
import { toastError } from '../../utils/customToast';

interface AgenciaListProps {
    search: string; // Termo de pesquisa passado como prop
}

const AgenciaList: React.FC<AgenciaListProps> = ({ search }) => {
    const [items, setItems] = useState<AgenciaListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<AgenciaListResponse[]>([]); // Para armazenar os dados originais

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetAgencia();
                const mappedData: AgenciaListResponse[] = response.data.map((item: any) => ({
                    codigo: item.age_codigo,
                    descricao: item.age_descricao,
                    responsavel: item.age_responsavel, // Campos do objeto que você espera
                    email: item.age_email, // Campos do objeto que você espera
                }));
                setItems(mappedData);
                setOriginalItems(mappedData); // Armazena os dados originais
            } catch (error) {
                toastError('Erro ao buscar as agências');
            }
        };

        fetchData();
    }, []);

    // Filtra os itens com base na pesquisa
    const filteredItems = search
        ? originalItems.filter(item => {
              const searchTerm = search.toLowerCase();
              return (
                  item.descricao.toLowerCase().includes(searchTerm) ||
                  item.codigo.toString().toLowerCase().includes(searchTerm) ||
                  (item.responsavel && item.responsavel.toLowerCase().includes(searchTerm)) ||
                  (item.email && item.email.toString().toLowerCase().includes(searchTerm))
              );
          })
        : []; // Exibe uma lista vazia se não houver pesquisa

    return (
        <GenericTable filteredItems={filteredItems} emptyMessage='Nenhuma agência encontrada' />
    );
};

export default AgenciaList;

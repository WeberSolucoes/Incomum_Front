import React, { useEffect, useState } from 'react';
import { UnidadesListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetUnidades } from '../../services/Api';
import { toastError } from '../../utils/customToast';

interface UnidadeListProps {
    search: string; // Termo de pesquisa passado como prop
}

const UnidadeList: React.FC<UnidadeListProps> = ({ search }) => {
    const [items, setItems] = useState<UnidadesListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<UnidadesListResponse[]>([]); // Para armazenar os dados originais

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetUnidades();
                const mappedData: UnidadesListResponse[] = response.data.map((item: any) => ({
                    codigo: item.loj_codigo,
                    descricao: item.loj_descricao,
                    responsavel: item.loj_email, // Campos do objeto que você espera
                    email: item.loj_cnpj, // Campos do objeto que você espera
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

export default UnidadeList;
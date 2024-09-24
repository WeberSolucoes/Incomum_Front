import React, { useEffect, useState } from 'react';
import {VendedorListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetVendedor } from '../../services/Api';
import { toastError } from '../../utils/customToast';

interface VendedorListProps {
    search: string; // Termo de pesquisa passado como prop
}

const VendedorList: React.FC<VendedorListProps> = ({ search }) => {
    const [items, setItems] = useState<VendedorListResponse[]>([]);
    const [originalItems, setOriginalItems] = useState<VendedorListResponse[]>([]); // Para armazenar os dados originais

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetVendedor();
                const mappedData: VendedorListResponse[] = response.data.map((item: any) => ({
                    codigo: item.ven_codigo,
                    descricao: item.ven_descricao,
                    responsavel: item.ven_cpf, // Campos do objeto que você espera
                    email: item.ven_email, // Campos do objeto que você espera
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

export default VendedorList;
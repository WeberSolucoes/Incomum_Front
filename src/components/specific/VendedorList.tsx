import { useEffect, useState } from 'react';
import { VendedorListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetVendedor } from '../../services/Api';
import { toastError } from '../../utils/customToast';


interface VendedorListProps {
    search: string;
}

const UnidadeList: React.FC<VendedorListProps> = ({ search }) => {
    const [items, setItems] = useState<VendedorListResponse[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetVendedor();
                const mappedData: VendedorListResponse[] = response.data.map((item:any) => ({
                    codigo: item.ven_codigo,
                    descricao: item.ven_descricao,
                    responsavel: item.ven_descricao,
                    email: item.ven_descricao,
                }));
                setItems(mappedData);
            } catch (error) {
                toastError('Erro ao buscar as unidades');
            }
        }

        fetchData();
    },[])
    

    const filteredItems = items.filter(item => {
        if(!item.responsavel){item.responsavel = ''};
        if(!item.email){item.email = ''};
        return (
            item.descricao.toLowerCase().includes(search.toLowerCase()) ||
            item.codigo.toString().toLowerCase().includes(search.toLowerCase()) ||
            item.responsavel.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toString().toLowerCase().includes(search.toLowerCase())
        )
    }
    );

    return (
        GenericTable(filteredItems, 'Nenhuma unidade encontrada')
    );
};
export default UnidadeList;
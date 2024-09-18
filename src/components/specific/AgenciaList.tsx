import { useEffect, useState } from 'react';
import { AgenciaListResponse } from '../../utils/apiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetAgencia } from '../../services/Api';
import { toastError } from '../../utils/customToast';


interface AgenciaListProps {
    search: string;
}

const UnidadeList: React.FC<AgenciaListProps> = ({ search }) => {
    const [items, setItems] = useState<AgenciaListResponse[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetAgencia();
                const mappedData: AgenciaListResponse[] = response.data.map((item:any) => ({
                    codigo: item.age_codigo,
                    descricao: item.age_descricao,
                    responsavel: item.age_descricao,
                    email: item.age_descricao,
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
import { useEffect, useState } from 'react';
import { UnidadesListResponse } from '../../utils/ApiObjects';
import GenericTable from '../common/GenericTable';
import { apiGetUnidades } from '../../services/Api';
import { toastError } from '../../utils/customToast';


interface UnidadeListProps {
    search: string;
}

const UnidadeList: React.FC<UnidadeListProps> = ({ search }) => {
    const [items, setItems] = useState<UnidadesListResponse[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetUnidades();
                const mappedData: UnidadesListResponse[] = response.data.map((item:any) => ({
                    codigo: item.loj_codigo,
                    descricao: item.loj_descricao,
                    responsavel: item.loj_responsavel,
                    email: item.loj_email,
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
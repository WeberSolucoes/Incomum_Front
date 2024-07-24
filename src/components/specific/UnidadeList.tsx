import { UnidadesListResponse } from '../../utils/ApiObjects';
import GenericTable from '../common/GenericTable';


interface UnidadeListProps {
    search: string;
}

const UnidadeList: React.FC<UnidadeListProps> = ({ search }) => {
    const items: UnidadesListResponse[] = [
        { id: 1, nome: 'Unidade 1', sigla: 'U1', created_at: '2022-01-01', updated_at: '2022-01-01', deleted_at: "null", user_id: 1, user: null, ativo: true },
        { id: 2, nome: 'Unidade 2', sigla: 'U2', created_at: '2022-01-01', updated_at: '2022-01-01', deleted_at: null, user_id: 1, user: null, ativo: false },
        { id: 3, nome: 'Unidade 3', sigla: 'U3', created_at: '2022-01-01', updated_at: '2022-01-01', deleted_at: null, user_id: 1, user: null, ativo: true },
        { id: 4, nome: 'Unidade 4', sigla: 'U4', created_at: '2022-01-01', updated_at: '2022-01-01', deleted_at: null, user_id: 1, user: null, ativo: true },
        { id: 5, nome: 'Unidade 5', sigla: 'U5', created_at: '2022-01-01', updated_at: '2022-01-01', deleted_at: null, user_id: 1, user: null, ativo: true },
        { id: 6, nome: 'Unidade 6', sigla: 'U6', created_at: '2022-01-01', updated_at: '2022-01-01', deleted_at: null, user_id: 1, user: null, ativo: true },
        { id: 7, nome: 'Unidade 7', sigla: 'U7', created_at: '2022-01-01', updated_at: '2022-01-01', deleted_at: null, user_id: 1, user: null, ativo: true },

    ]

    const filteredItems = items.filter(item => {
        return (
            item.nome.toLowerCase().includes(search.toLowerCase()) ||
            item.id.toString().toLowerCase().includes(search.toLowerCase()) ||
            item.sigla.toLowerCase().includes(search.toLowerCase()) ||
            item.ativo.toString().toLowerCase().includes(search.toLowerCase())
        )
    }
    );

    return (
        GenericTable(filteredItems, 'Nenhuma unidade encontrada')
    );
};
export default UnidadeList;
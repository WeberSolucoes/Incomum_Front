import React, { useState, useEffect } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

interface BarraDeFerramentasProps {
    onCreateClick: () => void;
    onSearch: (term: string) => void;
    resetSearch: boolean; // Nova prop para resetar o campo de busca
}

const BarraDeFerramentas: React.FC<BarraDeFerramentasProps> = ({ onCreateClick, onSearch, resetSearch }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Estado para armazenar o termo de busca

    // Limpa o termo de busca toda vez que a prop resetSearch mudar
    useEffect(() => {
        if (resetSearch) {
            setSearchTerm(''); // Reseta o termo de busca
        }
    }, [resetSearch]); // Executa quando resetSearch mudar

    // Função para lidar com o clique no botão de consulta
    const handleSearchClick = () => {
        onSearch(searchTerm); // Dispara a pesquisa com o termo armazenado
    };

    return (
        <div></div>
    );
};

export default BarraDeFerramentas;

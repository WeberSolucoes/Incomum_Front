import React, { useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

interface BarraDeFerramentasProps {
    onCreateClick: () => void;
    onSearch: (term: string) => void;
}

const BarraDeFerramentas: React.FC<BarraDeFerramentasProps> = ({ onCreateClick, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Estado para armazenar o termo de busca

    // Função para lidar com o clique no botão de consulta
    const handleSearchClick = () => {
        onSearch(searchTerm); // Dispara a pesquisa com o termo armazenado
    };

    const endContent = (
        <React.Fragment>
            <Button style={{ backgroundColor: '#001a40', border: 'none' }} icon="pi pi-plus" iconPos='right' label='Criar' className="rounded" onClick={onCreateClick} />
        </React.Fragment>
    );

    const centerContent = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" style={{ position: 'absolute', left: '10px', top: '70%', transform: 'translateY(-50%)' }} />
                <InputText
                    style={{ width: '300px', paddingLeft: '2.5rem' }} // Ajuste do paddingLeft para deixar espaço para o ícone
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca no estado
                />
            </IconField>
            <Button 
                icon="pi pi-search" 
                label="Consultar" 
                className="p-button-rounded p-button-secondary" 
                onClick={handleSearchClick} // Chama a pesquisa ao clicar no botão
                style={{ marginLeft: '10px',backgroundColor:'#0152a1',borderRadius:'4px' }} // Espaço entre o input e o botão
            />
        </div>
    );

    return (
        <Toolbar start={centerContent} end={endContent} />
    );
};

export default BarraDeFerramentas;

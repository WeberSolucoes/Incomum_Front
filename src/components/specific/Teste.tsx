import React from 'react';
        
// Define a interface para as props do componente Teste
interface TesteProps {
    message: string;
}

// Componente funcional Teste
const Teste: React.FC<TesteProps> = ({ message }) => {
    return (
        <div>
            {message}
        </div>
    );
};

export default Teste;


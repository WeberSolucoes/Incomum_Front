import React, { useEffect, useRef, useState  } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useCodigo } from '../../contexts/CodigoProvider';
import axios from 'axios';

interface ImageUploadProps {
    agenciaId: number | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ agenciaId }) => {
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const toast = useRef<any>(null);

    useEffect(() => {
        if (agenciaId) {
            // Buscar a imagem atual da agência
            axios.get(`http://18.118.35.25:8443/api/incomum/agencia/${agenciaId}/imagem/`)
                .then(response => {
                    const imageData = response.data.image; // Pegando a imagem Base64
                    setCurrentImageUrl(imageData); // Atualizando o estado da imagem
                })
                .catch(() => {
                    toast.current.show({ severity: 'warn', summary: 'Imagem não encontrada', detail: 'Nenhuma imagem atual para esta agência.' });
                });
        }
    }, [agenciaId]);

    const onTemplateUpload = (e: any) => {
        toast.current.show({ severity: 'success', summary: 'Upload realizado', detail: e.files.length + ' arquivo(s) enviado(s)' });
        // Atualizar a imagem após o upload
        if (agenciaId) {
            axios.get(`http://18.118.35.25:8443/api/incomum/agencia/${agenciaId}/imagem/`)
                .then(response => {
                    const imageData = response.data.image;
                    setCurrentImageUrl(imageData); // Atualizando a imagem
                });
        }
    };

    const onTemplateSelect = (e: any) => {
        if (e.files.length > 1) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Você pode selecionar apenas uma imagem.' });
            return;
        }
        toast.current.show({ severity: 'info', summary: 'Arquivo selecionado', detail: e.files[0].name });
    };

    const invalidFileSizeMessageSummary = "Tamanho de arquivo inválido";
    const invalidFileSizeMessageDetail = "O arquivo excede o tamanho máximo permitido de 1MB.";

    const onTemplateError = (e: any) => {
        toast.current.show({ severity: 'error', summary: 'Erro no upload', detail: e.files[0].name + ' não foi enviado.' });
    };

    // Criar um "arquivo fictício" para exibir no value do FileUpload
    const fakeFile = currentImageUrl
        ? [
            {
                name: 'Imagem Atual',
                type: 'image/png', // Tipo da imagem
                size: currentImageUrl.length, // Tamanho da imagem base64
                objectURL: `data:image/png;base64,${currentImageUrl}`, // URL Base64 da imagem
            },
        ]
        : [];

    return (
        <div>
            <Toast ref={toast}></Toast>
            {currentImageUrl && (
                <div style={{ marginBottom: '1rem' }}>
                    <h4>Imagem Atual</h4>
                    <img src={`data:image/png;base64,${currentImageUrl}`} alt="Imagem da Agência" style={{ width: '100%', maxWidth: '300px', borderRadius: '10px' }} />
                </div>
            )}
            <FileUpload
                name="age_imagem"
                url={`http://18.118.35.25:8443/api/incomum/agencia/upload/${agenciaId}/`}
                accept="image/*"
                maxFileSize={1000000}
                onUpload={onTemplateUpload}
                onSelect={onTemplateSelect}
                invalidFileSizeMessageSummary={invalidFileSizeMessageSummary}
                invalidFileSizeMessageDetail={invalidFileSizeMessageDetail}
                onError={onTemplateError}
                value={fakeFile} // Passando o arquivo fictício no value
                multiple={false} // Impede o upload de mais de um arquivo
            />
        </div>
    );
};

export default ImageUpload;

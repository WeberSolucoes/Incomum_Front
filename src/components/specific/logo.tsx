import React, { useEffect, useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useCodigo } from '../../contexts/CodigoProvider';


interface ImageUploadProps {
    agenciaId: number | null; // Recebe o ID da agência como prop
}

const ImageUpload: React.FC<ImageUploadProps> = ({ agenciaId }) => {
    const { codigo } = useCodigo(); // Ajuste conforme a origem do código
    const toast = useRef<any>(null);

    const onTemplateUpload = (e: any) => {
        toast.current.show({ severity: 'success', summary: 'Upload realizado', detail: e.files.length + ' arquivo(s) enviado(s)' });
    };

    const onTemplateSelect = (e: any) => {
        if (e.files.length > 1) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Você pode selecionar apenas uma imagem.' });
            return; // Impede o upload se mais de um arquivo for selecionado
        }
        toast.current.show({ severity: 'info', summary: 'Arquivo selecionado', detail: e.files[0].name });
    };



    const invalidFileSizeMessageSummary = "Tamanho de arquivo inválido";
    const invalidFileSizeMessageDetail = "O arquivo excede o tamanho máximo permitido de 1MB.";

    const onTemplateError = (e: any) => {
        toast.current.show({ severity: 'error', summary: 'Erro no upload', detail: e.files[0].name + ' não foi enviado.' });
    };
    
    
    useEffect(() => {
        const interval = setInterval(() => {
            const pendingElements = document.querySelectorAll('.p-fileupload-content .p-fileupload-preview .p-fileupload-preview-status');
            pendingElements.forEach((el) => {
                if (el.textContent === 'Pending') {
                    el.textContent = 'Aguardando';
                }
            });
        }, 1000); // Verifica a cada segundo

        return () => clearInterval(interval);
    }, []);

    // Definindo estilos diretamente
    const chooseOptions = { 
        label: 'Selecionar Arquivos', 
        icon: 'pi pi-fw pi-images', 
        style: { 
            backgroundColor: '#0152a1', /* Cor verde */
            height:'34px',
            paddingTop:'0.3rem',
            border:'none'
        } 
    };

    const uploadOptions = { 
        label: 'Salvar', 
        icon: 'pi pi-upload', 
        style: { 
            backgroundColor: '#0152a1', /* Cor azul */
            height:'34px',
            paddingTop:'0.3rem',
            border:'none'
        } 
    };

    const cancelOptions = { 
        label: 'Cancelar', 
        icon: 'pi pi-times', 
        style: { 
            backgroundColor: '#0152a1', /* Cor vermelha */
            height:'34px',
            paddingTop:'0.3rem',
            border:'none'
        } 
    };

    return (
        <div>
            <Toast ref={toast}></Toast>
            <FileUpload
                name="age_imagem"
                url={`http://18.118.35.25:8443/api/incomum/agencia/upload/${codigo}/`}
                accept="image/*"
                maxFileSize={1000000}
                onUpload={onTemplateUpload}
                onSelect={onTemplateSelect}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
                invalidFileSizeMessageSummary={invalidFileSizeMessageSummary}
                invalidFileSizeMessageDetail={invalidFileSizeMessageDetail}
                onError={onTemplateError}
                multiple={false}
            />
        </div>
    );
};

export default ImageUpload;

import React, { useEffect, useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';


const ImageUpload: React.FC = () => {
    const toast = useRef<any>(null);

    const onTemplateUpload = (e: any) => {
        toast.current.show({ severity: 'success', summary: 'Upload realizado', detail: e.files.length + ' arquivo(s) enviado(s)' });
    };

    const onTemplateSelect = (e: any) => {
        toast.current.show({ severity: 'info', summary: 'Arquivo selecionado', detail: e.files.length + ' arquivo(s) selecionado(s)' });
    };

    const invalidFileSizeMessageSummary = "Tamanho de arquivo inválido";
    const invalidFileSizeMessageDetail = "O arquivo excede o tamanho máximo permitido de 1MB.";
    
    
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
                name="demo[]"
                url="http://127.0.0.1:8000/api/upload/"
                multiple
                accept="image/*"
                maxFileSize={1000000}
                onUpload={onTemplateUpload}
                onSelect={onTemplateSelect}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
                invalidFileSizeMessageSummary={invalidFileSizeMessageSummary}
                invalidFileSizeMessageDetail={invalidFileSizeMessageDetail}
            />
        </div>
    );
};

export default ImageUpload;

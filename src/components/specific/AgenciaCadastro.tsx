import React, { useEffect, useRef, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { AgenciaCreateRequest } from "../../utils/apiObjects";
import { apiDeleteAgencia, apiGetAgenciaById, apiGetArea, apiPostCreateAgencia, apiPostCreateUnidade, apiPutUpdateAgencia } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cnpj } from "cpf-cnpj-validator";
import { Button } from 'primereact/button';

interface AgenciaCadastroProps {
    onCodigoUpdate: (codigo: number) => void; // Define a prop como uma função que recebe um número
}

const Agencia: React.FC<AgenciaCadastroProps> = ({onBackClick,onCodigoUpdate}) => {
  const { codigo } = useCodigo(); // Ajuste conforme a origem do código
  const [request, setRequest] = useState<AgenciaCreateRequest>({} as AgenciaCreateRequest);
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [ibge, setibge] = useState(0);
  const [loading, setLoading] = useState(false);
  const [areacomercial, setAreaComercial] = useState('');
  const [areasComerciais, setAreasComerciais] = useState<{ label: string, value: number }[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [cnpjValido, setCnpjValido] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        if (codigo === null) return;

        try {
            const response = await apiGetAgenciaById(codigo);
            const unidade = response.data;

            // Certifique-se de que unidade contém todas as propriedades esperadas
            if (unidade) {
                setRequest(unidade);

                // Verifica se o campo de endereço está definido
                if (unidade.age_endereco) {
                    const enderecoParts = unidade.age_endereco.split(",");
                    setRua(enderecoParts[0] || ''); // Se não houver, setar string vazia
                    setNumero(enderecoParts[1] || ''); // Se não houver, setar string vazia
                } else {
                    setRua('');
                    setNumero('');
                }

                // Certifique-se de que cid_codigo está correto
                setCidade(unidade.cid_codigo || ''); // Se não houver, setar string vazia
                setSelectedAreas(unidade.areasComerciais || []);
                setChecked(unidade.age_situacao === 1);
                
                // Verifica se a API de cidades responde corretamente
                if (unidade.cid_codigo) {
                    const responseCidade = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${unidade.cid_codigo}`);
                    setCidade(responseCidade.data.nome || ''); // Se não houver, setar string vazia
                }
            } else {
                console.error("Dados da agência não encontrados");
                toastError("Agência não encontrada.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            toastError("Erro ao buscar dados da agência.");
        }
    };
    fetchData();
}, [codigo]);
  useEffect(() => {
    const fetchAreasComerciais = async () => {
        try {
            const response = await apiGetArea();
            const data = response.data.associacoes; // Acesse o array dentro do objeto

            if (Array.isArray(data)) {
                setAreasComerciais(data.map((area: { aco_descricao: string; aco_codigo: number }) => ({
                    label: area.aco_descricao,
                    value: area.aco_codigo
                })));
            } else {
                console.error("Dados inesperados para áreas comerciais:", data);
                toastError("Erro: dados de áreas comerciais em formato inesperado.");
            }
        } catch (error) {
            console.error("Erro ao buscar áreas comerciais:", error);
            toastError("Erro ao buscar áreas comerciais.");
        }
    };
    fetchAreasComerciais();
}, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setRequest(prevState => ({ ...prevState, [id]: value }));

      if (id === 'loj_cnpj') {
        setCnpjValido(cnpj.isValid(value.replace(/\D/g, '')));
      }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { id, value } = e.target;
      setRequest(prevState => ({ ...prevState, [id]: value }));
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '');
      setRequest(prevState => ({ ...prevState, 'cep_codigo': value }));
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '');
      setRequest(prevState => ({ ...prevState, 'loj_cnpj': value }));
  };

  const handleFoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '');
      setRequest(prevState => ({ ...prevState, 'loj_fone': value }));
  };

  const handleMultiSelectChange = (e: { value: number[] }) => {
      setSelectedAreas(e.value);
      setRequest(prevState => ({ ...prevState, areasComerciais: e.value }));
  };

  const handleDeleteClick = () => {
      if (request.age_codigo) {
          confirmDialog({
              message: 'Tem certeza de que deseja excluir este cadastro?',
              header: 'Confirmar Exclusão',
              icon: 'pi pi-exclamation-triangle',
              accept: handleConfirmDelete,
              reject: () => console.log('Exclusão cancelada'),
              acceptLabel: 'Sim, desejo excluir',
              rejectLabel: 'Cancelar',
              className: 'custom-confirm-dialog',
          });
      }
  };

  const handleConfirmDelete = async () => {
      if (request.age_codigo) {
          setLoading(true);
          try {
              await apiDeleteAgencia(request.age_codigo);
              toastSucess('Cadastro excluído com sucesso.');
          } catch (error) {
              console.error('Erro ao excluir o cadastro:', error);
              toastError('Erro ao excluir o cadastro.');
          } finally {
              setLoading(false);
          }
      }
  };
  
  const campoMapeamento: Record<keyof AgenciaCreateRequest, string> = {
    age_numero: 'Número',
    age_contacorrente: 'Conta',
    age_agencia: 'Agência',
    age_cep: 'Cep',
    age_comissao: 'Comissão',
    age_markup: 'Markup',
    age_over: 'Over',
    age_codigoprincipal: "",
    ban_codigo: "",
    age_codigocontabil: "",
    age_codigoimportacao: "Importação",
    age_descricao: "",
    age_endereco: "",
    age_bairro: "",
    cid_codigo: "",
    age_fone: "",
    age_fax: "",
    age_cnpj: "",
    age_situacao: "",
    aco_codigo: "",
    age_observacao: "",
    age_descricaosite: "",
    age_inscricaomunicipal: "",
    age_razaosocial: "",
    age_celular: ""
  };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const camposNumericos: Array<keyof AgenciaCreateRequest> = [
            'age_codigo', 'age_cep', 'age_numero', 'age_codigocontabil',
            'age_codigoimportacao', 'age_comissao', 'age_contacorrente',
            'age_markup', 'age_numero', 'age_over'
        ];
        
        // Validação dos campos numéricos
        for (const campo of camposNumericos) {
            const value = request[campo] as string;
            const isNumber = /^\d*$/.test(value);
            if (value && !isNumber) {
                toastError(`O campo '${campoMapeamento[campo]}' deve conter apenas números.`);
                return;
            }
        }
        
        const cnpjNumerico = request.age_cnpj?.replace(/\D/g, '') || '';
        
        setLoading(true);
        try {
            const enderecoCompleto = `${rua}, ${numero}`;
            
            // Garante que age_descricao sempre seja enviado
            const updatedRequest = {
                ...request,
                age_endereco: enderecoCompleto,
                age_situacao: checked ? 1 : 0,
                cid_codigo: ibge,
                aco_codigo: areacomercial,
                age_descricao: request.age_descricao || "abc" // Envia age_descricao mesmo se estiver vazio
            };
            
            console.log("Dados enviados para atualização:", updatedRequest);
            console.log("Valor de age_descricao:", updatedRequest.age_descricao);
            
            let response;
            if (request.age_codigo) {
                response = await apiPutUpdateAgencia(request.age_codigo, updatedRequest);
                console.log("Valor de age_descricao:", updatedRequest.age_descricao);
            } else {
                response = await apiPostCreateAgencia(updatedRequest);
            }
            
            console.log("Resposta da API:", response.data);
            
            if (response && (response.status === 200 || response.status === 201)) {
                toastSucess("Agência salva com sucesso");
                
                if (!updatedRequest.age_codigo) {
                    const novoCodigo = response.data.age_codigo;
                    onCodigoUpdate(novoCodigo);
                    
                    setRequest(prevState => ({
                        ...prevState,
                        age_codigo: novoCodigo
                    }));
                }
            } else {
                toastError("Erro ao salvar a agência");
            }
        } catch (error: any) {
            console.error("Erro:", error);
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                if (status === 400) {
                    toastError("Dados inválidos. Verifique os campos e tente novamente.");
                } else if (status === 401) {
                    toastError("Não autorizado. Verifique suas credenciais.");
                } else if (status === 500) {
                    toastError("Erro interno do servidor. Tente novamente mais tarde.");
                } else {
                    toastError(`Erro desconhecido: ${data.detail || "Verifique os campos e tente novamente"}`);
                }
            } else {
                toastError("Erro de conexão. Verifique sua rede e tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

  const handleReset = (e: React.FormEvent) => {
      e.preventDefault();
      setRequest({} as AgenciaCreateRequest);
      setSelectedAreas([]);
      setRua('');
      setNumero('');
      setCidade('');
      setChecked(false);
  };

  const handleCepApi = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace('-', '');
    if (cep.length === 8) {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const data = response.data;
            setRua(data.logradouro || '');
            setCidade(data.localidade || '');
            setibge(data.ibge || '');
            setRequest(prevState => ({
                ...prevState,
                age_bairro: data.bairro || '',
                age_endereco: data.logradouro || '',
                cid_codigo: data.localidade || '',
                age_cep: prevState.age_cep // Garante que o valor do campo `age_cep` não seja alterado
            }));
        } catch (error) {
            console.error("Erro ao buscar dados do CEP:", error);
            toastError("Erro ao buscar dados do CEP.");
        }
    }
  };
  return (
    <form className="erp-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age_codigo">Codigo</label>
          <input disabled type="text" id="age_codigo" name="age_codigo" value={request.age_codigo || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label style={{marginLeft:'-78px'}} htmlFor="age_codigoimportacao">Importação</label>
          <input style={{marginLeft:'-80px'}} type="text" id="age_codigoimportacao" name="age_codigoimportacao" value={request.age_codigoimportacao || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label style={{marginLeft:'-158px'}} htmlFor="age_codigocontabil">Contabil</label>
          <input style={{marginLeft:'-160px'}} type="text" id="age_codigocontabil" name="age_codigocontabil" value={request.age_codigocontabil || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label style={{marginLeft:'-238px'}} htmlFor="age_situacao">Situação</label>
          <select style={{marginLeft:'-240px', width:'105%'}} id="age_situacao" name="age_situacao" value={request.age_situacao || ''} onChange={handleSelectChange}>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age_descricao">Agencia Viagem</label>
          <input style={{ width: '679px' }} type="text" id="age_descricao" name="age_descricao" value={request.age_descricao || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="age_cnpj">Cnpj</label>
          <input style={{ width: '220px' }} type="text" id="age_cnpj" name="age_cnpj" value={request.age_cnpj || ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age_descricaosite">Agencia Site</label>
          <input style={{ width: '679px' }} type="text" id="age_descricaosite" name="age_descricaosite" value={request.age_descricaosite || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="age_inscricaomunicipal">Inscrição Municipal</label>
          <input style={{ width: '220px' }} type="text" id="age_inscricaomunicipal" name="age_inscricaomunicipal" value={request.age_inscricaomunicipal || ''}  onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="age_razaosocial">Razão Social</label>
          <input type="text" id="age_razaosocial" name="age_razaosocial" value={request.age_razaosocial || ''} onChange={handleInputChange} />
        </div>
      </div>

      

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age_cep">Cep</label>
          <input style={{ width: '80%' }} type="text" id="age_cep" name="age_cep" value={request.age_cep || ''} onChange={(e) => setRequest(prevState => ({ ...prevState, age_cep: e.target.value }))} onBlur={handleCepApi} />
        </div>
        <div className="form-group">
          <label style={{marginLeft:'-58px' }} htmlFor="age_rua">Rua</label>
          <input style={{ width: '190%',marginLeft:'-60px' }} type="text" id="age_rua" name="age_rua" value={request.age_endereco || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label style={{ marginLeft:'210px' }} htmlFor="age_numero">Numero</label>
          <input style={{ width: '30%',marginLeft:'208px' }} type="text" id="age_numero" name="age_numero" value={request.age_numero || ''} onChange={handleInputChange} />
        </div>

      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age_bairro">Bairro</label>
          <input type="text" id="age_bairro" name="age_bairro" value={request.age_bairro || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="age_cidade">Cidade</label>
          <input type="text" id="cid_codigo" name="cid_codigo" value={cidade || ''} onChange={handleInputChange} />
        </div>
      </div>


      <div className="form-row my-custom-row"> {/* Adiciona uma classe ao contêiner */}
        <div className="form-group">
            <label htmlFor="age_fone">Fone</label>
            <input type="text" id="age_fone" name="age_fone" value={request.age_fone || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
            <label htmlFor="age_celular">Celular</label>
            <input type="text" id="age_celular" name="age_celular" value={request.age_celular || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
            <label htmlFor="age_comissao">Comissão</label>
            <input type="text" id="age_comissao" name="age_comissao" value={request.age_comissao || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
            <label htmlFor="age_over">Over</label>
            <input type="text" id="age_over" name="age_over" value={request.age_over || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
            <label htmlFor="age_markup">Markup</label>
            <input style={{ width: '178px' }} type="text" id="age_markup" name="age_markup" value={request.age_markup || ''} onChange={handleInputChange} />
        </div>
    </div>


      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age_banco">Banco</label>
          <select id="age_banco" name="age_banco" value={request.ban_codigo || ''} onChange={handleSelectChange}>
            <option value="Caixa">Caixa</option>
            <option value="Bradesco">Bradesco</option>
            <option value="Santander">Santander</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="age_agencia">Agencia</label>
          <input type="text" id="age_agencia" name="age_agencia" value={request.age_agencia || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="age_conta">Conta</label>
          <input type="text" id="age_conta" name="age_conta" value={request.age_contacorrente|| ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="aco_codigo">Area Comercial</label>
            <select
              id="aco_codigo"
              name="aco_codigo"
              value={request.aco_codigo || ''}
              onChange={handleSelectChange}
            >
              <option value="">Selecione uma área comercial</option>
              {areasComerciais.map((area) => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
        </div>
        <div className="form-group">
          <label htmlFor="age_codigoprincipal">Codigo Principal</label>
          <input type="text" id="age_codigoprincipal" name="age_codigoprincipal" value={request.age_codigoprincipal || ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="age_observacao">Observação</label>
          <input id="age_observacao" name="age_observacao" value={request.age_observacao || ''} onChange={handleInputChange}/>
        </div>
      </div>

      <div className="form-row">
           <Button
                label="Voltar"
                icon="pi pi-arrow-left"
                style={{backgroundColor: '#0152a1',width:'100px',height:'34px',marginLeft:'580px',borderRadius:'4px' }}
                onClick={onBackClick} // Chama a função passada como prop
            />
          {/* Condição para renderizar o botão de exclusão */}
          {request.age_codigo && (
          <Button
            label="Excluir"
            icon="pi pi-trash"
            style={{marginLeft:'0px',color:'white',width:'100px'}}
            type="button"
            className="reset-btn"
            onClick={handleDeleteClick}
          />
        )}
        
        <button
            style={{color:'white',backgroundColor:'#0152a1',marginLeft: request.age_codigo ? '0px' : '0px',display: request.age_codigo ? 'none' :''}}
            type="button"
            className="reset-btn"
            onClick={handleReset}
        >
            <i className="fas fa-trash-alt"></i> Limpar
        </button>
        <button style={{width:'100px',height:'34px',padding:'inherit'}} disabled={loading} type="submit" className="submit-btn"><i style={{marginRight:'10px'}}className="fas fa-save"></i>{loading ? 'Salvando...' : 'Salvar'}</button>
        <ConfirmDialog/>
      </div>
    </form>
  );
};

export default Agencia;

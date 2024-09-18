import React, { useEffect, useRef, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";
import { toast } from "react-toastify";
import { toastError, toastSucess } from "../../utils/customToast";
import { useCodigo } from "../../contexts/CodigoProvider";
import { AgenciaCreateRequest } from "../../utils/apiObjects";
import { apiDeleteAgencia, apiGetAgenciaById, apiGetAreas, apiPostCreateAgencia, apiPostCreateUnidade, apiPutUpdateAgencia } from "../../services/Api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { cnpj } from "cpf-cnpj-validator";



const Agencia: React.FC = () => {
  const { codigo } = useCodigo(); // Ajuste conforme a origem do código
  const [request, setRequest] = useState<AgenciaCreateRequest>({} as AgenciaCreateRequest);
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [loading, setLoading] = useState(false);
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
              setRequest(unidade);

              if (unidade.age_endereco) {
                  const enderecoParts = unidade.age_endereco.split(",");
                  setRua(enderecoParts[0] || '');
                  setNumero(enderecoParts[1] || '');
              } else {
                  setRua('');
                  setNumero('');
              }

              setCidade(unidade.cid_codigo || '');
              setSelectedAreas(unidade.areasComerciais || []);
              setChecked(unidade.age_situacao === 1);

              const responseCidade = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${unidade.cid_codigo}`);
              setCidade(responseCidade.data.nome || '');
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
              const response = await apiGetAreas();
              const data = response.data;
              setAreasComerciais(data.map((area: { aco_descricao: string; aco_codigo: number }) => ({
                  label: area.aco_descricao,
                  value: area.aco_codigo
              })));
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
              acceptLabel: 'Confirmar',
              rejectLabel: 'Cancelar',
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

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const cnpjNumerico = request.age_cnpj?.replace(/\D/g, '') || ''; // Garante que será uma string

      if (!cnpj.isValid(cnpjNumerico)) {
          toastError("CNPJ inválido.");
          setCnpjValido(false);
          return;
      }
      setLoading(true);
      try {
          const enderecoCompleto = `${rua}, ${numero}`;
          request.age_endereco = enderecoCompleto;
          request.aco_codigo = selectedAreas;
          request.age_situacao = checked ? 1 : 0;

          let response;
          if (request.age_codigo) {
              response = await apiPutUpdateAgencia(request.age_codigo);
          } else {
              response = await apiPostCreateAgencia();
          }

          if (response.status === 200 || response.status === 201) {
              toastSucess("Agência salva com sucesso");
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
          <label htmlFor="age_codigoimportacao">Importação</label>
          <input type="text" id="age_codigoimportacao" name="age_codigoimportacao" value={request.age_codigoimportacao || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="age_codigocontabil">Contabil</label>
          <input type="text" id="age_codigocontabil" name="age_codigocontabil" value={request.age_codigocontabil || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="age_situacao">Situação</label>
          <select id="age_situacao" name="age_situacao" value={request.age_situacao || ''} onChange={handleSelectChange}>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age_descricao">Agencia Viagem</label>
          <input style={{ width: '678px' }} type="text" id="age_descricao" name="age_descricao" value={request.age_descricao || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="age_cnpj">Cnpj</label>
          <input style={{ width: '218px' }} type="text" id="age_cnpj" name="age_cnpj" value={request.age_cnpj || ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age_descricaosite">Agencia Site</label>
          <input style={{ width: '678px' }} type="text" id="age_descricaosite" name="age_descricaosite" value={request.age_descricaosite || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="age_inscricaomunicipal">Inscrição Municipal</label>
          <input style={{ width: '218px' }} type="text" id="age_inscricaomunicipal" name="age_inscricaomunicipal" value={request.age_inscricaomunicipal || ''}  onChange={handleInputChange} />
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
          <input type="text" id="age_cep" name="age_cep" value={request.age_cep || ''} onChange={(e) => setRequest(prevState => ({ ...prevState, age_cep: e.target.value }))} onBlur={handleCepApi} />
        </div>
        <div className="form-group">
          <label htmlFor="age_cidade">Cidade</label>
          <input type="text" id="age_cidade" name="age_cidade" value={request.cid_codigo || ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age_bairro">Bairro</label>
          <input type="text" id="age_bairro" name="age_bairro" value={request.age_bairro || ''} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="age_numero">Numero</label>
          <input type="text" id="age_numero" name="age_numero" value={request.age_numero || ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="age_endereco">Endereço</label>
          <input type="text" id="age_endereco" name="age_endereco" value={request.age_endereco || ''} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-row">
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
          <input type="text" id="age_markup" name="age_markup" value={request.age_markup || ''} onChange={handleInputChange} />
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
          {/* Condição para renderizar o botão de exclusão */}
          {request.age_codigo && (
          <button
            type="button"
            className="reset-btn"
            onClick={handleDeleteClick}
            disabled={loading}
          >
            <i className="fas fa-trash-alt"></i>{loading ? "Excluindo..." : "Excluir Agência"}
          </button>
          )}
        <button type="submit" className="submit-btn">Enviar</button>
        <button
          type="button"
          className="reset-btn"
          onClick={handleReset}
        >
          <i className="fas fa-trash-alt"></i> Limpar
        </button>
        <ConfirmDialog/>
      </div>
    </form>
  );
};

export default Agencia;



// utils/MenuEnum.ts
import * as icons from '@coreui/icons';
import axios from 'axios';
import { useEffect, useState } from 'react';

export enum MenuEnum {
    cadastro_agencias = 'Agência',
    cadastro_unidades = 'Unidade',
    cadastro_vendedores = 'Vendedor',
    cadastro_departamento = 'Departamento',
    cadastro_assinatura = 'Assinatura',
    cadastro_classe = 'Classe',
    cadastro_steps = 'cadastro_steps',
    cadastro_acomodacao = 'Acomodação',
    cadastro_formapagamento = 'Forma Pagamento',
    cadastro_despesas = 'Despesas',
    cadastro_despesasgeral = 'Despesas Geral',
    cadastro_subgrupo = 'SubGrupo',
    cadastro_centrocusto = 'Centro Custo',
    cadastro_protocolo = 'Protocolo',
    cadastro_bandeira = 'Bandeira',
    cadastro_situacaoturistico = "Situação Turistico",
    cadastro_servicoturistico = "Serviço Turistico",
    cadastro_fornecedores = 'Fornecedores',
    cadastro_regime = 'Regime',
    cadastro_padrao = 'Padrão',
    cadastro_paises = 'Países',
    cadastro_companhia = 'Companhia',
    cadastro_cidade = 'Cidade',
    cadastro_cep = 'Cep',
    cadastro_moeda = 'Moeda',
    cadastro_aeroporto = 'Aeroporto',
    cadastro_fatura = 'Gerar Fatura',
    cadastro_banco = 'Banco',
    lancamento_opcao = 'lancamento_opcao',
    financeiro_opcao = 'financeiro_opcao',
    gerencial_faturamento_unidades = 'Faturamento Unidades',
    gerencial_faturamento_comercial = 'gerencial_faturamento_comercial',
    gerencial_faturamento_vendedor = 'gerencial_faturamento_vendedor',
    relatorios_simplicados_vendas = 'Simplificado Vendas',
    relatorio_protocolo = 'Relatorio Protocolo',
    usuario = 'usuario',
    logout = 'logout',
    perfil = "perfil",
    default = '',
}

export interface MenuItem {
    label: string;
    icon?: keyof typeof icons;
    requiredPermissions?: string[];
    command?: () => void;
    items?: MenuItem[];
    key?: MenuEnum;
}

export const menuItems: (onMenuItemClick: (itemKey: MenuEnum) => void) => MenuItem[] = (onMenuItemClick) => {
    const [usuarioComercial, setUsuarioComercial] = useState(false);
    const [userId, setUserId] = useState(null);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    useEffect(() => {
        if (token) {
            axios.get('http://api.incoback.com.br/api/incomum/usuario/get-id/', {
                headers: {
                    Authorization: `Bearer ${token}`  // Passando o token no cabeçalho Authorization
                }
            })
            .then(response => {
                setUserId(response.data.user_id);  // Atualiza o estado com o ID do usuário
            })
            .catch(error => {
                console.error('Erro ao obter o ID do usuário:', error);
            });
        } else {
            console.error('Token não encontrado');
        }
    }, [token]);


    // Verifica a permissão ao carregar o componente
    useEffect(() => {
        if (token) {
            axios.get('https://api.incoback.com.br/api/incomum/usuario/permission/', {
                headers: {
                    Authorization: `Bearer ${token}`  // Passando o token no cabeçalho Authorization
                }
            }) 
            .then(response => {
                setUsuarioComercial(response.data.usuario_comercial);   // Atualiza o estado com a permissão recebida
            })
            .catch(error => {
                console.error('Erro ao verificar permissões:', error);
            });
        } else {
            console.error('Token não encontrado');
        }
    }, [token]);

    // Exibe os itens do menu dependendo da permissão
    return [
        {
        label: 'Cadastro',
        icon: 'cilPenAlt', // Ajuste o nome do ícone conforme sua escolha
        requiredPermissions: ['Can view area comercial'],
        items: !usuarioComercial ? [
            {
                label: "Aeroporto",
                icon: "cilFlightTakeoff",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_aeroporto);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Agências",
                icon: "cilBriefcase",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_agencias);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Assinatura",
                icon: "cilPen",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_assinatura);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Bandeira",
                icon: "cilFlagAlt", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_bandeira);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Cep",
                icon: "cilEnvelopeLetter",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_cep);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Cidades",
                icon: "cilHouse",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_cidade);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Classe",
                icon: "cilSchool",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_classe);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Companhia",
                icon: "cilWc",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_companhia);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Departamento",
                icon: "cilIndustry",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_departamento);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Fornecedores",
                icon: "cilGroup", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_fornecedores);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Moeda",
                icon: "cilDollar",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_moeda);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Países",
                icon: "cilGlobeAlt",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_paises);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Situação Turistico",
                icon: "cilClipboard", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_situacaoturistico);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Serviço Turistico",
                icon: "cilCarAlt", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_servicoturistico);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Tipo Acomodação",
                icon: "cilSofa",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_acomodacao);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Tipo Padrão",
                icon: "cilShortText",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_padrao);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Tipo Regime",
                icon: "cilFastfood",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_regime);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Unidades",
                icon: "cilBuilding",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_unidades);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Vendedores",
                icon: "cilUser",
                requiredPermissions: ["Can view area comercial"],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_vendedores);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
        ] : []
    },
    {
        label: 'Lançamentos',
        icon: 'cilCalendar', // Ajuste o nome do ícone conforme sua escolha
        requiredPermissions: ['Can view area comercial'],
        items: !usuarioComercial ? [
            {
                label: 'Opção',
                icon: 'cilPencil', // Ajuste o nome do ícone conforme sua escolha
                command: () => { onMenuItemClick(MenuEnum.lancamento_opcao); }
            },
        ] : []
    },
    {
        label: 'Financeiro',
        icon: 'cilWallet', // Ajuste o nome do ícone conforme sua escolha
        requiredPermissions: ['Can view area comercial'],
        items: !usuarioComercial ? [
            {
                label: "Banco",
                icon: "cilCash", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_banco);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Forma De Pagamento",
                icon: "cilCash", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_formapagamento);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Despesas",
                icon: "cilTag", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_despesas);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Despesas Geral",
                icon: "cilTags", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_despesasgeral);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "SubGrupo",
                icon: "cilListNumbered", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_subgrupo);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Centro De Custo",
                icon: "cilEuro", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_centrocusto);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Protocolo",
                icon: "cilEuro", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_protocolo);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
            {
                label: "Gerar Fatura",
                icon: "cilCreditCard", // Ajuste o nome do ícone conforme sua escolha
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_fatura);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            },
        ] : []
    },
    {
        label: 'Gerencial',
        icon: 'cilCalendar', // Ajuste o nome do ícone conforme sua escolha
        requiredPermissions: ['Can view area comercial'],
        items: !usuarioComercial ? [
            {
                label: 'Faturamento Unidade',
                icon: 'cilPencil', // Ajuste o nome do ícone conforme sua escolha
                command: () => { onMenuItemClick(MenuEnum.gerencial_faturamento_unidades); }
            },
        ] : []
    },
    {
        label: 'Relatórios',
        icon: 'cilBook', // Ajuste o nome do ícone conforme sua escolha
        items: [
            {
                label: 'Simplificado de vendas',
                icon: 'cilClipboard', // Ajuste o nome do ícone conforme sua escolha
                command: () => { onMenuItemClick(MenuEnum.relatorios_simplicados_vendas); }
            },
            ...([64, 8, 1, 55, 62, 56].includes(userId) ? [
                {
                    label: 'Relatorio Protocolo',
                    icon: 'cilClipboard',
                    command: () => { onMenuItemClick(MenuEnum.relatorio_protocolo); }
                }
            ] : [])
        ]
    },
];
}
        

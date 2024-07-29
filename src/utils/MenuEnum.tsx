export enum MenuEnum {
    cadastro_agencias = 'cadastro_agencias',
    cadastro_unidades = 'cadastro_unidades',
    cadastro_vendedores = 'cadastro_vendedores',
    lancamento_opcao = 'lancamento_opcao',
    financeiro_opcao = 'financeiro_opcao',
    gerencial_faturamento_unidades = 'gerencial_faturamento_unidades',
    gerencial_faturamento_comercial = 'gerencial_faturamento_comercial',
    gerencial_faturamento_vendedor = 'gerencial_faturamento_vendedor',
    relatorios_simplicados_vendas = 'relatorios_simplicados_vendas',
    usuario = 'usuario',
    logout = 'logout',
    perfil = "perfil",
    default = '',
}
export interface MenuItem {
    label: string;
    icon?: string;
    requiredPermissions?: string[];
    command?: () => void;
    items?: MenuItem[];
}
export const menuItems: (onMenuItemClick: (itemKey: MenuEnum) => void) => MenuItem[] = (onMenuItemClick) => [
    //INICIO
    {
        label: 'Inicio',
        icon: 'pi pi-fw pi-home',
        command: () => { onMenuItemClick(MenuEnum.default); }

    },
    //CADASTRO
    {
        label: 'Cadastro',
        icon: 'pi pi-fw pi-home',
        requiredPermissions: ['Can vieaw area comercial'],
        items: [
            //UNIDADES
            {
                label: "Unidades",
                icon: "pi pi-fw pi-home",
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_unidades);
                }

            },
            //AGÊNCIAS
            {
                label: "Agências",
                icon: "pi pi-fw pi-home",
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_agencias);
                }

            },
            //VENDEDORES
            {
                label: "Vendedores",
                icon: "pi pi-fw pi-home",
                requiredPermissions: ['Can view area comercial'],
                command: () => {
                    onMenuItemClick(MenuEnum.cadastro_vendedores);
                }
            }
        ]

    },
    //LANÇAMENTOS
    {
        label: 'Lançamentos',
        icon: 'pi pi-fw pi-calendar',
        requiredPermissions: ['Can view araea comercial'],
        items: [
            {
                label: 'Opção',
                icon: 'pi pi-fw pi-pencil',
                command: () => { onMenuItemClick(MenuEnum.lancamento_opcao); }
            },
        ]
    },
    //FINANCEIRO
    {
        label: 'Financeiro',
        icon: 'pi pi-fw pi-calendar',
        requiredPermissions: ['Can view areaa comercial'],
        items: [
            {
                label: 'Opção',
                icon: 'pi pi-fw pi-pencil',
                command: () => { onMenuItemClick(MenuEnum.financeiro_opcao); }
            },
        ]
    },
    //GERENCIAL
    {
        label: 'Gerencial',
        icon: 'pi pi-fw pi-calendar',
        requiredPermissions: ['Can view araea comercial'],
        items: [
            //FATURAMENTO UNIDADE
            {
                label: 'Faturamento Unidade',
                icon: 'pi pi-fw pi-pencil',
                command: () => { onMenuItemClick(MenuEnum.gerencial_faturamento_unidades); }
            },
            //FATURAMENTO COMERCIAL
            {
                label: 'Faturamento Comercial',
                icon: 'pi pi-fw pi-pencil',
                command: () => { onMenuItemClick(MenuEnum.gerencial_faturamento_comercial); }
            },
            //FATURAMENTO VENDEDOR
            {
                label: 'Faturamento Vendedor',
                icon: 'pi pi-fw pi-pencil',
                command: () => { onMenuItemClick(MenuEnum.gerencial_faturamento_vendedor); }
            }
        ]
    },
    //RELATÓRIOS
    {
        label: 'Relatórios',
        icon: 'pi pi-fw pi-calendar',
        items: [
            {

                label: 'Simplificado de vendas',
                icon: 'pi pi-fw pi-pencil',
                command: () => { onMenuItemClick(MenuEnum.relatorios_simplicados_vendas); }
            },
        ]
    },
    //USUARIO
    {
        label: 'Configurações',
        icon: 'pi pi-fw pi-cog',
        items: [
            {
                label: 'Perfil',
                icon: 'pi pi-fw pi-user',
                requiredPermissions: ['Can view araea comercial'],
                command: () => { onMenuItemClick(MenuEnum.perfil); }
            },
            {
                label: 'Sair',
                icon: 'pi pi-fw pi-sign-out',
                command: () => { onMenuItemClick(MenuEnum.logout); }
                
            }
        ]
    }
];

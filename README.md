# HomeHive - Gerenciador de Tarefas Domésticas

Um aplicativo de gerenciamento de tarefas domésticas desenvolvido com React Native e TypeScript, permitindo que famílias organizem e compartilhem responsabilidades do lar.

## 📱 Sobre o Projeto

HomeHive é um aplicativo móvel projetado para facilitar o gerenciamento de tarefas domésticas, oferecendo uma interface intuitiva e agradável com suporte a temas claro e escuro. O aplicativo permite que usuários criem, editem e acompanhem suas tarefas diárias de forma eficiente.

## ✨ Funcionalidades

### Sistema de Autenticação
- **Login**: Tela funcional com validação de campos (email e senha)
- **Cadastro**: Tela funcional com validação completa (nome, email, senha)
- **Logout**: Botão implementado no cabeçalho da tela principal
- **Persistência**: Dados do usuário armazenados com Supabase Auth

### Gerenciamento de Tarefas
- **Listagem de Tarefas**: Tela principal com lista de tarefas
- **Filtros**: Pesquisa por texto e filtro por categoria
- **Detalhes da Tarefa**: Tela para visualizar detalhes de uma tarefa
- **Criação/Edição**: Formulário para criar e editar tarefas
- **Categorias**: Sistema de categorias pré-definidas e personalizáveis

### Interface do Usuário
- **Temas**: Suporte a tema claro e escuro com alternância
- **Identidade Visual**: Cores roxas (#673AB7, #B497D0) consistentes em toda a aplicação
- **Componentes Reutilizáveis**: CustomInput, TaskCard, CategoryPicker, etc.
- **Design Responsivo**: Layout adaptável a diferentes tamanhos de tela

### Banco de Dados
- **Supabase**: Integração completa com Supabase para autenticação e armazenamento
- **Sincronização**: Dados sincronizados entre dispositivos
- **Segurança**: Políticas de segurança (RLS) implementadas para proteger dados dos usuários

## 🛠️ Tecnologias Utilizadas

- **Framework**: React Native com TypeScript
- **Gerenciamento de Estado**: Context API (AuthContext, ThemeContext, AlertContext)
- **Navegação**: React Navigation (Stack Navigator)
- **Backend**: Supabase (Autenticação, Banco de Dados PostgreSQL)
- **Armazenamento Local**: AsyncStorage para cache e configurações
- **Estilo**: Sistema de temas personalizado com suporte a tema claro e escuro
- **Expo**: Utilizado para desenvolvimento e build do aplicativo

## 🔧 Configuração do Projeto

### Pré-requisitos
- Node.js (v14 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Supabase

### Instalação
1. Clone o repositório
2. Instale as dependências: `npm install` ou `yarn install`
3. Configure o Supabase seguindo as instruções em `SUPABASE_SETUP.md`
4. Inicie o projeto: `npm start` ou `yarn start`

## 🎨 Identidade Visual

- **Nome**: HomeHive
- **Logo**: Casa roxa em fundo roxo claro (#B497D0)
- **Paleta de Cores**: Tons de roxo (#673AB7, #B497D0)
- **Temas**: Alternância entre tema claro e escuro com ícones intuitivos (sol/lua)

## 🚀 Próximos Passos

- **Melhorias na UI/UX**: Adicionar animações e transições mais fluidas
- **Compartilhamento de Tarefas**: Funcionalidade para compartilhar tarefas entre usuários
- **Notificações**: Lembretes para tarefas com prazo próximo
- **Testes Automatizados**: Implementar testes unitários e de integração
- **Modo Offline**: Melhorar suporte para uso offline com sincronização posterior

## 📝 Projeto Acadêmico

Este aplicativo foi desenvolvido como parte do projeto final da disciplina de Desenvolvimento de Aplicativo Mobile, utilizando React Native, TypeScript e Supabase como principais tecnologias.
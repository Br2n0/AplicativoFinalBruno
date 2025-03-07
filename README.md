# HomeHive - Gerenciador de Tarefas Domésticas

Um aplicativo de gerenciamento de tarefas domésticas desenvolvido com React Native e TypeScript, permitindo que famílias organizem e compartilhem responsabilidades do lar.

## 📱 Sobre o Projeto

HomeHive é um aplicativo móvel projetado para facilitar o gerenciamento de tarefas domésticas, oferecendo uma interface intuitiva e agradável com suporte a temas claro e escuro. O aplicativo permite que usuários criem, editem e acompanhem suas tarefas diárias de forma eficiente.

## ✨ Funcionalidades

### Sistema de Autenticação
- **Login**: Tela funcional com validação de campos (email e senha)
- **Cadastro**: Tela funcional com validação completa (nome, email, senha)
- **Logout**: Botão implementado no cabeçalho da tela principal
- **Persistência**: Dados do usuário armazenados no AsyncStorage

### Gerenciamento de Tarefas
- **Listagem de Tarefas**: Tela principal com lista de tarefas
- **Filtros**: Pesquisa por texto e filtro por categoria
- **Detalhes da Tarefa**: Tela para visualizar detalhes de uma tarefa
- **Criação/Edição**: Formulário para criar e editar tarefas

### Interface do Usuário
- **Temas**: Suporte a tema claro e escuro com alternância
- **Identidade Visual**: Cores roxas (#673AB7, #B497D0) consistentes em toda a aplicação
- **Componentes Reutilizáveis**: CustomInput, TaskCard, CategoryPicker, etc.
- **Design Responsivo**: Layout adaptável a diferentes tamanhos de tela

## 🛠️ Tecnologias Utilizadas

- **Framework**: React Native com TypeScript
- **Gerenciamento de Estado**: Context API (AuthContext, ThemeContext)
- **Navegação**: React Navigation
- **Armazenamento Local**: AsyncStorage
- **Estilo**: Sistema de temas personalizado com suporte a tema claro e escuro

## 🎨 Identidade Visual

- **Nome**: HomeHive
- **Logo**: Casa roxa em fundo roxo claro (#B497D0)
- **Paleta de Cores**: Tons de roxo (#673AB7, #B497D0)
- **Temas**: Alternância entre tema claro e escuro com ícones intuitivos (sol/lua)

## 🚀 Próximos Passos

- **Melhorias na Persistência de Dados**: Implementar banco de dados local mais robusto
- **Compartilhamento de Tarefas**: Funcionalidade para compartilhar tarefas entre usuários
- **Notificações**: Lembretes para tarefas com prazo próximo
- **Testes Automatizados**: Implementar testes unitários e de integração

## 📝 Projeto Acadêmico

Este aplicativo foi desenvolvido como parte do projeto final da disciplina de Desenvolvimento de Aplicativo Mobile.
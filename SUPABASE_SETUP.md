# Configuração do Supabase para o Aplicativo de Tarefas Domésticas

Este guia explica como configurar o Supabase para ser usado com o aplicativo de Tarefas Domésticas.

## Passo 1: Criar uma conta no Supabase

1. Acesse [supabase.com](https://supabase.com/) e crie uma conta ou faça login
2. Crie um novo projeto, dando um nome e uma senha segura para o banco de dados
3. Escolha a região mais próxima de você para o servidor
4. Aguarde a criação do projeto (pode levar alguns minutos)

## Passo 2: Obter as credenciais do projeto

1. No painel do Supabase, vá para "Configurações do Projeto" (ícone de engrenagem)
2. Na seção "API", você encontrará:
   - URL do projeto
   - Chave anônima (public)
3. Copie essas informações para usar no aplicativo

## Passo 3: Configurar o banco de dados

1. No painel do Supabase, vá para "SQL Editor"
2. Clique em "Novo Query"
3. Cole o conteúdo do arquivo `supabase/schema.sql` deste projeto
4. Execute o script clicando em "Run"

Este script irá:
- Criar as tabelas necessárias (categories, family_members, tasks)
- Configurar as políticas de segurança (RLS - Row Level Security)
- Inserir categorias padrão

## Passo 4: Configurar autenticação

1. No painel do Supabase, vá para "Authentication" > "Providers"
2. Certifique-se de que o provedor "Email" esteja habilitado
3. Você pode configurar outros provedores como Google, Facebook, etc. (opcional)

## Passo 5: Atualizar as variáveis de ambiente no aplicativo

1. Abra o arquivo `src/config/env.ts`
2. Substitua as variáveis pelos valores obtidos no Passo 2:
   ```typescript
   export const SUPABASE_URL = 'sua-url-do-projeto';
   export const SUPABASE_ANON_KEY = 'sua-chave-anônima';
   ```

## Passo 6: Testar a conexão

1. Execute o aplicativo
2. Tente criar uma conta ou fazer login
3. Verifique se os dados estão sendo salvos no Supabase

## Solução de problemas

### Erro de conexão
- Verifique se as credenciais estão corretas
- Certifique-se de que o projeto Supabase está ativo

### Erro de autenticação
- Verifique as configurações de autenticação no painel do Supabase
- Certifique-se de que o provedor de email está habilitado

### Erro ao salvar dados
- Verifique se as tabelas foram criadas corretamente
- Verifique se as políticas de segurança (RLS) estão configuradas corretamente
-- Configuração do esquema do banco de dados para o aplicativo de Tarefas Domésticas

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- Adicionar políticas de segurança para a tabela de categorias
-- Permitir que todos os usuários vejam as categorias padrão (sem user_id) e suas próprias categorias
CREATE POLICY "Categorias visíveis para todos os usuários autenticados" 
    ON public.categories FOR SELECT 
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Permitir que usuários criem suas próprias categorias
CREATE POLICY "Usuários podem criar suas próprias categorias" 
    ON public.categories FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários atualizem suas próprias categorias
CREATE POLICY "Usuários podem atualizar suas próprias categorias" 
    ON public.categories FOR UPDATE 
    USING (auth.uid() = user_id);

-- Permitir que usuários excluam suas próprias categorias
CREATE POLICY "Usuários podem excluir suas próprias categorias" 
    ON public.categories FOR DELETE 
    USING (auth.uid() = user_id);

-- Tabela de membros da família
CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Adicionar políticas de segurança para a tabela de membros da família
-- Permitir que usuários vejam seus próprios membros da família
CREATE POLICY "Usuários podem ver seus próprios membros da família" 
    ON public.family_members FOR SELECT 
    USING (auth.uid() = user_id);

-- Permitir que usuários criem seus próprios membros da família
CREATE POLICY "Usuários podem criar seus próprios membros da família" 
    ON public.family_members FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários atualizem seus próprios membros da família
CREATE POLICY "Usuários podem atualizar seus próprios membros da família" 
    ON public.family_members FOR UPDATE 
    USING (auth.uid() = user_id);

-- Permitir que usuários excluam seus próprios membros da família
CREATE POLICY "Usuários podem excluir seus próprios membros da família" 
    ON public.family_members FOR DELETE 
    USING (auth.uid() = user_id);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id),
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
    assigned_to UUID REFERENCES public.family_members(id),
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Adicionar políticas de segurança para a tabela de tarefas
-- Permitir que usuários vejam suas próprias tarefas
CREATE POLICY "Usuários podem ver suas próprias tarefas" 
    ON public.tasks FOR SELECT 
    USING (auth.uid() = user_id);

-- Permitir que usuários criem suas próprias tarefas
CREATE POLICY "Usuários podem criar suas próprias tarefas" 
    ON public.tasks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários atualizem suas próprias tarefas
CREATE POLICY "Usuários podem atualizar suas próprias tarefas" 
    ON public.tasks FOR UPDATE 
    USING (auth.uid() = user_id);

-- Permitir que usuários excluam suas próprias tarefas
CREATE POLICY "Usuários podem excluir suas próprias tarefas" 
    ON public.tasks FOR DELETE 
    USING (auth.uid() = user_id);

-- Habilitar RLS (Row Level Security) para todas as tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Inserir categorias padrão (visíveis para todos os usuários)
INSERT INTO public.categories (name, icon, user_id) VALUES
('Limpeza', '🧹', NULL),
('Compras', '🛒', NULL),
('Cozinha', '👨‍🍳', NULL),
('Lavanderia', '🧺', NULL),
('Manutenção', '🔧', NULL),
('Jardim', '🌱', NULL),
('Pets', '🐾', NULL),
('Crianças', '👶', NULL),
('Finanças', '💰', NULL),
('Estudos', '📚', NULL),
('Saúde', '💊', NULL),
('Exercícios', '🏋️', NULL),
('Eventos', '🎉', NULL),
('Tecnologia', '💻', NULL),
('Decoração', '🏠', NULL),
('Reciclagem', '♻️', NULL),
('Automóvel', '🚗', NULL),
('Pagamentos', '💳', NULL),
('Outros', '📝', NULL)
ON CONFLICT DO NOTHING;
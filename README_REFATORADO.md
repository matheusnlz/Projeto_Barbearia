# Barbearia Seu Jota - Sistema Refatorado 🚀

Este projeto foi completamente refatorado para oferecer máxima segurança, performance e uma experiência de usuário premium.

## 🛠 Tecnologias Utilizadas
- **Frontend:** React, Vite, TypeScript, Tailwind CSS.
- **UI/UX:** shadcn/ui, Framer Motion, Lucide React.
- **Backend (BaaS):** Supabase (Auth, Database, RLS).
- **Formulários:** React Hook Form + Zod.

## 🔐 Principais Melhorias Implementadas

### 1. Segurança (Prioridade Máxima)
- **Autenticação Real:** Login hardcoded removido. Agora utiliza **Supabase Auth** com e-mail e senha.
- **Proteção de Rotas:** O painel administrativo é protegido por tokens JWT reais do Supabase.
- **RLS (Row Level Security):** Políticas de banco de dados ajustadas. Apenas administradores autenticados podem deletar ou editar serviços, barbeiros e agendamentos.

### 2. Arquitetura Dinâmica
- **Banco de Dados:** Serviços e Barbeiros migrados de arquivos estáticos para tabelas no Supabase.
- **Custom Hooks:** Implementação de `useServices`, `useBarbers` e lógica centralizada para melhor manutenção.
- **Gestão Administrativa:** O administrador agora pode adicionar, editar e excluir serviços e visualizar a agenda por profissional em tempo real.

### 3. Experiência do Usuário (UX)
- **Agendamento Inteligente:** 
  - Validação robusta com Zod.
  - Regra de 2 horas de antecedência para agendamentos no mesmo dia.
  - Bloqueio automático de domingos e segundas.
  - Feedback visual de carregamento (Loading States) em todas as ações.
- **SEO:** Meta tags atualizadas para melhor ranqueamento no Google e compartilhamento em redes sociais.

## 🚀 Como Rodar o Projeto

1. **Clonar o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd seu-jota-master-cuts
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   ```

3. **Configurar Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz com suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
   ```

4. **Banco de Dados:**
   Execute o script SQL localizado em `supabase/migrations/20260404000000_refactor_schema.sql` no Editor SQL do seu painel Supabase para criar as tabelas e políticas.

5. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 🧑‍💼 Acesso Administrativo
Para acessar o painel admin, você deve criar um usuário no **Supabase Auth** (Authentication > Users > Add User) e utilizar essas credenciais na página `/admin`.

---
Desenvolvido com foco em qualidade e escalabilidade. ✂️💈

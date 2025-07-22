# FitTracker Pro

Sistema completo de gerenciamento para Personal Trainers desenvolvido com React, TypeScript e Supabase.

## 🌐 Acesso Online

**🔗 Aplicação disponível em:** https://fitrackerpro.netlify.app/

## 📋 Sobre o Projeto

O FitTracker Pro é uma solução moderna e intuitiva para personal trainers gerenciarem seus alunos, registrarem medições corporais e acompanharem a evolução física através de gráficos detalhados e gerar relatórios em PDF para apresentar a seus alunos.

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação
- **Login e Cadastro** seguro para personal trainers
- **Isolamento de dados** - cada personal acessa apenas seus alunos
- **Sessão persistente** com logout seguro

### 👥 Gerenciamento de Alunos
- **Cadastro completo** de alunos (nome, email, telefone, data de nascimento)
- **Busca e filtros** para encontrar alunos rapidamente
- **Edição e exclusão** de dados dos alunos
- **Visualização em cards** com informações resumidas

### 📏 Controle de Medições Corporais
- **Medições básicas**: peso, altura, percentual de gordura
- **Circunferências detalhadas**: peito, cintura, quadril, braços, coxas, panturrilhas
- **Histórico completo** de todas as medições
- **Notas e observações** para cada medição
- **Edição e exclusão** de medições

### 📊 Gráficos de Evolução
- **Gráficos interativos** para acompanhar progresso
- **Múltiplas métricas**: peso, gordura corporal, circunferências
- **Visualização temporal** da evolução do aluno
- **Estatísticas de resumo** com variações desde a primeira medição

### 📄 Relatórios em PDF
- **Geração automática** de relatórios profissionais
- **Seleção personalizada** de gráficos para incluir
- **Ilustração corporal** com medições marcadas
- **Tabelas detalhadas** com todas as medições
- **Design profissional** pronto para apresentação

### 📱 Interface Responsiva
- **Design moderno** e intuitivo
- **Compatível** com desktop, tablet e mobile
- **Animações suaves** e micro-interações
- **Tema profissional** em azul e cinza

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **Recharts** - Biblioteca para gráficos
- **Date-fns** - Manipulação de datas
- **Vite** - Build tool moderna

### Backend & Banco de Dados
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança a nível de linha
- **Autenticação JWT** - Sistema de autenticação seguro

### Geração de PDF
- **jsPDF** - Geração de PDFs
- **html2canvas** - Captura de elementos HTML

## 🚀 Como Usar

### 1. Acesso ao Sistema
- Acesse https://fitrackerpro.netlify.app/
- Faça seu cadastro como personal trainer
- Ou entre com suas credenciais existentes

### 2. Gerenciar Alunos
- Clique em "Alunos" no menu superior
- Use o botão "Novo Aluno" para cadastrar
- Busque alunos usando a barra de pesquisa
- Clique em "Ver Perfil Completo" para detalhes

### 3. Registrar Medições
- No perfil do aluno, clique em "Nova Medição"
- Preencha peso, altura e percentual de gordura (obrigatórios)
- Adicione circunferências opcionais conforme necessário
- Inclua observações sobre a medição

### 4. Visualizar Evolução
- Na aba "Gráficos de Evolução" do perfil do aluno
- Visualize a progressão em diferentes métricas
- Compare medições ao longo do tempo

### 5. Gerar Relatórios PDF
- No perfil do aluno, selecione o gênero (masculino/feminino)
- Clique no botão "PDF"
- Escolha quais gráficos incluir (se houver múltiplas medições)
- O PDF será gerado e baixado automaticamente

## 🔒 Segurança e Privacidade

- **Dados isolados** por personal trainer
- **Criptografia** de senhas e dados sensíveis
- **Políticas de segurança** a nível de banco de dados
- **Sessões seguras** com tokens JWT
- **Backup automático** via Supabase

## 📊 Estrutura do Banco de Dados

### Tabela `students`
- Informações básicas dos alunos
- Vinculação ao personal trainer (`user_id`)

### Tabela `measurements`
- Todas as medições corporais
- Histórico temporal completo
- Notas e observações

### Políticas RLS
- Usuários só acessam seus próprios dados
- Proteção contra acesso não autorizado

## 🎯 Casos de Uso Ideais

- **Personal Trainers** que querem profissionalizar o atendimento
- **Academias** que oferecem acompanhamento personalizado
- **Nutricionistas** que trabalham com composição corporal
- **Profissionais de saúde** que monitoram evolução física

## 📈 Benefícios

- ✅ **Organização profissional** de dados dos alunos
- ✅ **Acompanhamento visual** da evolução
- ✅ **Relatórios profissionais** para apresentar resultados
- ✅ **Acesso em qualquer lugar** via web
- ✅ **Segurança total** dos dados
- ✅ **Interface intuitiva** e fácil de usar

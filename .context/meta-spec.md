## TaskFlow Experimental App — Especificação Metodológica do Experimento

### 1. Nome do experimento

**TaskFlow Experimental App: comparação estrutural entre aplicações front-end equivalentes desenvolvidas em React e Angular.**

### 2. Objetivo científico

**Objetivo geral**: analisar, de forma controlada, diferenças estruturais, arquiteturais e de desempenho entre duas implementações funcionalmente idênticas de um mini sistema de gerenciamento de tarefas: uma em React e outra em Angular.

**Objetivos específicos**:
- Comparar o impacto de cada framework em métricas de performance (Web Vitals, tempo de carregamento, consumo de CPU/memória).
- Avaliar diferenças na estabilidade visual e na responsividade da interface durante interações típicas de CRUD.
- Investigar a percepção subjetiva de usabilidade e experiência do usuário por meio de SUS (System Usability Scale) e UEQ (User Experience Questionnaire).
- Mapear diferenças arquiteturais internas (gestão de estado, composição de componentes, navegação, organização de serviços) mantendo constante o comportamento funcional e visual.

### 3. Variável independente

- **Framework front-end utilizado**:
  - Implementação A: React 18+ (Vite, React Router, Context API, hooks).
  - Implementação B: Angular (versão estável atual, Angular Router, services, módulos, signals).

Trata-se da **única variável independente intencionalmente manipulada**; as demais dimensões (fluxo de usuário, layout, CSS, funcionalidades e dados simulados) são controladas para permanecerem equivalentes.

### 4. Variáveis dependentes

- **Métricas objetivas de performance**:
  - Web Vitals (LCP, FID/INP, CLS) medidos com ferramentas como Lighthouse/Chrome DevTools.
  - **Tempo de carregamento inicial** (Time to Interactive, First Contentful Paint).
  - **Consumo de CPU** durante o fluxo experimental definido.
  - **Uso de memória** no navegador durante a execução do fluxo.
  - **Tamanho dos bundles** gerados (JS/CSS) e número de requisições.

- **Métricas de estabilidade visual e responsividade**:
  - Variação de layout observada (CLS e inspeção visual durante operações de CRUD e abertura de modal).
  - Fluidez de animações e transições (avaliação subjetiva + eventuais medições de FPS/tools de timeline).

- **Métricas subjetivas de usabilidade e UX**:
  - **SUS (System Usability Scale)** — escore global de usabilidade percebida.
  - **UEQ (User Experience Questionnaire)** — dimensões como atratividade, eficiência, dependabilidade, estimulação e novidade.
  - Comentários qualitativos registrados após o uso de cada versão.

### 5. Justificativa metodológica

- A literatura em engenharia de software e HCI mostra que comparações entre frameworks tendem a ser enviesadas quando designs, fluxos e bibliotecas visuais diferem entre as implementações.
- Ao **fixar o mesmo domínio funcional (gerenciamento de tarefas)** e o mesmo fluxo experimental, maximiza-se a comparabilidade dos resultados.
- A escolha de **um sistema moderadamente interativo** (login simulado, dashboard com métricas em tempo real, CRUD de tarefas, filtros, busca e modal customizado) permite observar tanto:
  - comportamento em **carregamento inicial**, quanto
  - comportamento em **interações contínuas** (estado, re-renderizações, atualizações parciais da UI).
- A ausência de backend real, substituído por dados mockados em memória, isola o efeito do **framework front-end** de variáveis externas como latência de rede ou desempenho de servidor.

### 6. Estratégia de controle experimental

- **Equivalência funcional**:
  - Ambos os sistemas implementam exatamente o mesmo fluxo: login simulado → dashboard → tarefas → criação/edição/conclusão/remoção → filtros e busca em tempo real.
  - A estrutura de dados das tarefas é idêntica (`id`, `title`, `description`, `status`, `createdAt`).
- **Equivalência visual**:
  - O CSS global é **idêntico** entre os projetos (mesmo arquivo base replicado entre React e Angular).
  - Hierarquia de títulos, espaçamentos, tamanhos de fonte, cores e estados visuais seguem as mesmas classes (`.app-shell`, `.app-header`, `.card`, `.tasks-list`, etc.).
  - O layout do cabeçalho, navegação e conteúdo principal é reimplementado em Angular seguindo a mesma estrutura de marcação definida em React.
- **Equivalência de fluxo e interações**:
  - A navegação usa rotas equivalentes (`/login`, `/dashboard`, `/tasks`) e o mesmo comportamento de proteção de rota (auth fake).
  - O fluxo de interação exigido para o experimento é igual nos dois sistemas (vide seção 9).
- **Isolamento de bibliotecas externas**:
  - Não são utilizadas bibliotecas de UI (Bootstrap, Material, MUI, PrimeNG, etc.).
  - Não há uso de state managers externos (Redux, NgRx, Zustand). A gestão de estado é feita com as primitivas nativas de cada framework (Context + hooks no React; services + signals/módulos no Angular).

### 7. Justificativa da escolha de CSS próprio

- Bibliotecas de UI abstratizam estilos, componentes e muitas vezes adicionam camadas de JavaScript que interferem nas métricas de performance e na estrutura interna dos componentes.
- Para manter a **variável independente restrita ao framework**, o CSS é:
  - autoral, com foco em um design limpo e neutro;
  - definido em um único arquivo base, compartilhado entre os dois projetos;
  - organizado em classes semânticas reutilizáveis (`.page-title`, `.card`, `.modal`, `.tasks-toolbar`, etc.).
- A adoção de CSS próprio:
  - reduz o ruído metodológico,
  - evita dependências de design system específicos de um dos frameworks,
  - facilita a auditoria da equivalência visual entre as duas implementações.

### 8. Estrutura de navegação

- **Rotas principais (idênticas em React e Angular)**:
  - `/login`: tela de login simulado (email e senha obrigatórios, sem backend real).
  - `/dashboard`: dashboard com métricas das tarefas (total, concluídas, pendentes, percentual).
  - `/tasks`: página de tarefas com CRUD, filtros, busca em tempo real e modal customizado.
- **Proteção de rotas**:
  - Após login bem-sucedido, o usuário é redirecionado para `/dashboard`.
  - Rotas `/dashboard` e `/tasks` exigem autenticação simulada (Context/guard).
  - Logout retorna o usuário para `/login` sem persistência em backend.
- **Comportamento de lazy loading**:
  - Em React, as páginas (`LoginPage`, `DashboardPage`, `TasksPage`) são carregadas de forma lazy via `React.lazy` e `Suspense`.
  - Em Angular, os módulos/rotas de dashboard e tarefas são carregados lazy via `loadChildren`, e o módulo de tarefas é explicitamente modularizado (`TasksModule`).

### 9. Estratégia de futura integração backend

- Ambos os projetos possuem camada de serviços estruturada para consumo futuro de **endpoints REST**:
  - Operações previstas:
    - `GET /api/tasks`
    - `POST /api/tasks`
    - `PUT /api/tasks/:id`
    - `DELETE /api/tasks/:id`
    - `POST /api/login`
- **No estado atual (experimento controlado)**:
  - Os serviços trabalham com dados mockados em memória, com pequenas latências simuladas.
  - A assinatura dos métodos e a forma de chamada (promises/async) já são compatíveis com a futura substituição por `fetch`/`HttpClient` real.
- **Roteiro de migração**:
  - Substituir as funções de mock por chamadas HTTP reais mantendo a mesma interface pública dos serviços.
  - Inserir tratamento de erros e estados de carregamento sem modificar o contrato das páginas, preservando a comparabilidade da camada de apresentação.

### 10. Estratégia de medição de performance

- **Ambiente de teste**:
  - Mesmo dispositivo, navegador e condições de rede (idealmente rede limitada simulada, como “Fast 3G” no DevTools) para ambos os sistemas.
  - Versões de build de produção dos dois projetos servidas localmente.
- **Ferramentas recomendadas**:
  - Chrome DevTools (aba Performance e Lighthouse).
  - Extensões específicas para Web Vitals quando aplicável.
- **Procedimento para cada participante/sessão**:
  1. Carregar a aplicação React em estado “frio” (sem cache).
  2. Executar o fluxo experimental completo (ver seção 11) enquanto se registra:
     - Web Vitals,
     - tempo até primeira interação possível,
     - consumo de CPU e memória (via aba Performance / Memory).
  3. Repetir o mesmo procedimento na aplicação Angular, na mesma ordem de ações.
- **Análise**:
  - Comparar métricas de carregamento e interação entre frameworks.
  - Observar trade-offs entre tamanho de bundle, tempo de bootstrapping e custo de re-renderizações em operações de CRUD.

### 11. Fluxo experimental para o participante

O participante deve seguir **rigorosamente o mesmo roteiro** em ambas as aplicações:

1. Acessar `/login`.
2. Informar um email qualquer e uma senha qualquer (validação apenas de campos obrigatórios).
3. Confirmar o login e ser redirecionado para o **dashboard**.
4. Na tela de dashboard, observar os valores iniciais de métricas (podem iniciar em zero).
5. Navegar para a página de **tarefas**.
6. **Criar 3 tarefas** com títulos e descrições distintas.
7. **Editar 1 tarefa**, alterando título e/ou descrição via modal.
8. **Marcar 2 tarefas como concluídas**.
9. Utilizar os filtros:
   - visualizar apenas tarefas **pendentes**;
   - visualizar apenas tarefas **concluídas**;
   - retornar para **todas**.
10. Utilizar o campo de **busca em tempo real**, digitando parte do título de uma tarefa específica e verificando o filtro dinâmico.
11. Retornar ao dashboard e observar a atualização das métricas.
12. Encerrar sessão com o botão de **logout** (quando disponível no fluxo).

### 12. Estratégia de aplicação de SUS e UEQ

- **Ordem de aplicação**:
  - Cada participante usa primeiro uma das implementações (ordem balanceada entre participantes para evitar viés de aprendizado).
  - Após concluir o fluxo experimental completo em um dos sistemas, responde:
    1. Questionário SUS, adaptado para o “TaskFlow Experimental App — versão X (React ou Angular)”.  
    2. Questionário UEQ, referenciando explicitamente a versão utilizada.
  - O procedimento é repetido para a segunda implementação.
- **Cuidados metodológicos**:
  - Os formulários devem deixar claro qual versão está sendo avaliada (React ou Angular), mas **sem sugerir julgamento tecnológico** (foco na experiência percebida).
  - A escala de resposta (Likert) e a forma de cálculo dos escores devem seguir as recomendações originais dos instrumentos.
  - Recomenda-se um intervalo curto entre o uso de cada versão para reduzir esquecimento, mas não tão curto a ponto de gerar fadiga.
- **Análise dos resultados**:
  - Cálculo do escore SUS para cada versão e comparação estatística (média, desvio padrão, testes apropriados conforme tamanho da amostra).
  - Cálculo dos escores das dimensões UEQ e comparação entre frameworks, identificando diferenças em atratividade, eficiência percebida e outros fatores.
  - Cruzamento das métricas subjetivas (SUS/UEQ) com as métricas objetivas de performance, buscando correlações (por exemplo, um pior LCP associado a menor escore de eficiência percebida).

### 13. Considerações finais

Esta especificação foi elaborada para garantir que **a única diferença sistemática relevante** entre as duas versões do TaskFlow Experimental App seja o **framework front-end** utilizado.  
Ao manter o design, o fluxo de usuário, a estrutura de dados, o CSS e a lógica de domínio equivalentes, o experimento busca fornecer uma base sólida para discutir:

- impactos arquiteturais (estrutura de componentes, serviços, gestão de estado);
- impactos de performance percebida e medida;
- relação entre tecnologia adotada e experiência subjetiva de uso.

Qualquer evolução futura (como integração real com backend REST) deve preservar a simetria entre as duas implementações para manter a validade comparativa dos resultados.


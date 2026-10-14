# UFG - Universidade Federal de Goiás

**Curso:** Engenharia de Software
**Disciplina:** Modelagem de Software
**Professor(a):** Diogo Oliveira Santos

## TRABALHO DE MODELAGEM UML

**Tema:** Aplicativo de Agendamento de Consultas Médicas
**Diagramas de Atividades, Sequência e Classes**

### Integrantes

| Nome | Matrícula |
|---|---|
| Caio Lucas do Couto Ribeiro | 202605251 |
| Emanuel Henrique Sudré Rosado Paz Gonçalves | 202600686 |
| Haniel Gomes da Silva | 202604074 |
| Rafael Nunes Braun | 202600695 |
| Vinícius Moreli Parisi | 202600699 |

Goiânia – 2026/2º Semestre

---

## Sumário

1. Descrição da Aplicação
2. Diagrama de Atividades
3. Diagrama de Sequência
4. Diagrama de Classes (macro)
5. Considerações Finais do Grupo

---

## 1. Descrição da Aplicação

### 1.1 Visão geral

O sistema abordado trata-se de agendamento de consultas médicas cujo objetivo é digitalizar e centralizar todo o ciclo de vida de uma consulta: desde a busca pelo profissional (por especialidade e por médico), passando pela escolha de data e horário, pelo preenchimento e revisão dos dados do paciente e pela validação administrativa do secretário, até o cancelamento ou a remarcação de consultas já existentes. O sistema elimina o fluxo tradicional baseado em ligações telefônicas e agendas de papel, reduzindo faltas, conflitos de horário e o trabalho operacional das secretarias.

O aplicativo envolve quatro atores principais:

- **Paciente** — usuário final que seleciona a especialidade desejada, escolhe o médico, visualiza e seleciona data e horário dentre os disponíveis, preenche seus dados pessoais, revisa e confirma o agendamento, recebe a notificação do resultado e pode cancelar ou remarcar consultas existentes;
- **Médico** — profissional que gerencia sua própria agenda, definindo os horários em que estará disponível e bloqueando horários quando necessário.
- **Secretário** — usuário administrativo responsável por revisar as solicitações de consulta geradas pelos pacientes, confirmar o agendamento e disparar a notificação do resultado;
- **Sistema de Notificação** — ator não humano (sistema automatizado) que envia, reenvia e monitora notificações por e-mail, push ou SMS sempre que uma operação é concluída.

### 1.2 Funcionalidades por ator

**Paciente:** pesquisa médicos por especialidade (`buscarMedico`); seleciona o médico e escolhe a data e o horário dentre os disponíveis (`agendarConsulta`); preenche os dados pessoais solicitados e confirma o agendamento após a revisão; pode cancelar consultas existentes (`cancelarConsulta`) ou remarcá-las para um novo horário (`remarcarConsulta`); e recebe as notificações de resultado de cada operação.

**Médico:** autentica-se com perfil de profissional; define seus horários disponíveis (`definirHorariosDisponiveis`); pode bloquear horários (`bloquearHorario`); visualiza sua agenda de consultas (`visualizarAgenda`); e, nos fluxos de cancelamento e remarcação, atua liberando o horário da consulta (`liberarHorario`) e reservando o novo horário (`reservarNovoHorario`).

**Secretário:** recebe as novas solicitações de consulta; revisa cada solicitação (`revisarSolicitacao`); confirma o agendamento (`confirmarConsulta`) ou rejeita a solicitação registrando o motivo (`rejeitarSolicitacao`); pode também realizar remarcações (`remarcarConsulta`); e o envio da notificação do resultado faz parte da sua etapa no fluxo.

**Sistema de Notificação:** envia notificações (`enviar`), reenvia quando necessário (`reenviar`) e permite consultar o status de envio (`consultarStatusEnvio`); cada notificação possui tipo (email, push ou SMS), conteúdo, data de envio e indicação de leitura.

### 1.3 Fluxo principal (narrativa)

O fluxo principal do agendamento é o seguinte: o paciente seleciona a especialidade desejada e o sistema exibe a lista de médicos; o paciente seleciona um médico e o sistema verifica a disponibilidade — enquanto o médico estiver indisponível, o sistema exibe um aviso e o paciente seleciona outro médico (repetição); com o médico disponível, o sistema exibe as datas e horários livres; o paciente seleciona a data e o horário, preenche os dados pessoais solicitados e o sistema exibe a tela de revisão do agendamento; o paciente confirma e o sistema encaminha a solicitação para o secretário, exibindo "Aguardando revisão de Secretário"; o secretário revisa a solicitação e confirma a consulta; o sistema então dispara, no Sistema de Notificação, a notificação do resultado, e o paciente recebe "Consulta Agendada com Sucesso". A partir daí, o paciente pode marcar outra consulta (reiniciando o fluxo de agendamento) ou encerrar.

Existem fluxos alternativos e complementares importantes:

- **(a) médico indisponível** — durante a escolha, o sistema informa a indisponibilidade e o paciente repete a seleção de médico até encontrar um com horários;
- **(b) revisão antes da confirmação** — o paciente retorna à tela de revisão quantas vezes forem necessárias até confirmar o agendamento;
- **(c) cancelamento** — após o agendamento, o paciente solicita o cancelamento informando a consulta; o sistema pede ao médico que libere o horário, dispara a notificação de cancelamento e informa "Cancelamento realizado";
- **(d) remarcação** — o paciente solicita a remarcação; o sistema localiza a consulta, o médico libera o horário antigo, o paciente seleciona o novo horário dentre os disponíveis (repetindo enquanto necessário), o médico reserva o novo horário, o sistema dispara a notificação de remarcação e informa "Remarcação realizada";
- **(e) paciente sem consultas** — ao entrar no fluxo de cancelamento/remarcação e informar seus dados, se não houver consultas existentes para o paciente, o sistema exibe "Sem consultas existentes para esse paciente!" e o fluxo é encerrado.

### 1.4 Regras de negócio

1. Só são oferecidos horários de médicos com disponibilidade verificada pelo sistema (`verificarDisponibilidade`);
2. A solicitação do paciente só se torna consulta efetiva após a revisão e confirmação do Secretário;
3. O cancelamento está sujeito à política de cancelamento verificada pelo sistema (`verificarPoliticaCancelamento`);
4. Ao remarcar, o horário antigo é liberado e o novo horário é reservado;
5. Toda operação concluída (agendamento confirmado, cancelamento, remarcação) gera notificação ao paciente;
6. Cada médico possui exatamente uma agenda, composta por seus horários;
7. Um horário reserva no máximo uma consulta (0..1 para 0..1).

---

## 2. Diagrama de Atividades

O diagrama abaixo modela os dois fluxos macro do aplicativo, separados pela decisão inicial que leva às atividades **Agendamento** e **Cancelamento/Remarcar**: o fluxo de agendamento (seleção do médico por especialidade ou diretamente por nome → visualização e seleção de data e horário → preenchimento dos dados pessoais → revisão → envio da solicitação à secretária) e o fluxo de cancelamento/remarcação (informe do CPF → busca do usuário → exibição das consultas → cancelamento, sujeito a confirmação, ou remarcação, que carrega os dados da consulta e reaproveita a etapa de seleção de data e horário). Os desfechos confirmados de ambos convergem, por um nó de junção, para a etapa do Secretário, que culmina na notificação do resultado ao paciente e na decisão de voltar ou não à tela inicial.

**Elementos utilizados:** nó inicial, ações, decisões (diamantes), ações de entrada/saída (p. ex. "Selecione a especialidade"), nós de junção (unindo os dois caminhos de seleção do médico e os desfechos confirmados de agendamento e cancelamento), laços de retorno, uma partição que agrupa as ações do Secretário (Notificação de solicitação → Revisar Notificação → Liberar solicitação → Enviar Notificação para paciente → Notificação do resultado) e nó final único.

![Diagrama de Atividades](diagrama_atividades.png)

### 2.1 Leitura do diagrama

| Elemento | Onde aparece | Significado |
|---|---|---|
| Nó inicial | "Início" | Ponto de partida único, seguido da escolha do serviço |
| Decisão 1 | Decisão após o nó inicial (arestas para "Agendamento" e "Cancelamento/Remarcar") | Separa os dois fluxos macro da aplicação |
| Decisão 2 | "Selecionar por Especialidade" / "Selecionar por Médico" (rótulos das arestas) | Dois caminhos de busca do médico: pela especialidade (escolhe a especialidade e depois o médico) ou diretamente pelo médico; ambos convergem na seleção de data e horário |
| Decisão 3 | "Confirmação?" (revisão) | Fluxo alternativo B: não confirmado → retorno a "Preencher dados pessoais" até confirmar |
| Subgrafo Secretário | Notificação de solicitação → Revisar Notificação → Liberar solicitação → Enviar Notificação para paciente → Notificação do resultado | Etapa administrativa da solicitação: o Secretário revisa e libera o agendamento e o resultado é notificado ao paciente |
| Decisão 4 | "Usuário Existe?" (após "Buscar usuário") | Fluxo alternativo C: CPF sem cadastro → mensagem "Paciente não cadastrado!" → retorno a "Informar CPF"; cadastrado → exibição das consultas do paciente |
| Decisão 5 | "Remarcar" / "Cancelar" (rótulos das arestas) | Define a operação sobre a consulta selecionada: Remarcar carrega as informações da consulta e reaproveita "Visualizar + Selecionar Data e Horário"; Cancelar leva à tela de Confirmação |
| Decisão 6 | Confirmação (cancelamento) | Não confirmado → retorno a "Mostrar consultas + Selecionar consulta"; confirmado → junção com a etapa do Secretário |
| Decisão 7 | "Voltar à tela inicial?" | Após a notificação do resultado: sim → reinicia o fluxo de agendamento; não → nó final |
| Nó final | "Fim" | Encerramento compartilhado pelos fluxos |

---

## 3. Diagrama de Sequência

**Cenário escolhido:** o fluxo completo do atendimento — o mais representativo do sistema, pois atravessa todos os participantes (Paciente, Sistema, Médico, Secretário e Sistema de Notificação) e cobre o agendamento (fragmento `alt`), o pós-agendamento opcional (fragmento `opt`) com os fluxos alternativos de cancelamento e remarcação, além de laços de repetição (`loop`) para a seleção de médico disponível e de novo horário.

![Diagrama de Sequência](diagrama_sequencia.png)

### 3.1 Leitura do diagrama

- **Participantes:** Paciente (ator), `:Sistema` e `:Sistema de Notificação` (participantes do sistema) e Médico e Secretário (atores);
- **Mensagens síncronas (seta cheia):** chamadas de operação, ex.: `selecionarEspecialidade(String)`, `confirmarAgendamento()`, `cancelarConsulta(int)`, `remarcarConsulta(int)`;
- **Mensagens de retorno (seta tracejada):** resultados e exibições, ex.: `exibirListaMedicos()`, `exibirDataEHorarios(horariosDisponiveis)`, `enviarNotificacao("Consulta Agendada com Sucesso")`;
- **Mensagens para o próprio objeto (self-message):** processamentos internos, ex.: `verificarDisponibilidade()`, `buscarConsulta(idConsulta)`;
- **Fragmento `alt` externo:** separa o bloco de Agendamento;
- **`loop` + `alt` aninhados:** repetição da escolha até achar médico disponível, com as alternativas "Médico Indisponível" (mensagem de aviso) e "Médico Disponível" (exibição de datas e horários);
- **Fragmento `opt` Pós-Agendamento:** operações opcionais após o agendamento, com `alt` interno entre Cancelar Consulta e Remarcar Consulta;
- **`loop` na remarcação:** repetição até selecionar novo horário disponível;
- **Ativações e numeração automática:** ordenam temporalmente as interações.

A coerência com o Diagrama de Classes é direta: as mensagens correspondem a operações declaradas nas classes — `SistemaAgendamento.criarConsulta()`, `Secretario.confirmarConsulta()`, `Consulta.cancelar()`/`remarcar()` e `SistemaNotificacao.enviar()` — e as mensagens de liberação/reserva de horário dirigidas ao Médico correspondem às operações que ele executa sobre sua Agenda (`liberarHorario()`, `reservarHorario()`).

---

## 4. Diagrama de Classes (macro)

Diagrama macro do sistema, com as principais classes, atributos, métodos (com visibilidade `+` público e `-` privado), herança, composições, associações dirigidas, dependências para enumerações e multiplicidades.

![Diagrama de Classes — Sistema de Agendamento de Consultas Médicas](diagrama_classes.png)

### 4.1 Descrição das classes

| Classe | Papel |
|---|---|
| **Pessoa** (abstrata) | Superclasse com atributos (`id`, `nome`, `cpf`, `email`, `telefone`, `senhaHash`) e operações (`login()`, `logout()`, `atualizarCadastro()`) comuns a todos os usuários |
| **Paciente** | Herda de Pessoa; adiciona `dataNascimento` e `planoSaude`; busca médicos, agenda, cancela e remarca consultas |
| **Medico** | Herda de Pessoa; possui `crm` e `valorConsulta`; define horários disponíveis, bloqueia horários, visualiza a agenda e pode aceitar/recusar consultas |
| **Secretario** | Herda de Pessoa; possui `matricula`; confirma, rejeita (com motivo) e remarca consultas |
| **Especialidade** | Área médica (`id`, `nome`, `descricao`) que lista os médicos que atuam nela |
| **Agenda** | Pertence exclusivamente a um médico; possui vigência (`vigenciaInicio`/`vigenciaFim`); consulta, reserva e libera horários |
| **Horario** | Faixa de data/hora (`dataHoraInicio`/`dataHoraFim`) com status; expõe `estaDisponivel()` |
| **StatusHorario** (enumeração) | Estados do horário: `LIVRE`, `RESERVADO`, `OCUPADO`, `BLOQUEADO` |
| **Consulta** | Classe central: liga paciente, médico e horário; controla status, motivo de cancelamento e cálculo do valor |
| **StatusConsulta** (enumeração) | Estados da consulta: `PENDENTE`, `CONFIRMADA`, `REMARCADA`, `CANCELADA`, `CONCLUIDA` |
| **Notificacao** | Mensagem com tipo, `conteudo`, `dataEnvio` e marcação de leitura; destina-se a uma Pessoa |
| **TipoNotificacao** (enumeração) | Canais de envio: `EMAIL`, `PUSH`, `SMS` |
| **SistemaNotificacao** | Serviço que envia, reenvia e monitora o status das notificações |
| **SistemaAgendamento** | Controlador/fachada que orquestra os casos de uso: listar especialidades e médicos, consultar horários, criar consultas e verificar a política de cancelamento |

### 4.2 Relacionamentos

| Relação | Tipo | Multiplicidade | Justificativa |
|---|---|---|---|
| Pessoa ← Medico, Paciente, Secretario | Herança (generalização) | — | Os três perfis compartilham dados e comportamento de usuário |
| SistemaAgendamento → SistemaNotificacao | Associação dirigida | 1 → 1 | O controlador usa o serviço de notificação |
| SistemaAgendamento → Especialidade | Associação dirigida | 1 → 1..* | O controlador consulta as especialidades cadastradas |
| SistemaNotificacao → Notificacao | Associação | 1 → 0..* | O serviço envia muitas notificações |
| Notificacao → Pessoa | Associação | 0..* → 1 | Cada notificação destina-se a uma pessoa |
| Notificacao ⇢ TipoNotificacao | Dependência | — | A notificação referencia o canal de envio |
| Medico — Especialidade | Associação | 1..* ↔ 1..* | Um médico atua em várias especialidades e vice-versa |
| Medico ◆— Agenda | Composição | 1 → exatamente 1 | A agenda não existe sem o médico; se o médico é excluído, a agenda também é |
| Agenda ◆— Horario | Composição | 1 → 1..* | Horários fazem parte da agenda e são destruídos com ela |
| Horario ⇢ StatusHorario | Dependência | — | O horário referencia seu estado |
| Horario — Consulta | Associação | 0..1 ↔ 0..1 | Um horário reserva no máximo uma consulta |
| Medico — Consulta | Associação | 1 → 0..* | Um médico atende várias consultas |
| Paciente — Consulta | Associação | 1 → 0..* | Um paciente solicita várias consultas |
| Secretario — Consulta | Associação | 1 → 0..* | Um secretário confirma várias consultas |
| Consulta ◆— StatusConsulta | Composição | 1 → 1 | O estado é parte do ciclo de vida da consulta |

O diagrama registra ainda duas notas: a composição Medico–Agenda ("se o médico for excluído, sua Agenda e seus Horários também o são") e o papel de Consulta como agregado central, ligando Paciente, Médico e Horário e monitorada por Notificação.

---

## 5. Considerações Finais do Grupo

A modelagem do sistema de agendamento de consultas médicas permitiu ao grupo exercitar, de forma integrada, os três diagramas UML mais utilizados na fase de análise de sistemas.

O **Diagrama de Atividades** foi essencial para visualizar o fluxo completo do negócio. A decisão inicial que separa Agendamento de Cancelamento/Remarcação deixou explícito que o aplicativo tem dois fluxos macro complementares; a decisão entre selecionar por especialidade ou diretamente por médico, os laços de retorno — como a mensagem "Paciente não cadastrado!" enquanto o CPF não corresponder a um usuário cadastrado e o retorno ao preenchimento dos dados pessoais até a confirmação da revisão — e o reaproveitamento da etapa de seleção de data e horário na remarcação mostraram situações reais do domínio; e o agrupamento das ações do Secretário (Notificação de solicitação → Revisar Notificação → Liberar solicitação → Enviar Notificação para paciente → Notificação do resultado) evidenciou o papel administrativo de validação, que não apareceria com a mesma clareza em um fluxo único centrado no paciente.

O **Diagrama de Sequência** mostrou a dimensão temporal dos cenários, revelando a ordem real das interações: a disponibilidade é verificada antes de exibir os horários; a solicitação só chega ao Secretário após a confirmação do paciente; a notificação do resultado só é disparada depois da confirmação da consulta; e, na remarcação, o horário antigo é liberado antes da reserva do novo. Os fragmentos `alt`, `loop` e `opt` evidenciaram, respectivamente, as alternativas (médico disponível/indisponível; cancelar/remarcar), as repetições (escolha de médico e de novo horário) e o caráter opcional do pós-agendamento.

O **Diagrama de Classes (macro)** consolidou o vocabulário do sistema. A decisão de modelar Pessoa como classe abstrata evitou duplicação de atributos entre os três perfis de usuário; as composições Medico–Agenda e Agenda–Horario expressam o forte vínculo de posse e ciclo de vida; a composição Consulta–StatusConsulta representou o ciclo de estados da consulta; e as enumerações (`StatusHorario`, `StatusConsulta`, `TipoNotificacao`) tiparam os estados e os canais do domínio. A classe Consulta emergiu naturalmente como agregado central, conectando Paciente, Médico e Horário, enquanto SistemaAgendamento atuou como fachada que orquestra os casos de uso.

Por fim, o grupo destacou a importância da coerência entre os diagramas: as ações do diagrama de atividades correspondem a mensagens do diagrama de sequência (escolha de especialidade e médico, preenchimento de dados, revisão, confirmação, cancelamento e remarcação), e as mensagens correspondem a operações declaradas no diagrama de classes (ex.: `criarConsulta()`, `confirmarConsulta()`, `cancelar()`, `remarcar()`, `liberarHorario()`, `reservarHorario()`, `enviar()`). Essa rastreabilidade — atividades → mensagens → operações — é o que garante que a modelagem descreva um sistema implementável e consistente, além de facilitar a evolução futura do projeto.

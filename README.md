# Sistema de Agendamento de Consultas Médicas (POO em TypeScript)

Aplicação interativa em **TypeScript** com **Programação Orientada a Objetos (POO)** baseada na modelagem UML do trabalho acadêmico (Diagramas de Atividades, Sequência e Classes).

---

## 🚀 Como Executar

Basta abrir o terminal nesta pasta e rodar:

```powershell
npm start
```

O menu interativo abrirá diretamente no console:
```text
=== SISTEMA DE AGENDAMENTO DE CONSULTAS (POO UML) ===

--- MENU ---
1. [Paciente] Agendar Consulta
2. [Secretário] Revisar e Confirmar Solicitações
3. [Paciente] Remarcar Consulta
4. [Paciente] Cancelar Consulta
5. [Paciente] Ver Notificações e Consultas
0. Sair

Opção: 
```

---

## 🏛️ Estrutura e Rastreabilidade com os Diagramas UML

O projeto está organizado na pasta `src/`:

- **[enums.ts](file:///c:/Users/emanu/Downloads/Diogo/src/enums.ts)**:
  - `StatusHorario`: `LIVRE`, `RESERVADO`, `OCUPADO`, `BLOQUEADO`.
  - `StatusConsulta`: `PENDENTE`, `CONFIRMADA`, `REMARCADA`, `CANCELADA`, `CONCLUIDA`.
  - `TipoNotificacao`: `EMAIL`, `PUSH`, `SMS`.

- **`src/models/`**:
  - **[Pessoa.ts](file:///c:/Users/emanu/Downloads/Diogo/src/models/Pessoa.ts)**: Superclasse abstrata com atributos de usuário (`id`, `nome`, `cpf`, `email`, etc.) e métodos de autenticação/cadastro.
  - **[Paciente.ts](file:///c:/Users/emanu/Downloads/Diogo/src/models/Paciente.ts)**: Herda de `Pessoa`; solicita agendamentos, cancelamentos e remarcações.
  - **[Medico.ts](file:///c:/Users/emanu/Downloads/Diogo/src/models/Medico.ts)**: Herda de `Pessoa`; possui CRM, valor de consulta e gerencia sua própria agenda.
  - **[Secretario.ts](file:///c:/Users/emanu/Downloads/Diogo/src/models/Secretario.ts)**: Herda de `Pessoa`; usuário administrativo que analisa solicitações para aprovar ou rejeitar.
  - **[Especialidade.ts](file:///c:/Users/emanu/Downloads/Diogo/src/models/Especialidade.ts)**: Associação N:M com médicos.
  - **[Agenda.ts](file:///c:/Users/emanu/Downloads/Diogo/src/models/Agenda.ts)**: Composição 1:1 com `Medico`.
  - **[Horario.ts](file:///c:/Users/emanu/Downloads/Diogo/src/models/Horario.ts)**: Composição 1:N com `Agenda` que controla disponibilidade da faixa de horário.
  - **[Consulta.ts](file:///c:/Users/emanu/Downloads/Diogo/src/models/Consulta.ts)**: Agregado central conectando Paciente, Médico, Horário e Secretário.
  - **[Notificacao.ts](file:///c:/Users/emanu/Downloads/Diogo/src/models/Notificacao.ts)**: Mensagem enviada a uma pessoa via canais de notificação.

- **`src/services/`**:
  - **[SistemaAgendamento.ts](file:///c:/Users/emanu/Downloads/Diogo/src/services/SistemaAgendamento.ts)**: Fachada/controlador que aplica as regras de negócio (`verificarDisponibilidade`, `verificarPoliticaCancelamento`, etc.).
  - **[SistemaNotificacao.ts](file:///c:/Users/emanu/Downloads/Diogo/src/services/SistemaNotificacao.ts)**: Serviço automatizado de envio e histórico de notificações.

- **[index.ts](file:///c:/Users/emanu/Downloads/Diogo/src/index.ts)**: Ponto de entrada com o fluxo interativo no terminal.

---

## 🛠️ Compilação

Para compilar o TypeScript:

```powershell
npm run build
```

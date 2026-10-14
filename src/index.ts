import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { StatusConsulta, TipoNotificacao } from './enums.js';
import { Especialidade } from './models/Especialidade.js';
import { Horario } from './models/Horario.js';
import { Medico } from './models/Medico.js';
import { Paciente } from './models/Paciente.js';
import { Secretario } from './models/Secretario.js';
import { SistemaAgendamento } from './services/SistemaAgendamento.js';
import { SistemaNotificacao } from './services/SistemaNotificacao.js';

// Setup inicial com os atores e dados da clínica
const servicoNotificacao = new SistemaNotificacao();
const sistema = new SistemaAgendamento(servicoNotificacao);

// Especialidades
const cardio = new Especialidade(1, 'Cardiologia', 'Cardiovascular');
const derma = new Especialidade(2, 'Dermatologia', 'Dermatologia');
sistema.cadastrarEspecialidade(cardio);
sistema.cadastrarEspecialidade(derma);

// Médicos
const drDiogo = new Medico(1, 'Dr. Diogo Santos', '111.111.111-11', 'diogo@hospital.com', '62988880001', '123', 'CRM/GO 12345', 350);
drDiogo.adicionarEspecialidade(cardio);

const draAna = new Medico(2, 'Dra. Ana Paula', '222.222.222-22', 'ana@hospital.com', '62988880002', '123', 'CRM/GO 67890', 400);
draAna.adicionarEspecialidade(derma);

sistema.cadastrarMedico(drDiogo);
sistema.cadastrarMedico(draAna);

// Horários do Dr. Diogo
const amanha = new Date();
amanha.setDate(amanha.getDate() + 1);

drDiogo.definirHorariosDisponiveis([
  new Horario(1, new Date(amanha.getFullYear(), amanha.getMonth(), amanha.getDate(), 9, 0), new Date(amanha.getFullYear(), amanha.getMonth(), amanha.getDate(), 10, 0)),
  new Horario(2, new Date(amanha.getFullYear(), amanha.getMonth(), amanha.getDate(), 10, 30), new Date(amanha.getFullYear(), amanha.getMonth(), amanha.getDate(), 11, 30)),
  new Horario(3, new Date(amanha.getFullYear(), amanha.getMonth(), amanha.getDate(), 14, 0), new Date(amanha.getFullYear(), amanha.getMonth(), amanha.getDate(), 15, 0))
]);

// Paciente e Secretário
const paciente = new Paciente(1, 'Emanuel Gonçalves', '123.456.789-00', 'emanuel@email.com', '62999991111', '123', new Date('2000-01-01'), 'Unimed');
sistema.cadastrarPaciente(paciente);

const secretario = new Secretario(1, 'Maria Silva', '999.888.777-66', 'secretaria@hospital.com', '62987654321', '123', 'SEC-01');

// Consulta inicial pré-cadastrada e confirmada para Emanuel (permite testar remarcação/cancelamento imediatamente)
const h1 = drDiogo.getAgenda().getHorarios()[0];
const consultaInicial = sistema.criarConsulta(paciente, drDiogo, h1);
secretario.confirmarConsulta(consultaInicial);

async function main() {
  const rl = readline.createInterface({ input, output });

  console.log('\n=== SISTEMA DE AGENDAMENTO DE CONSULTAS (POO UML) ===');

  while (true) {
    console.log('\n--- MENU ---');
    console.log('1. [Paciente] Agendar Consulta');
    console.log('2. [Secretário] Revisar e Confirmar Solicitações');
    console.log('3. [Paciente] Remarcar Consulta');
    console.log('4. [Paciente] Cancelar Consulta');
    console.log('5. [Paciente] Ver Notificações e Consultas');
    console.log('0. Sair');

    const opcao = (await rl.question('\nOpção: ')).trim();

    if (opcao === '0') {
      console.log('Sistema encerrado.');
      rl.close();
      break;
    }

    switch (opcao) {
      case '1': {
        const especialidades = sistema.listarEspecialidades();
        console.log('\nEspecialidades:');
        especialidades.forEach((e, i) => console.log(`  ${i + 1}. ${e.getNome()}`));

        const espIdx = parseInt(await rl.question('Selecione a especialidade: '), 10) - 1;
        const esp = especialidades[espIdx];
        if (!esp) { console.log('Especialidade inválida.'); break; }

        const medicos = sistema.listarMedicosPorEspecialidade(esp);
        if (medicos.length === 0) { console.log('Sem médicos para esta especialidade.'); break; }

        console.log(`\nMédicos (${esp.getNome()}):`);
        medicos.forEach((m, i) => console.log(`  ${i + 1}. ${m.getNome()} (R$ ${m.getValorConsulta()})`));

        const medIdx = parseInt(await rl.question('Selecione o médico: '), 10) - 1;
        const med = medicos[medIdx];
        if (!med) { console.log('Médico inválido.'); break; }

        const horarios = sistema.consultarHorarios(med);
        if (horarios.length === 0) { console.log('Aviso: Médico sem horários disponíveis.'); break; }

        console.log('\nHorários disponíveis:');
        horarios.forEach((h, i) => console.log(`  ${i + 1}. ${h.formatar()}`));

        const horIdx = parseInt(await rl.question('Selecione o horário: '), 10) - 1;
        const hor = horarios[horIdx];
        if (!hor) { console.log('Horário inválido.'); break; }

        console.log(`\nRevisão: ${paciente.getNome()} | ${med.getNome()} | ${hor.formatar()} | R$ ${med.getValorConsulta()}`);
        const confirma = (await rl.question('Confirmar solicitação? (s/n): ')).toLowerCase().trim();

        if (confirma === 's') {
          const c = sistema.criarConsulta(paciente, med, hor);
          console.log(`Solicitação #${c.getId()} enviada! Status: "Aguardando revisão de Secretário".`);
        }
        break;
      }

      case '2': {
        const pendentes = sistema.getConsultas().filter((c) => c.getStatus() === StatusConsulta.PENDENTE);
        if (pendentes.length === 0) { console.log('\nNenhuma solicitação pendente.'); break; }

        console.log('\nSolicitações pendentes:');
        pendentes.forEach((c, i) => console.log(`  ${i + 1}. Consulta #${c.getId()} | Paciente: ${c.getPaciente().getNome()} | Médico: ${c.getMedico().getNome()} | ${c.getHorario().formatar()}`));

        const cIdx = parseInt(await rl.question('Selecione a solicitação: '), 10) - 1;
        const consulta = pendentes[cIdx];
        if (!consulta) { console.log('Opção inválida.'); break; }

        const acao = (await rl.question('Escolha: [1] Confirmar | [2] Rejeitar: ')).trim();
        if (acao === '1') {
          secretario.confirmarConsulta(consulta);
          sistema.notificar(consulta.getPaciente(), TipoNotificacao.SMS, `Consulta Agendada com Sucesso com ${consulta.getMedico().getNome()}.`);
          console.log('Consulta confirmada e paciente notificado!');
        } else if (acao === '2') {
          const motivo = await rl.question('Motivo da rejeição: ');
          secretario.rejeitarSolicitacao(consulta, motivo);
          sistema.notificar(consulta.getPaciente(), TipoNotificacao.SMS, `Solicitação rejeitada: ${motivo}`);
          console.log('Solicitação rejeitada.');
        }
        break;
      }

      case '3': {
        const cpf = (await rl.question('\nInforme o CPF (ex: 12345678900 ou 123.456.789-00): ')).trim();
        const pac = sistema.buscarPacientePorCpf(cpf);
        if (!pac) { console.log('Paciente não cadastrado!'); break; }

        const consultas = sistema.buscarConsultasPorPaciente(pac);
        if (consultas.length === 0) { console.log('Sem consultas existentes para esse paciente!'); break; }

        console.log('\nSuas consultas:');
        consultas.forEach((c, i) => console.log(`  ${i + 1}. Consulta #${c.getId()} | ${c.getMedico().getNome()} | ${c.getHorario().formatar()} [${c.getStatus()}]`));

        const cIdx = parseInt(await rl.question('Selecione para remarcar: '), 10) - 1;
        const consulta = consultas[cIdx];
        if (!consulta) { console.log('Opção inválida.'); break; }

        const horarios = sistema.consultarHorarios(consulta.getMedico());
        if (horarios.length === 0) { console.log('Nenhum outro horário disponível com este médico.'); break; }

        console.log('\nNovos horários:');
        horarios.forEach((h, i) => console.log(`  ${i + 1}. ${h.formatar()}`));

        const hIdx = parseInt(await rl.question('Selecione o novo horário: '), 10) - 1;
        const novoHor = horarios[hIdx];
        if (!novoHor) { console.log('Horário inválido.'); break; }

        if (pac.remarcarConsulta(consulta, novoHor)) {
          sistema.notificar(pac, TipoNotificacao.EMAIL, `Remarcação realizada com sucesso para: ${novoHor.formatar()}`);
          console.log('Remarcação realizada com sucesso!');
        }
        break;
      }

      case '4': {
        const cpf = (await rl.question('\nInforme o CPF (ex: 12345678900 ou 123.456.789-00): ')).trim();
        const pac = sistema.buscarPacientePorCpf(cpf);
        if (!pac) { console.log('Paciente não cadastrado!'); break; }

        const consultas = sistema.buscarConsultasPorPaciente(pac);
        if (consultas.length === 0) { console.log('Sem consultas para esse paciente!'); break; }

        consultas.forEach((c, i) => console.log(`  ${i + 1}. Consulta #${c.getId()} | ${c.getMedico().getNome()} | ${c.getHorario().formatar()}`));

        const cIdx = parseInt(await rl.question('Selecione para cancelar: '), 10) - 1;
        const consulta = consultas[cIdx];
        if (!consulta) { console.log('Opção inválida.'); break; }

        if (!sistema.verificarPoliticaCancelamento(consulta)) {
          console.log('Não é permitido cancelar com menos de 2 horas de antecedência.');
          break;
        }

        const motivo = (await rl.question('Motivo: ')).trim() || 'Desistência';
        if (pac.cancelarConsulta(consulta, motivo)) {
          sistema.notificar(pac, TipoNotificacao.PUSH, 'Cancelamento realizado com sucesso.');
          console.log('Cancelamento realizado!');
        }
        break;
      }

      case '5': {
        console.log('\nNotificações recebidas:');
        const notifs = servicoNotificacao.getInstanciasEnviadas();
        if (notifs.length === 0) console.log('  Nenhuma notificação enviada ainda.');
        notifs.forEach((n) => console.log(`  [${n.getTipo()}] ${n.getConteudo()}`));
        break;
      }

      default:
        console.log('Opção inválida.');
    }
  }
}

main().catch(console.error);

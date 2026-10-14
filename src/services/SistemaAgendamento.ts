import { Especialidade } from '../models/Especialidade.js';
import { Medico } from '../models/Medico.js';
import { Paciente } from '../models/Paciente.js';
import { Horario } from '../models/Horario.js';
import { Consulta } from '../models/Consulta.js';
import { Notificacao } from '../models/Notificacao.js';
import { SistemaNotificacao } from './SistemaNotificacao.js';
import { StatusConsulta, TipoNotificacao } from '../enums.js';

/**
 * Classe SistemaAgendamento (Controlador / Fachada)
 * Orquestra as regras de negócio e fluxos principais dos diagramas UML
 */
export class SistemaAgendamento {
  private especialidades: Especialidade[] = [];
  private medicos: Medico[] = [];
  private consultas: Consulta[] = [];
  private pacientes: Paciente[] = [];
  private sistemaNotificacao: SistemaNotificacao;
  private proximoIdConsulta: number = 1;
  private proximoIdNotificacao: number = 1;

  constructor(sistemaNotificacao: SistemaNotificacao) {
    this.sistemaNotificacao = sistemaNotificacao;
  }

  // --- Métodos de Cadastro e Consulta Básica ---

  public cadastrarEspecialidade(especialidade: Especialidade): void {
    this.especialidades.push(especialidade);
  }

  public cadastrarMedico(medico: Medico): void {
    this.medicos.push(medico);
  }

  public cadastrarPaciente(paciente: Paciente): void {
    this.pacientes.push(paciente);
  }

  public listarEspecialidades(): Especialidade[] {
    return [...this.especialidades];
  }

  public listarMedicosPorEspecialidade(especialidade: Especialidade): Medico[] {
    return especialidade.listarMedicos();
  }

  public buscarPacientePorCpf(cpf: string): Paciente | undefined {
    const cleanCpf = cpf.replace(/\D/g, '');
    return this.pacientes.find((p) => {
      const pClean = p.getCpf().replace(/\D/g, '');
      return (cleanCpf.length > 0 && pClean === cleanCpf) || p.getCpf().trim() === cpf.trim();
    });
  }

  public buscarConsultasPorPaciente(paciente: Paciente): Consulta[] {
    return this.consultas.filter(
      (c) =>
        c.getPaciente().getId() === paciente.getId() &&
        c.getStatus() !== StatusConsulta.CANCELADA
    );
  }

  public buscarConsultaPorId(id: number): Consulta | undefined {
    return this.consultas.find((c) => c.getId() === id);
  }

  /**
   * Regra 1: Verifica a disponibilidade do horário na agenda do médico
   */
  public verificarDisponibilidade(medico: Medico, horario: Horario): boolean {
    return medico.getAgenda().eHorarioLivre(horario);
  }

  public consultarHorarios(medico: Medico, data?: Date): Horario[] {
    return medico.getAgenda().getHorariosDisponiveis(data);
  }

  /**
   * Regra 2: Criar solicitação de consulta.
   * Inicialmente fica em status PENDENTE aguardando revisão do Secretário.
   */
  public criarConsulta(paciente: Paciente, medico: Medico, horario: Horario): Consulta {
    if (!this.verificarDisponibilidade(medico, horario)) {
      throw new Error(`O horário ${horario.formatar()} não está disponível.`);
    }

    const consulta = paciente.agendarConsulta(this.proximoIdConsulta++, medico, horario);
    this.consultas.push(consulta);

    console.log(
      `[Sistema] Consulta #${consulta.getId()} gerada com status PENDENTE. Encaminhada para revisão do secretário.`
    );

    return consulta;
  }

  /**
   * Regra 3: Política de cancelamento (ex.: mínimo de 2 horas antes da consulta)
   */
  public verificarPoliticaCancelamento(consulta: Consulta): boolean {
    const agora = new Date().getTime();
    const dataConsulta = consulta.getDataHora().getTime();
    const diferencaHoras = (dataConsulta - agora) / (1000 * 60 * 60);

    // Permitido se faltar pelo menos 2 horas
    return diferencaHoras >= 2;
  }

  /**
   * Notifica um usuário através do Sistema de Notificação
   */
  public notificar(destinatario: Paciente | Medico, tipo: TipoNotificacao, mensagem: string): boolean {
    const notificacao = new Notificacao(
      this.proximoIdNotificacao++,
      destinatario,
      tipo,
      mensagem,
      new Date()
    );
    return this.sistemaNotificacao.enviar(notificacao);
  }

  public getSistemaNotificacao(): SistemaNotificacao {
    return this.sistemaNotificacao;
  }

  public getConsultas(): Consulta[] {
    return [...this.consultas];
  }
}

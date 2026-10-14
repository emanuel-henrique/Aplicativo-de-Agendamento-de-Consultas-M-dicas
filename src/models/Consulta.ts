import { StatusConsulta, StatusHorario } from '../enums.js';
import { Horario } from './Horario.js';
import type { Paciente } from './Paciente.js';
import type { Medico } from './Medico.js';
import type { Secretario } from './Secretario.js';

/**
 * Classe Consulta
 * Agregado central que conecta Paciente, Medico e Horario
 */
export class Consulta {
  private id: number;
  private dataHora: Date;
  private status: StatusConsulta;
  private motivoCancelamento: string | null = null;
  private paciente: Paciente;
  private medico: Medico;
  private horario: Horario;
  private secretario: Secretario | null = null;

  constructor(
    id: number,
    paciente: Paciente,
    medico: Medico,
    horario: Horario,
    status: StatusConsulta = StatusConsulta.PENDENTE
  ) {
    this.id = id;
    this.paciente = paciente;
    this.medico = medico;
    this.horario = horario;
    this.dataHora = horario.getDataHoraInicio();
    this.status = status;
  }

  public getId(): number {
    return this.id;
  }

  public getDataHora(): Date {
    return this.dataHora;
  }

  public getStatus(): StatusConsulta {
    return this.status;
  }

  public setStatus(status: StatusConsulta): void {
    this.status = status;
  }

  public getMotivoCancelamento(): string | null {
    return this.motivoCancelamento;
  }

  public getPaciente(): Paciente {
    return this.paciente;
  }

  public getMedico(): Medico {
    return this.medico;
  }

  public getHorario(): Horario {
    return this.horario;
  }

  public getSecretario(): Secretario | null {
    return this.secretario;
  }

  public setSecretario(secretario: Secretario): void {
    this.secretario = secretario;
  }

  /**
   * Confirmação da consulta (aprovada pelo Secretário)
   */
  public confirmar(secretario?: Secretario): void {
    this.status = StatusConsulta.CONFIRMADA;
    this.horario.setStatus(StatusHorario.OCUPADO);
    if (secretario) {
      this.secretario = secretario;
    }
  }

  /**
   * Cancelamento da consulta com registro do motivo e liberação do horário
   */
  public cancelar(motivo: string): boolean {
    this.status = StatusConsulta.CANCELADA;
    this.motivoCancelamento = motivo;
    this.horario.setStatus(StatusHorario.LIVRE);
    return true;
  }

  /**
   * Remarcação da consulta: o horário antigo é liberado e o novo horário é assumido
   */
  public remarcar(novoHorario: Horario): boolean {
    if (!novoHorario.estaDisponivel()) {
      return false;
    }
    // Libera o horário antigo
    this.horario.setStatus(StatusHorario.LIVRE);

    // Assume e reserva o novo horário
    this.horario = novoHorario;
    this.dataHora = novoHorario.getDataHoraInicio();
    novoHorario.setStatus(StatusHorario.RESERVADO);
    this.status = StatusConsulta.REMARCADA;
    return true;
  }

  /**
   * Calcula o valor da consulta (baseado no valor do médico e regras de convênio)
   */
  public calcularValor(): number {
    return this.medico.getValorConsulta();
  }
}

import { StatusHorario } from '../enums.js';

/**
 * Classe Horario
 * Faixa de data/hora associada a uma Agenda
 */
export class Horario {
  private id: number;
  private dataHoraInicio: Date;
  private dataHoraFim: Date;
  private status: StatusHorario;

  constructor(id: number, dataHoraInicio: Date, dataHoraFim: Date, status: StatusHorario = StatusHorario.LIVRE) {
    this.id = id;
    this.dataHoraInicio = dataHoraInicio;
    this.dataHoraFim = dataHoraFim;
    this.status = status;
  }

  public getId(): number {
    return this.id;
  }

  public getDataHoraInicio(): Date {
    return this.dataHoraInicio;
  }

  public getDataHoraFim(): Date {
    return this.dataHoraFim;
  }

  public getStatus(): StatusHorario {
    return this.status;
  }

  public setStatus(status: StatusHorario): void {
    this.status = status;
  }

  /**
   * Verifica se o horário está disponível para agendamento
   */
  public estaDisponivel(): boolean {
    return this.status === StatusHorario.LIVRE;
  }

  public formatar(): string {
    const data = this.dataHoraInicio.toLocaleDateString('pt-BR');
    const horaInicio = this.dataHoraInicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const horaFim = this.dataHoraFim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${data} das ${horaInicio} às ${horaFim} [Status: ${this.status}]`;
  }
}

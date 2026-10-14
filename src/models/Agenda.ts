import { Horario } from './Horario.js';
import { StatusHorario } from '../enums.js';

/**
 * Classe Agenda
 * Composta por horários e pertencente exclusivamente a um Médico
 */
export class Agenda {
  private id: number;
  private vigenciaInicio: Date;
  private vigenciaFim: Date;
  private horarios: Horario[] = [];

  constructor(id: number, vigenciaInicio: Date, vigenciaFim: Date) {
    this.id = id;
    this.vigenciaInicio = vigenciaInicio;
    this.vigenciaFim = vigenciaFim;
  }

  public getId(): number {
    return this.id;
  }

  public getVigenciaInicio(): Date {
    return this.vigenciaInicio;
  }

  public getVigenciaFim(): Date {
    return this.vigenciaFim;
  }

  public adicionarHorario(horario: Horario): void {
    this.horarios.push(horario);
  }

  public getHorarios(): Horario[] {
    return [...this.horarios];
  }

  /**
   * Retorna os horários livres, opcionalmente filtrando por data
   */
  public getHorariosDisponiveis(data?: Date): Horario[] {
    return this.horarios.filter((h) => {
      const isLivre = h.estaDisponivel();
      if (!isLivre) return false;
      if (!data) return true;
      return (
        h.getDataHoraInicio().getFullYear() === data.getFullYear() &&
        h.getDataHoraInicio().getMonth() === data.getMonth() &&
        h.getDataHoraInicio().getDate() === data.getDate()
      );
    });
  }

  public eHorarioLivre(horario: Horario): boolean {
    const encontrado = this.horarios.find((h) => h.getId() === horario.getId());
    return !!encontrado && encontrado.estaDisponivel();
  }

  public reservarHorario(horario: Horario): boolean {
    const h = this.horarios.find((item) => item.getId() === horario.getId());
    if (h && h.estaDisponivel()) {
      h.setStatus(StatusHorario.RESERVADO);
      return true;
    }
    return false;
  }

  public liberarHorario(horario: Horario): boolean {
    const h = this.horarios.find((item) => item.getId() === horario.getId());
    if (h) {
      h.setStatus(StatusHorario.LIVRE);
      return true;
    }
    return false;
  }

  public bloquearHorario(horario: Horario): boolean {
    const h = this.horarios.find((item) => item.getId() === horario.getId());
    if (h) {
      h.setStatus(StatusHorario.BLOQUEADO);
      return true;
    }
    return false;
  }
}

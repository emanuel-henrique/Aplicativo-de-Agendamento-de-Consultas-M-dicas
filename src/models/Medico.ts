import { Pessoa } from './Pessoa.js';
import { Agenda } from './Agenda.js';
import { Horario } from './Horario.js';
import type { Especialidade } from './Especialidade.js';
import type { Consulta } from './Consulta.js';

/**
 * Classe Medico
 * Especialista de saúde que gerencia sua agenda
 */
export class Medico extends Pessoa {
  private crm: string;
  private valorConsulta: number;
  private agenda: Agenda;
  private especialidades: Especialidade[] = [];

  constructor(
    id: number,
    nome: string,
    cpf: string,
    email: string,
    telefone: string,
    senhaHash: string,
    crm: string,
    valorConsulta: number,
    agenda?: Agenda
  ) {
    super(id, nome, cpf, email, telefone, senhaHash);
    this.crm = crm;
    this.valorConsulta = valorConsulta;
    // Composição: cada médico possui exatamente uma agenda
    this.agenda = agenda ?? new Agenda(id, new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  }

  public getCrm(): string {
    return this.crm;
  }

  public getValorConsulta(): number {
    return this.valorConsulta;
  }

  public getAgenda(): Agenda {
    return this.agenda;
  }

  public getEspecialidades(): Especialidade[] {
    return [...this.especialidades];
  }

  public adicionarEspecialidade(especialidade: Especialidade): void {
    if (!this.especialidades.some((e) => e.getId() === especialidade.getId())) {
      this.especialidades.push(especialidade);
      especialidade.adicionarMedico(this);
    }
  }

  public definirHorariosDisponiveis(horarios: Horario[]): void {
    for (const h of horarios) {
      this.agenda.adicionarHorario(h);
    }
    console.log(`[Médico Dr(a). ${this.nome}] ${horarios.length} horários disponibilizados na agenda.`);
  }

  public bloquearHorario(horario: Horario): void {
    this.agenda.bloquearHorario(horario);
    console.log(`[Médico Dr(a). ${this.nome}] Horário ${horario.getId()} bloqueado.`);
  }

  public liberarHorario(horario: Horario): void {
    this.agenda.liberarHorario(horario);
    console.log(`[Médico Dr(a). ${this.nome}] Horário ${horario.getId()} liberado na agenda.`);
  }

  public reservarHorario(horario: Horario): void {
    this.agenda.reservarHorario(horario);
    console.log(`[Médico Dr(a). ${this.nome}] Horário ${horario.getId()} reservado na agenda.`);
  }

  public visualizarAgenda(): Horario[] {
    return this.agenda.getHorarios();
  }

  public aceitarRecusarConsulta(consulta: Consulta, aceitar: boolean): void {
    if (aceitar) {
      console.log(`[Médico Dr(a). ${this.nome}] Aceitou a consulta #${consulta.getId()}.`);
    } else {
      console.log(`[Médico Dr(a). ${this.nome}] Recusou a consulta #${consulta.getId()}.`);
    }
  }
}

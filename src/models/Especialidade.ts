import type { Medico } from './Medico.js';

/**
 * Classe Especialidade
 * Área médica com relação N:M com Medico
 */
export class Especialidade {
  private id: number;
  private nome: string;
  private descricao: string;
  private medicos: Medico[] = [];

  constructor(id: number, nome: string, descricao: string) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
  }

  public getId(): number {
    return this.id;
  }

  public getNome(): string {
    return this.nome;
  }

  public getDescricao(): string {
    return this.descricao;
  }

  public adicionarMedico(medico: Medico): void {
    if (!this.medicos.some((m) => m.getId() === medico.getId())) {
      this.medicos.push(medico);
    }
  }

  public listarMedicos(): Medico[] {
    return [...this.medicos];
  }
}

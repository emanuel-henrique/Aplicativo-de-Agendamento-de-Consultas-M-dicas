import { Pessoa } from './Pessoa.js';
import { Consulta } from './Consulta.js';
import { Horario } from './Horario.js';

/**
 * Classe Secretario
 * Usuário administrativo responsável por validar, confirmar ou rejeitar solicitações de consulta
 */
export class Secretario extends Pessoa {
  private matricula: string;

  constructor(
    id: number,
    nome: string,
    cpf: string,
    email: string,
    telefone: string,
    senhaHash: string,
    matricula: string
  ) {
    super(id, nome, cpf, email, telefone, senhaHash);
    this.matricula = matricula;
  }

  public getMatricula(): string {
    return this.matricula;
  }

  public confirmarConsulta(consulta: Consulta): void {
    consulta.confirmar(this);
    console.log(
      `[Secretário(a) ${this.nome}] Consulta #${consulta.getId()} confirmada com sucesso para o paciente ${consulta.getPaciente().getNome()}.`
    );
  }

  public rejeitarSolicitacao(consulta: Consulta, motivo: string): void {
    consulta.cancelar(`Rejeitada pela secretaria: ${motivo}`);
    consulta.getMedico().liberarHorario(consulta.getHorario());
    console.log(
      `[Secretário(a) ${this.nome}] Solicitação #${consulta.getId()} rejeitada. Motivo: ${motivo}`
    );
  }

  public remarcarConsulta(consulta: Consulta, novoHorario: Horario): void {
    const horarioAntigo = consulta.getHorario();
    const sucesso = consulta.remarcar(novoHorario);
    if (sucesso) {
      consulta.getMedico().liberarHorario(horarioAntigo);
      consulta.getMedico().reservarHorario(novoHorario);
      console.log(
        `[Secretário(a) ${this.nome}] Consulta #${consulta.getId()} remarcada administrativamente para o novo horário.`
      );
    } else {
      console.warn(`[Secretário(a) ${this.nome}] Horário indisponível para remarcação.`);
    }
  }
}

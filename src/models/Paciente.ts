import { Pessoa } from './Pessoa.js';
import { Especialidade } from './Especialidade.js';
import { Medico } from './Medico.js';
import { Horario } from './Horario.js';
import { Consulta } from './Consulta.js';

/**
 * Classe Paciente
 * Usuário final que agenda, remarca e cancela consultas
 */
export class Paciente extends Pessoa {
  private dataNascimento: Date;
  private planoSaude: string;

  constructor(
    id: number,
    nome: string,
    cpf: string,
    email: string,
    telefone: string,
    senhaHash: string,
    dataNascimento: Date,
    planoSaude: string
  ) {
    super(id, nome, cpf, email, telefone, senhaHash);
    this.dataNascimento = dataNascimento;
    this.planoSaude = planoSaude;
  }

  public getDataNascimento(): Date {
    return this.dataNascimento;
  }

  public getPlanoSaude(): string {
    return this.planoSaude;
  }

  public buscarMedico(especialidade: Especialidade): Medico[] {
    return especialidade.listarMedicos();
  }

  public agendarConsulta(idConsulta: number, medico: Medico, horario: Horario): Consulta {
    const consulta = new Consulta(idConsulta, this, medico, horario);
    medico.reservarHorario(horario);
    console.log(
      `[Paciente ${this.nome}] Agendamento solicitado para ${medico.getNome()} no horário ${horario.formatar()}. Aguardando confirmação.`
    );
    return consulta;
  }

  public cancelarConsulta(consulta: Consulta, motivo: string = 'Solicitado pelo paciente'): boolean {
    if (consulta.getPaciente().getId() !== this.id) {
      console.warn(`[Paciente ${this.nome}] Não é permitido cancelar consulta de outro paciente.`);
      return false;
    }
    const sucesso = consulta.cancelar(motivo);
    if (sucesso) {
      consulta.getMedico().liberarHorario(consulta.getHorario());
      console.log(`[Paciente ${this.nome}] Cancelou a consulta #${consulta.getId()}. Motivo: ${motivo}`);
    }
    return sucesso;
  }

  public remarcarConsulta(consulta: Consulta, novoHorario: Horario): boolean {
    if (consulta.getPaciente().getId() !== this.id) {
      console.warn(`[Paciente ${this.nome}] Não é permitido remarcar consulta de outro paciente.`);
      return false;
    }
    const horarioAntigo = consulta.getHorario();
    const sucesso = consulta.remarcar(novoHorario);
    if (sucesso) {
      consulta.getMedico().liberarHorario(horarioAntigo);
      consulta.getMedico().reservarHorario(novoHorario);
      console.log(
        `[Paciente ${this.nome}] Consulta #${consulta.getId()} remarcada para ${novoHorario.formatar()}.`
      );
    } else {
      console.warn(`[Paciente ${this.nome}] Horário desejado não está disponível para remarcação.`);
    }
    return sucesso;
  }
}

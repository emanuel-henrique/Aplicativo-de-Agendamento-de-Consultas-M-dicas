import { TipoNotificacao } from '../enums.js';
import { Pessoa } from './Pessoa.js';

/**
 * Classe Notificacao
 * Mensagem disparada pelo sistema/secretário direcionada a uma Pessoa
 */
export class Notificacao {
  private id: number;
  private destinatario: Pessoa;
  private tipo: TipoNotificacao;
  private conteudo: string;
  private dataEnvio: Date;
  private lida: boolean = false;

  constructor(
    id: number,
    destinatario: Pessoa,
    tipo: TipoNotificacao,
    conteudo: string,
    dataEnvio: Date = new Date()
  ) {
    this.id = id;
    this.destinatario = destinatario;
    this.tipo = tipo;
    this.conteudo = conteudo;
    this.dataEnvio = dataEnvio;
  }

  public getId(): number {
    return this.id;
  }

  public getDestinatario(): Pessoa {
    return this.destinatario;
  }

  public getTipo(): TipoNotificacao {
    return this.tipo;
  }

  public getConteudo(): string {
    return this.conteudo;
  }

  public getDataEnvio(): Date {
    return this.dataEnvio;
  }

  public isLida(): boolean {
    return this.lida;
  }

  public marcarComoLida(): void {
    this.lida = true;
  }

  public enviar(): boolean {
    console.log(
      `[Notificação enviada via ${this.tipo}] Para: ${this.destinatario.getNome()} (${this.destinatario.getEmail()}) | Mensagem: "${this.conteudo}"`
    );
    return true;
  }
}

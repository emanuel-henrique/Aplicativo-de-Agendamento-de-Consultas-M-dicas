import { Notificacao } from '../models/Notificacao.js';

/**
 * Classe SistemaNotificacao
 * Serviço automatizado responsável pelo envio, reenvio e monitoramento de notificações
 */
export class SistemaNotificacao {
  private instanciasEnviadas: Notificacao[] = [];

  public enviar(notificacao: Notificacao): boolean {
    const enviado = notificacao.enviar();
    if (enviado) {
      this.instanciasEnviadas.push(notificacao);
    }
    return enviado;
  }

  public reenviar(notificacao: Notificacao): boolean {
    console.log(`[Sistema de Notificação] Reenviando notificação #${notificacao.getId()}...`);
    return this.enviar(notificacao);
  }

  public consultarStatusEnvio(idNotificacao: number): string {
    const notif = this.instanciasEnviadas.find((n) => n.getId() === idNotificacao);
    if (!notif) {
      return 'Notificação não encontrada.';
    }
    return `Notificação #${notif.getId()} enviada via ${notif.getTipo()} em ${notif
      .getDataEnvio()
      .toISOString()} | Lida: ${notif.isLida() ? 'Sim' : 'Não'}`;
  }

  public getInstanciasEnviadas(): Notificacao[] {
    return [...this.instanciasEnviadas];
  }
}

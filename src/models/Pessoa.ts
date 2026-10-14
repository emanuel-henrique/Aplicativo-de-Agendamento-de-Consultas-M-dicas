/**
 * Classe abstrata Pessoa
 * Superclasse base para usuários do sistema (Paciente, Medico, Secretario)
 */
export abstract class Pessoa {
  protected id: number;
  protected nome: string;
  protected cpf: string;
  protected email: string;
  protected telefone: string;
  protected senhaHash: string;
  protected autenticado: boolean = false;

  constructor(
    id: number,
    nome: string,
    cpf: string,
    email: string,
    telefone: string,
    senhaHash: string
  ) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    this.telefone = telefone;
    this.senhaHash = senhaHash;
  }

  public getId(): number {
    return this.id;
  }

  public getNome(): string {
    return this.nome;
  }

  public getCpf(): string {
    return this.cpf;
  }

  public getEmail(): string {
    return this.email;
  }

  public getTelefone(): string {
    return this.telefone;
  }

  public login(senha: string): boolean {
    // Verificação simples de senha/hash para fins de demonstração
    if (this.senhaHash === senha) {
      this.autenticado = true;
      console.log(`[Autenticação] ${this.nome} realizou login com sucesso.`);
      return true;
    }
    console.warn(`[Autenticação] Falha no login para ${this.nome}: senha incorreta.`);
    return false;
  }

  public logout(): void {
    this.autenticado = false;
    console.log(`[Autenticação] ${this.nome} realizou logout.`);
  }

  public atualizarCadastro(dados: {
    nome?: string;
    email?: string;
    telefone?: string;
    senhaHash?: string;
  }): void {
    if (dados.nome) this.nome = dados.nome;
    if (dados.email) this.email = dados.email;
    if (dados.telefone) this.telefone = dados.telefone;
    if (dados.senhaHash) this.senhaHash = dados.senhaHash;
    console.log(`[Cadastro] Dados de ${this.nome} atualizados com sucesso.`);
  }
}

export class Dish {
  constructor(
    public nome: string,
    public descricao: string,
    public categoria: string,
    public tempoPreparo: number,
    public preco: number,
    public tamanhoPorcao: string,
    public informacaoNutricional: NutritionalInfo,
    public imagem: string,
    public menu: string, 
    public criadoEm?: Date
  ) {}
}

export class NutritionalInfo {
  constructor(
    public calorias: number,
    public proteinas: number,
    public carboidratos: number,
    public gorduras: number,
    public sodio: number
  ) {}
}

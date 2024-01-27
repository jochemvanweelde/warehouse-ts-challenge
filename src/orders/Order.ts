export class Order {
  public id: number;
  public productMap: Map<string, number>;
  public installationDate: Date;

  constructor({
    id,
    articles,
    installationDate,
  }: {
    id: number;
    articles: string[];
    installationDate: string;
  }) {
    this.id = id;
    this.productMap = new Map();
    articles.forEach((entry) => {
      this.productMap.set(entry, (this.productMap.get(entry) || 0) + 1);
    });
    this.installationDate = new Date(installationDate);
  }
}

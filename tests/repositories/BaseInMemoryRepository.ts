export abstract class BaseInMemoryRepository<T> {
  protected items: T[] = [];

  public addItem(item: T): void {
    this.items.push(item);
  }

  public addItems(items: T[]): void {
    this.items.push(...items);
  }

  public clear(): void {
    this.items = [];
  }

  public getAllItems(): T[] {
    return [...this.items];
  }

  public async count(): Promise<number> {
    return this.items.length;
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  protected generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  protected findByProperty<K extends keyof T>(property: K, value: T[K]): T | undefined {
    return this.items.find((item) => item[property] === value);
  }

  protected findAllByProperty<K extends keyof T>(property: K, value: T[K]): T[] {
    return this.items.filter((item) => item[property] === value);
  }

  protected updateByProperty<K extends keyof T>(property: K, value: T[K], updates: Partial<T>): boolean {
    const item = this.findByProperty(property, value);
    if (item) {
      Object.assign(item, updates);
      return true;
    }
    return false;
  }

  protected removeByProperty<K extends keyof T>(property: K, value: T[K]): boolean {
    const index = this.items.findIndex((item) => item[property] === value);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}

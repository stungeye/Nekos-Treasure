class LocalStorageStore {
  namespace: string;
  cache: Record<string, any>;

  constructor(namespace: string = "app") {
    this.namespace = namespace;
    this.cache = {};
    this.loadFromStorage();
  }

  loadFromStorage(): void {
    const storedData = localStorage.getItem(this.namespace);
    if (storedData) {
      this.cache = JSON.parse(storedData);
    }
  }

  saveToStorage(): void {
    localStorage.setItem(this.namespace, JSON.stringify(this.cache));
  }

  get(key: string): any {
    return this.cache[key];
  }

  set(key: string, value: any): void {
    this.cache[key] = value;
    this.saveToStorage();
  }

  delete(key: string): void {
    delete this.cache[key];
    this.saveToStorage();
  }

  clear(): void {
    this.cache = {};
    localStorage.removeItem(this.namespace);
  }

  getAll(): Record<string, any> {
    return { ...this.cache };
  }
}

export default LocalStorageStore;

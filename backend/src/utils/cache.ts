// Cache simple en memoria para boletas
class CacheService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private TTL = 5000; // 5 segundos de TTL

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Verificar si expiró
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();

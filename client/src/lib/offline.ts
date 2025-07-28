// Offline functionality utilities

export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const setupOfflineHandling = (): void => {
  window.addEventListener('online', () => {
    console.log('App is now online');
    // Optionally sync data or show notification
  });

  window.addEventListener('offline', () => {
    console.log('App is now offline');
    // Show offline indicator or cache data
  });
};

// Enhanced local storage with compression and error handling
export class OfflineStorage {
  private static compress(data: string): string {
    try {
      // Simple compression using JSON stringify optimizations
      return JSON.stringify(JSON.parse(data));
    } catch {
      return data;
    }
  }

  private static decompress(data: string): string {
    return data;
  }

  static setItem(key: string, value: any): boolean {
    try {
      const serialized = JSON.stringify(value);
      const compressed = this.compress(serialized);
      localStorage.setItem(key, compressed);
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const compressed = localStorage.getItem(key);
      if (!compressed) return null;
      
      const decompressed = this.decompress(compressed);
      return JSON.parse(decompressed) as T;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  }

  static clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  static getStorageInfo(): { used: number; remaining: number; total: number } {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // Estimate remaining storage (5MB typical limit)
    const total = 5 * 1024 * 1024; // 5MB in bytes
    const remaining = total - used;

    return { used, remaining, total };
  }
}
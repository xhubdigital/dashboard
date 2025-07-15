export const USER_TOKEN_KEY = 'ut';
export const REFRESH_TOKEN_KEY = 'rt';

class LocalStorageHelper {
  get<T>(key: string) {
    const value = localStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  set(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}

export const localStorageHelper = new LocalStorageHelper();

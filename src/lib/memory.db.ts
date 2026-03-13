import { AdminConfig } from './admin.types';
import { Favorite, IStorage, PlayRecord, SkipConfig } from './types';

export class MemoryStorage implements IStorage {
  private playRecords: Map<string, { [key: string]: PlayRecord }> = new Map();
  private favorites: Map<string, { [key: string]: Favorite }> = new Map();
  private users: Map<string, string> = new Map();
  private searchHistory: Map<string, string[]> = new Map();
  private adminConfig: AdminConfig | null = null;
  private skipConfigs: Map<string, { [key: string]: SkipConfig }> = new Map();

  async getPlayRecord(userName: string, key: string): Promise<PlayRecord | null> {
    return this.playRecords.get(userName)?.[key] || null;
  }

  async setPlayRecord(userName: string, key: string, record: PlayRecord): Promise<void> {
    if (!this.playRecords.has(userName)) this.playRecords.set(userName, {});
    this.playRecords.get(userName)![key] = record;
  }

  async getAllPlayRecords(userName: string): Promise<{ [key: string]: PlayRecord }> {
    return this.playRecords.get(userName) || {};
  }

  async deletePlayRecord(userName: string, key: string): Promise<void> {
    delete this.playRecords.get(userName)?.[key];
  }

  async deleteAllPlayRecords(userName: string): Promise<void> {
    this.playRecords.delete(userName);
  }

  async getFavorite(userName: string, key: string): Promise<Favorite | null> {
    return this.favorites.get(userName)?.[key] || null;
  }

  async setFavorite(userName: string, key: string, favorite: Favorite): Promise<void> {
    if (!this.favorites.has(userName)) this.favorites.set(userName, {});
    this.favorites.get(userName)![key] = favorite;
  }

  async getAllFavorites(userName: string): Promise<{ [key: string]: Favorite }> {
    return this.favorites.get(userName) || {};
  }

  async deleteFavorite(userName: string, key: string): Promise<void> {
    delete this.favorites.get(userName)?.[key];
  }

  async deleteAllFavorites(userName: string): Promise<void> {
    this.favorites.delete(userName);
  }

  async registerUser(userName: string, password: string): Promise<void> {
    this.users.set(userName, password);
  }

  async verifyUser(userName: string, password: string): Promise<boolean> {
    return this.users.get(userName) === password;
  }

  async checkUserExist(userName: string): Promise<boolean> {
    return this.users.has(userName);
  }

  async changePassword(userName: string, newPassword: string): Promise<void> {
    this.users.set(userName, newPassword);
  }

  async deleteUser(userName: string): Promise<void> {
    this.users.delete(userName);
    this.playRecords.delete(userName);
    this.favorites.delete(userName);
    this.searchHistory.delete(userName);
  }

  async getSearchHistory(userName: string): Promise<string[]> {
    return this.searchHistory.get(userName) || [];
  }

  async addSearchHistory(userName: string, keyword: string): Promise<void> {
    const history = await this.getSearchHistory(userName);
    const newHistory = [keyword, ...history.filter((h: string) => h !== keyword)].slice(0, 20);
    this.searchHistory.set(userName, newHistory);
  }

  async deleteSearchHistory(userName: string, keyword?: string): Promise<void> {
    if (!keyword) {
      this.searchHistory.delete(userName);
    } else {
      const history = await this.getSearchHistory(userName);
      this.searchHistory.set(userName, history.filter((h: string) => h !== keyword));
    }
  }

  async getAllUsers(): Promise<string[]> {
    return Array.from(this.users.keys());
  }

  async getAdminConfig(): Promise<AdminConfig | null> {
    return this.adminConfig;
  }

  async setAdminConfig(config: AdminConfig): Promise<void> {
    this.adminConfig = config;
  }

  async getSkipConfig(userName: string, source: string, id: string): Promise<SkipConfig | null> {
    const key = `${source}+${id}`;
    return this.skipConfigs.get(userName)?.[key] || null;
  }

  async setSkipConfig(userName: string, source: string, id: string, config: SkipConfig): Promise<void> {
    const key = `${source}+${id}`;
    if (!this.skipConfigs.has(userName)) this.skipConfigs.set(userName, {});
    this.skipConfigs.get(userName)![key] = config;
  }

  async deleteSkipConfig(userName: string, source: string, id: string): Promise<void> {
    const key = `${source}+${id}`;
    delete this.skipConfigs.get(userName)?.[key];
  }

  async getAllSkipConfigs(userName: string): Promise<{ [key: string]: SkipConfig }> {
    return this.skipConfigs.get(userName) || {};
  }

  async clearAllData(): Promise<void> {
    this.playRecords.clear();
    this.favorites.clear();
    this.users.clear();
    this.searchHistory.clear();
    this.adminConfig = null;
    this.skipConfigs.clear();
  }
}

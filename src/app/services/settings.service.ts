import { Injectable } from '@angular/core';
import { LocalCanteen, RemoteCanteen } from '../models/canteen';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Settings } from '../models/settings';
import { ToastController } from '@ionic/angular';
import { CalendarEventRaw } from '../models/event';

const CANTINE_STORAGE_KEY = 'myCanteens';
const SETTINGS_STORAGE_KEY = 'settings';
const SETTINGS_CACHE_KEY = 'cached';
const DEFAULT_TOAST_DURATION = 3000;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  canteens: LocalCanteen[] = [];

  selectedCanteen?: LocalCanteen;

  settings: Settings = {
    notifications: true,
    notificationsDay: 0,
    notificationsTimeHour: 12,
    notificationsTimeMinute: 0
  };

  updatedCanteens: Subject<LocalCanteen[]> = new Subject();

  updatedSettings: Subject<Settings> = new Subject();


  palette = ["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#f5E163", "#beb9db", "#fdcce5", "#8bd3c7"]

  constructor(
    private storage: Storage,
    private router: Router,
    private toastController: ToastController
  ) {
    this.init();
  }

  async init() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
    this.canteens = await this.getMyCanteens();
  }

  async getMyCanteens(): Promise<LocalCanteen[]> {
    const canteens = await this.storage.get(CANTINE_STORAGE_KEY);
    return canteens || [];
  }

  async addCanteen(canteen: LocalCanteen): Promise<boolean> {
    const canteens = await this.getMyCanteens();
    if (!canteens.find((c) => c.canteen.id === canteen.canteen.id)) {
      canteens.push(canteen);
      this.saveCanteens(canteens);
      return true;
    }
    return false;
  }

  async updateLocalCanteensValues(canteens: RemoteCanteen[]) {
    const myCanteens = await this.getMyCanteens();
    myCanteens.forEach((c) => {
      const remoteCanteen = canteens.find((rc) => rc.id === c.canteen.id);
      if (remoteCanteen) {
        c.canteen = remoteCanteen;
      }
    });
    this.saveCanteens(myCanteens);
  }

  async updateCanteen(canteen: LocalCanteen): Promise<void> {
    const canteens = await this.getMyCanteens();
    const index = canteens.findIndex((c) => c.canteen.id === canteen.canteen.id);
    canteens[index] = canteen;
    this.saveCanteens(canteens);
  }

  async removeCanteen(canteen: LocalCanteen): Promise<void> {
    const canteens = await this.getMyCanteens();
    const index = canteens.findIndex((c) => c.canteen.id === canteen.canteen.id);
    canteens.splice(index, 1);
    this.saveCanteens(canteens);
    this.presentToast(`${canteen.name} rimossa!`, 'danger');
  }

  async saveCanteens(canteens: LocalCanteen[]): Promise<void> {
    await this.storage.set(CANTINE_STORAGE_KEY, canteens);
    this.canteens = canteens;
    this.updatedCanteens.next(canteens);
  }

  async addNewCanteen(canteen: RemoteCanteen) {
    await this.addCanteen({
      name: `${canteen.city}-${canteen.name}`,
      color: this.getNewColor(),
      canteen: canteen,
      notifications: true
    });
    this.presentToast(`${canteen.city}-${canteen.name} aggiunta!`, 'success');
  }

  async getCacheResult(canteen: LocalCanteen): Promise<CalendarEventRaw[]> {
    const results = await this.storage.get(`${SETTINGS_CACHE_KEY}-${canteen.canteen.id}`) || [];
    return results;
  }

  async saveCacheResult(canteen: LocalCanteen, results: CalendarEventRaw[]): Promise<void> {
    await this.storage.set(`${SETTINGS_CACHE_KEY}-${canteen.canteen.id}`, results);
  }

  async getCanteen(id: number): Promise<LocalCanteen | undefined> {
    const canteens = await this.getMyCanteens();
    const canteen = canteens.find((c) => c.canteen.id == id);
    return canteen;
  }

  openCanteen(canteenId: number) {
    this.router.navigate(['/canteen-detail'], { queryParams: { id: canteenId } });
  }

  async getSettings() {
    this.settings = await this.storage.get(SETTINGS_STORAGE_KEY) || this.settings;
    return this.settings;
  }

  async updateSettings(settings: Settings) {
    await this.storage.set(SETTINGS_STORAGE_KEY, settings);
    this.settings = settings;
    this.updatedSettings.next(settings);
  }

  getNewColor(): string {
    for (let color of this.palette) {
      const canteenUsing = this.canteens.find((c) => c.color === color);
      if (!canteenUsing) {
        return color;
      }
    }
    return this.palette[0];
  }

  getColors(): string[] {
    return this.palette;
  }

  async presentToast(
    message: string,
    color: 'secondary' | 'primary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'dark' | 'medium' | 'light' = 'dark',
    position: 'top' | 'middle' | 'bottom' = 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: DEFAULT_TOAST_DURATION,
      color: color,
      position: position,
    });

    await toast.present();
  }
}

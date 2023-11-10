import { Injectable } from '@angular/core';
import { LocalCantine, RemoteCantine } from '../models/cantine';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Settings } from '../models/settings';
import { ToastController } from '@ionic/angular';
import { CalendarEventRaw } from '../models/event';

const CANTINE_STORAGE_KEY = 'myCantines';
const SETTINGS_STORAGE_KEY = 'settings';
const SETTINGS_CACHE_KEY = 'cached';
const DEFAULT_TOAST_DURATION = 1500;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  cantines: LocalCantine[] = [];

  selectedCantine?: LocalCantine;

  settings: Settings = {
    notifications: true,
    notificationsDay: 0,
    notificationsTimeHour: 12,
    notificationsTimeMinute: 0
  };

  updatedCantines: Subject<LocalCantine[]> = new Subject();

  updatedSettings: Subject<Settings> = new Subject();


  palette = [
    '#FFCCCC',
    '#FFFFCC',
    '#CCFFCC',
    '#FFDAB9',
    '#E6E6FF',
    '#B2E5FF',
    '#CCFFE5',
    '#FFFCDA',
    '#E0E0E0',
    '#FFE0B2',
    '#E6CCFF',
    '#B2FFFF',
    '#E4C1DE',
  ];

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
    this.cantines = await this.getMyCantines();
  }

  async getMyCantines(): Promise<LocalCantine[]> {
    const cantines = await this.storage.get(CANTINE_STORAGE_KEY);
    return cantines || [];
  }

  async addCantine(cantine: LocalCantine): Promise<boolean> {
    const cantines = await this.getMyCantines();
    if (!cantines.find((c) => c.cantine.id === cantine.cantine.id)) {
      cantines.push(cantine);
      this.saveCantines(cantines);
      return true;
    }
    return false;
  }

  async updateLocalCantinesValues(cantines: RemoteCantine[]) {
    const myCantines = await this.getMyCantines();
    myCantines.forEach((c) => {
      const remoteCantine = cantines.find((rc) => rc.id === c.cantine.id);
      if (remoteCantine) {
        c.cantine = remoteCantine;
      }
    });
    this.saveCantines(myCantines);
  }

  async updateCantine(cantine: LocalCantine): Promise<void> {
    const cantines = await this.getMyCantines();
    const index = cantines.findIndex((c) => c.cantine.id === cantine.cantine.id);
    cantines[index] = cantine;
    this.saveCantines(cantines);
  }

  async removeCantine(cantine: LocalCantine): Promise<void> {
    const cantines = await this.getMyCantines();
    const index = cantines.findIndex((c) => c.cantine.id === cantine.cantine.id);
    cantines.splice(index, 1);
    this.saveCantines(cantines);
    this.presentToast(`${cantine.name} rimossa!`, 'danger');
  }

  async saveCantines(cantines: LocalCantine[]): Promise<void> {
    await this.storage.set(CANTINE_STORAGE_KEY, cantines);
    this.cantines = cantines;
    this.updatedCantines.next(cantines);
  }

  async addNewCantine(cantine: RemoteCantine) {
    await this.addCantine({
      name: `${cantine.city}-${cantine.name}`,
      color: this.getNewColor(),
      cantine: cantine,
      notifications: true
    });
    this.presentToast(`${cantine.city}-${cantine.name} aggiunta!`, 'success');
  }

  async getCacheResult(cantine: LocalCantine): Promise<CalendarEventRaw[]> {
    const results = await this.storage.get(`${SETTINGS_CACHE_KEY}-${cantine.cantine.id}`) || [];
    return results;
  }

  async saveCacheResult(cantine: LocalCantine, results: CalendarEventRaw[]): Promise<void> {
    await this.storage.set(`${SETTINGS_CACHE_KEY}-${cantine.cantine.id}`, results);
  }

  async getCantine(id: number): Promise<LocalCantine | undefined> {
    const cantines = await this.getMyCantines();
    const cantine = cantines.find((c) => c.cantine.id == id);
    return cantine;
  }

  openCantine(cantineId: number) {
    this.router.navigate(['/cantine-detail'], { queryParams: { id: cantineId } });
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
      const cantineUsing = this.cantines.find((c) => c.color === color);
      if (!cantineUsing) {
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

import { Injectable } from '@angular/core';
import { LocalCantine, RemoteCantine } from '../models/cantine';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

const CANTINE_STORAGE_KEY = "myCantines";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  cantines: LocalCantine[] = [];

  selectedCantine?: LocalCantine;

  palette = [
    '#FFCCCC',
    '#FFFFCC',
    '#CCFFCC',
    '#CCE5FF',
    '#DDCCFF',
    '#FFDAB9',
    '#FFD8B1',
    '#E6E6FF',
    '#B2E5FF',
    '#CCFFE5',
    '#FFFCDA',
    '#FFCCCC',
    '#E0E0E0',
    '#FFFFCC',
    '#FFE0B2',
    '#E6CCFF',
    '#B2FFFF',
    '#E4C1DE',
    '#F5F5DC',
    '#E6E6FA',
  ];

  constructor(
    private storage: Storage,
    private router: Router
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

  async addCantine(cantine: LocalCantine): Promise<void> {
    const cantines = await this.getMyCantines();
    cantines.push(cantine);
    await this.storage.set(CANTINE_STORAGE_KEY, cantines);
  }

  async updateCantine(cantine: LocalCantine): Promise<void> {
    const cantines = await this.getMyCantines();
    const index = cantines.findIndex((c) => c.cantine.id === cantine.cantine.id);
    cantines[index] = cantine;
    await this.storage.set(CANTINE_STORAGE_KEY, cantines);
  }

  async removeCantine(cantine: LocalCantine): Promise<void> {
    const cantines = await this.getMyCantines();
    const index = cantines.findIndex((c) => c.cantine.id === cantine.cantine.id);
    cantines.splice(index, 1);
    await this.storage.set(CANTINE_STORAGE_KEY, cantines);
  }

  async addNewCantine(cantine: RemoteCantine) {
    await this.addCantine({
      name: `${cantine.city}-${cantine.name}`,
      color: this.getNewColor(),
      cantine: cantine,
    });

  }

  openCantine(cantineId: number) {
    this.selectedCantine = this.cantines.find((c) => c.cantine.id === cantineId);
    if (this.selectedCantine) {
      this.router.navigate(['/cantine-detail']);
    }
  }

  getNewColor(): string {
    for (let color in this.palette) {
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
}

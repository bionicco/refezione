import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CantineDetailPage } from './cantine-detail.page';

describe('CantineDetailPage', () => {
  let component: CantineDetailPage;
  let fixture: ComponentFixture<CantineDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CantineDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

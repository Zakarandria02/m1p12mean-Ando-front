import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttribueTacheComponent } from './attribue-tache.component';

describe('AttribueTacheComponent', () => {
  let component: AttribueTacheComponent;
  let fixture: ComponentFixture<AttribueTacheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttribueTacheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttribueTacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

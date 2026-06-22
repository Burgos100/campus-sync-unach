import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoInscripcionesComponent } from './alumno-inscripciones.component';

describe('AlumnoInscripcionesComponent', () => {
  let component: AlumnoInscripcionesComponent;
  let fixture: ComponentFixture<AlumnoInscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnoInscripcionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlumnoInscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

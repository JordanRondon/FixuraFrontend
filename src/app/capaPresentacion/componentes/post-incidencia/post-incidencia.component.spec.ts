import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostIncidenciaComponent } from './post-incidencia.component';

describe('PostIncidenciaComponent', () => {
  let component: PostIncidenciaComponent;
  let fixture: ComponentFixture<PostIncidenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostIncidenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostIncidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

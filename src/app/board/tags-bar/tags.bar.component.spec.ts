import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TagsBarComponent } from './tags-bar.component';
import * as BoardActions from '../store/board.actions';

describe('TagsBarComponent', () => {
  let component: TagsBarComponent;
  let fixture: ComponentFixture<TagsBarComponent>;
  let mockStore: MockStore;

  const initialState = {
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagsBarComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(TagsBarComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch fetchTags action on ngOnInit', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(BoardActions.fetchTags());
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const unsubscribeSpy = spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});

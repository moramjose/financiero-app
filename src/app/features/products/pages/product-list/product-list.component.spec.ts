import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: any;

  beforeEach(async () => {
    productServiceMock = {
      getProducts: jest.fn().mockReturnValue(of([
        { id: '1', name: 'Test Product', description: 'Desc', logo: 'logo', date_release: '2025-01-01', date_revision: '2026-01-01' }
      ])),
      deleteProduct: jest.fn().mockReturnValue(of(void 0))
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: productServiceMock }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productServiceMock.getProducts).toHaveBeenCalled();
    expect(component.products().length).toBe(1);
  });

  it('should filter products', () => {
    component.searchTerm.set('Test');
    expect(component.filteredProducts().length).toBe(1);
    
    component.searchTerm.set('NotFound');
    expect(component.filteredProducts().length).toBe(0);
  });
});

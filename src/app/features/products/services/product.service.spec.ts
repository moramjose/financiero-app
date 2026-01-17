import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    { id: '1', name: 'Product 1', description: 'Desc 1', logo: 'img1', date_release: '2025-01-01', date_revision: '2026-01-01' },
    { id: '2', name: 'Product 2', description: 'Desc 2', logo: 'img2', date_release: '2025-02-01', date_revision: '2026-02-01' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products (GET)', () => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should create a product (POST)', () => {
    const newProduct = mockProducts[0];
    service.createProduct(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('should update a product (PUT)', () => {
    const mkProduct = mockProducts[0];
    service.updateProduct(mkProduct).subscribe(product => {
      expect(product).toEqual(mkProduct);
    });

    const req = httpMock.expectOne(`/bp/products/${mkProduct.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mkProduct);
  });

  it('should delete a product (DELETE)', () => {
    service.deleteProduct('1').subscribe(res => {
      expect(res).toBeNull(); // Void
    });

    const req = httpMock.expectOne('/bp/products/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should verify if ID exists', () => {
    service.verifyId('1').subscribe(exists => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne('/bp/products/verification/1');
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
});

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _productService = inject(ProductService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  form!: FormGroup;
  isEditMode = signal<boolean>(false);
  productId = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
    
    this._route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode.set(true);
        this.productId.set(id);
        this.loadProduct(id);
        this.form.get('id')?.disable();
        this.form.get('id')?.clearAsyncValidators();
      } else {
         this.form.get('id')?.setAsyncValidators(this._productService.idValidator());
      }
    });
  }

  initForm() {
    this.form = this._fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, this.minDateValidator]],
      date_revision: [{value: '', disabled: true}, [Validators.required]]
    });

    this.form.get('date_release')?.valueChanges.subscribe(val => {
      if (val) {
        const releaseDate = new Date(val);
        // Correcting timezone offset issue for simple calculation
        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(revisionDate.getFullYear() + 1);
        
        const formatted = revisionDate.toISOString().split('T')[0];
        this.form.patchValue({ date_revision: formatted });
      }
    });
  }

  minDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    // Normalize input date to midnight (UTC) to avoid timezone issues or just compare YYYY-MM-DD
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // We need to compare carefully because input[date] gives YYYY-MM-DD.
    // If we do new Date('2023-01-01'), it might be UTC.
    // Let's assume input matches local or treat as string.
    
    // safe comparison
    const inputTime = inputDate.getTime();
    const todayTime = today.getTime();

    // Since input[date] is usually parsed as UTC midnight by Date constructor? 
    // Actually new Date('2023-10-10') is UTC. 
    // We should probably strip time components and compare.
    
    // Simpler: Compare ISO strings YYYY-MM-DD
    const inputStr = control.value;
    const todayStr = today.toISOString().split('T')[0];
    
    if (inputStr < todayStr) {
       return { minDate: true };
    }
    return null;
  }

  loadProduct(id: string) {
    // Assuming backend returns all products on GET /
    this._productService.getProducts().subscribe({
      next: (products) => {
        const product = products.find(p => p.id === id);
        if (product) {
          // Handle dates safely
          let release = product.date_release;
          if (release instanceof Date) release = release.toISOString();
          // Ensure it's YYYY-MM-DD
          release = String(release).split('T')[0];
          
          let revision = product.date_revision;
          if (revision instanceof Date) revision = revision.toISOString();
          revision = String(revision).split('T')[0];

          this.form.patchValue({
            ...product,
            date_release: release,
            date_revision: revision
          });
        }
      },
      error: (e) => console.error(e)
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const productData: Product = {
      ...this.form.getRawValue(),
    };

    const request$ = this.isEditMode() 
      ? this._productService.updateProduct(productData)
      : this._productService.createProduct(productData);

    request$.subscribe({
      next: () => this._router.navigate(['/']),
      error: (err) => alert('Error al guardar el producto')
    });
  }

  onReset() {
    this.form.reset();
  }

  onBack() {
    this._router.navigate(['/']);
  }
  
  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && (control?.dirty || control?.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors) return '';
    
    if (control.hasError('required')) return 'Este campo es requerido';
    if (control.hasError('minlength')) return `El mínimo son ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.hasError('maxlength')) return `El máximo son ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.hasError('idExists')) return 'El ID ya existe';
    if (control.hasError('minDate')) return 'La fecha debe ser actual o futura';
    
    return 'Valor inválido';
  }
}

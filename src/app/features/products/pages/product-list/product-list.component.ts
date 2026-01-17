import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Still good for pipes if needed, or stick to standalone
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { DeleteModalComponent } from '../../components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DeleteModalComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private _productService = inject(ProductService);
  private _router = inject(Router);

  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  searchTerm = signal<string>('');
  itemsPerPage = signal<number>(5);
  
  // For context menu
  activeMenuId = signal<string | null>(null);

  // For delete modal
  showDeleteModal = signal<boolean>(false);
  productToDelete = signal<Product | null>(null);

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const products = this.products();
    const limit = this.itemsPerPage();
    
    let filtered = products;
    if (term) {
      filtered = products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
    }
    
    return filtered.slice(0, limit);
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this._productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    }); // restored to clean version thanks to service mapper
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
  }

  onLimitChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage.set(Number(target.value));
  }

  toggleMenu(id: string, event: Event) {
    event.stopPropagation();
    if (this.activeMenuId() === id) {
      this.activeMenuId.set(null);
    } else {
      this.activeMenuId.set(id);
    }
  }

  closeMenu() {
    this.activeMenuId.set(null);
  }

  editProduct(product: Product) {
    this._router.navigate(['/edit', product.id]);
  }

  confirmDelete(product: Product) {
    this.productToDelete.set(product);
    this.showDeleteModal.set(true);
    this.closeMenu();
  }

  onDeleteConfirmed() {
    const product = this.productToDelete();
    if (product) {
      this._productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loadProducts(); // Refresh list
          this.closeDeleteModal();
        },
        error: (err) => alert('Error al eliminar el producto')
      });
    }
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }

  // Click outside to close menu
  onDocumentClick() {
    this.closeMenu();
  }
}

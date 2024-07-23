import { ProductsService } from "./products.service";

export class ProductsController {
  constructor(private productsService: ProductsService) {}
}

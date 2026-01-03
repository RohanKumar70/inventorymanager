package com.rohan.inventorymanager.backend.controller;
import java.util.List;
import java.util.Map;
import com.rohan.inventorymanager.backend.model.Product;
import com.rohan.inventorymanager.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/products")
@CrossOrigin
public class ProductController {
    private final ProductService service;
    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Product add(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        int quantity = (int) body.get("quantity");
        return service.addProduct(name, quantity);
    }

    @PostMapping("/{id}/remove")
    public Product remove(@PathVariable Long id) {
        return service.removeOne(id);
    }

}

package com.rohan.inventorymanager.backend.service;
import com.rohan.inventorymanager.backend.model.Product;
import com.rohan.inventorymanager.backend.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository repo;
    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }
    public List<Product> getAll() {
        return repo.findAll();
    }
    public Product addProduct(String name, int quantity) {
        Product product = repo.findByNameIgnoreCase(name).orElse(new Product(name, 0));
        product.setQuantity(product.getQuantity() + quantity);
        return repo.save(product);
    }

    public Product removeOne(Long id) {
        Product product = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product not found"));
        if (product.getQuantity() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock.");
        }
        int newQuantity = product.getQuantity() - 1;
        if(newQuantity == 0){
            repo.delete(product);
            return null;
        }
        product.setQuantity(newQuantity);
        return repo.save(product);
    }

}

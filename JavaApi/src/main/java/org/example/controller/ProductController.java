package org.example.controller;

import org.example.dto.product.ProductItemDTO;
import org.example.dto.product.ProductPostDTO;
import org.example.entities.ProductEntity;
import org.example.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<ProductItemDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ProductItemDTO getProductById(@PathVariable Integer id) {
        return productService.getProductById(id);
    }

    @PostMapping(consumes = MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductEntity> createProduct(@ModelAttribute ProductPostDTO product) {
        ProductEntity createdProduct = productService.createProduct(product);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @PutMapping(path="/{id}", consumes = MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateProduct(@PathVariable Integer id, @ModelAttribute ProductPostDTO product) {
        //1.Отримуємо спиок усіх фото у проудкті
        //2.Шукаємо по назву, продуктів, яких немає у product.images із актрибутом old-image
        //3.Видаляємо дані фото і файли у файловій системі.
        //4.Інші файли, які залишилися, мінієямо їм пріорітет згідно номера у масиві product.images
        //5.Усі інші файли, які не type="old-image" додаємо, як нові файли і ставимо їм пріорітет - згідно
        //номера масиву в послідовності product.images
        return productService.updateProduct(id, product)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        return productService.deleteProduct(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
}
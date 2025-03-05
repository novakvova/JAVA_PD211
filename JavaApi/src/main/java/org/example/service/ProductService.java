package org.example.service;

import lombok.AllArgsConstructor;
import org.example.dto.product.ProductItemDTO;
import org.example.dto.product.ProductPostDTO;
import org.example.entities.CategoryEntity;
import org.example.entities.ProductEntity;
import org.example.entities.ProductImageEntity;
import org.example.mapper.ProductMapper;
import org.example.repository.IProductImageRepository;
import org.example.repository.IProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductService {

    private IProductRepository productRepository;
    private FileService fileService;
    private IProductImageRepository productImageRepository;
    private ProductMapper productMapper;

    public List<ProductItemDTO> getAllProducts() {
        var list = productRepository.findAll();
        return productMapper.toDto(list);
    }

    public ProductItemDTO getProductById(Integer id) {
        return productMapper.toDto(productRepository.findById(id).orElse(null));
    }

    public ProductEntity createProduct(ProductPostDTO product) {
        var entity = new ProductEntity();
        entity.setName(product.getName());
        entity.setDescription(product.getDescription());
        entity.setPrice(product.getPrice());
        entity.setCreationTime(LocalDateTime.now());
        var cat = new CategoryEntity();
        cat.setId(product.getCategoryId());
        entity.setCategory(cat);

        productRepository.save(entity);

        int priority = 1;
        for (var img : product.getImages()) {
            var imageName = fileService.load(img);
            var img1 = new ProductImageEntity();
            img1.setPriority(priority);
            img1.setName(imageName);
            img1.setProduct(entity);
            productImageRepository.save(img1);
            priority++;
        }
        return entity;
    }

    public boolean updateProduct(Integer id, ProductPostDTO product) {
        var res = productRepository.findById(id);
        if (res.isEmpty()) {
            return false;
        }
        var entity = res.get();
        entity.setName(product.getName());
        entity.setDescription(product.getDescription());
        entity.setPrice(product.getPrice());
        var cat = new CategoryEntity();
        cat.setId(product.getCategoryId());
        entity.setCategory(cat);
        productRepository.save(entity);

        var clientImageFiles = product.getImages();


        // Видаляємо старі зображення, яких немає в новому списку
        Set<String> clientImageNames = clientImageFiles.stream()
                .map(MultipartFile::getOriginalFilename)
                .collect(Collectors.toSet());

        entity.getImages().removeIf(productImage -> {
            if (!clientImageNames.contains(productImage.getName())) {
                fileService.remove(productImage.getName());
                productImageRepository.delete(productImage);
                return true;
            }
            return false;
        });

        // Створюємо мапу для нових зображень
        int priority = 1;
        for (int i=0;i<clientImageFiles.size();i++) {
            var clientFile = clientImageFiles.get(i);
            //Якщо старий файл - змінюємо пріорітет
            if ("old-image".equals(clientFile.getContentType())) {
                var oldFileName = clientFile.getOriginalFilename();
                var productImage = productImageRepository.findByName(oldFileName).get();
                productImage.setPriority(i);
                productImageRepository.save(productImage);
            }
            //Якщо новий файл - зберігаю в БД, як новий і у файлову систему
            else {
                var productImage = new ProductImageEntity();
                var imageName = fileService.load(clientFile);
                productImage.setName(imageName);
                productImage.setPriority(i);
                productImage.setProduct(entity);
                productImageRepository.save(productImage);
            }
        }

        return true;
    }

    public boolean deleteProduct(Integer id) {
        var res = productRepository.findById(id);
        if (res.isEmpty()) {
            return false;
        }
        productRepository.deleteById(id);
        return true;
    }
}
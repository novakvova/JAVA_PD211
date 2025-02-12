package org.example.controller;

import org.example.dto.category.CategoryCreateDTO;
import org.example.entites.CategoryEntity;
import org.example.repository.ICategoryRepository;
import org.example.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<CategoryEntity> getAllCategories() {
        return categoryService.getList();
    }

    @PostMapping
    public CategoryEntity createCategory(CategoryCreateDTO dto) {
        return categoryService.create(dto);
    }
}

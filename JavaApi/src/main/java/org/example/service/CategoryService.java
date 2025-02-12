package org.example.service;

import org.example.dto.category.CategoryCreateDTO;
import org.example.entites.CategoryEntity;
import org.example.repository.ICategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private ICategoryRepository repository;

    public List<CategoryEntity> getList() {
        return repository.findAll();
    }

    public CategoryEntity create(CategoryCreateDTO dto) {
        CategoryEntity entity = new CategoryEntity();
        entity.setName(dto.getName());
        entity.setImage(dto.getImage());
        entity.setDescription(dto.getDescription());
        entity.setCreationTime(LocalDateTime.now());
        repository.save(entity);
        return entity;
    }

}

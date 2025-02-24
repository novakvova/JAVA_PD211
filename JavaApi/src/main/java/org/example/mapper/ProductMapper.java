package org.example.mapper;

import org.example.dto.product.ProductItemDTO;
import org.example.entities.ProductEntity;
import org.example.entities.ProductImageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    default List<String> toStr(List<ProductImageEntity> productImageEntities) {
        return productImageEntities == null
                ? Collections.emptyList()
                : productImageEntities.stream()
                .sorted(Comparator.comparing(ProductImageEntity::getPriority))
                .map(ProductImageEntity::getName)
                .collect(Collectors.toList());
    }

    @Mapping(source = "creationTime", target = "dateCreated", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(source = "category.name", target = "categoryName")
    ProductItemDTO toDto(ProductEntity product);

    List<ProductItemDTO> toDto(List<ProductEntity> products);


}
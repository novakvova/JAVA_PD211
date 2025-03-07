package org.example.seeder;

import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {
    private CategorySeeder categorySeeder;
    private ProductsSeeder productsSeeder;
    private UserSeeder userSeeder;
    private RoleSeeder roleSeeder;

    @Override
    public void run(String... args) throws Exception {
        categorySeeder.seed();
        productsSeeder.seed();
        roleSeeder.seed();
        userSeeder.seed();
    }
}
package org.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class Main {

    //UserName - dowik44272@kuandika.com
    //Password = dowik44272@kuandika.comQ
    //postgresql://neondb_owner:npg_5SMINwZlU3mB@ep-icy-smoke-a54k5of0-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require

    private static final String URL = "jdbc:postgresql://ep-icy-smoke-a54k5of0-pooler.us-east-2.aws.neon.tech:5432/neondb";
    private static final String USER = "neondb_owner";
    private static final String PASSWORD = "npg_5SMINwZlU3mB";

    public static Connection getConnection() {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Connected to PostgreSQL successfully!");
        } catch (SQLException e) {
            System.out.println("Connection failed: " + e.getMessage());
        }
        return conn;
    }

    public static void createGenresTable(Connection conn) {
        String createTableSQL = """
                    CREATE TABLE IF NOT EXISTS Genres (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) UNIQUE NOT NULL
                    )
                """;

        try (Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(createTableSQL);
            System.out.println("Table 'Genres' checked/created successfully!");
        } catch (SQLException e) {
            System.out.println("Error creating table: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        var conn = getConnection();
        if (conn != null) {
            createGenresTable(conn);
        }
    }
}
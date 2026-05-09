package com.medstudy.backend.scratch;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DbCleanup {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://127.0.0.1:5433/medstudy";
        String user = "postgres";
        String password = "postgres";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Limpando tabela flashcards...");
            stmt.execute("DROP TABLE IF EXISTS flashcards CASCADE");
            
            System.out.println("Limpando historico Flyway V4...");
            stmt.execute("DELETE FROM flyway_schema_history WHERE version = '4'");
            
            System.out.println("Limpeza concluida com sucesso!");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

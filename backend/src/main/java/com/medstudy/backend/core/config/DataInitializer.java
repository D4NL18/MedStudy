package com.medstudy.backend.core.config;

import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        System.out.println(">>> DataInitializer: Iniciando verificação de semente...");
        
        userRepository.findByEmail("admin@medstudy.com").ifPresentOrElse(
            user -> {
                user.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(user);
                System.out.println(">>> DataInitializer: Usuário admin já existia. Senha resetada para 'admin123'.");
            },
            () -> {
                User admin = new User();
                admin.setName("Admin Test");
                admin.setEmail("admin@medstudy.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println(">>> DataInitializer: Usuário admin criado: admin@medstudy.com / admin123");
            }
        );

        userRepository.findByEmail("user@test.com").ifPresentOrElse(
            user -> {
                user.setPassword(passwordEncoder.encode("user123"));
                userRepository.save(user);
                System.out.println(">>> DataInitializer: Usuário de teste já existia. Senha resetada para 'user123'.");
            },
            () -> {
                User user = new User();
                user.setName("User Test");
                user.setEmail("user@test.com");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setRole("USER");
                userRepository.save(user);
                System.out.println(">>> DataInitializer: Usuário de teste criado: user@test.com / user123");
            }
        );

        userRepository.findByEmail("admin@test.com").ifPresentOrElse(
            user -> {
                user.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(user);
                System.out.println(">>> DataInitializer: Usuário admin@test.com já existia. Senha resetada para 'admin123'.");
            },
            () -> {
                User admin = new User();
                admin.setName("Admin Test User");
                admin.setEmail("admin@test.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println(">>> DataInitializer: Usuário admin@test.com criado: admin@test.com / admin123");
            }
        );

    }
}

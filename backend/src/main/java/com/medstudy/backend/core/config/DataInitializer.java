package com.medstudy.backend.core.config;

import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
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
    }
}

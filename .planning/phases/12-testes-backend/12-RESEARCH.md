# Phase 12 Research: Backend Tests

Este documento detalha as descobertas técnicas necessárias para implementar a suíte de testes do backend com 80% de cobertura e bloqueio de build.

## 1. Configuração do JaCoCo (Bloqueio de Build)

Para forçar a cobertura de 80%, o `jacoco-maven-plugin` deve ser configurado no `pom.xml` com o goal `check` vinculado à fase `verify`.

### Configuração Sugerida:
```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.12</version>
    <executions>
        <execution>
            <id>prepare-agent</id>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
        <execution>
            <id>check</id>
            <goals>
                <goal>check</goal>
            </goals>
            <configuration>
                <rules>
                    <rule>
                        <element>BUNDLE</element>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.80</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

## 2. Mapeamento de Gaps de Teste

### Services sem Testes Unitários:
- `JwtService` (Core Security)
- `AuthService` (Auth Module)
- `EmailService` (Auth Module - Mockar JavaMailSender)
- `LoginAttemptService` (Auth Module - Rate Limiting)
- `RefreshTokenService` (Auth Module)
- `FlashcardService` (Flashcard Module)
- `RevisionService` (Revision Module)

### Controllers (0% de cobertura unitária):
Todos os controllers em `com.medstudy.backend.modules.*.controller` precisam de testes usando `@WebMvcTest`.
- `StudySessionController`
- `SimuladoController`
- `LessonController`
- `DashboardController`
- `AnalyticsController`
- `RevisionController`
- `FlashcardController`
- `AuthController` (Além do IT existente)

## 3. TestDataFactory (src/test/java/.../util/)

A Factory deve centralizar a criação de objetos para evitar duplicação.

**Estrutura recomendada:**
```java
public class TestDataFactory {
    public static User createUser() { ... }
    public static StudySession createSession(User user) { ... }
    public static Simulado createSimulado(User user) { ... }
    public static Flashcard createFlashcard(User user) { ... }
    public static Lesson createLesson(User user) { ... }
}
```

## 4. Estratégia de Mocking de Segurança

Para testar controllers protegidos com `@WebMvcTest` e garantir o erro 401:

1.  **Habilitar Segurança:** Por padrão, `@WebMvcTest` carrega a segurança.
2.  **Mocks Necessários:** Como o `JwtAuthenticationFilter` depende de `JwtService` e `UserDetailsService`, estes devem ser mockados como `@MockBean` no teste ou em uma classe base.
3.  **Simulação de Usuário:** Usar `@WithMockUser` para casos simples ou um helper que injete o objeto `User` real (que implementa `UserDetails`) no `SecurityContextHolder`.

### Exemplo de Teste de Validação (400):
```java
@Test
@WithMockUser
void create_ShouldReturn400_WhenInvalidData() throws Exception {
    StudySessionRequest invalidRequest = new StudySessionRequest(null, null, null, 0, 0, null, null, false);
    mockMvc.perform(post("/api/study-sessions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(invalidRequest)))
            .andExpect(status().isBadRequest());
}
```

## 5. Próximos Passos
1. Configurar JaCoCo no `pom.xml`.
2. Criar `TestDataFactory`.
3. Implementar testes de Service faltantes (prioridade Auth e Flashcards).
4. Implementar testes de Controller (foco em validação e segurança).
5. Executar `mvn verify` e ajustar até atingir 80%.

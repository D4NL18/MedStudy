package com.medstudy.backend.modules.clinic.controller;

import com.medstudy.backend.modules.clinic.dto.BuyClinicItemRequest;
import com.medstudy.backend.modules.clinic.dto.BuyClinicItemResponse;
import com.medstudy.backend.modules.clinic.dto.ClinicStateResponse;
import com.medstudy.backend.modules.clinic.dto.UpdateClinicLayoutRequest;
import com.medstudy.backend.modules.clinic.service.ClinicService;
import com.medstudy.backend.modules.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

/**
 * REST Controller for "Minha Clínica Médica" endpoints (P-080, P-082, P-083, P-084).
 */
@RestController
@RequestMapping({"/api/v1/clinic", "/api/clinic"})
@Tag(name = "Minha Clínica Médica", description = "Endpoints para progressão espacial, catálogo de 27 itens e decoração 2.5D da Clínica Médica")
@PreAuthorize("isAuthenticated()")
public class ClinicController {

    private final ClinicService clinicService;

    public ClinicController(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @Operation(
            summary = "Obter ou inicializar o estado consolidado da clínica médica",
            description = "Retorna saldos de XP, nível atual, itens posicionados/adquiridos e os 27 itens do catálogo. Provisiona automaticamente o Box do Internato (4x4) no 1º acesso."
    )
    @ApiResponse(responseCode = "200", description = "Estado da clínica retornado com sucesso")
    @GetMapping
    public ResponseEntity<ClinicStateResponse> getClinic(@AuthenticationPrincipal User user) {
        UUID userId = resolveAuthenticatedUserId(user);
        return ResponseEntity.ok(clinicService.getOrInitClinic(userId));
    }

    @Operation(
            summary = "Expandir fisicamente a clínica médica para o próximo nível",
            description = "Valida XP Vitalício (pré-requisito) e debita o custo apenas do Saldo de XP Investível (current_xp), ampliando as dimensões da malha."
    )
    @ApiResponse(responseCode = "200", description = "Clínica expandida com sucesso")
    @ApiResponse(responseCode = "422", description = "Pré-requisito de XP Vitalício ou Saldo de XP insuficiente")
    @PostMapping("/expand")
    public ResponseEntity<ClinicStateResponse> expandClinic(@AuthenticationPrincipal User user) {
        UUID userId = resolveAuthenticatedUserId(user);
        return ResponseEntity.ok(clinicService.expandClinic(userId));
    }

    @Operation(
            summary = "Comprar item oficial do catálogo da clínica",
            description = "Valida nível mínimo da clínica e saldo de XP investível, debita current_xp e adiciona o item ao piso ou inventário."
    )
    @ApiResponse(responseCode = "200", description = "Item adquirido com sucesso")
    @ApiResponse(responseCode = "404", description = "Item não encontrado no catálogo")
    @ApiResponse(responseCode = "422", description = "Nível da clínica ou saldo de XP insuficiente")
    @PostMapping("/items/buy")
    public ResponseEntity<BuyClinicItemResponse> buyItem(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BuyClinicItemRequest request
    ) {
        UUID userId = resolveAuthenticatedUserId(user);
        return ResponseEntity.ok(clinicService.buyItem(userId, request));
    }

    @Operation(
            summary = "Atualizar layout espacial dos móveis e equipamentos no piso 2.5D",
            description = "Valida propriedade dos itens, limites da malha e ausência de colisão AABB 2D considerando inversão de footprint por rotação."
    )
    @ApiResponse(responseCode = "200", description = "Layout atualizado com sucesso")
    @ApiResponse(responseCode = "403", description = "Tentativa de modificar item pertencente a outra clínica")
    @ApiResponse(responseCode = "422", description = "Colisão AABB 2D ou extrapolação dos limites da malha")
    @PutMapping("/layout")
    public ResponseEntity<ClinicStateResponse> updateLayout(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateClinicLayoutRequest request
    ) {
        UUID userId = resolveAuthenticatedUserId(user);
        return ResponseEntity.ok(clinicService.updateLayout(userId, request));
    }

    @Operation(
            summary = "Atualizar temas de superfície da clínica (parede e piso)",
            description = "Aplica novos papéis de parede ou acabamentos de piso desbloqueados sem afetar o grid de circulação (P-087)."
    )
    @ApiResponse(responseCode = "200", description = "Superfícies atualizadas com sucesso")
    @ApiResponse(responseCode = "403", description = "Tema de revestimento não desbloqueado pelo estudante")
    @PutMapping("/surfaces")
    public ResponseEntity<ClinicStateResponse> updateSurfaces(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody com.medstudy.backend.modules.clinic.dto.ClinicSurfacesUpdateRequest request
    ) {
        UUID userId = resolveAuthenticatedUserId(user);
        return ResponseEntity.ok(clinicService.updateSurfaces(userId, request));
    }

    @Operation(
            summary = "Obter dados do personagem médico virtual e catálogo de skins",
            description = "Retorna gênero, itens equipados e lista completa de vestimentas disponíveis (P-089)."
    )
    @ApiResponse(responseCode = "200", description = "Dados do avatar médico retornados com sucesso")
    @GetMapping("/avatar")
    public ResponseEntity<com.medstudy.backend.modules.clinic.dto.DoctorAvatarResponseDto> getAvatar(
            @AuthenticationPrincipal User user
    ) {
        UUID userId = resolveAuthenticatedUserId(user);
        return ResponseEntity.ok(clinicService.getDoctorAvatar(userId));
    }

    @Operation(
            summary = "Atualizar personalização do avatar médico (gênero e skins equipadas)",
            description = "Permite alternância gratuita de gênero (MALE/FEMALE) e equipar peças desbloqueadas (P-089)."
    )
    @ApiResponse(responseCode = "200", description = "Avatar atualizado com sucesso")
    @ApiResponse(responseCode = "403", description = "Tentativa de equipar skin não adquirida")
    @PutMapping("/avatar")
    public ResponseEntity<com.medstudy.backend.modules.clinic.dto.DoctorAvatarResponseDto> updateAvatar(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody com.medstudy.backend.modules.clinic.dto.DoctorAvatarUpdateDto request
    ) {
        UUID userId = resolveAuthenticatedUserId(user);
        return ResponseEntity.ok(clinicService.updateDoctorAvatar(userId, request));
    }

    @Operation(
            summary = "Comprar skin cosmética para o guarda-roupa do avatar médico",
            description = "Debita atomicamente current_xp e adiciona a peça cosmética ao inventário (P-089)."
    )
    @ApiResponse(responseCode = "200", description = "Skin adquirida com sucesso")
    @ApiResponse(responseCode = "409", description = "Skin já desbloqueada")
    @ApiResponse(responseCode = "422", description = "Saldo de XP insuficiente")
    @PostMapping("/avatar/skins/buy")
    public ResponseEntity<java.util.Map<String, Object>> buySkin(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody com.medstudy.backend.modules.clinic.dto.SkinBuyRequestDto request
    ) {
        UUID userId = resolveAuthenticatedUserId(user);
        return ResponseEntity.ok(clinicService.buySkin(userId, request.getSkinId()));
    }

    static UUID resolveAuthenticatedUserId(User principal) {
        if (principal != null && principal.getId() != null) {
            return principal.getId();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            if (auth.getPrincipal() instanceof User contextUser && contextUser.getId() != null) {
                return contextUser.getId();
            }
            if (auth.getName() != null && !auth.getName().isBlank() && !"anonymousUser".equals(auth.getName())) {
                return UUID.nameUUIDFromBytes(auth.getName().getBytes(StandardCharsets.UTF_8));
            }
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Estudante não autenticado.");
    }
}

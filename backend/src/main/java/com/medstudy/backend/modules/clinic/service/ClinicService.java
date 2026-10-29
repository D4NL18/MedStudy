package com.medstudy.backend.modules.clinic.service;

import com.medstudy.backend.modules.clinic.dto.BuyClinicItemRequest;
import com.medstudy.backend.modules.clinic.dto.BuyClinicItemResponse;
import com.medstudy.backend.modules.clinic.dto.ClinicStateResponse;
import com.medstudy.backend.modules.clinic.dto.ClinicSurfacesUpdateRequest;
import com.medstudy.backend.modules.clinic.dto.DoctorAvatarDto;
import com.medstudy.backend.modules.clinic.dto.DoctorAvatarResponseDto;
import com.medstudy.backend.modules.clinic.dto.DoctorAvatarUpdateDto;
import com.medstudy.backend.modules.clinic.dto.DoctorSkinCatalogDto;
import com.medstudy.backend.modules.clinic.dto.OwnedSurfaceDto;
import com.medstudy.backend.modules.clinic.dto.PlacedItemDto;
import com.medstudy.backend.modules.clinic.dto.UpdateClinicLayoutRequest;
import com.medstudy.backend.modules.clinic.entity.ClinicCatalogItem;
import com.medstudy.backend.modules.clinic.entity.ClinicExpansionLevel;
import com.medstudy.backend.modules.clinic.entity.ClinicPlacedItem;
import com.medstudy.backend.modules.clinic.entity.StudyActionType;
import com.medstudy.backend.modules.clinic.entity.UserClinic;
import com.medstudy.backend.modules.clinic.entity.UserDoctorAvatar;
import com.medstudy.backend.modules.clinic.entity.UserUnlockedSkin;
import com.medstudy.backend.modules.clinic.entity.UserXpAccount;
import com.medstudy.backend.modules.clinic.entity.UserXpTransaction;
import com.medstudy.backend.modules.clinic.repository.ClinicCatalogItemRepository;
import com.medstudy.backend.modules.clinic.repository.ClinicPlacedItemRepository;
import com.medstudy.backend.modules.clinic.repository.UserClinicRepository;
import com.medstudy.backend.modules.clinic.repository.UserDoctorAvatarRepository;
import com.medstudy.backend.modules.clinic.repository.UserUnlockedSkinRepository;
import com.medstudy.backend.modules.clinic.repository.UserXpAccountRepository;
import com.medstudy.backend.modules.clinic.repository.UserXpTransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Core domain service for "Minha Clínica Médica", Surfaces, Wall Fixation, and Doctor Avatar (P-080 to P-089).
 */
@Service
public class ClinicService {

    /**
     * Official 104 catalog items (P-083, P-092).
     */
    public static final List<ClinicCatalogItem> OFFICIAL_CATALOG_ITEMS = List.of(
            new ClinicCatalogItem("ped_maca_dino", "Maca Dinossauro Safari", "pediatria", 3500, 2, 2, 1, "FLOOR", true, "/assets/audio/clinic/dino_blink.mp3", "ped_maca_dino"),
            new ClinicCatalogItem("ped_maca_baleia", "Maca Baleia Azul", "pediatria", 1800, 1, 2, 1, "FLOOR", true, "/assets/audio/clinic/whale_soft.mp3", "ped_maca_baleia"),
            new ClinicCatalogItem("ped_maca_f1", "Maca Carro de Corrida", "pediatria", 2400, 2, 2, 1, "FLOOR", true, "/assets/audio/clinic/f1_horn.mp3", "ped_maca_f1"),
            new ClinicCatalogItem("ped_regua_girafa", "Régua Girafa de Parede", "pediatria", 900, 1, 0, 0, "WALL", true, "/assets/audio/clinic/wood_measure.mp3", "ped_regua_girafa"),
            new ClinicCatalogItem("ped_balanca_urso", "Balança Bebê Ursinho", "pediatria", 1100, 1, 1, 1, "FLOOR", false, null, "ped_balanca_urso"),
            new ClinicCatalogItem("ped_piscina_bolinhas", "Piscina de Bolinhas Candy Color", "pediatria", 2800, 3, 2, 2, "FLOOR", true, "/assets/audio/clinic/ball_pit.mp3", "ped_piscina_bolinhas"),
            new ClinicCatalogItem("ped_tenda_leitura", "Tenda Tipi Indígena", "pediatria", 3200, 4, 2, 2, "FLOOR", true, "/assets/audio/clinic/page_turn.mp3", "ped_tenda_leitura"),
            new ClinicCatalogItem("ped_bau_coragem", "Baú do Tesouro / Pote de Adesivos", "pediatria", 1500, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/sparkle_chime.mp3", "ped_bau_coragem"),
            new ClinicCatalogItem("ped_papel_safari", "Papel de Parede Safari Aquarela", "pediatria", 850, 1, 0, 0, "SURFACE_WALL", false, null, "ped_papel_safari"),
            new ClinicCatalogItem("ped_esteto_elefante", "Protetor de Esteto Elefantinho", "pediatria", 650, 1, 1, 1, "FLOOR", false, null, "ped_esteto_elefante"),
            new ClinicCatalogItem("ped_tapete_amarelinha", "Tapete Amarelinha Sensorial", "pediatria", 750, 1, 2, 1, "FLOOR", false, null, "ped_tapete_amarelinha"),
            new ClinicCatalogItem("ped_mesa_desenho_infantil", "Mesinha de Atividades com Giz", "pediatria", 1250, 1, 2, 1, "FLOOR", true, "/assets/audio/clinic/wood_tap.mp3", "ped_mesa_desenho_infantil"),
            new ClinicCatalogItem("ped_cadeirinha_sapinho", "Cadeira Infantil Sapinho", "pediatria", 450, 1, 1, 1, "FLOOR", false, null, "ped_cadeirinha_sapinho"),
            new ClinicCatalogItem("ped_oftalmo_figuras_lea", "Tabela Oftalmológica Infantil LEA", "pediatria", 800, 1, 0, 0, "WALL", true, "/assets/audio/clinic/chime.mp3", "ped_oftalmo_figuras_lea"),
            new ClinicCatalogItem("ped_mobile_planetas", "Móbile Teto Sistema Solar", "pediatria", 1350, 2, 0, 0, "WALL", true, "/assets/audio/clinic/mobile_spin.mp3", "ped_mobile_planetas"),
            new ClinicCatalogItem("ped_otoscopio_pinguim", "Otoscópio Pediátrico Pinguim", "pediatria", 950, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/click.mp3", "ped_otoscopio_pinguim"),
            new ClinicCatalogItem("ped_carrinho_vacina_sorriso", "Carrinho de Vacinação Sem Dor", "pediatria", 1950, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/cart_roll.mp3", "ped_carrinho_vacina_sorriso"),
            new ClinicCatalogItem("ped_pelucia_microbios", "Cesto de Pelúcias de Micróbios Fofos", "pediatria", 1100, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/squeak.mp3", "ped_pelucia_microbios"),
            new ClinicCatalogItem("ped_painel_engrenagens", "Painel Sensorial de Parede", "pediatria", 1650, 3, 0, 0, "WALL", true, "/assets/audio/clinic/gears.mp3", "ped_painel_engrenagens"),
            new ClinicCatalogItem("ped_escorregador_elefante", "Mini Escorregador Tromba de Elefante", "pediatria", 3100, 3, 2, 1, "FLOOR", true, "/assets/audio/clinic/slide.mp3", "ped_escorregador_elefante"),
            new ClinicCatalogItem("ped_balanca_digital_aquecida", "Balança Pediátrica Aquecida", "pediatria", 2100, 3, 1, 1, "FLOOR", false, null, "ped_balanca_digital_aquecida"),
            new ClinicCatalogItem("ped_berco_aquecido", "Berço Aquecido Neonatal", "pediatria", 4600, 4, 2, 1, "FLOOR", true, "/assets/audio/clinic/hum.mp3", "ped_berco_aquecido"),
            new ClinicCatalogItem("ped_fototerapia_led", "Aparelho de Fototerapia Bili-LED", "pediatria", 5200, 4, 1, 1, "FLOOR", true, "/assets/audio/clinic/light_switch.mp3", "ped_fototerapia_led"),
            new ClinicCatalogItem("ped_circuito_espuma", "Circuito de Psicomotricidade Infantil", "pediatria", 4900, 5, 2, 2, "FLOOR", true, "/assets/audio/clinic/bounce.mp3", "ped_circuito_espuma"),
            new ClinicCatalogItem("ped_incubadora_neonatal", "Incubadora Neonatal Tecnológica", "pediatria", 7800, 5, 2, 1, "FLOOR", true, "/assets/audio/clinic/incubator_beep.mp3", "ped_incubadora_neonatal"),
            new ClinicCatalogItem("ped_castelo_faz_de_conta", "Castelo Lúdico com Miniclínica", "pediatria", 9500, 6, 2, 2, "FLOOR", true, "/assets/audio/clinic/fanfare.mp3", "ped_castelo_faz_de_conta"),
            new ClinicCatalogItem("mesa_scandi", "Mesa Escandinava de Carvalho com Suculenta", "mobiliario", 950, 1, 2, 1, "FLOOR", false, null, "mesa_scandi"),
            new ClinicCatalogItem("mesa_mogno_cafe", "Mesa de Mogno com Xícara de Café Quente", "mobiliario", 2200, 2, 2, 1, "FLOOR", true, "/assets/audio/clinic/coffee_sip.mp3", "mesa_mogno_cafe"),
            new ClinicCatalogItem("mesa_carrara", "Mesa Mármore Carrara & Dourado", "mobiliario", 4800, 4, 2, 1, "FLOOR", true, "/assets/audio/clinic/marble_chime.mp3", "mesa_carrara"),
            new ClinicCatalogItem("cadeira_ergonomica", "Cadeira Operacional Mesh", "mobiliario", 800, 1, 1, 1, "FLOOR", false, null, "cadeira_ergonomica"),
            new ClinicCatalogItem("cadeira_presidente_couro", "Cadeira Presidente Couro Caramelo Capitonê", "mobiliario", 2600, 3, 1, 1, "FLOOR", false, null, "cadeira_presidente_couro"),
            new ClinicCatalogItem("pc_ultrawide", "Estação de Trabalho com Monitor Ultrawide", "mobiliario", 1600, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/key_click.mp3", "pc_ultrawide"),
            new ClinicCatalogItem("maca_clinica_antisseptica", "Maca de Exame Clínico com Lençol", "mobiliario", 900, 1, 2, 1, "FLOOR", false, null, "maca_clinica_antisseptica"),
            new ClinicCatalogItem("mocho_giratorio_clinico", "Mocho Giratório com Encosto", "mobiliario", 550, 1, 1, 1, "FLOOR", false, null, "mocho_giratorio_clinico"),
            new ClinicCatalogItem("biombo_triplo_privacidade", "Biombo Hospitalar Triplo", "mobiliario", 700, 1, 2, 1, "FLOOR", true, "/assets/audio/clinic/rustle.mp3", "biombo_triplo_privacidade"),
            new ClinicCatalogItem("escada_dois_degraus", "Escadinha Clínica Antiderrapante", "mobiliario", 350, 1, 1, 1, "FLOOR", false, null, "escada_dois_degraus"),
            new ClinicCatalogItem("suporte_soro_cromado", "Suporte de Soro com 4 Ganchos", "mobiliario", 600, 1, 1, 1, "FLOOR", false, null, "suporte_soro_cromado"),
            new ClinicCatalogItem("mesa_auxiliar_inox", "Carrinho Auxiliar em Aço Inox", "mobiliario", 850, 1, 1, 1, "FLOOR", false, null, "mesa_auxiliar_inox"),
            new ClinicCatalogItem("armario_vitrine_remedios", "Armário Vitrine com Portas de Vidro", "mobiliario", 1850, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/glass_click.mp3", "armario_vitrine_remedios"),
            new ClinicCatalogItem("foco_clinico_led", "Foco Clínico Flexível de LED", "mobiliario", 1150, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/led_switch.mp3", "foco_clinico_led"),
            new ClinicCatalogItem("gaveteiro_modular_madeira", "Gaveteiro Volante de Carvalho", "mobiliario", 1300, 2, 1, 1, "FLOOR", false, null, "gaveteiro_modular_madeira"),
            new ClinicCatalogItem("poltrona_reclinavel_coleta", "Poltrona Reclinável de Hidratação", "mobiliario", 2300, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/recline.mp3", "poltrona_reclinavel_coleta"),
            new ClinicCatalogItem("mesa_atendimento_em_l", "Mesa Executiva em L", "mobiliario", 2900, 3, 2, 2, "FLOOR", false, null, "mesa_atendimento_em_l"),
            new ClinicCatalogItem("estante_modular_nichos", "Estante de Parede com Nichos LED", "mobiliario", 1750, 3, 0, 0, "WALL", false, null, "estante_modular_nichos"),
            new ClinicCatalogItem("divisoria_vidro_acustica", "Painel Divisório Vidro Canelado", "mobiliario", 2400, 3, 2, 1, "FLOOR", false, null, "divisoria_vidro_acustica"),
            new ClinicCatalogItem("estacao_triagem_enfermagem", "Bancada Completa de Triagem", "mobiliario", 3400, 3, 2, 1, "FLOOR", true, "/assets/audio/clinic/printer.mp3", "estacao_triagem_enfermagem"),
            new ClinicCatalogItem("armario_vestiario_medico", "Armário Vestiário com Espelho", "mobiliario", 2800, 4, 1, 1, "FLOOR", true, "/assets/audio/clinic/locker.mp3", "armario_vestiario_medico"),
            new ClinicCatalogItem("maca_gineco_eletrica", "Maca Gineco-Obstétrica Motorizada", "mobiliario", 5400, 4, 2, 1, "FLOOR", true, "/assets/audio/clinic/motor.mp3", "maca_gineco_eletrica"),
            new ClinicCatalogItem("mesa_reuniao_clinica", "Mesa Oval de Discussão Clínica", "mobiliario", 4900, 5, 2, 2, "FLOOR", false, null, "mesa_reuniao_clinica"),
            new ClinicCatalogItem("estacao_telemedicina", "Estação Completa de Telemedicina", "mobiliario", 6200, 5, 2, 1, "FLOOR", true, "/assets/audio/clinic/video_call.mp3", "estacao_telemedicina"),
            new ClinicCatalogItem("bancada_laboratorial_ilha", "Ilha Laboratorial Central Inox", "mobiliario", 8200, 5, 3, 1, "FLOOR", true, "/assets/audio/clinic/lab_centrifuge.mp3", "bancada_laboratorial_ilha"),
            new ClinicCatalogItem("conjunto_diretoria_nogal", "Conjunto Presidencial Nogal & Bronze", "mobiliario", 12000, 6, 3, 2, "FLOOR", true, "/assets/audio/clinic/leather_creak.mp3", "conjunto_diretoria_nogal"),
            new ClinicCatalogItem("didatico_dr_bones", "Esqueleto Didático Dr. Bones", "clinica", 1900, 1, 1, 1, "FLOOR", true, "/assets/audio/clinic/bones_clack.mp3", "didatico_dr_bones"),
            new ClinicCatalogItem("esteto_ouro_master", "Estetoscópio Master Ouro em Suporte", "clinica", 3000, 3, 1, 1, "FLOOR", true, "/assets/audio/clinic/heartbeat_soft.mp3", "esteto_ouro_master"),
            new ClinicCatalogItem("monitor_ecg", "Monitor Cardíaco com Traçado Vivo em Loop", "clinica", 2100, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/ecg_beep.mp3", "monitor_ecg"),
            new ClinicCatalogItem("usg_fetal_4d", "Aparelho de Ultrassom 4D com Display Colorido", "clinica", 3900, 4, 1, 1, "FLOOR", true, "/assets/audio/clinic/usg_doppler.mp3", "usg_fetal_4d"),
            new ClinicCatalogItem("negatoscopio_led", "Negatoscópio Ultra-Slim com Radiografia Iluminada", "clinica", 1400, 1, 0, 0, "WALL", true, "/assets/audio/clinic/led_switch.mp3", "negatoscopio_led"),
            new ClinicCatalogItem("estante_harrison", "Estante Gigante com Tratados Clássicos de Medicina", "clinica", 1700, 2, 2, 1, "FLOOR", false, null, "estante_harrison"),
            new ClinicCatalogItem("esfigmo_pedestal", "Esfigmomanômetro em Pedestal Móvel", "clinica", 800, 1, 1, 1, "FLOOR", true, "/assets/audio/clinic/cuff_pump.mp3", "esfigmo_pedestal"),
            new ClinicCatalogItem("tabela_snellen_iluminada", "Tabela de Snellen Iluminada", "clinica", 750, 1, 0, 0, "WALL", true, "/assets/audio/clinic/light_switch.mp3", "tabela_snellen_iluminada"),
            new ClinicCatalogItem("conjunto_diagnostico_parede", "Otoscópio & Oftalmoscópio de Parede", "clinica", 1200, 1, 0, 0, "WALL", true, "/assets/audio/clinic/click.mp3", "conjunto_diagnostico_parede"),
            new ClinicCatalogItem("estojo_laringoscopio", "Estojo de Laringoscópio Inox", "clinica", 1050, 1, 1, 1, "FLOOR", true, "/assets/audio/clinic/metal_latch.mp3", "estojo_laringoscopio"),
            new ClinicCatalogItem("diploma_crm_moldura_ouro", "Diploma de Graduação Médica Ouro", "clinica", 950, 1, 0, 0, "WALL", true, "/assets/audio/clinic/chime.mp3", "diploma_crm_moldura_ouro"),
            new ClinicCatalogItem("estadiometro_compacto", "Estadiômetro de Parede em Alumínio", "clinica", 850, 1, 0, 0, "WALL", true, "/assets/audio/clinic/slide.mp3", "estadiometro_compacto"),
            new ClinicCatalogItem("desfibrilador_dea_parede", "Desfibrilador DEA em Caixa Vermelha", "clinica", 2500, 2, 0, 0, "WALL", true, "/assets/audio/clinic/dea_prompt.mp3", "desfibrilador_dea_parede"),
            new ClinicCatalogItem("bipap_ventilador", "Aparelho de Ventilação BiPAP", "clinica", 2400, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/breathe.mp3", "bipap_ventilador"),
            new ClinicCatalogItem("aspirador_cirurgico_movel", "Aspirador Cirúrgico com Frascos", "clinica", 1650, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/suction.mp3", "aspirador_cirurgico_movel"),
            new ClinicCatalogItem("carrinho_parada_cardiorresp", "Carrinho de Parada Emergencial", "clinica", 3100, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/siren_short.mp3", "carrinho_parada_cardiorresp"),
            new ClinicCatalogItem("microscopio_optico_binoc", "Microscópio Óptico Binocular", "clinica", 2800, 3, 1, 1, "FLOOR", true, "/assets/audio/clinic/focus_click.mp3", "microscopio_optico_binoc"),
            new ClinicCatalogItem("eletrocardiografo_digital", "Eletrocardiógrafo de 12 Canais", "clinica", 3200, 3, 1, 1, "FLOOR", true, "/assets/audio/clinic/paper_print.mp3", "eletrocardiografo_digital"),
            new ClinicCatalogItem("autoclave_esterilizacao", "Autoclave Hospitalar em Inox", "clinica", 2700, 3, 1, 1, "FLOOR", true, "/assets/audio/clinic/steam_hiss.mp3", "autoclave_esterilizacao"),
            new ClinicCatalogItem("torre_videolaparoscopia", "Torre Cirúrgica de Vídeo-Laparoscopia", "clinica", 5800, 4, 2, 1, "FLOOR", true, "/assets/audio/clinic/laparo_beep.mp3", "torre_videolaparoscopia"),
            new ClinicCatalogItem("bomba_infusao_seringa", "Estação de Bombas de Infusão", "clinica", 4200, 4, 1, 1, "FLOOR", true, "/assets/audio/clinic/infusion_beep.mp3", "bomba_infusao_seringa"),
            new ClinicCatalogItem("tomografo_extremidades", "Mini Tomógrafo Cone Beam", "clinica", 8500, 5, 2, 2, "FLOOR", true, "/assets/audio/clinic/ct_whirr.mp3", "tomografo_extremidades"),
            new ClinicCatalogItem("ressonancia_simulador", "Simulador Compacto de Ressonância", "clinica", 10500, 5, 3, 2, "FLOOR", true, "/assets/audio/clinic/mri_thump.mp3", "ressonancia_simulador"),
            new ClinicCatalogItem("arco_cirurgico_fluorosc", "Arco Cirúrgico em C Digital", "clinica", 9200, 5, 2, 2, "FLOOR", true, "/assets/audio/clinic/fluoroscopy.mp3", "arco_cirurgico_fluorosc"),
            new ClinicCatalogItem("robo_cirurgico_console", "Console Master de Cirurgia Robótica", "clinica", 15000, 6, 2, 2, "FLOOR", true, "/assets/audio/clinic/robot_servo.mp3", "robo_cirurgico_console"),
            new ClinicCatalogItem("tanque_criogenico_celulas", "Tanque de Nitrogênio Criogênico", "clinica", 11000, 6, 1, 1, "FLOOR", true, "/assets/audio/clinic/cryo_release.mp3", "tanque_criogenico_celulas"),
            new ClinicCatalogItem("cafe_espresso_vermelho", "Máquina de Espresso Gourmet", "recepcao", 1300, 1, 1, 1, "FLOOR", true, "/assets/audio/clinic/espresso_steam.mp3", "cafe_espresso_vermelho"),
            new ClinicCatalogItem("mascote_gato_bisturi", "Gato Bisturi", "recepcao", 2900, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/cat_purr.mp3", "mascote_gato_bisturi"),
            new ClinicCatalogItem("mascote_cao_caramelo", "Golden Retriever Dr. Caramelo", "recepcao", 4500, 3, 1, 1, "FLOOR", true, "/assets/audio/clinic/dog_tail_wag.mp3", "mascote_cao_caramelo"),
            new ClinicCatalogItem("balcao_recepcao_madeira", "Balcão de Recepção em Madeira Clara", "recepcao", 1500, 3, 2, 1, "FLOOR", false, null, "balcao_recepcao_madeira"),
            new ClinicCatalogItem("bebedouro_galao", "Bebedouro Retrô de Galão Azul", "recepcao", 400, 1, 1, 1, "FLOOR", true, "/assets/audio/clinic/water_bubble.mp3", "bebedouro_galao"),
            new ClinicCatalogItem("longarina_espera_confort", "Longarina de Três Assentos Tecido", "recepcao", 850, 1, 2, 1, "FLOOR", false, null, "longarina_espera_confort"),
            new ClinicCatalogItem("revisteiro_acrilico", "Revisteiro com Periódicos Médicos", "recepcao", 450, 1, 1, 1, "FLOOR", true, "/assets/audio/clinic/page_flip.mp3", "revisteiro_acrilico"),
            new ClinicCatalogItem("planta_costela_adao", "Vaso com Planta Costela-de-Adão", "recepcao", 600, 1, 1, 1, "FLOOR", false, null, "planta_costela_adao"),
            new ClinicCatalogItem("dispenser_alcool_totem", "Totem de Álcool em Gel a Pedal", "recepcao", 350, 1, 1, 1, "FLOOR", true, "/assets/audio/clinic/pump.mp3", "dispenser_alcool_totem"),
            new ClinicCatalogItem("relogio_parede_minimal", "Relógio de Parede Minimalista", "recepcao", 500, 1, 0, 0, "WALL", false, null, "relogio_parede_minimal"),
            new ClinicCatalogItem("quadro_juramento_hipocr", "Quadro Juramento de Hipócrates", "recepcao", 800, 1, 0, 0, "WALL", true, "/assets/audio/clinic/chime.mp3", "quadro_juramento_hipocr"),
            new ClinicCatalogItem("tv_sala_espera_painel", "Smart TV de Espera com Senhas", "recepcao", 1800, 2, 0, 0, "WALL", true, "/assets/audio/clinic/tv_ding.mp3", "tv_sala_espera_painel"),
            new ClinicCatalogItem("poltrona_boucle_offwhite", "Poltrona Acolhedora Tecido Bouclé", "recepcao", 1450, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/cushion.mp3", "poltrona_boucle_offwhite"),
            new ClinicCatalogItem("luminaria_arco_latonada", "Luminária de Chão em Arco Dourado", "recepcao", 1250, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/lamp_click.mp3", "luminaria_arco_latonada"),
            new ClinicCatalogItem("aparador_cha_biscoitos", "Aparador Buffet Café & Biscoitos", "recepcao", 1600, 2, 2, 1, "FLOOR", true, "/assets/audio/clinic/cup_clink.mp3", "aparador_cha_biscoitos"),
            new ClinicCatalogItem("mascote_calopsita_poleiro", "Calopsita Semiologista no Poleiro", "recepcao", 2700, 2, 1, 1, "FLOOR", true, "/assets/audio/clinic/bird_whistle.mp3", "mascote_calopsita_poleiro"),
            new ClinicCatalogItem("aquario_marinho_coral", "Aquário Panorâmico com Corais Vivos", "recepcao", 3600, 3, 2, 1, "FLOOR", true, "/assets/audio/clinic/bubbles.mp3", "aquario_marinho_coral"),
            new ClinicCatalogItem("jardim_inverno_bambu", "Jardim de Inverno com Bambu Mossô", "recepcao", 2800, 3, 2, 1, "FLOOR", false, null, "jardim_inverno_bambu"),
            new ClinicCatalogItem("fonte_agua_pedra_zen", "Fonte Zen em Pedra Natural", "recepcao", 2200, 3, 1, 1, "FLOOR", true, "/assets/audio/clinic/water_stream.mp3", "fonte_agua_pedra_zen"),
            new ClinicCatalogItem("cafeteira_moedor_graos", "Máquina Profissional Grãos Moídos", "recepcao", 3200, 3, 1, 1, "FLOOR", true, "/assets/audio/clinic/grinder.mp3", "cafeteira_moedor_graos"),
            new ClinicCatalogItem("frigobar_retro_turquesa", "Frigobar Retrô Turquesa com Sucos", "recepcao", 2100, 3, 1, 1, "FLOOR", true, "/assets/audio/clinic/fridge_open.mp3", "frigobar_retro_turquesa"),
            new ClinicCatalogItem("sofa_chesterfield_couro", "Sofá Chesterfield em Couro Conhaque", "recepcao", 4800, 4, 3, 1, "FLOOR", false, null, "sofa_chesterfield_couro"),
            new ClinicCatalogItem("lareira_ecologica_etanol", "Lareira Ecológica a Bioetanol", "recepcao", 4200, 4, 2, 1, "FLOOR", true, "/assets/audio/clinic/fire_crackle.mp3", "lareira_ecologica_etanol"),
            new ClinicCatalogItem("poltrona_massagem_zero_g", "Poltrona de Massagem Gravidade Zero", "recepcao", 6500, 4, 1, 1, "FLOOR", true, "/assets/audio/clinic/massage_hum.mp3", "poltrona_massagem_zero_g"),
            new ClinicCatalogItem("piano_cauda_lounge", "Piano de Meia-Cauda Laqueado Preto", "recepcao", 9800, 5, 2, 2, "FLOOR", true, "/assets/audio/clinic/piano_chord.mp3", "piano_cauda_lounge"),
            new ClinicCatalogItem("mascote_coruja_atena", "Coruja Buraqueira Atena", "recepcao", 8500, 6, 1, 1, "FLOOR", true, "/assets/audio/clinic/owl_hoot.mp3", "mascote_coruja_atena")
    );
    /**
     * Official cosmetic skins catalog for Doctor Avatar (P-089).
     */
    public static final List<DoctorSkinCatalogDto> OFFICIAL_SKINS_CATALOG = List.of(
            // COAT (Jaleco / Roupa)
            new DoctorSkinCatalogDto("coat_intern_white", "COAT", "Jaleco Tradicional Internato", 0, "skin_coat_intern_white", true),
            new DoctorSkinCatalogDto("coat_scrubs_navy", "COAT", "Scrub Azul Marinho Plantão", 500, "skin_coat_scrubs_navy", false),
            new DoctorSkinCatalogDto("coat_scrubs_green", "COAT", "Scrub Verde Cirúrgico", 800, "skin_coat_scrubs_green", false),
            new DoctorSkinCatalogDto("coat_pediatric_dino", "COAT", "Jaleco Estampado Pediatria", 1200, "skin_coat_pediatric_dino", false),
            new DoctorSkinCatalogDto("coat_executive_doc", "COAT", "Jaleco Sob Medida Premium", 2500, "skin_coat_executive_doc", false),

            // STETHOSCOPE (Estetoscópio)
            new DoctorSkinCatalogDto("steth_none", "STETHOSCOPE", "Sem Estetoscópio", 0, "skin_steth_none", true),
            new DoctorSkinCatalogDto("steth_classic_black", "STETHOSCOPE", "Estetoscópio Preto Básico", 0, "skin_steth_classic_black", true),
            new DoctorSkinCatalogDto("steth_cardio_burgundy", "STETHOSCOPE", "Esteto Cardiológico Vinho", 700, "skin_steth_cardio_burgundy", false),
            new DoctorSkinCatalogDto("ped_steth_elefante", "STETHOSCOPE", "Esteto Pediátrico Elefante", 950, "skin_steth_elefante", false),
            new DoctorSkinCatalogDto("steth_gold_master", "STETHOSCOPE", "Esteto Master Ouro 24k", 3000, "skin_steth_gold_master", false),

            // ACCESSORY (Acessórios)
            new DoctorSkinCatalogDto("acc_none", "ACCESSORY", "Nenhum", 0, "skin_acc_none", true),
            new DoctorSkinCatalogDto("acc_glasses_classic", "ACCESSORY", "Óculos de Armação Redonda", 400, "skin_acc_glasses_classic", false),
            new DoctorSkinCatalogDto("acc_ped_gorro_colorido", "ACCESSORY", "Gorro Cirúrgico Safari", 600, "skin_acc_ped_gorro_colorido", false),
            new DoctorSkinCatalogDto("acc_prontuario_clipboard", "ACCESSORY", "Prancheta Médica na Mão", 850, "skin_acc_prontuario_clipboard", false)
    );

    /**
     * Official surface options (P-087).
     */
    public static final List<OwnedSurfaceDto> OFFICIAL_SURFACES = List.of(
            new OwnedSurfaceDto("wall_clean_white", "WALL", "Paredes Brancas Internato", 0),
            new OwnedSurfaceDto("ped_papel_safari", "WALL", "Papel de Parede Safari Aquarela", 850),
            new OwnedSurfaceDto("wall_azul_clinico", "WALL", "Azulejo Cirúrgico Azul Suave", 1200),
            new OwnedSurfaceDto("wall_tijolo_loft", "WALL", "Tijolinho Aparente Acolhedor", 1600),
            new OwnedSurfaceDto("floor_porcelanato_cinza", "FLOOR", "Porcelanato Acetinado Neutro", 0),
            new OwnedSurfaceDto("floor_madeira_escandi", "FLOOR", "Madeira Clara Escandinava", 900),
            new OwnedSurfaceDto("floor_vinilico_cirurgico", "FLOOR", "Piso Vinílico Hospitalar Verde", 1100),
            new OwnedSurfaceDto("floor_marmore_carrara", "FLOOR", "Mármore Carrara & Dourado", 2400)
    );

    private final UserClinicRepository userClinicRepository;
    private final UserXpAccountRepository userXpAccountRepository;
    private final ClinicCatalogItemRepository clinicCatalogItemRepository;
    private final ClinicPlacedItemRepository clinicPlacedItemRepository;
    private final UserXpTransactionRepository userXpTransactionRepository;
    private final ClinicLayoutValidator clinicLayoutValidator;
    private final UserDoctorAvatarRepository userDoctorAvatarRepository;
    private final UserUnlockedSkinRepository userUnlockedSkinRepository;

    public ClinicService(
            UserClinicRepository userClinicRepository,
            UserXpAccountRepository userXpAccountRepository,
            ClinicCatalogItemRepository clinicCatalogItemRepository,
            ClinicPlacedItemRepository clinicPlacedItemRepository,
            UserXpTransactionRepository userXpTransactionRepository,
            ClinicLayoutValidator clinicLayoutValidator
    ) {
        this(
                userClinicRepository,
                userXpAccountRepository,
                clinicCatalogItemRepository,
                clinicPlacedItemRepository,
                userXpTransactionRepository,
                clinicLayoutValidator,
                null,
                null
        );
    }

    @org.springframework.beans.factory.annotation.Autowired
    public ClinicService(
            UserClinicRepository userClinicRepository,
            UserXpAccountRepository userXpAccountRepository,
            ClinicCatalogItemRepository clinicCatalogItemRepository,
            ClinicPlacedItemRepository clinicPlacedItemRepository,
            UserXpTransactionRepository userXpTransactionRepository,
            ClinicLayoutValidator clinicLayoutValidator,
            UserDoctorAvatarRepository userDoctorAvatarRepository,
            UserUnlockedSkinRepository userUnlockedSkinRepository
    ) {
        this.userClinicRepository = userClinicRepository;
        this.userXpAccountRepository = userXpAccountRepository;
        this.clinicCatalogItemRepository = clinicCatalogItemRepository;
        this.clinicPlacedItemRepository = clinicPlacedItemRepository;
        this.userXpTransactionRepository = userXpTransactionRepository;
        this.clinicLayoutValidator = clinicLayoutValidator;
        this.userDoctorAvatarRepository = userDoctorAvatarRepository;
        this.userUnlockedSkinRepository = userUnlockedSkinRepository;
    }

    /**
     * P-082, P-084 & P-087: Returns the student's clinic state or provisions Level 1 (Box do Internato 4x4)
     * with the 3 starter kit items if accessing for the first time.
     */
    @Transactional
    public ClinicStateResponse getOrInitClinic(UUID userId) {
        List<ClinicCatalogItem> catalog = getOrSeedCatalog();
        UserXpAccount account = getOrCreateXpAccount(userId);
        UserClinic clinic = getOrCreateUserClinicWithStarterKit(userId);
        return buildClinicStateResponse(clinic, account, catalog);
    }

    /**
     * P-087: Updates active surface finishes (wallTheme and floorTheme) if unlocked.
     */
    @Transactional
    public ClinicStateResponse updateSurfaces(UUID userId, ClinicSurfacesUpdateRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requisição de atualização de superfícies não pode ser nula.");
        }

        UserClinic clinic = getOrCreateUserClinicWithStarterKit(userId);
        UserXpAccount account = getOrCreateXpAccount(userId);
        List<ClinicCatalogItem> catalog = getOrSeedCatalog();

        Set<String> unlockedSkins = getUnlockedSkinIds(userId);

        if (request.getWallTheme() != null && !request.getWallTheme().isBlank()) {
            String wallTheme = request.getWallTheme().trim();
            // Free default or must be unlocked
            if (!"wall_clean_white".equals(wallTheme) && !unlockedSkins.contains(wallTheme)) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Você ainda não desbloqueou este revestimento."
                );
            }
            clinic.setWallTheme(wallTheme);
        }

        if (request.getFloorTheme() != null && !request.getFloorTheme().isBlank()) {
            String floorTheme = request.getFloorTheme().trim();
            // Free default or must be unlocked
            if (!"floor_porcelanato_cinza".equals(floorTheme) && !unlockedSkins.contains(floorTheme)) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Você ainda não desbloqueou este revestimento."
                );
            }
            clinic.setFloorTheme(floorTheme);
        }

        clinic.setUpdatedAt(LocalDateTime.now());
        userClinicRepository.save(clinic);

        return buildClinicStateResponse(clinic, account, catalog);
    }

    /**
     * P-080 & P-082: Sequential physical expansion of the clinic from Level 1 up to Level 6.
     * Validates lifetime_xp prerequisite and current_xp cost, debiting strictly from current_xp.
     */
    @Transactional
    public ClinicStateResponse expandClinic(UUID userId) {
        List<ClinicCatalogItem> catalog = getOrSeedCatalog();
        UserXpAccount account = getOrCreateXpAccount(userId);
        UserClinic clinic = getOrCreateUserClinicWithStarterKit(userId);

        Optional<ClinicExpansionLevel> nextOpt = ClinicExpansionLevel.nextLevel(clinic.getExpansionLevel());
        if (nextOpt.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Sua clínica já atingiu o nível máximo de expansão (Nível 6 — Instituto Médico Completo)."
            );
        }

        ClinicExpansionLevel nextLevel = nextOpt.get();

        if (account.getLifetimeXp() < nextLevel.getRequiredLifetimeXp()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    String.format(
                            "XP Vitalício insuficiente para desbloquear '%s'. Necessário: %d XP Vitalício (atual: %d XP).",
                            nextLevel.getName(), nextLevel.getRequiredLifetimeXp(), account.getLifetimeXp()
                    )
            );
        }

        if (account.getCurrentXp() < nextLevel.getCostXp()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Saldo de XP insuficiente para realizar esta operação."
            );
        }

        account.debitCurrentXp(nextLevel.getCostXp());
        userXpAccountRepository.save(account);

        clinic.setExpansionLevel(nextLevel.getLevel());
        clinic.setGridWidth(nextLevel.getGridWidth());
        clinic.setGridHeight(nextLevel.getGridHeight());
        clinic.setUpdatedAt(LocalDateTime.now());
        userClinicRepository.save(clinic);

        UserXpTransaction tx = new UserXpTransaction(
                userId,
                -nextLevel.getCostXp(),
                account.getCurrentXp(),
                StudyActionType.ROOM_EXPANSION.name(),
                "Expansão física da clínica para Nível " + nextLevel.getLevel() + ": " + nextLevel.getName()
        );
        userXpTransactionRepository.save(tx);

        return buildClinicStateResponse(clinic, account, catalog);
    }

    /**
     * P-080, P-083, P-084, P-087 & P-088: Atomic purchase of an item from the catalog.
     * Decouples surfaces and handles wall items cleanly.
     */
    @Transactional
    public BuyClinicItemResponse buyItem(UUID userId, BuyClinicItemRequest request) {
        if (request == null || request.getCatalogItemId() == null || request.getCatalogItemId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O identificador do item do catálogo é obrigatório.");
        }

        List<ClinicCatalogItem> catalog = getOrSeedCatalog();
        Map<String, ClinicCatalogItem> catalogMap = catalog.stream()
                .collect(Collectors.toMap(ClinicCatalogItem::getId, Function.identity(), (a, b) -> a, LinkedHashMap::new));

        ClinicCatalogItem item = findCatalogItem(request.getCatalogItemId(), catalogMap)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item não encontrado no catálogo oficial: " + request.getCatalogItemId()
                ));

        if (item.isLootboxExclusive()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Este item é uma relíquia exclusiva de Lootbox e não pode ser adquirido por compra direta com XP."
            );
        }

        UserXpAccount account = getOrCreateXpAccount(userId);
        UserClinic clinic = getOrCreateUserClinicWithStarterKit(userId);

        if (clinic.getExpansionLevel() < item.getMinExpansionLevel()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    String.format(
                            "Nível da clínica insuficiente para adquirir '%s'. Nível mínimo exigido: %d (atual: %d).",
                            item.getName(), item.getMinExpansionLevel(), clinic.getExpansionLevel()
                    )
            );
        }

        if (account.getCurrentXp() < item.getCostXp()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Saldo de XP insuficiente para realizar esta operação."
            );
        }

        account.debitCurrentXp(item.getCostXp());
        userXpAccountRepository.save(account);

        UserXpTransaction tx = new UserXpTransaction(
                userId,
                -item.getCostXp(),
                account.getCurrentXp(),
                StudyActionType.ITEM_PURCHASE.name(),
                "Compra de item da clínica: " + item.getName() + " (" + item.getId() + ")"
        );
        userXpTransactionRepository.save(tx);

        // Surface themes handling (P-087)
        if ("SURFACE_WALL".equalsIgnoreCase(item.getPlacementType()) || "SURFACE_FLOOR".equalsIgnoreCase(item.getPlacementType())) {
            unlockSkinForUser(userId, item.getPlacementType().toLowerCase(), item.getId());
            if ("SURFACE_WALL".equalsIgnoreCase(item.getPlacementType())) {
                clinic.setWallTheme(item.getId());
            } else {
                clinic.setFloorTheme(item.getId());
            }
            clinic.setUpdatedAt(LocalDateTime.now());
            userClinicRepository.save(clinic);

            ClinicPlacedItem surfaceItem = new ClinicPlacedItem(clinic.getId(), item.getId(), 0, 0, 0, false);
            surfaceItem.setId(UUID.randomUUID());

            ClinicStateResponse updatedState = buildClinicStateResponse(clinic, account, catalog);
            return BuyClinicItemResponse.from(
                    PlacedItemDto.fromEntity(surfaceItem),
                    updatedState,
                    "Revestimento '" + item.getName() + "' aplicado com sucesso à clínica!"
            );
        }

        List<ClinicPlacedItem> existingEntities = new ArrayList<>(
                clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinic.getId())
        );
        List<PlacedItemDto> existingPlacedDtos = existingEntities.stream()
                .filter(ClinicPlacedItem::isPlaced)
                .map(PlacedItemDto::fromEntity)
                .toList();

        int rotation = request.getRotation() != null ? request.getRotation() : 0;
        ClinicPlacedItem newPlacedEntity;

        if ("WALL".equalsIgnoreCase(item.getPlacementType())) {
            // Default wall placement
            String wallSide = "NW";
            int wallTileIndex = 0;
            // Find first free wall slot
            for (int i = 0; i < clinic.getGridWidth(); i++) {
                final int idx = i;
                boolean occupied = existingPlacedDtos.stream()
                        .anyMatch(p -> "NW".equalsIgnoreCase(p.getWallSide()) && p.getWallTileIndex() != null && p.getWallTileIndex() == idx);
                if (!occupied) {
                    wallTileIndex = i;
                    break;
                }
            }
            newPlacedEntity = new ClinicPlacedItem(clinic.getId(), item.getId(), wallSide, wallTileIndex, 45, true);
        } else if (request.getGridX() != null && request.getGridY() != null) {
            List<PlacedItemDto> candidateLayout = new ArrayList<>(existingPlacedDtos);
            candidateLayout.add(new PlacedItemDto(null, item.getId(), request.getGridX(), request.getGridY(), rotation, true));
            clinicLayoutValidator.validateLayout(clinic.getGridWidth(), clinic.getGridHeight(), candidateLayout, catalogMap);
            newPlacedEntity = new ClinicPlacedItem(clinic.getId(), item.getId(), request.getGridX(), request.getGridY(), rotation, true);
        } else {
            int[] freeCoords = findFirstFreeSlot(clinic.getGridWidth(), clinic.getGridHeight(), rotation, item, existingPlacedDtos, catalogMap);
            if (freeCoords != null) {
                newPlacedEntity = new ClinicPlacedItem(clinic.getId(), item.getId(), freeCoords[0], freeCoords[1], rotation, true);
            } else {
                newPlacedEntity = new ClinicPlacedItem(clinic.getId(), item.getId(), 0, 0, 0, false);
            }
        }

        ClinicPlacedItem repoSaved = clinicPlacedItemRepository.save(newPlacedEntity);
        final ClinicPlacedItem savedPlaced;
        if (repoSaved == null) {
            newPlacedEntity.setId(UUID.randomUUID());
            savedPlaced = newPlacedEntity;
        } else {
            if (repoSaved.getId() == null) {
                repoSaved.setId(UUID.randomUUID());
            }
            savedPlaced = repoSaved;
        }

        existingEntities.add(savedPlaced);
        ClinicStateResponse updatedState = buildClinicStateResponseWithItems(clinic, account, catalog, existingEntities);
        PlacedItemDto purchasedDto = PlacedItemDto.fromEntity(savedPlaced);

        return BuyClinicItemResponse.from(
                purchasedDto,
                updatedState,
                "Item '" + item.getName() + "' adquirido com sucesso!"
        );
    }

    /**
     * P-084 & P-088: Batch updates the spatial layout of owned items after validating ownership, grid bounds,
     * 2D AABB collisions for floor items, and wall non-collisions for wall items.
     */
    @Transactional
    public ClinicStateResponse updateLayout(UUID userId, UpdateClinicLayoutRequest request) {
        if (request == null || request.getItems() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A lista de itens do layout é obrigatória.");
        }

        List<ClinicCatalogItem> catalog = getOrSeedCatalog();
        Map<String, ClinicCatalogItem> catalogMap = catalog.stream()
                .collect(Collectors.toMap(ClinicCatalogItem::getId, Function.identity(), (a, b) -> a, LinkedHashMap::new));

        UserXpAccount account = getOrCreateXpAccount(userId);
        UserClinic clinic = getOrCreateUserClinicWithStarterKit(userId);

        List<ClinicPlacedItem> ownedEntities = new ArrayList<>(
                clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinic.getId())
        );
        Map<UUID, ClinicPlacedItem> ownedById = ownedEntities.stream()
                .filter(e -> e.getId() != null)
                .collect(Collectors.toMap(ClinicPlacedItem::getId, Function.identity(), (a, b) -> a));

        // 1. Validate item ownership (prevent IDOR across clinics)
        for (PlacedItemDto dto : request.getItems()) {
            if (dto.getId() != null) {
                ClinicPlacedItem owned = ownedById.get(dto.getId());
                if (owned == null) {
                    Optional<ClinicPlacedItem> fromDb = clinicPlacedItemRepository.findById(dto.getId());
                    if (fromDb.isPresent() && !clinic.getId().equals(fromDb.get().getClinicId())) {
                        throw new ResponseStatusException(
                                HttpStatus.FORBIDDEN,
                                "Você não tem permissão para modificar itens pertencentes a outra clínica."
                        );
                    }
                    throw new ResponseStatusException(
                            HttpStatus.FORBIDDEN,
                            "Item não pertence à clínica do estudante autenticado: " + dto.getId()
                    );
                }
                if (dto.getCatalogItemId() == null || dto.getCatalogItemId().isBlank()) {
                    dto.setCatalogItemId(owned.getCatalogItemId());
                }
            }
        }

        // 2. Validate grid boundaries and non-collision (P-084, P-088)
        clinicLayoutValidator.validateLayout(clinic.getGridWidth(), clinic.getGridHeight(), request.getItems(), catalogMap);

        // 3. Apply layout changes to owned entities
        List<ClinicPlacedItem> toSave = new ArrayList<>();
        for (PlacedItemDto dto : request.getItems()) {
            ClinicPlacedItem target = null;
            if (dto.getId() != null) {
                target = ownedById.get(dto.getId());
            } else if (dto.getCatalogItemId() != null) {
                target = ownedEntities.stream()
                        .filter(e -> e.getCatalogItemId().equals(dto.getCatalogItemId()) && !toSave.contains(e))
                        .findFirst()
                        .orElse(null);
            }

            if (target != null) {
                target.setGridX(dto.getGridX() != null ? dto.getGridX() : 0);
                target.setGridY(dto.getGridY() != null ? dto.getGridY() : 0);
                target.setRotation(dto.getRotation());
                target.setPlaced(dto.isPlaced());
                if (dto.getWallSide() != null) {
                    target.setWallSide(dto.getWallSide());
                    target.setWallTileIndex(dto.getWallTileIndex());
                    target.setElevationZ(dto.getElevationZ() != null ? dto.getElevationZ() : 45);
                }
                toSave.add(target);
            }
        }

        if (!toSave.isEmpty()) {
            clinicPlacedItemRepository.saveAll(toSave);
        }

        clinic.setUpdatedAt(LocalDateTime.now());
        userClinicRepository.save(clinic);

        return buildClinicStateResponse(clinic, account, catalog);
    }

    /**
     * P-089: Gets active Doctor Avatar state, unlocked skins, and full catalog.
     */
    @Transactional
    public DoctorAvatarResponseDto getDoctorAvatar(UUID userId) {
        UserDoctorAvatar avatar = getOrCreateDoctorAvatar(userId);
        Set<String> unlockedSkins = getUnlockedSkinIds(userId);

        List<DoctorSkinCatalogDto> catalogSkins = OFFICIAL_SKINS_CATALOG.stream()
                .map(s -> new DoctorSkinCatalogDto(
                        s.getId(),
                        s.getSlot(),
                        s.getName(),
                        s.getCostXp(),
                        s.getAssetSvgKey(),
                        unlockedSkins.contains(s.getId())
                ))
                .toList();

        return new DoctorAvatarResponseDto(
                avatar.getUserId(),
                avatar.getGender(),
                avatar.getSkinCoat(),
                avatar.getSkinStethoscope(),
                avatar.getSkinAccessory(),
                avatar.getAvatarX(),
                avatar.getAvatarY(),
                new ArrayList<>(unlockedSkins),
                catalogSkins
        );
    }

    /**
     * P-089: Updates Doctor Avatar (free gender switch, equipping owned skins).
     */
    @Transactional
    public DoctorAvatarResponseDto updateDoctorAvatar(UUID userId, DoctorAvatarUpdateDto request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requisição de avatar inválida.");
        }

        UserDoctorAvatar avatar = getOrCreateDoctorAvatar(userId);
        Set<String> unlockedSkins = getUnlockedSkinIds(userId);

        if (request.getGender() != null && !request.getGender().isBlank()) {
            String gender = request.getGender().toUpperCase();
            if (!"MALE".equals(gender) && !"FEMALE".equals(gender)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Gênero inválido. Opções permitidas: MALE ou FEMALE.");
            }
            avatar.setGender(gender); // Free change!
        }

        if (request.getSkinCoat() != null && !request.getSkinCoat().isBlank()) {
            if (!unlockedSkins.contains(request.getSkinCoat())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você ainda não desbloqueou este item cosmético.");
            }
            avatar.setSkinCoat(request.getSkinCoat());
        }

        if (request.getSkinStethoscope() != null && !request.getSkinStethoscope().isBlank()) {
            if (!unlockedSkins.contains(request.getSkinStethoscope())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você ainda não desbloqueou este item cosmético.");
            }
            avatar.setSkinStethoscope(request.getSkinStethoscope());
        }

        if (request.getSkinAccessory() != null && !request.getSkinAccessory().isBlank()) {
            if (!unlockedSkins.contains(request.getSkinAccessory())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você ainda não desbloqueou este item cosmético.");
            }
            avatar.setSkinAccessory(request.getSkinAccessory());
        }

        if (request.getAvatarX() != null) avatar.setAvatarX(request.getAvatarX());
        if (request.getAvatarY() != null) avatar.setAvatarY(request.getAvatarY());
        avatar.setUpdatedAt(LocalDateTime.now());

        if (userDoctorAvatarRepository != null) {
            userDoctorAvatarRepository.save(avatar);
        }

        return getDoctorAvatar(userId);
    }

    /**
     * P-089: Purchases a cosmetic skin for Doctor Avatar, debiting current_xp.
     */
    @Transactional
    public Map<String, Object> buySkin(UUID userId, String skinId) {
        if (skinId == null || skinId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O identificador da skin é obrigatório.");
        }

        DoctorSkinCatalogDto catalogSkin = OFFICIAL_SKINS_CATALOG.stream()
                .filter(s -> s.getId().equalsIgnoreCase(skinId.trim()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skin cosmética não encontrada no catálogo."));

        Set<String> unlockedSkins = getUnlockedSkinIds(userId);
        if (unlockedSkins.contains(catalogSkin.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Item cosmético já desbloqueado.");
        }

        UserXpAccount account = getOrCreateXpAccount(userId);
        if (account.getCurrentXp() < catalogSkin.getCostXp()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Saldo de XP insuficiente para realizar esta operação.");
        }

        account.debitCurrentXp(catalogSkin.getCostXp());
        userXpAccountRepository.save(account);

        unlockSkinForUser(userId, catalogSkin.getSlot().toLowerCase(), catalogSkin.getId());

        UserXpTransaction tx = new UserXpTransaction(
                userId,
                -catalogSkin.getCostXp(),
                account.getCurrentXp(),
                "SKIN_PURCHASE",
                "Aquisição de Skin Cosmética: " + catalogSkin.getName()
        );
        userXpTransactionRepository.save(tx);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("skinId", catalogSkin.getId());
        res.put("slot", catalogSkin.getSlot());
        res.put("name", catalogSkin.getName());
        res.put("costXp", catalogSkin.getCostXp());
        res.put("remainingCurrentXp", account.getCurrentXp());
        res.put("purchasedAt", LocalDateTime.now().toString());
        return res;
    }

    private UserDoctorAvatar getOrCreateDoctorAvatar(UUID userId) {
        if (userDoctorAvatarRepository != null) {
            try {
                Optional<UserDoctorAvatar> found = userDoctorAvatarRepository.findByUserId(userId);
                if (found != null && found.isPresent()) {
                    return found.get();
                }
                UserDoctorAvatar created = new UserDoctorAvatar(userId);
                UserDoctorAvatar saved = userDoctorAvatarRepository.save(created);
                return saved != null ? saved : created;
            } catch (Exception e) {
                return new UserDoctorAvatar(userId);
            }
        }
        return new UserDoctorAvatar(userId);
    }

    private Set<String> getUnlockedSkinIds(UUID userId) {
        Set<String> defaultSkins = Set.of(
                "wall_clean_white",
                "floor_porcelanato_cinza",
                "coat_intern_white",
                "steth_none",
                "steth_classic_black",
                "acc_none"
        );
        if (userUnlockedSkinRepository != null) {
            List<UserUnlockedSkin> list = userUnlockedSkinRepository.findByUserId(userId);
            Set<String> fromDb = list.stream().map(UserUnlockedSkin::getSkinId).collect(Collectors.toSet());
            fromDb.addAll(defaultSkins);
            return fromDb;
        }
        return new java.util.HashSet<>(defaultSkins);
    }

    private void unlockSkinForUser(UUID userId, String slot, String skinId) {
        if (userUnlockedSkinRepository != null) {
            if (!userUnlockedSkinRepository.existsByUserIdAndSkinId(userId, skinId)) {
                UserUnlockedSkin skin = new UserUnlockedSkin(userId, slot, skinId);
                userUnlockedSkinRepository.save(skin);
            }
        }
    }

    private List<ClinicCatalogItem> getOrSeedCatalog() {
        List<ClinicCatalogItem> existing = clinicCatalogItemRepository.findAllByOrderByCategoryAscMinExpansionLevelAscCostXpAsc();
        if (existing != null && existing.size() >= OFFICIAL_CATALOG_ITEMS.size()) {
            return existing;
        }
        try {
            clinicCatalogItemRepository.saveAll(OFFICIAL_CATALOG_ITEMS);
        } catch (Exception ignored) {
            // Ignore in read-only or mocked test contexts
        }
        return OFFICIAL_CATALOG_ITEMS;
    }

    private Optional<ClinicCatalogItem> findCatalogItem(String catalogItemId, Map<String, ClinicCatalogItem> catalogMap) {
        Optional<ClinicCatalogItem> fromRepo = clinicCatalogItemRepository.findById(catalogItemId);
        if (fromRepo.isPresent()) {
            return fromRepo;
        }
        return Optional.ofNullable(catalogMap.get(catalogItemId));
    }

    private UserXpAccount getOrCreateXpAccount(UUID userId) {
        return userXpAccountRepository.findById(userId)
                .orElseGet(() -> {
                    UserXpAccount created = new UserXpAccount(userId, 0L, 0L, 0, null);
                    UserXpAccount saved = userXpAccountRepository.save(created);
                    return saved != null ? saved : created;
                });
    }

    private UserClinic getOrCreateUserClinicWithStarterKit(UUID userId) {
        Optional<UserClinic> existingOpt = userClinicRepository.findByUserId(userId);
        if (existingOpt.isPresent()) {
            return existingOpt.get();
        }

        UserClinic newClinic = new UserClinic();
        newClinic.setUserId(userId);
        newClinic.setClinicName("Minha Clínica");
        newClinic.setExpansionLevel(ClinicExpansionLevel.LEVEL_1.getLevel());
        newClinic.setGridWidth(ClinicExpansionLevel.LEVEL_1.getGridWidth());
        newClinic.setGridHeight(ClinicExpansionLevel.LEVEL_1.getGridHeight());
        newClinic.setTheme("clean_modern");
        newClinic.setWallTheme("wall_clean_white");
        newClinic.setFloorTheme("floor_porcelanato_cinza");

        UserClinic savedClinic = userClinicRepository.save(newClinic);
        if (savedClinic == null) {
            savedClinic = newClinic;
        }
        if (savedClinic.getId() == null) {
            savedClinic.setId(UUID.randomUUID());
        }

        UUID clinicId = savedClinic.getId();
        List<ClinicPlacedItem> starterItems = List.of(
                new ClinicPlacedItem(clinicId, "mesa_scandi", 0, 0, 0, true),
                new ClinicPlacedItem(clinicId, "cadeira_ergonomica", 0, 1, 0, true),
                new ClinicPlacedItem(clinicId, "ped_maca_baleia", 2, 0, 0, true)
        );
        clinicPlacedItemRepository.saveAll(starterItems);

        // Provision initial avatar
        getOrCreateDoctorAvatar(userId);

        return savedClinic;
    }

    private int[] findFirstFreeSlot(
            int gridWidth,
            int gridHeight,
            int rotation,
            ClinicCatalogItem item,
            List<PlacedItemDto> existingPlacedItems,
            Map<String, ClinicCatalogItem> catalogMap
    ) {
        for (int y = 0; y < gridHeight; y++) {
            for (int x = 0; x < gridWidth; x++) {
                if (clinicLayoutValidator.canPlaceAt(gridWidth, gridHeight, x, y, rotation, item, existingPlacedItems, catalogMap)) {
                    return new int[]{x, y};
                }
            }
        }
        return null;
    }

    private ClinicStateResponse buildClinicStateResponse(
            UserClinic clinic,
            UserXpAccount account,
            List<ClinicCatalogItem> catalog
    ) {
        List<ClinicPlacedItem> allItems = clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinic.getId());
        return buildClinicStateResponseWithItems(clinic, account, catalog, allItems);
    }

    private ClinicStateResponse buildClinicStateResponseWithItems(
            UserClinic clinic,
            UserXpAccount account,
            List<ClinicCatalogItem> catalog,
            List<ClinicPlacedItem> allItems
    ) {
        ClinicExpansionLevel currentLevel = ClinicExpansionLevel.fromLevel(clinic.getExpansionLevel());
        Optional<ClinicExpansionLevel> nextLevelOpt = ClinicExpansionLevel.nextLevel(clinic.getExpansionLevel());

        List<PlacedItemDto> inventory = (allItems != null ? allItems : List.<ClinicPlacedItem>of())
                .stream()
                .map(PlacedItemDto::fromEntity)
                .toList();

        List<PlacedItemDto> placedItems = inventory.stream()
                .filter(PlacedItemDto::isPlaced)
                .toList();

        List<String> ownedItemIds = inventory.stream()
                .map(PlacedItemDto::getCatalogItemId)
                .distinct()
                .toList();

        int streakDays = account.getCurrentStreakDays();
        int streakMultiplierPercent = calculateStreakMultiplierPercent(streakDays);

        ClinicStateResponse response = new ClinicStateResponse();
        response.setClinicId(clinic.getId());
        response.setClinicName(clinic.getClinicName());
        response.setExpansionLevel(currentLevel.getLevel());
        response.setExpansionName(currentLevel.getName());
        response.setGridWidth(clinic.getGridWidth());
        response.setGridHeight(clinic.getGridHeight());
        response.setTheme(clinic.getTheme());
        response.setWallTheme(clinic.getWallTheme() != null ? clinic.getWallTheme() : "wall_clean_white");
        response.setFloorTheme(clinic.getFloorTheme() != null ? clinic.getFloorTheme() : "floor_porcelanato_cinza");
        response.setLifetimeXp(account.getLifetimeXp());
        response.setCurrentXp(account.getCurrentXp());
        response.setCurrentStreakDays(streakDays);
        response.setStreakMultiplierPercent(streakMultiplierPercent);

        // Populate avatar DTO
        UserDoctorAvatar avatarEntity = getOrCreateDoctorAvatar(clinic.getUserId());
        response.setAvatar(new DoctorAvatarDto(
                avatarEntity.getUserId(),
                avatarEntity.getGender(),
                avatarEntity.getSkinCoat(),
                avatarEntity.getSkinStethoscope(),
                avatarEntity.getSkinAccessory(),
                avatarEntity.getAvatarX(),
                avatarEntity.getAvatarY()
        ));

        // Populate owned surfaces
        Set<String> unlockedIds = getUnlockedSkinIds(clinic.getUserId());
        List<OwnedSurfaceDto> ownedSurfaces = OFFICIAL_SURFACES.stream()
                .filter(s -> unlockedIds.contains(s.getId()))
                .toList();
        response.setOwnedSurfaces(ownedSurfaces);

        if (nextLevelOpt.isPresent()) {
            ClinicExpansionLevel next = nextLevelOpt.get();
            response.setNextExpansionLevel(next.getLevel());
            response.setNextExpansionName(next.getName());
            response.setNextExpansionGridWidth(next.getGridWidth());
            response.setNextExpansionGridHeight(next.getGridHeight());
            response.setNextExpansionCostXp(next.getCostXp());
            response.setNextExpansionRequiredLifetimeXp(next.getRequiredLifetimeXp());
            response.setCanExpand(
                    account.getLifetimeXp() >= next.getRequiredLifetimeXp()
                            && account.getCurrentXp() >= next.getCostXp()
            );
        } else {
            response.setCanExpand(false);
        }

        response.setOwnedItemIds(ownedItemIds);
        response.setPlacedItems(placedItems);
        response.setInventory(inventory);
        response.setCatalog(catalog);

        return response;
    }

    private int calculateStreakMultiplierPercent(int streakDays) {
        if (streakDays >= 30) return 50;
        if (streakDays >= 14) return 35;
        if (streakDays >= 7) return 20;
        if (streakDays >= 3) return 10;
        return 0;
    }
}

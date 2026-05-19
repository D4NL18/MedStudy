export interface AvatarPreset {
  id: string;
  name: string;
  category: 'Clínica Médica' | 'Cirurgia' | 'Pediatria' | 'Ginecologia e Obstetrícia' | 'Preventiva' | 'Outros';
  icon: 'heart' | 'brain' | 'lung' | 'baby' | 'scalpel' | 'shield' | 'dna' | 'eye' | 'ear' | 'pill' | 'bone' | 'microscope' | 'steth' | 'tooth' | 'flask';
  colorStart: string;
  colorEnd: string;
  abbreviation: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  // Clínica Médica
  { id: 'clinica_geral', name: 'Clínica Médica', category: 'Clínica Médica', icon: 'steth', colorStart: '#00B4DB', colorEnd: '#0083B0', abbreviation: 'CM' },
  { id: 'cardiologia', name: 'Cardiologia', category: 'Clínica Médica', icon: 'heart', colorStart: '#FF416C', colorEnd: '#FF4B2B', abbreviation: 'CARD' },
  { id: 'dermatologia', name: 'Dermatologia', category: 'Clínica Médica', icon: 'shield', colorStart: '#F3904F', colorEnd: '#3B4371', abbreviation: 'DERM' },
  { id: 'endocrinologia', name: 'Endocrinologia', category: 'Clínica Médica', icon: 'pill', colorStart: '#11998e', colorEnd: '#38ef7d', abbreviation: 'ENDO' },
  { id: 'gastroenterologia', name: 'Gastroenterologia', category: 'Clínica Médica', icon: 'steth', colorStart: '#8E2DE2', colorEnd: '#4A00E0', abbreviation: 'GAST' },
  { id: 'geriatria', name: 'Geriatria', category: 'Clínica Médica', icon: 'shield', colorStart: '#ffe259', colorEnd: '#ffa751', abbreviation: 'GERI' },
  { id: 'hematologia', name: 'Hematologia', category: 'Clínica Médica', icon: 'flask', colorStart: '#e65c00', colorEnd: '#F9D423', abbreviation: 'HEMA' },
  { id: 'infectologia', name: 'Infectologia', category: 'Clínica Médica', icon: 'microscope', colorStart: '#1488CC', colorEnd: '#2B32B2', abbreviation: 'INFE' },
  { id: 'nefrologia', name: 'Nefrologia', category: 'Clínica Médica', icon: 'steth', colorStart: '#a8c0ff', colorEnd: '#3f2b96', abbreviation: 'NEFR' },
  { id: 'neurologia', name: 'Neurologia', category: 'Clínica Médica', icon: 'brain', colorStart: '#30CFD0', colorEnd: '#330867', abbreviation: 'NEUR' },
  { id: 'oncologia', name: 'Oncologia', category: 'Clínica Médica', icon: 'dna', colorStart: '#f857a6', colorEnd: '#ff5858', abbreviation: 'ONCO' },
  { id: 'pneumologia', name: 'Pneumologia', category: 'Clínica Médica', icon: 'lung', colorStart: '#4CA1AF', colorEnd: '#2C3E50', abbreviation: 'PNEU' },
  { id: 'psiquiatria', name: 'Psiquiatria', category: 'Clínica Médica', icon: 'brain', colorStart: '#e65c00', colorEnd: '#F9D423', abbreviation: 'PSIQ' },
  { id: 'reumatologia', name: 'Reumatologia', category: 'Clínica Médica', icon: 'bone', colorStart: '#614385', colorEnd: '#516395', abbreviation: 'REUM' },
  { id: 'alergologia', name: 'Alergologia', category: 'Clínica Médica', icon: 'shield', colorStart: '#78ffd6', colorEnd: '#a18cd1', abbreviation: 'ALER' },
  { id: 'nutrologia', name: 'Nutrologia', category: 'Clínica Médica', icon: 'steth', colorStart: '#16BFFD', colorEnd: '#CB3066', abbreviation: 'NUTR' },
  { id: 'medicina_emergencia', name: 'Medicina de Emergência', category: 'Clínica Médica', icon: 'shield', colorStart: '#FF4B2B', colorEnd: '#FF416C', abbreviation: 'EMER' },
  { id: 'medicina_intensiva', name: 'Medicina Intensiva', category: 'Clínica Médica', icon: 'heart', colorStart: '#52c234', colorEnd: '#061700', abbreviation: 'UTI' },
  { id: 'toxicologia', name: 'Toxicologia', category: 'Clínica Médica', icon: 'flask', colorStart: '#0052D4', colorEnd: '#4364F7', abbreviation: 'TOXI' },
  { id: 'medicina_esporte', name: 'Medicina do Esporte', category: 'Clínica Médica', icon: 'heart', colorStart: '#F3904F', colorEnd: '#3B4371', abbreviation: 'ESPO' },

  // Cirurgia
  { id: 'cirurgia_geral', name: 'Cirurgia Geral', category: 'Cirurgia', icon: 'scalpel', colorStart: '#4568DC', colorEnd: '#B06AB8', abbreviation: 'CG' },
  { id: 'cirurgia_cardiovascular', name: 'Cirurgia Cardiovascular', category: 'Cirurgia', icon: 'heart', colorStart: '#f12711', colorEnd: '#f5af19', abbreviation: 'CCV' },
  { id: 'cirurgia_plastica', name: 'Cirurgia Plástica', category: 'Cirurgia', icon: 'scalpel', colorStart: '#D3CBB8', colorEnd: '#6D6027', abbreviation: 'PLAS' },
  { id: 'cirurgia_toracica', name: 'Cirurgia Torácica', category: 'Cirurgia', icon: 'lung', colorStart: '#3a7bd5', colorEnd: '#3a6073', abbreviation: 'CTOR' },
  { id: 'cirurgia_vascular', name: 'Cirurgia Vascular', category: 'Cirurgia', icon: 'scalpel', colorStart: '#20002c', colorEnd: '#cbb4d4', abbreviation: 'CVAS' },
  { id: 'neurocirurgia', name: 'Neurocirurgia', category: 'Cirurgia', icon: 'brain', colorStart: '#141E30', colorEnd: '#243B55', abbreviation: 'NCIR' },
  { id: 'ortopedia', name: 'Ortopedia', category: 'Cirurgia', icon: 'bone', colorStart: '#4DA0B0', colorEnd: '#D39D38', abbreviation: 'ORTO' },
  { id: 'urologia', name: 'Urologia', category: 'Cirurgia', icon: 'shield', colorStart: '#0575E6', colorEnd: '#00F260', abbreviation: 'UROL' },
  { id: 'cirurgia_pediatrica', name: 'Cirurgia Pediátrica', category: 'Cirurgia', icon: 'baby', colorStart: '#FF3366', colorEnd: '#FF99CC', abbreviation: 'CPED' },
  { id: 'cirurgia_cabeca_pescoco', name: 'Cirurgia de Cabeça e Pescoço', category: 'Cirurgia', icon: 'scalpel', colorStart: '#30E891', colorEnd: '#0E85D8', abbreviation: 'CCP' },

  // Pediatria
  { id: 'pediatria_geral', name: 'Pediatria Geral', category: 'Pediatria', icon: 'baby', colorStart: '#FF99F8', colorEnd: '#FF33B4', abbreviation: 'PED' },
  { id: 'neonatologia', name: 'Neonatologia', category: 'Pediatria', icon: 'baby', colorStart: '#00c6ff', colorEnd: '#0072ff', abbreviation: 'NEO' },
  { id: 'pediatria_intensiva', name: 'Pediatria Intensiva', category: 'Pediatria', icon: 'heart', colorStart: '#FF4E50', colorEnd: '#F9D423', abbreviation: 'UTIP' },
  { id: 'cardiologia_pediatrica', name: 'Cardiologia Pediátrica', category: 'Pediatria', icon: 'heart', colorStart: '#FF00CC', colorEnd: '#333399', abbreviation: 'CPED' },
  { id: 'neurologia_pediatrica', name: 'Neurologia Pediátrica', category: 'Pediatria', icon: 'brain', colorStart: '#2193b0', colorEnd: '#6dd5ed', abbreviation: 'NPED' },
  { id: 'oncologia_pediatrica', name: 'Oncologia Pediátrica', category: 'Pediatria', icon: 'dna', colorStart: '#f12711', colorEnd: '#f5af19', abbreviation: 'OPED' },
  { id: 'pneumologia_pediatrica', name: 'Pneumologia Pediátrica', category: 'Pediatria', icon: 'lung', colorStart: '#a8ff78', colorEnd: '#78ffd6', abbreviation: 'PPED' },
  { id: 'gastroenterologia_pediatrica', name: 'Gastroenterologia Pediátrica', category: 'Pediatria', icon: 'steth', colorStart: '#eef2f3', colorEnd: '#8e9eab', abbreviation: 'GPED' },

  // Ginecologia e Obstetrícia
  { id: 'ginecologia_obstetricia', name: 'Ginecologia e Obstetrícia', category: 'Ginecologia e Obstetrícia', icon: 'baby', colorStart: '#f857a6', colorEnd: '#ff5858', abbreviation: 'GO' },
  { id: 'medicina_fetal', name: 'Medicina Fetal', category: 'Ginecologia e Obstetrícia', icon: 'baby', colorStart: '#FFC371', colorEnd: '#FF5F6D', abbreviation: 'FET' },
  { id: 'reproducao_humana', name: 'Reprodução Humana', category: 'Ginecologia e Obstetrícia', icon: 'dna', colorStart: '#ee9ca7', colorEnd: '#ffdde1', abbreviation: 'REPR' },
  { id: 'gineco_infanto', name: 'Ginecologia Infanto-Juvenil', category: 'Ginecologia e Obstetrícia', icon: 'baby', colorStart: '#a1c4fd', colorEnd: '#c2e9fb', abbreviation: 'GIJ' },

  // Preventiva
  { id: 'preventiva_social', name: 'Medicina Preventiva e Social', category: 'Preventiva', icon: 'shield', colorStart: '#11998e', colorEnd: '#38ef7d', abbreviation: 'PREV' },
  { id: 'epidemiologia', name: 'Epidemiologia', category: 'Preventiva', icon: 'microscope', colorStart: '#396afc', colorEnd: '#2948ff', abbreviation: 'EPID' },
  { id: 'medicina_trabalho', name: 'Medicina do Trabalho', category: 'Preventiva', icon: 'shield', colorStart: '#2C3E50', colorEnd: '#FD746C', abbreviation: 'MEDT' },
  { id: 'medicina_familia', name: 'Medicina de Família e Comunidade', category: 'Preventiva', icon: 'steth', colorStart: '#ffe259', colorEnd: '#ffa751', abbreviation: 'MFC' },

  // Outros
  { id: 'anestesiologia', name: 'Anestesiologia', category: 'Outros', icon: 'pill', colorStart: '#000000', colorEnd: '#434343', abbreviation: 'ANES' },
  { id: 'radiologia', name: 'Radiologia', category: 'Outros', icon: 'shield', colorStart: '#757F9A', colorEnd: '#D7DDE8', abbreviation: 'RAD' },
  { id: 'oftalmologia', name: 'Oftalmologia', category: 'Outros', icon: 'eye', colorStart: '#00c6ff', colorEnd: '#0072ff', abbreviation: 'OFTA' },
  { id: 'otorrinolaringologia', name: 'Otorrinolaringologia', category: 'Outros', icon: 'ear', colorStart: '#ffe259', colorEnd: '#ffa751', abbreviation: 'ORL' },
  { id: 'patologia', name: 'Patologia', category: 'Outros', icon: 'microscope', colorStart: '#799F0C', colorEnd: '#ACBB78', abbreviation: 'PATO' },
  { id: 'genetica_medica', name: 'Genética Médica', category: 'Outros', icon: 'dna', colorStart: '#F3904F', colorEnd: '#3B4371', abbreviation: 'GENE' }
];

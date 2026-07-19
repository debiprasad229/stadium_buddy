/**
 * Translations Dictionary for ArenaOS 2026
 * Supports English (US), Spanish (Mexico), and French (Canada).
 */

export type Language = 'en' | 'es' | 'fr';

export const translations = {
  en: {
    title: 'ArenaOS 2026',
    subtitle: 'FIFA World Cup Smart Stadium Dashboard',
    roleFan: 'Fan Experience Hub',
    roleOps: 'Operations Command Center',
    welcomeTitle: 'Welcome to MetLife Stadium',
    welcomeSubtitle: 'Your smart digital companion for navigation, food express pre-ordering, and sustainable tournament rewards.',
    
    // Common
    loading: 'Loading...',
    send: 'Send',
    cancel: 'Cancel',
    save: 'Save',
    active: 'Active',
    resolved: 'Resolved',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
    
    // Fan Hub - Chatbot
    assistantTitle: 'FIFA Smart Assistant',
    assistantPlaceholder: 'Ask about gates, food, transport, or seats...',
    concessionTitle: 'Express Concessions',
    sustainabilityTitle: 'GreenPass Sustainability Tracker',
    sustainabilityText: 'Scan your eco-cup barcode to earn FIFA Green Points.',
    sustainabilityPoints: 'Green Points Earned',
    scanCupButton: 'Scan Eco-Cup Barcode',
    mapTitle: 'Interactive Stadium Seating Map',
    findSeatButton: 'Calculate Seat Route',
    expressOrderButton: 'Pre-Order Food',
    queueTime: 'Est. Queue Wait',
    greenPointsLabel: 'GP',
    
    // Fan Hub - Concessions
    concessionDesc: 'Pre-order food and drinks to bypass lines. Receive eco-cup credits on checkout.',
    orderFormTitle: 'Express Pre-Order Form',
    selectItemLabel: 'Select Item',
    quantityLabel: 'Quantity',
    seatLocationLabel: 'Seat Location (e.g. A102-12)',
    customerNameLabel: 'Customer Name',
    customerNamePlaceholder: 'Enter name for pick-up',
    orderSuccessMsg: 'Order {orderId} placed! Go to Express Lane at {location} in {waitTime} min.',
    recentOrdersTitle: 'Recent Order Logs',
    preparingStatus: 'Preparing',
    orderValidationError: 'Invalid order details.',

    // Fan Hub - GreenTracker
    environmentalImpactTitle: 'Environmental Impact',
    plasticSavedLabel: 'Plastic saved',
    co2SavedLabel: 'CO₂ saved',
    waterSavedLabel: 'Water saved',
    rewardsProgressionTitle: 'Eco-Rewards Progression',
    unlockedLabel: 'Unlocked',
    recycleScannerTitle: 'Simulate Cup Recycle Scan',
    recycleScannerDesc: 'Input the barcode found on your reusable plastic cup or click below to generate one.',
    barcodeInputLabel: 'Barcode ID',
    generateBarcodeBtn: 'Generate Barcode',
    scanAwardBtn: 'Scan & Award Points',
    invalidBarcodeError: 'Invalid barcode. Must be in GREEN-CUP-XXXXXXXXXX format (e.g. GREEN-CUP-0123456789).',
    scanSuccessMsg: 'Scan successful! +10 Green Points added.',
    
    // Fan Hub - MapViewer
    blueprintTitle: 'Stadium Blueprint',
    calculatorTitle: 'Gate-to-Seat Route Calculator',
    gateSelectLabel: 'Select Ticket Gate Entrance',
    sectionSelectLabel: 'Select Target Seat Section',
    routeDirectionsTitle: 'Route Directions',
    pitchCenterLabel: 'Pitch',
    
    // Ops Command
    opsCopilotTitle: 'GenAI Operational Copilot',
    opsCopilotDesc: 'Real-time telemetry insights and automated stadium guidance.',
    opsMetricsTitle: 'Live Telemetry Dashboard',
    incidentTitle: 'Incident Dispatcher & Response',
    volunteerTitle: 'Active Volunteers',
    densityLabel: 'Crowd Density',
    energyLabel: 'Energy Consumption',
    gateFlowLabel: 'Gate Flow Rate',
    reportIncidentButton: 'Report Incident',
    incidentType: 'Incident Type',
    location: 'Location',
    severity: 'Severity',
    assignedVolunteer: 'Assigned Volunteer',
    status: 'Status',
    assignAction: 'Assign Volunteer',

    // Ops - Incident Manager Form & Roster
    severityLow: 'Low',
    severityMedium: 'Medium',
    severityHigh: 'High',
    severityCritical: 'Critical',
    incidentTypeFacility: 'Facility/Maintenance',
    incidentTypeMedical: 'Medical Emergency',
    incidentTypeLogistics: 'Logistics/System',
    incidentTypeCrowding: 'Crowd Management',
    incidentTypeSafety: 'Safety/Security',
    incidentLocationWest: 'Sector 102 (West Stand)',
    incidentLocationNorth: 'Sector 114 (North Stand)',
    incidentLocationEast: 'Sector 128 (East Stand)',
    incidentLocationSouth: 'Sector 142 (South Stand)',
    incidentLocationGateB: 'Gate B Entrance',
    incidentDescLabel: 'Incident Description (e.g. "Spanish fan needs medical assist")',
    incidentDescPlaceholder: 'Provide a detailed incident report...',
    dispatchStaffBtn: 'Dispatch Staff',
    activeVolunteerRosterTitle: 'Active Volunteer Roster',
    volunteerAvailable: 'Available',
    volunteerBusy: 'Busy',
    responderLabel: 'Responder',
    markResolvedBtn: 'Mark Resolved',
    
    // Accessibility Settings
    a11yTitle: 'Accessibility Panel',
    contrastToggle: 'High Contrast Mode',
    fontSizeLabel: 'Text Size',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    themeHC: 'High Contrast',
    ttsActiveLabel: 'Audio Assist Enabled',
    ttsSpeakBtn: 'Speak Directions',
    ttsChatBtn: 'Speak Response',
    ttsStopBtn: 'Stop Speech'
  },
  es: {
    title: 'ArenaOS 2026',
    subtitle: 'Tablero de Estadio Inteligente de la Copa Mundial de la FIFA',
    roleFan: 'Portal de Experiencia del Fanático',
    roleOps: 'Centro de Comando de Operaciones',
    welcomeTitle: 'Bienvenido al MetLife Stadium',
    welcomeSubtitle: 'Tu compañero digital inteligente para la navegación, pre-pedido express de comida y recompensas de torneos sostenibles.',
    
    // Common
    loading: 'Cargando...',
    send: 'Enviar',
    cancel: 'Cancelar',
    save: 'Guardar',
    active: 'Activo',
    resolved: 'Resuelto',
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    critical: 'Crítico',
    
    // Fan Hub - Chatbot
    assistantTitle: 'Asistente Inteligente FIFA',
    assistantPlaceholder: 'Pregunta sobre puertas, comida, transporte o asientos...',
    concessionTitle: 'Concesiones Express',
    sustainabilityTitle: 'Seguimiento de Sostenibilidad GreenPass',
    sustainabilityText: 'Escanea el código de barras de tu vaso ecológico para ganar Puntos Verdes FIFA.',
    sustainabilityPoints: 'Puntos Verdes Ganados',
    scanCupButton: 'Escanear Código de Vaso Ecológico',
    mapTitle: 'Mapa Interactivo de Asientos del Estadio',
    findSeatButton: 'Calcular Ruta al Asiento',
    expressOrderButton: 'Pre-ordenar Comida',
    queueTime: 'Espera Estimada',
    greenPointsLabel: 'PV',
    
    // Fan Hub - Concessions
    concessionDesc: 'Pre-ordena alimentos y bebidas para evitar filas. Recibe créditos por vaso ecológico.',
    orderFormTitle: 'Formulario de Pre-Pedido Express',
    selectItemLabel: 'Seleccionar Artículo',
    quantityLabel: 'Cantidad',
    seatLocationLabel: 'Ubicación del Asiento (ej. A102-12)',
    customerNameLabel: 'Nombre del Cliente',
    customerNamePlaceholder: 'Ingresa nombre para recoger',
    orderSuccessMsg: '¡Pedido {orderId} realizado! Ve a la Fila Express en {location} en {waitTime} min.',
    recentOrdersTitle: 'Registro de Pedidos Recientes',
    preparingStatus: 'Preparando',
    orderValidationError: 'Detalles del pedido no válidos.',

    // Fan Hub - GreenTracker
    environmentalImpactTitle: 'Impacto Ambiental',
    plasticSavedLabel: 'Plástico ahorrado',
    co2SavedLabel: 'CO₂ ahorrado',
    waterSavedLabel: 'Agua ahorrada',
    rewardsProgressionTitle: 'Progresión de Eco-Recompensas',
    unlockedLabel: 'Desbloqueado',
    recycleScannerTitle: 'Simular Escaneo de Reciclaje',
    recycleScannerDesc: 'Ingresa el código de barras de tu vaso reutilizable o presiona abajo para generar uno.',
    barcodeInputLabel: 'ID de Código de Barras',
    generateBarcodeBtn: 'Generar Código de Barras',
    scanAwardBtn: 'Escanear y Otorgar Puntos',
    invalidBarcodeError: 'Código de barras inválido. Debe tener el formato GREEN-CUP-XXXXXXXXXX (ej. GREEN-CUP-0123456789).',
    scanSuccessMsg: '¡Escaneo exitoso! +10 Puntos Verdes añadidos.',
    
    // Fan Hub - MapViewer
    blueprintTitle: 'Plano del Estadio',
    calculatorTitle: 'Calculadora de Ruta de Puerta a Asiento',
    gateSelectLabel: 'Selecciona Puerta de Entrada de Boleto',
    sectionSelectLabel: 'Selecciona Sección de Asiento',
    routeDirectionsTitle: 'Indicaciones de Ruta',
    pitchCenterLabel: 'Cancha',
    
    // Ops Command
    opsCopilotTitle: 'Copiloto Operacional de IA',
    opsCopilotDesc: 'Información de telemetría en tiempo real y guía automatizada del estadio.',
    opsMetricsTitle: 'Panel de Telemetría en Vivo',
    incidentTitle: 'Despachador de Incidentes y Respuesta',
    volunteerTitle: 'Voluntarios Activos',
    densityLabel: 'Densidad de Multitud',
    energyLabel: 'Consumo de Energía',
    gateFlowLabel: 'Tasa de Flujo de Puerta',
    reportIncidentButton: 'Reportar Incidente',
    incidentType: 'Tipo de Incidente',
    location: 'Ubicación',
    severity: 'Severidad',
    assignedVolunteer: 'Voluntario Asignado',
    status: 'Estado',
    assignAction: 'Asignar Voluntario',

    // Ops - Incident Manager Form & Roster
    severityLow: 'Bajo',
    severityMedium: 'Medio',
    severityHigh: 'Alto',
    severityCritical: 'Crítico',
    incidentTypeFacility: 'Instalaciones/Mantenimiento',
    incidentTypeMedical: 'Emergencia Médica',
    incidentTypeLogistics: 'Logística/Sistema',
    incidentTypeCrowding: 'Control de Multitudes',
    incidentTypeSafety: 'Seguridad/Protección',
    incidentLocationWest: 'Sector 102 (Tribuna Oeste)',
    incidentLocationNorth: 'Sector 114 (Tribuna Norte)',
    incidentLocationEast: 'Sector 128 (Tribuna Este)',
    incidentLocationSouth: 'Sector 142 (Tribuna Sur)',
    incidentLocationGateB: 'Entrada de Puerta B',
    incidentDescLabel: 'Descripción del Incidente (ej. "Aficionado requiere asistencia médica")',
    incidentDescPlaceholder: 'Proporciona un reporte detallado del incidente...',
    dispatchStaffBtn: 'Despachar Personal',
    activeVolunteerRosterTitle: 'Lista de Voluntarios Activos',
    volunteerAvailable: 'Disponible',
    volunteerBusy: 'Ocupado',
    responderLabel: 'Respondedor',
    markResolvedBtn: 'Marcar como Resuelto',
    
    // Accessibility Settings
    a11yTitle: 'Panel de Accesibilidad',
    contrastToggle: 'Modo de Alto Contraste',
    fontSizeLabel: 'Tamaño del Texto',
    themeDark: 'Modo Oscuro',
    themeLight: 'Modo Claro',
    themeHC: 'Alto Contraste',
    ttsActiveLabel: 'Asistencia de Audio Activada',
    ttsSpeakBtn: 'Escuchar Indicaciones',
    ttsChatBtn: 'Escuchar Respuesta',
    ttsStopBtn: 'Detener Audio'
  },
  fr: {
    title: 'ArenaOS 2026',
    subtitle: 'Tableau de bord du stade intelligent de la Coupe du Monde de la FIFA',
    roleFan: 'Hub d\'Expérience des Supporters',
    roleOps: 'Centre de Commandement des Opérations',
    welcomeTitle: 'Bienvenue au MetLife Stadium',
    welcomeSubtitle: 'Votre compagnon numérique intelligent pour la navigation, la pré-commande de nourriture express et les récompenses de durabilité.',
    
    // Common
    loading: 'Chargement...',
    send: 'Envoyer',
    cancel: 'Annuler',
    save: 'Enregistrer',
    active: 'Actif',
    resolved: 'Résolu',
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    critical: 'Critique',
    
    // Fan Hub - Chatbot
    assistantTitle: 'Assistant Intelligent FIFA',
    assistantPlaceholder: 'Posez des questions sur les portes, la nourriture, les transports...',
    concessionTitle: 'Concessions Express',
    sustainabilityTitle: 'Suivi de Durabilité GreenPass',
    sustainabilityText: 'Scannez le code-barres de votre éco-gobelet pour gagner des Points Verts FIFA.',
    sustainabilityPoints: 'Points Verts Gagnés',
    scanCupButton: 'Scanner le Code de l\'Éco-Gobelet',
    mapTitle: 'Carte Interactive des Sièges du Stade',
    findSeatButton: 'Calculer l\'Itinéraire du Siège',
    expressOrderButton: 'Pré-commander de la Nourriture',
    queueTime: 'Attente Estimée',
    greenPointsLabel: 'PV',
    
    // Fan Hub - Concessions
    concessionDesc: 'Pré-commandez des repas et boissons pour éviter l\'attente. Recevez des crédits éco-gobelet.',
    orderFormTitle: 'Formulaire de Pré-Commande Express',
    selectItemLabel: 'Sélectionner l\'Article',
    quantityLabel: 'Quantité',
    seatLocationLabel: 'Emplacement du Siège (ex: A102-12)',
    customerNameLabel: 'Nom du Client',
    customerNamePlaceholder: 'Entrez le nom pour le retrait',
    orderSuccessMsg: 'Commande {orderId} passée! Allez à la Fois Express au {location} dans {waitTime} min.',
    recentOrdersTitle: 'Historique des Commandes Récentes',
    preparingStatus: 'Préparation',
    orderValidationError: 'Détails de la commande invalides.',

    // Fan Hub - GreenTracker
    environmentalImpactTitle: 'Impact Environnemental',
    plasticSavedLabel: 'Plastique économisé',
    co2SavedLabel: 'CO₂ économisé',
    waterSavedLabel: 'Eau économisée',
    rewardsProgressionTitle: 'Progression des Éco-Récompenses',
    unlockedLabel: 'Déverrouillé',
    recycleScannerTitle: 'Simuler le Recyclage de Gobelet',
    recycleScannerDesc: 'Saisissez le code-barres de votre éco-gobelet ou cliquez ci-dessous pour en générer un.',
    barcodeInputLabel: 'ID du Code-Barres',
    generateBarcodeBtn: 'Générer un Code-Barres',
    scanAwardBtn: 'Scanner et Créditer les Points',
    invalidBarcodeError: 'Code-barres invalide. Doit respecter le format GREEN-CUP-XXXXXXXXXX (ex: GREEN-CUP-0123456789).',
    scanSuccessMsg: 'Scan réussi! +10 Points Verts ajoutés.',
    
    // Fan Hub - MapViewer
    blueprintTitle: 'Plan du Stade',
    calculatorTitle: 'Calculateur d\'Itinéraire Porte-à-Siège',
    gateSelectLabel: 'Sélectionnez la Porte d\'Entrée du Billet',
    sectionSelectLabel: 'Sélectionnez la Section de Siège',
    routeDirectionsTitle: 'Directions de l\'Itinéraire',
    pitchCenterLabel: 'Terrain',
    
    // Ops Command
    opsCopilotTitle: 'Copilote Opérationnel d\'IA',
    opsCopilotDesc: 'Analyses télémétriques en temps réel et guidage automatisé du stade.',
    opsMetricsTitle: 'Tableau de Bord Télémétrique en Direct',
    incidentTitle: 'Répartiteur d\'Incidents et Réponse',
    volunteerTitle: 'Volontaires Actifs',
    densityLabel: 'Densité de Foule',
    energyLabel: 'Consommation d\'Énergie',
    gateFlowLabel: 'Débit des Portes',
    reportIncidentButton: 'Signaler un Incident',
    incidentType: 'Type d\'Incident',
    location: 'Emplacement',
    severity: 'Gravité',
    assignedVolunteer: 'Volontaire Assigné',
    status: 'Statut',
    assignAction: 'Assigner un Volontaire',

    // Ops - Incident Manager Form & Roster
    severityLow: 'Faible',
    severityMedium: 'Moyen',
    severityHigh: 'Élevé',
    severityCritical: 'Critique',
    incidentTypeFacility: 'Installations/Maintenance',
    incidentTypeMedical: 'Urgence Médicale',
    incidentTypeLogistics: 'Logistique/Système',
    incidentTypeCrowding: 'Gestion des Foules',
    incidentTypeSafety: 'Sécurité/Protection',
    incidentLocationWest: 'Secteur 102 (Tribune Ouest)',
    incidentLocationNorth: 'Secteur 114 (Tribune Nord)',
    incidentLocationEast: 'Secteur 128 (Tribune Est)',
    incidentLocationSouth: 'Secteur 142 (Tribune Sud)',
    incidentLocationGateB: 'Entrée de la Porte B',
    incidentDescLabel: 'Description de l\'Incident (ex: "Supporter a besoin d\'assistance")',
    incidentDescPlaceholder: 'Fournir un rapport d\'incident détaillé...',
    dispatchStaffBtn: 'Répartir le Personnel',
    activeVolunteerRosterTitle: 'Roster des Volontaires Actifs',
    volunteerAvailable: 'Disponible',
    volunteerBusy: 'Occupé',
    responderLabel: 'Répondeur',
    markResolvedBtn: 'Marquer comme Résolu',
    
    // Accessibility Settings
    a11yTitle: 'Panneau d\'Accessibilité',
    contrastToggle: 'Mode Contraste Élevé',
    fontSizeLabel: 'Taille du Texte',
    themeDark: 'Mode Sombre',
    themeLight: 'Mode Clair',
    themeHC: 'Contraste Élevé',
    ttsActiveLabel: 'Assistance Audio Activée',
    ttsSpeakBtn: 'Écouter les Directions',
    ttsChatBtn: 'Écouter la Réponse',
    ttsStopBtn: 'Arrêter l\'Audio'
  }
};

/**
 * Translation helper function.
 */
export function t(key: keyof typeof translations['en'], lang: Language): string {
  return translations[lang][key] || translations['en'][key] || String(key);
}

/**
 * Translate dynamic route descriptions.
 */
export function getTranslatedRouteStep(index: number, gate: string, section: string, lang: Language): string {
  const gateChar = gate.replace(/[^A-Za-z0-9]/g, '').replace('Gate', '').trim().charAt(0);
  
  const steps = {
    en: [
      `Enter the stadium through security checkpoints at ${gate}.`,
      `Scan your ticket at Turnstile ${gateChar}.`,
      `Walk along the main concourse corridor towards the inner arena.`,
      `Turn towards the stairs/escalator designated for your level.`,
      `Follow the overhead signs to ${section}. Your seat row is straight ahead.`
    ],
    es: [
      `Ingresa al estadio a través de los puntos de control de seguridad en la ${gate}.`,
      `Escanea tu boleto en el Molinete ${gateChar}.`,
      `Camina por el pasillo del vestíbulo principal hacia la arena interior.`,
      `Gira hacia las escaleras/escalera mecánica designada para tu nivel.`,
      `Sigue los carteles superiores hacia la ${section}. La fila de tu asiento está justo adelante.`
    ],
    fr: [
      `Entrez dans le stade par les points de contrôle de sécurité à la ${gate}.`,
      `Scannez votre billet au Tourniquet ${gateChar}.`,
      `Marchez le long du couloir de la tribune principale vers l'arène intérieure.`,
      `Tournez vers les escaliers/escaliers mécaniques désignés pour votre niveau.`,
      `Suivez les panneaux suspendus vers la ${section}. La rangée de votre siège est droit devant.`
    ]
  };

  return steps[lang]?.[index] || steps['en'][index] || '';
}

/**
 * Translate gate names.
 */
export function getTranslatedGate(gate: string, lang: Language): string {
  const match = gate.match(/Gate ([A-D])/i);
  if (!match) return gate;
  const letter = match[1];
  
  const translations = {
    en: { A: 'Gate A (North)', B: 'Gate B (East)', C: 'Gate C (South)', D: 'Gate D (West)' },
    es: { A: 'Puerta A (Norte)', B: 'Puerta B (Este)', C: 'Puerta C (Sur)', D: 'Puerta D (Oeste)' },
    fr: { A: 'Porte A (Nord)', B: 'Porte B (Est)', C: 'Porte C (Sud)', D: 'Porte D (Ouest)' }
  };
  
  return translations[lang]?.[letter as 'A'|'B'|'C'|'D'] || gate;
}

/**
 * Translate section names.
 */
export function getTranslatedSection(section: string, lang: Language): string {
  const match = section.match(/Section (\d+)/i);
  if (!match) return section;
  const num = match[1];
  
  const translations = {
    en: `Section ${num}`,
    es: `Sección ${num}`,
    fr: `Section ${num}`
  };
  
  return translations[lang] || section;
}

/**
 * Translate food items.
 */
export function getTranslatedFood(item: string, lang: Language): { name: string; desc?: string } {
  const items: Record<string, Record<Language, { name: string; desc?: string }>> = {
    'World Cup Double Burger': {
      en: { name: 'World Cup Double Burger' },
      es: { name: 'Hamburguesa Doble Copa Mundial' },
      fr: { name: 'Double Burger Coupe du Monde' }
    },
    'Stadium Loaded Fries': {
      en: { name: 'Stadium Loaded Fries' },
      es: { name: 'Papas Cargadas del Estadio' },
      fr: { name: 'Frites Garnies du Stade' }
    },
    'Soft Drink (Eco-Cup)': {
      en: { name: 'Soft Drink (Eco-Cup)' },
      es: { name: 'Refresco (Vaso Ecológico)' },
      fr: { name: 'Boisson Gazeuse (Éco-Gobelet)' }
    },
    'Trio Chicken Tacos': {
      en: { name: 'Trio Chicken Tacos' },
      es: { name: 'Trío de Tacos de Pollo' },
      fr: { name: 'Trio de Tacos au Poulet' }
    },
    'Nachos Supreme': {
      en: { name: 'Nachos Supreme' },
      es: { name: 'Nachos Supremos' },
      fr: { name: 'Nachos Suprêmes' }
    },
    'Aguas Frescas (Eco-Cup)': {
      en: { name: 'Aguas Frescas (Eco-Cup)' },
      es: { name: 'Aguas Frescas (Vaso Ecológico)' },
      fr: { name: 'Aguas Frescas (Éco-Gobelet)' }
    },
    'Classic Maple Poutine': {
      en: { name: 'Classic Maple Poutine' },
      es: { name: 'Poutine de Arce Clásica' },
      fr: { name: 'Poutine Classique à l\'Érable' }
    },
    'Jumbo Stadium Hotdog': {
      en: { name: 'Jumbo Stadium Hotdog' },
      es: { name: 'Hot Dog Gigante del Estadio' },
      fr: { name: 'Hotdog Géant du Stade' }
    },
    'Craft Beer (Eco-Cup)': {
      en: { name: 'Craft Beer (Eco-Cup)' },
      es: { name: 'Cerveza Artesanal (Vaso Ecológico)' },
      fr: { name: 'Bière Artisanale (Éco-Gobelet)' }
    }
  };

  return items[item]?.[lang] || { name: item };
}

/**
 * Translate reward milestones.
 */
export function getTranslatedReward(name: string, lang: Language): string {
  const rewards: Record<string, Record<Language, string>> = {
    'FIFA Eco-Coaster': {
      en: 'FIFA Eco-Coaster',
      es: 'Portavasos Ecológico FIFA',
      fr: 'Sous-verre Éco FIFA'
    },
    'Recycled Keyring': {
      en: 'Recycled Keyring',
      es: 'Llavero Reciclado',
      fr: 'Porte-clés Recyclé'
    },
    'FIFA Smart Water Bottle': {
      en: 'FIFA Smart Water Bottle',
      es: 'Botella de Agua Inteligente FIFA',
      fr: 'Gourde Intelligente FIFA'
    }
  };

  return rewards[name]?.[lang] || name;
}

/**
 * Translate volunteer zones.
 */
export function getTranslatedZone(zone: string, lang: Language): string {
  const zones: Record<string, Record<Language, string>> = {
    'North Stand': { en: 'North Stand', es: 'Tribuna Norte', fr: 'Tribune Nord' },
    'East Stand': { en: 'East Stand', es: 'Tribuna Este', fr: 'Tribune Est' },
    'South Stand': { en: 'South Stand', es: 'Tribuna Sur', fr: 'Tribune Sur' },
    'West Stand': { en: 'West Stand', es: 'Tribuna Oeste', fr: 'Tribune Ouest' }
  };
  return zones[zone]?.[lang] || zone;
}

export function getTranslatedStand(standId: string, lang: Language): { name: string; cuisine: string; location: string } {
  const stands: Record<string, Record<Language, { name: string; cuisine: string; location: string }>> = {
    c1: {
      en: { name: 'MetLife Grill (Burgers & Fries)', cuisine: 'American', location: 'North Concourse - Sect 114' },
      es: { name: 'MetLife Grill (Hamburguesas y Papas)', cuisine: 'Americana', location: 'Vestíbulo Norte - Sec. 114' },
      fr: { name: 'MetLife Grill (Burgers & Frites)', cuisine: 'Américaine', location: 'Tribune Nord - Sect 114' }
    },
    c2: {
      en: { name: 'Taco Fiesta', cuisine: 'Mexican', location: 'East Concourse - Sect 128' },
      es: { name: 'Taco Fiesta', cuisine: 'Mexicana', location: 'Vestíbulo Este - Sec. 128' },
      fr: { name: 'Taco Fiesta', cuisine: 'Mexicaine', location: 'Tribune Est - Sect 128' }
    },
    c3: {
      en: { name: 'Maple Poutine & Dogs', cuisine: 'Canadian', location: 'South Concourse - Sect 142' },
      es: { name: 'Poutine de Arce y Hot Dogs', cuisine: 'Canadiense', location: 'Vestíbulo Sur - Sec. 142' },
      fr: { name: 'Maple Poutine & Hotdogs', cuisine: 'Canadienne', location: 'Tribune Sud - Sect 142' }
    }
  };
  return stands[standId]?.[lang] || stands[standId]?.['en'] || { name: standId, cuisine: '', location: '' };
}

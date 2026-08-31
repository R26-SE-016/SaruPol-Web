export type Language = 'en' | 'si' | 'ta';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export interface TranslationSchema {
  nav: {
    dashboard: string;
    soil: string;
    pathology: string;
    yield: string;
    advisory: string;
    operations: string;
    stationBadge: string;
    quickCommand: string;
  };
  home: {
    subtitle: string;
    commandPalette: string;
    stats: {
      activeSubsystems: string;
      mlModels: string;
      gatewayUptime: string;
      cloudFunctions: string;
    };
    modules: {
      soilTitle: string;
      soilSub: string;
      soilDesc: string;
      pathologyTitle: string;
      pathologySub: string;
      pathologyDesc: string;
      yieldTitle: string;
      yieldSub: string;
      yieldDesc: string;
      advisoryTitle: string;
      advisorySub: string;
      advisoryDesc: string;
      operationsTitle: string;
      operationsSub: string;
      operationsDesc: string;
      launchModule: string;
    };
    telemetryBar: {
      subsystemsTitle: string;
      subsystemsDesc: string;
      mlTitle: string;
      mlDesc: string;
      criTitle: string;
      criDesc: string;
    };
    footer: string;
  };
  pathology: {
    title: string;
    subtitle: string;
    tabs: {
      systemA: string;
      systemB: string;
      history: string;
      protocols: string;
    };
    overview: {
      gatewaysTitle: string;
      aerialTitle: string;
      aerialDesc: string;
      aerialBtn: string;
      leafTitle: string;
      leafDesc: string;
      leafBtn: string;
      kbTitle: string;
      kbDesc: string;
      kbBtn: string;
      totalDiagnostics: string;
      verifiedHealthy: string;
      activePathogens: string;
      avgConfidence: string;
      pathogenProfile: string;
      weeklyCadence: string;
    };
    systemA: {
      title: string;
      desc: string;
      scanTab: string;
      historyTab: string;
      estateLabel: string;
      uploadPrompt: string;
      analyzing: string;
      variIndex: string;
      ndviIndex: string;
      exgMask: string;
      crownDetection: string;
      hotspotsDetected: string;
      criticalSeverity: string;
      highSeverity: string;
      moderateSeverity: string;
      actionRequired: string;
      dispatchFieldOfficer: string;
      loadSample: string;
      runAnalysis: string;
    };
    systemB: {
      title: string;
      desc: string;
      uploadOrCapture: string;
      dropzoneSub: string;
      browsePhotos: string;
      analyzingWasm: string;
      resultTitle: string;
      confidence: string;
      entropyScore: string;
      oodSafe: string;
      oodWarning: string;
      recommendation: string;
      chemical: string;
      cultural: string;
      biological: string;
      saveLocal: string;
      syncCloud: string;
      runDiagnosisBtn: string;
    };
    diseases: {
      budRot: string;
      stemBleeding: string;
      grayLeafSpot: string;
      leafRot: string;
      healthy: string;
    };
  };
  soil: {
    title: string;
    subtitle: string;
    description: string;
    triangulation: string;
    sensorInputs: string;
    leafEst: string;
    dosingPlan: string;
    urea: string;
    erp: string;
    mop: string;
    dolomite: string;
    calculateBtn: string;
    treeNo: string;
    zoneId: string;
  };
  yield: {
    title: string;
    subtitle: string;
    description: string;
    temp: string;
    humidity: string;
    soilMoisture: string;
    palmAge: string;
    palmHealth: string;
    predictBtn: string;
    cycleForecast: string;
    annualYield: string;
    ensembleConfidence: string;
    nutsPerPalm: string;
    directivesTitle: string;
  };
  advisory: {
    title: string;
    subtitle: string;
    chatPlaceholder: string;
    sendBtn: string;
    voiceBtn: string;
    listening: string;
    suggestedQuestions: string[];
    consensusVerified: string;
    criSource: string;
  };
  operations: {
    title: string;
    subtitle: string;
    mapLayers: string;
    droneSurvey: string;
    treeInventory: string;
    stressClusters: string;
    activeHotspots: string;
    inspectSector: string;
  };
  common: {
    loading: string;
    offline: string;
    online: string;
    syncing: string;
    success: string;
    error: string;
    viewAll: string;
    close: string;
    confirm: string;
  };
}

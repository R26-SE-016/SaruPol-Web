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
    systemA: {
      title: string;
      desc: string;
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
    };
    systemB: {
      title: string;
      desc: string;
      uploadOrCapture: string;
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
    triangulation: string;
    sensorInputs: string;
    leafEst: string;
    dosingPlan: string;
    urea: string;
    erp: string;
    mop: string;
    dolomite: string;
    calculateBtn: string;
  };
  yield: {
    title: string;
    subtitle: string;
    cycleForecast: string;
    ensembleConfidence: string;
    rfModel: string;
    lstmModel: string;
    annualYield: string;
    nutsPerPalm: string;
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

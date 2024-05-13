import { App, Frontend, genBundleFiles } from "@lcap/nasl";

async function compile() {
  // TODO read NASL from /workspace/src.json
  const app = new App() as App;
  // TODO read FRONTENDS from env
  const FRONTENDS = [
    {
      name: "pc",
      type: "pc",
      path: "/",
      selected: true,
      title: "PC端",
    },
    {
      name: "m",
      type: "h5",
      path: "/m",
      selected: true,
      title: "H5端",
    },
  ];
  // 从generator复制的mock数据
  const config = {
    nuimsDomain: "user.lcap.codewave-test.163yun.com",
    kubeInsightAppCluster: "drill",
    officialTenantId: "00000000000000000000000000000000",
    enableOpenAiCompletionForLogic: true,
    pwdSecurity: {
      pwdCategory: "normal",
    },
    tenantAndAppMaxLength: 32,
    platformCreateDatabaseOpen: false,
    documentCenter: {
      isLocalDeployment: false,
      deliveryMode: "online",
      url: "https://community.codewave.163.com/CommunityParent",
    },
    lcpRedirectSwitch: true,
    kubeInsightAddress: "",
    gatewayType: "light",
    STATIC_URL: "//minio-api.codewave-test.163yun.com/lowcode-static",
    traceSwitch: false,
    resourceAssignStrategy: "app",
    creatorIsManager: false,
    websqlSwitch: "dev,online",
    enableCodeWaveMarket: false,
    platformEnv: "dev",
    IDE_STATIC_URL: "//minio-api.codewave-test.163yun.com/lowcode-static",
    isPrivatized: "true",
    clientToken: "ODDINZU1OWYTZWM5NY0ZZJEYLTK3NGQTNWNJNJQYYMM0OGM1",
    biConfig: false,
    platformExtraAbilityDetail: null,
    USER_STATIC_URL: "//minio-api.codewave-test.163yun.com/lowcode-static",
    kubeInsightServiceName: "codewave#lcap-fe",
    consoleDomain: "",
    enableOpenAiForLogic: true,
    lowcodeDomain: "lcap.codewave-test.163yun.com",
    name: "lcap",
    tenantIntegrationSwitch: false,
    envNuimsDomain: {
      dev: "user.lcap.codewave-test.163yun.com",
      online: "user.lcap.codewave-test.163yun.com",
    },
    envLcpDomain: {
      dev: {
        lcpDomain: "lcap.codewave-test.163yun.com",
      },
      online: {
        lcpDomain: "lcap.codewave-test.163yun.com",
      },
    },
    kubeClientApplicationKey: "lcp-drill",
    tenant: "defaulttenant",
    env: "dev",
    tenantID: "00000000000000000000000000000000",
    multiEnvEnable: true,
    tenantType: 0,
    tenantLevel: 1,
    tenantLevelDetail: {
      onlineReplicasLimit: "3",
      aiJavaLogicCompletionDisplay: "true",
      releaseDevAppCountLimit: "-1",
      customPackageSupport: "true",
      aiNl2sqlSupport: "false",
      aiNextComponentSupport: "true",
      productAppSpecification: "1",
      configDatabaseSupport: "true",
      aiJavaLogicDisplay: "true",
      appPublishOnlineSupport: "true",
      rdsMode: "0",
      assetsLibraryExportSupport: "true",
      assignDeveloperSupport: "true",
      cpuLimit: "4",
      configSourceCodeSupport: "true",
      mavenConfigEditSupport: "true",
      aiCodeAnalyzeSupport: "false",
      aiNl2LogicSupport: "false",
      onboardingSupport: "false",
      storageLimit: "8",
      releaseAppCountLimit: "4",
      configFrontSupport: "true",
      configFileStorageSupport: "true",
      aiNl2sqlDisplay: "true",
      teamDeveloperSupport: "true",
      accountLimit: "-1",
      aiD2CSupport: "false",
      exportSourceSupport: "true",
      customDomainSupport: "true",
      reportFormsEditSupport: "true",
      aiNl2LogicDisplay: "true",
      memoryLimit: "8",
      aiJavaLogicCompletionSupport: "false",
      assetsArchetypeSupport: "true",
      appCreateLimit: "-1",
      configImageRepoSupport: "true",
      configSourceSupport: "true",
      aiJavaLogicSupport: "false",
      assetsTemplateExportSupport: "true",
    },
    tenantExtraAbilityDetail: null,
    tenantVersion: {
      tenantName: "defaulttenant",
      versionType: 4,
      versionId: "2417a61d7e9a4cb7b5ed2d83d29cc5fa",
      snapshotId: "c8885750ba4f48eea67f85fc965f71f8",
      validDateType: 1,
      startTime: "2024-02-02 12:44:02",
      endTime: "2024-02-02 12:44:02",
      changeStatus: 0,
      changeDesc: null,
      createdTime: "2024-02-02 12:44:02",
      updatedTime: "2024-02-02 12:44:02",
      businessVersionDTO: {
        versionType: 4,
        versionId: "2417a61d7e9a4cb7b5ed2d83d29cc5fa",
        snapshotId: "c8885750ba4f48eea67f85fc965f71f8",
        versionName: "私有化企业版",
        description: "私有化企业版",
        resourceList: null,
        createdTime: "2024-02-02 12:26:04",
        updatedTime: "2024-02-02 12:26:04",
      },
      resourceList: [
        {
          resourceItem: "onlineReplicasLimit",
          resourceValue: "3",
        },
        {
          resourceItem: "aiJavaLogicCompletionDisplay",
          resourceValue: "true",
        },
        {
          resourceItem: "releaseDevAppCountLimit",
          resourceValue: "-1",
        },
        {
          resourceItem: "customPackageSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "aiNl2sqlSupport",
          resourceValue: "false",
        },
        {
          resourceItem: "aiNextComponentSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "productAppSpecification",
          resourceValue: "1",
        },
        {
          resourceItem: "configDatabaseSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "aiJavaLogicDisplay",
          resourceValue: "true",
        },
        {
          resourceItem: "appPublishOnlineSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "rdsMode",
          resourceValue: "0",
        },
        {
          resourceItem: "assetsLibraryExportSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "assignDeveloperSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "cpuLimit",
          resourceValue: "4",
        },
        {
          resourceItem: "configSourceCodeSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "mavenConfigEditSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "aiNl2LogicSupport",
          resourceValue: "false",
        },
        {
          resourceItem: "aiCodeAnalyzeSupport",
          resourceValue: "false",
        },
        {
          resourceItem: "onboardingSupport",
          resourceValue: "false",
        },
        {
          resourceItem: "storageLimit",
          resourceValue: "8",
        },
        {
          resourceItem: "releaseAppCountLimit",
          resourceValue: "4",
        },
        {
          resourceItem: "configFrontSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "configFileStorageSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "accountLimit",
          resourceValue: "-1",
        },
        {
          resourceItem: "teamDeveloperSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "aiNl2sqlDisplay",
          resourceValue: "true",
        },
        {
          resourceItem: "exportSourceSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "aiD2CSupport",
          resourceValue: "false",
        },
        {
          resourceItem: "customDomainSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "reportFormsEditSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "memoryLimit",
          resourceValue: "8",
        },
        {
          resourceItem: "aiNl2LogicDisplay",
          resourceValue: "true",
        },
        {
          resourceItem: "aiJavaLogicCompletionSupport",
          resourceValue: "false",
        },
        {
          resourceItem: "appCreateLimit",
          resourceValue: "-1",
        },
        {
          resourceItem: "assetsArchetypeSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "configSourceSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "configImageRepoSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "assetsTemplateExportSupport",
          resourceValue: "true",
        },
        {
          resourceItem: "aiJavaLogicSupport",
          resourceValue: "false",
        },
      ],
    },
    tenantResource: [
      {
        resourceItem: "onlineReplicasLimit",
        resourceValue: "3",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "onlineReplicasLimit",
          resourceValue: "3",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "aiJavaLogicCompletionDisplay",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "aiJavaLogicCompletionDisplay",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "releaseDevAppCountLimit",
        resourceValue: "-1",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "releaseDevAppCountLimit",
          resourceValue: "-1",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "customPackageSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "customPackageSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "aiNl2sqlSupport",
        resourceValue: "false",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "aiNl2sqlSupport",
          resourceValue: "false",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "aiNextComponentSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "aiNextComponentSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "productAppSpecification",
        resourceValue: "1",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "productAppSpecification",
          resourceValue: "1",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "configDatabaseSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "configDatabaseSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "aiJavaLogicDisplay",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "aiJavaLogicDisplay",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "appPublishOnlineSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "appPublishOnlineSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "rdsMode",
        resourceValue: "0",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "rdsMode",
          resourceValue: "0",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "assetsLibraryExportSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "assetsLibraryExportSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "assignDeveloperSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "assignDeveloperSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "cpuLimit",
        resourceValue: "4",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "cpuLimit",
          resourceValue: "4",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "configSourceCodeSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "configSourceCodeSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "mavenConfigEditSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "mavenConfigEditSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "aiNl2LogicSupport",
        resourceValue: "false",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "aiNl2LogicSupport",
          resourceValue: "false",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "aiCodeAnalyzeSupport",
        resourceValue: "false",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "aiCodeAnalyzeSupport",
          resourceValue: "false",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "onboardingSupport",
        resourceValue: "false",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "onboardingSupport",
          resourceValue: "false",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "storageLimit",
        resourceValue: "8",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "storageLimit",
          resourceValue: "8",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "releaseAppCountLimit",
        resourceValue: "4",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "releaseAppCountLimit",
          resourceValue: "4",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "configFrontSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "configFrontSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "configFileStorageSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "configFileStorageSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "accountLimit",
        resourceValue: "-1",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "accountLimit",
          resourceValue: "-1",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "teamDeveloperSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "teamDeveloperSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "aiNl2sqlDisplay",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "aiNl2sqlDisplay",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "exportSourceSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "exportSourceSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "aiD2CSupport",
        resourceValue: "false",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "aiD2CSupport",
          resourceValue: "false",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "customDomainSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "customDomainSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "reportFormsEditSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "reportFormsEditSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "memoryLimit",
        resourceValue: "8",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "memoryLimit",
          resourceValue: "8",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "aiNl2LogicDisplay",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "aiNl2LogicDisplay",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "aiJavaLogicCompletionSupport",
        resourceValue: "false",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "aiJavaLogicCompletionSupport",
          resourceValue: "false",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "appCreateLimit",
        resourceValue: "-1",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "appCreateLimit",
          resourceValue: "-1",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "assetsArchetypeSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "assetsArchetypeSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "configSourceSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "configSourceSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "configImageRepoSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "configImageRepoSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "assetsTemplateExportSupport",
        resourceValue: "true",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "assetsTemplateExportSupport",
          resourceValue: "true",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
      {
        resourceItem: "aiJavaLogicSupport",
        resourceValue: "false",
        validDateType: 1,
        startTime: "2024-02-02 12:44:02",
        endTime: "2024-02-02 12:44:02",
        versionResourceDetail: {
          resourceItem: "aiJavaLogicSupport",
          resourceValue: "false",
          validDateType: 1,
          startTime: "2024-02-02 12:44:02",
          endTime: "2024-02-02 12:44:02",
          versionResourceDetail: null,
          valueAddedResourceDetail: null,
          valid: true,
        },
        valueAddedResourceDetail: null,
        valid: true,
      },
    ],
    businessConfig: {
      upgradeClueCollect: {
        appId: "",
        support: false,
      },
      eventTracking: {
        appId: "",
        support: false,
      },
      beginnerGuide: {
        appId: "",
        support: false,
      },
      corpCertify: {
        appId: "",
        support: false,
      },
      rateLimiter: {
        appId: "",
        support: false,
      },
      businessAccess: {
        appId: "",
        support: false,
      },
      createSaaSTenant: {
        appId: "",
        support: false,
      },
      customApp: {
        appId: "",
        support: false,
      },
      research: {
        appId: "",
        support: false,
      },
    },
    expireTimeStr: null,
    layOutConfig: {},
    isPreviewFe: false,
    previewVersion: "",
    isExport: false,
    extendedConfig: null,
    appid: "7c058eff-e54c-4991-9e71-8b6357eb43b7",
  };
  // 上层比较出来的所有变更路径的数组
  const diffNodePaths = [
    [
      "app.frontendTypes[name=pc].frontends[name=pc]",
      "app.frontendTypes[name=pc].frontends[name=pc].views[name=dashboard]",
      "app.frontendTypes[name=pc].frontends[name=pc].views[name=dashboard].children[name=achievement]",
      "app.frontendTypes[name=pc].frontends[name=pc].views[name=dashboard].children[name=achievement].children[name=assetscenter]",
    ],
  ];
  // 输出的
  const res = [];
  for (const frontend of FRONTENDS) {
    const path = `app.frontendTypes.${frontend.type}.${frontend.name}`;
    const f = app.findNodeByCompleteName(path) as Frontend | undefined;
    if (f) {
      const kind = f.frameworkKind;
      if (kind === "vue2") {
        (config as any).diffNodePaths = diffNodePaths;
        // 生成bundle文件，返回文件以及路径
        const files = await genBundleFiles(app, frontend, config);
        res.push(...files);
      } else {
        // TODO react
      }
    } else {
      throw new Error(`no such frontend: ${path}`);
    }
  }
}

export default compile;

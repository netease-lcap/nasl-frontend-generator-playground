export interface GeneratorConfig {
  fullVersion: string;
  tenant: string;
  env: string;
  debug: boolean;
  nuimsDomain: string;
  STATIC_URL: string;
  USER_STATIC_URL: string;
  lowcodeDomain: string;
  envLcpDomain: EnvLcpDomain;
  envNuimsDomain: EnvNuimsDomain;
  tenantType: number;
  tenantLevel: number;
  appid: string;
  isExport: boolean;
  realRelease: boolean;
  isPreviewFe: boolean;
  previewVersion: string;
  assets: Asset[];
  assetsMap: Record<AssetURL, Asset>;
}

type AssetURL = string;

interface Asset {
  id: number;
  tenantId: string;
  appId: string;
  serviceId: null;
  name: string;
  type: string;
  fileUrl: string;
  createdBy: string;
  updatedBy: string;
  createdTime: string;
  updatedTime: string;
  subType: string;
  syncStatus: number;
  fileUrlDev: null;
  fileUrlOnline: null;
  contentType: string;
}

interface EnvNuimsDomain {
  dev: string;
  online: string;
}

interface EnvLcpDomain {
  dev: Dev;
  online: Dev;
}

interface Dev {
  lcpDomain: string;
}
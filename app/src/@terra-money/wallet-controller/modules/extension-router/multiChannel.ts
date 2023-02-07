import { TerraWebExtensionConnector } from '@terra-money/web-extension-interface';

export interface ExtensionInfo {
  name: string;
  identifier: string;
  icon: string;
  connector?: () =>
    | TerraWebExtensionConnector
    | Promise<TerraWebExtensionConnector>;
}

declare global {
  interface Window {
    terraWallets: ExtensionInfo[] | undefined;
  }
}

export function getTerraExtensions(): ExtensionInfo[] {
  return Array.isArray(window.terraWallets)
    ? window.terraWallets
    : window.isTerraExtensionAvailable
    ? [
        {
          name: 'Terra Station',
          identifier: 'station',
          icon: 'https://assets.terra.money/icon/wallet-provider/station.svg',
        },
      ]
    : [];
}
// export function getTerraExtensions(): ExtensionInfo[] {
//   return [
//     {
//       name: 'Leap Cosmos Wallet',
//       identifier: 'leap-cosmos-wallet',
//       icon: 'https://softr-prod.imgix.net/applications/95bf8384-8d1e-46c0-9e2f-d2d8ee183230/assets/1aa6328e-a6fd-4754-a36c-5c2b04452ccd.svg',
//     },
//   ];
// }

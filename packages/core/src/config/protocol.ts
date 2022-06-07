import { ARBITRUM, ETHEREUM } from '../utils/constants';

interface YieldBaseAddresses {
  Cauldron: string;
  Ladle: string;
  Witch: string;
}

interface YieldModuleAddresses {
  WrapEtherModule: string;
  transfer1155Module?: string; // optional
  ConvexLadleModule?: string; // optional
}

export const supportedChains = new Map<string, number[]>([
  [ETHEREUM, [1, 4, 5]],
  [ARBITRUM, [42161]],
  // [ 'OPTIMISM', [] ],
]);

export const baseAddresses = new Map<number, YieldBaseAddresses>([
  [
    1,
    {
      Cauldron: '0xc88191F8cb8e6D4a668B047c1C8503432c3Ca867',
      Ladle: '0x6cB18fF2A33e981D1e38A663Ca056c0a5265066A',
      Witch: '0x53C3760670f6091E1eC76B4dd27f73ba4CAd5061',
    },
  ],
  [
    5,
    {
      Cauldron: '0xaD6469F5097dc935e776C78caA7c00566B43A89d',
      Ladle: '0x16e234Cc77ec3938f0115f636D8bD284a06410cf',
      Witch: '0xeE2D6a9b17c8B77879A1d05b8dCdb382f31b33d1',
    },
  ],
  [
    42161,
    {
      Cauldron: '0x23cc87FBEBDD67ccE167Fa9Ec6Ad3b7fE3892E30',
      Ladle: '0x16E25cf364CeCC305590128335B8f327975d0560',
      Witch: '0x08173D0885B00BDD640aaE57D05AbB74cd00d669',
    },
  ],
]);

export const moduleAddresses = new Map<number, YieldModuleAddresses>([
  [
    1,
    {
      transfer1155Module: '0x97f1d43A217aDD678bB6Dcd3C5D51F40b6729d06',
      WrapEtherModule: '0x22768FCaFe7BB9F03e31cb49823d1Ece30C0b8eA',
      ConvexLadleModule: '0x9Bf195997581C99cef8be95a3a816Ca19Cf1A3e6',
    },
  ],
  [
    5,
    {
      transfer1155Module: '0x532708fdC78C635162F94F65998E5014CAac34fF',
      WrapEtherModule: '0x6af513D4C6F5313a1499f6d001b9B6e2E39F9F68',
      ConvexLadleModule: '0x2d45a0925B3B4ac14641A63C2085574AC4E58fD8',
    },
  ],
  [
    42161,
    {
      WrapEtherModule: '0xd6AdA52c4A04895c3Ef4668a1defd186ccD5aC44',
    },
  ],
]);

export const strategyAddresses = new Map<number, string[]>([
  [
    1,
    [
      '0x7ACFe277dEd15CabA6a8Da2972b1eb93fe1e2cCD',
      '0x1144e14E9B0AA9e181342c7e6E0a9BaDB4ceD295',
      '0xFBc322415CBC532b54749E31979a803009516b5D',
      '0x8e8D6aB093905C400D583EfD37fbeEB1ee1c0c39',
      '0xcf30A5A994f9aCe5832e30C138C9697cda5E1247',
      '0x831dF23f7278575BA0b136296a285600cD75d076',
      '0x47cc34188a2869daa1ce821c8758aa8442715831',
      '0x1565f539e96c4d440c38979dbc86fd711c995dd6',
    ],
  ],
  [
    5,
    [
      '0x4A53F99b2d0e1D47Bfcb3D8244a8Def59d8ee8e4',
      '0xa61074868c27C6D4C5314bc7dEC46B7d05f53bf5',
      '0xa21BA96d74647290b0b99f8207C6f02154E6cA05',
      '0x4503f2496dc535a9D6ed596044A7BC0286a80900',
      '0xF0F9B3aB84fC910Ea4c005739b65e85051BAfFEE',
      '0x16E89982150e91dB9eF39267Db068637fE09A752',
      '0x64ef8090DA1C25d679D5BDfDbeb78E0382Eac7fe',
      '0xaCAFa65C8B798b3929c27d2E39c16aEB00C20aA3',
    ],
  ],
  [
    42161,
    [
      '0xE779cd75E6c574d83D3FD6C92F3CBE31DD32B1E1',
      '0xE7214Af14BD70F6AAC9c16B0c1Ec9ee1CcC7EFDA',
      '0x92A5B31310a3ED4546e0541197a32101fCfBD5c8',
      '0xDC705FB403DBB93Da1d28388bc1DC84274593c11',
    ],
  ],
]);

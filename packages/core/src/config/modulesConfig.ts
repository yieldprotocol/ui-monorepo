export interface ModuleAddresses {
    WrapEtherModule: string;
    transfer1155Module?: string; // optional
    ConvexLadleModule?: string; // optional
  }

export const moduleAddresses = new Map<number, ModuleAddresses>([
    [
      1,
      {
        transfer1155Module: '0x97f1d43A217aDD678bB6Dcd3C5D51F40b6729d06',
        WrapEtherModule: '0x22768FCaFe7BB9F03e31cb49823d1Ece30C0b8eA',
        ConvexLadleModule: '0x9Bf195997581C99cef8be95a3a816Ca19Cf1A3e6',
      },
    ],
    [
      42161,
      {
        WrapEtherModule: '0xd6AdA52c4A04895c3Ef4668a1defd186ccD5aC44',
      },
    ],
  ]);
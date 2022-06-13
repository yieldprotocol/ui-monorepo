import { ethers } from 'ethers';
declare const window: any;

export const defaultAccountProvider = new ethers.providers.Web3Provider(window.ethereum);

// export const getDefaultProvider = (chainId: number) => {
//   if (chainId === 1)
//     return new ethers.providers.WebSocketProvider(
//       `wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`
//     ) as ethers.providers.BaseProvider;
//   if (chainId === 5)
//     return new ethers.providers.WebSocketProvider(
//       `wss://goerli.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`
//     ) as ethers.providers.BaseProvider;
//   if (chainId === 42161) return new ethers.providers.AlchemyProvider(42161, 'vtMM4_eLnOvkjkdckprVw3cIa64EVkDZ');
//   return new ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea`);
// };

export const defaultProviderMap: Map<number, ethers.providers.BaseProvider> = new Map([
  [1, new ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea` ) ],
  [5, new ethers.providers.WebSocketProvider( `wss://goerli.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea` ) ], 
  [42161, new ethers.providers.AlchemyProvider(42161, 'vtMM4_eLnOvkjkdckprVw3cIa64EVkDZ') as ethers.providers.BaseProvider ]
]);

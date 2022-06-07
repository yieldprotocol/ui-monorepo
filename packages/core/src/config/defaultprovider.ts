import { ethers } from 'ethers';

// declare const window: any;

// what MetaMask injects as window.ethereum into each page

// const defaultProvider = window.ethereum
//     ? new ethers.providers.Web3Provider(window.ethereum)
//     : new ethers.providers.JsonRpcProvider() // deafult localhost:8545

// const defaultProvider: ethers.providers.BaseProvider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/2af222f674024a0f84b5f0aad0da72a2')
// const defaultProvider : ethers.providers.BaseProvider = new ethers.providers.WebSocketProvider('wss://mainnet.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea');

const defaultProvider : ethers.providers.BaseProvider = new ethers.providers.WebSocketProvider('wss://goerli.infura.io/ws/v3/de43fd0c912d4bdc94712ab4b37613ea');

// const defaultProvider: ethers.providers.BaseProvider = new ethers.providers.AlchemyProvider(
//   42161,
//   'vtMM4_eLnOvkjkdckprVw3cIa64EVkDZ'
// );

// const defaultProvider: ethers.providers.BaseProvider = new ethers.providers.AlchemyProvider(
//   1,
//   'ZXDCq5iy0KrKR0XjsqC6E4QG7Z_FuXDv'
// );

// const network = "homestead";
// const defaultProvider = ethers.getDefaultProvider(network, {
//     etherscan: '-',
//     infura: '-',
//     alchemy: 'ZXDCq5iy0KrKR0XjsqC6E4QG7Z_FuXDv',
//     ankr: '-',
//     pocket: '-'
//     // Or if using an application secret key:
//     // pocket: {
//     //   applicationId: ,
//     //   applicationSecretKey:
//     // },
// });

export default defaultProvider;

"use client";
import { createConfig, http, useWatchContractEvent } from "wagmi";
import { useReadMyTokenBalanceOf, useWriteMyTokenMint } from "./utils/contracts";
import { parseEther } from "viem";
import { Button, message } from "antd";
import { Mainnet, Sepolia, Hardhat, WagmiWeb3ConfigProvider, MetaMask, WalletConnect, OkxWallet, Polygon } from '@ant-design/web3-wagmi';
import { Address, NFTCard, ConnectButton, Connector, useAccount, useProvider } from "@ant-design/web3";
import { mainnet, sepolia, polygon, hardhat } from "wagmi/chains";
import SignDemo from './pages/components/SignDemo';
import { SendEth } from "./pages/transaction/SendEth";
import { injected, walletConnect } from "wagmi/connectors"; //钱包协议

const config = createConfig({
  chains: [mainnet, sepolia, polygon, hardhat],
  transports: {
    [mainnet.id]: http('https://api.zan.top/node/v1/eth/mainnet/781e2f9494f4424298a375a5fa910de4'),
    [sepolia.id]: http('https://api.zan.top/node/v1/eth/sepolia/781e2f9494f4424298a375a5fa910de4'),
    [polygon.id]: http('https://api.zan.top/node/v1/polygon/mainnet/781e2f9494f4424298a375a5fa910de4'),
    [hardhat.id]: http("http://127.0.0.1:8545/"),
  },
  connectors: [
    injected({
      target: "metaMask",
    }),
    walletConnect({
      projectId: "c07c0051c2055890eade3556618e38a6",
      showQrModal: false,
    }),
  ],
});

const contractInfo = [
  {
    id: 1,
    name: "Ethereum",
    contractAddress: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9"
  },
  {
    id: 5,
    name: "Sepolia",
    contractAddress: "0x418325c3979b7f8a17678ec2463a74355bdbe72c"
  },
  {
    id: 137,
    name: "Polygon",
    contractAddress: "0x418325c3979b7f8a17678ec2463a74355bdbe72c"
  },
  {
    id: hardhat.id,
    name: "Hardhat",
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
];

const CallTest = () => {
  const { account } = useAccount();
  const { chain } = useProvider();
  const { writeContract: mintNFT } = useWriteMyTokenMint(); // 确保在组件内调用 hook

  const result = useReadMyTokenBalanceOf({
    address: contractInfo.find((item) => item.id === chain?.id)?.contractAddress as `0x${string}`,
    args: [account?.address as `0x${string}`],
  });

  return (
    <div>
      {result.data?.toString()}
      <Button
        onClick={() => {
          mintNFT(
            {
              address: contractInfo.find((item) => item.id === chain?.id)?.contractAddress as `0x${string}`,
              args: [BigInt(1)],
              value: parseEther("0.01"),
            },
            {
              onSuccess: () => {
                message.success("Mint Success");
              },
              onError: (err) => {
                message.error(err.message);
              },
            }
          );
        }}
      >
        Mint
      </Button>
    </div>
  );
};

export default function Web3() {
  return (
    <WagmiWeb3ConfigProvider config={config} chains={[Mainnet, Sepolia, Polygon, Hardhat]} transports={{
      [Mainnet.id]: http('https://api.zan.top/node/v1/eth/mainnet/781e2f9494f4424298a375a5fa910de4'),
      [Sepolia.id]: http('https://api.zan.top/node/v1/eth/sepolia/781e2f9494f4424298a375a5fa910de4'),
      [Polygon.id]: http('https://api.zan.top/node/v1/polygon/mainnet/781e2f9494f4424298a375a5fa910de4'),
      [hardhat.id]: http("http://127.0.0.1:8545/"),
    }}
      wallets={[MetaMask(), WalletConnect(), OkxWallet()]}
      eip6963={{ autoAddInjectedWallets: true }}
    >
      <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
      <NFTCard address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" tokenId={641} />
      <Connector>
        <ConnectButton />
      </Connector>
      <SendEth />
      <CallTest />
      <SignDemo />
    </WagmiWeb3ConfigProvider>
  );
}

import React from "react";
import Header from "./Header";
import styles from "../../../styles/Home.module.css";

// 导入必要的组件和工具
import {
  MetaMask,
  OkxWallet,
  TokenPocket,
  WagmiWeb3ConfigProvider,
  WalletConnect,
  Hardhat,
  Mainnet,
} from "@ant-design/web3-wagmi";
import { QueryClient } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { mainnet, hardhat } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

// 初始化 QueryClient
const queryClient = new QueryClient();

// 创建 wagmi 配置
const config = createConfig({
  chains: [mainnet, hardhat],
  transports: {
    [mainnet.id]: http(),
    [hardhat.id]: http("http://127.0.0.1:8545/"), // 本地 Hardhat 节点
  },
  connectors: [
    walletConnect({
      showQrModal: false,
      projectId: "c07c0051c2055890eade3556618e38a6", // WalletConnect 项目 ID
    }),
  ],
});

// 定义布局组件的属性类型
interface WtfLayoutProps {
  children: React.ReactNode;
}

// 创建布局组件
const WtfLayout: React.FC<WtfLayoutProps> = ({ children }) => {
  return (
    <WagmiWeb3ConfigProvider
      eip6963={{
        autoAddInjectedWallets: true, // 自动添加已注入的钱包
      }}
      ens
      chains={[Mainnet, Hardhat]} // 支持的链
      wallets={[
        MetaMask(),
        WalletConnect(),
        TokenPocket({
          group: "Popular", // 设置 TokenPocket 的组
        }),
        OkxWallet(),
      ]}
      config={config}
      queryClient={queryClient} // 传递 QueryClient
    >
      <div className={styles.layout}>
        <Header />
        {children}
      </div>
    </WagmiWeb3ConfigProvider>
  );
};

export default WtfLayout;

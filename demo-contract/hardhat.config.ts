import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",  // 确保使用正确的 Solidity 版本
    settings: {
      optimizer: {
        enabled: true,  // 启用优化器
        runs: 200,      // 设定优化器运行次数，适当选择
      },
    },
  },
};

export default config;

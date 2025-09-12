import React, { useState, useEffect } from 'react';
import WalletWrapper from '../../components/WalletWrapper';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { ConnectWallet } from '../../components/ConnectWallet';

const Home = () => {

  return (
    <WalletWrapper>
      <ConnectWallet/>
    </WalletWrapper>
  );
};

export default Home;
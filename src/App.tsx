import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Onboard from '@bn-onboard/core'
import injectedModule from '@bn-onboard/injected-wallets'
import { Button } from '@material-ui/core';

const MAINNET_RPC_URL = 'RPC_URL'
const MATIC_MAINNET_RPC = 'RPC_URL'
const ETH_RINKEBY_RPC = 'RPC_URL'

const injected = injectedModule()
const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: MAINNET_RPC_URL
    },
    {
      id: '0x4',
      token: 'rETH',
      label: 'Ethereum Rinkeby Testnet',
      rpcUrl: ETH_RINKEBY_RPC
    },
    {
      id: '0x89',
      token: 'MATIC',
      label: 'Matic Mainnet',
      rpcUrl: MATIC_MAINNET_RPC
    },
  ],
  appMetadata: {
    name: 'My App',
    icon: '<SVG_ICON_STRING>',
    description: 'My app using Onboard'
  }
})

// wallet initiation logic must exist outside of react component
// but can/should be triggered from inside react component
async function connectWallet() {
  const wallets = await onboard.connectWallet()
  return wallets
}

async function setChain(chainIdObj: any): Promise<boolean> {
  return await onboard.setChain(chainIdObj)
}

function App() {
  const [userAddress, setUserAddress] = React.useState('')
  const [wallet, setWallet] = useState({})
  const [slectedChain, setSelectedChain] = useState('')

  const maticChainIdObj = { chainId: '0x89' }
  const rinkebyChainIdObj = { chainId: '0x4' }

  async function initializeOnboard() {
    const wallets = await connectWallet()
    console.log(wallets)
    setWallet(wallets as any)
    setUserAddress(wallets[0].accounts[0].address)
    setSelectedChain(wallets[0].chain)
  }

  async function switchChain(chainIdObj: any){
    const success = await setChain(chainIdObj)
    setSelectedChain(chainIdObj.chainId)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {userAddress !== '' ? <div>
        <p>
          02 is sweet!
        </p>
        <p>
          My address is {userAddress}
        </p>
        <p>
          My network is {slectedChain}
        </p>
        </div>
          :
          null
        }
        <a
          className="App-link"
          href="https://github.com/blocknative/onboard/tree/feature/v2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Onboard 2 Docs
        </a>
        <Button variant="contained" onClick={() => initializeOnboard()}> Connect O2 </Button>

        {userAddress !== '' ? <Button variant="contained" color="primary" onClick={() => setChain(maticChainIdObj)}> Switch to Polygon </Button> : null}
        {userAddress !== '' ? <Button variant="contained" color="secondary" onClick={() => setChain(rinkebyChainIdObj)}> Switch to Rinkeby </Button> : null}
      </header>
    </div>
  );
}

export default App;

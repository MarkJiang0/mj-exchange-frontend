import React, { useState } from 'react'
import styled from 'styled-components'
import NavItem from '../NavItem'
import ConnectModal from '../Modal/ConnectModal'
import { useWeb3React } from '@web3-react/core'
import UserDropDownMenu from '../UserDropDownMenu'

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 77px;
  width: 100%;
  background-color: #0E0037;
  border-bottom: 1px solid #0E0037;
`

const StartFlexBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const ConnectButton = styled.button`
  cursor: pointer;
  background-color: #46A1C2;
  color: #FFFFFF;
  border-radius: 20px;
  padding: 12px 24px 12px 24px;
  border: 0;
  box-shadow: 0px -1px 0px 0px rgba(14,14,44,0.4) inset;
  margin-right: 30px;
`


function Header() {
  const [showModal, setShowModal] = useState(false)

  const {isActive, account} = useWeb3React()

  const openWalletModal = () => {
    setShowModal(true)
  }

  return (
    <HeaderBox>
      <StartFlexBox>
        <NavItem>交易</NavItem>
        <NavItem>数据</NavItem>
      </StartFlexBox>
      
      <StartFlexBox>
        {isActive ? <UserDropDownMenu account={account}/> : <ConnectButton onClick={openWalletModal}>连接钱包</ConnectButton>}
        
        <ConnectModal show={showModal} onDismiss={() => {setShowModal(false)}} />
      </StartFlexBox>
      
    </HeaderBox>
  )
}

export default Header

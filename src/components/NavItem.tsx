import { type } from 'os'
import React, { ReactNode, useState } from 'react'
import styled, { css } from 'styled-components'

const NavItemBox = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  position: relative;
`

const Link = styled.a`
  color: #FFFFFF;
  padding: 0 24px;
  font-weight: 400px;
`

const NavPanelBox = styled.ul<{isOpen: boolean}>`
  position: absolute;
  top: 50px;
  left: 0;
  height: 200px;
  width: 400px;
  background-color: #FFFFFF;
  z-index: 10;
  border-radius: 20px;
  border: 1px solid #E7E3EB;

  ${(props) => setChangeDisplay(props)}
`

const DropListItem = styled.li`
  
`

const setChangeDisplay = (props: any) => {
  return props.isOpen ? css `
    display: block;
  `: css `
    display: none;
  `
}

interface NavItemProps {
  children: ReactNode
  
}

const NavItem: React.FC<NavItemProps> = ({children}: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handeMouseOn = () => {
    setIsOpen(true)
  }

  const handeMouseLeave = () => {
    setIsOpen(false)
  }

  return (
    <NavItemBox onMouseEnter={handeMouseOn} onMouseLeave={handeMouseLeave}>
      <Link href='#'>{children}</Link>
      <NavPanelBox isOpen={isOpen}>
      </NavPanelBox>
    </NavItemBox>
  )
}

export default NavItem

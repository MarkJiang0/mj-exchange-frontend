import React from 'react'
import styled from 'styled-components'

export type OverlayProps = {
  show: boolean;
  zIndex?: number;
};


const Overlay = styled.div<OverlayProps>`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: #000000;
  transition: opacity 0.4s;
  opacity: ${({ show }) => (show ? 0.4 : 0)};
  z-index: ${({ zIndex }) => zIndex};
  pointer-events: ${({ show }) => (show ? "initial" : "none")};
`

export default Overlay

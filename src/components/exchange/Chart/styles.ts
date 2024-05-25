import styled from "styled-components";

export const ChartContainer = styled.div`
  width: 100%;
  position: relative;
  border-top: 1px solid #252931;
`

export const ToolTipWrapper = styled.div`
  background: trasparent;
  border-color: trasparent;
  max-width: 500px; 
  height: auto; 
  position: absolute; 
  padding: 8px; 
  box-sizing: border-box; 
  font-size: 12px; 
  text-align: left; 
  z-index: 10; 
  top: 5px; 
  left: 12px; 
  pointer-events: none; 
  border: none; 
  font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; 
  -webkit-font-smoothing: antialiased; 
  -moz-osx-font-smoothing: grayscale;
`

export const ToolTipFlex = styled.div`
  display: flex; 
  justify-content: flex-start; 
  align-items: center;
`

export const ToolTipItem = styled.div`
  font-size: 14px; 
  margin: 2px 2px; 
  color: #E3B014;
`
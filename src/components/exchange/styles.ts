import styled from "styled-components"
import { css } from "styled-components"

export const ListItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  line-height: 20px;
  padding-left: 16px;
  padding-right: 16px;
`

export const PriceCell = styled.div<{$isBuy: boolean}>`
  font-size: 12px;
  flex: 1 1 0%;
  text-align: left;
  cursor: pointer;
  width: 90px;

  ${(props) => {
    return props.$isBuy ? css`color: rgb(14, 203, 129);` : css`color: rgb(246, 70, 93);`
  }}
`

export const TextCell = styled.div<{$left?: boolean}>`
  font-size: 12px;
  flex: 1 1 0%;
  color: rgb(183, 189, 198);
  cursor: pointer;
  width: 90px;
  ${(props) => {
    return props.$left ? css`text-align: left;` : css`text-align: right;`
  }}
`
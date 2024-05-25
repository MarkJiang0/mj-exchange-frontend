import useStore from '@/stores/exchange/useStore'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import CloseIcon from './icons/Close'
import SearchIcon from './icons/Search'
import { ModalWrapper } from '@/components/Modal/Styleds'
import Overlay from '@/components/Overlay'
import { Box, Flex } from '@/components/Box'
import FlexCol from '@/components/Box/FlexCol'
import FlexSpaceBetween from '@/components/Box/FlexSpaceBetween'
import { IndicatorInfo } from './types'
import { css } from 'styled-components'
import _ from 'lodash'



const IndicatorSelectorModal = () => {
  const {enabledIndicators, selectedIndicators, selected, unselected, removeAll, selectAll} = useStore(state => state.indicator)
  const [searchText, setSearchText] = useState('')

  const showIndicatorList: Partial<IndicatorInfo>[] = useMemo(() => {
    return enabledIndicators.map(ind => {
      const selected = selectedIndicators.some(i => i === ind.name)
      return {
        ...ind,
        selected
      }
    })
  }, [enabledIndicators, selectedIndicators])

  const allSelected = useMemo(() => {
    return !showIndicatorList.some(i => !i.selected)
  }, [enabledIndicators, selectedIndicators])

  const handleCheckBoxClicked = (name?: string) => {
    console.log(name)
    if (name) {
      const clickedInd = showIndicatorList.findLast(i => i.name && i.name === name)
      if (clickedInd && clickedInd.selected) {
        unselected(name)
      } else {
        selected(name)
      }
    }
  }

  const handleAllCheckBoxClicked = () => {
    if (allSelected) {
      removeAll()
    } else {
      selectAll()
    }
  }

  const handleSearchTextChange = (text: string) => {
    setSearchText(text)
  }

  return (
    <SelectPanel>
        <Header>
          <Title>Indicator</Title>
          <Box>
            <CloseIcon fill='rgb(132, 142, 156)'/>
          </Box>
        </Header>
        <SearchBox>
          <SearchIcon fill='rgb(132, 142, 156)'/>
          <SearchInput value={searchText} onChange={(e) => handleSearchTextChange(e.target.value)} />
        </SearchBox>
        <FlexSpaceBetween alignItems={'center'} width={'100%'} paddingLeft={'10px'} paddingTop={'5px'} paddingBottom={'5px'} borderBottom={'1px solid #474D57'}>
          <Flex justifyContent='flex-start' alignItems={'center'}>
            <IndCheckBox $selected={allSelected} onClick={() => handleAllCheckBoxClicked()}>
              <CheckIcon />
            </IndCheckBox>
            <Label>ALL</Label>
          </Flex>
        </FlexSpaceBetween>

        <FlexCol alignItems={'center'} padding={'2px 10px'} height={'300px'} overflowY={'auto'}>
          {showIndicatorList
            .filter(i => i.name?.toLowerCase().includes(searchText.toLowerCase()))
            .map((ind, key) => (
            <FlexSpaceBetween key={key} alignItems={'center'} width={'100%'} padding={'5px 0px'}>
              <Flex justifyContent='flex-start' alignItems={'center'}>
                <IndCheckBox $selected={ind.selected} onClick={() => handleCheckBoxClicked(ind.name)}>
                  <CheckIcon />
                </IndCheckBox>
                <Label>{ind.name}</Label>
              </Flex>
              <Box background={ind.color} width={'30px'} height={'30px'}></Box>
            </FlexSpaceBetween>
          ))}
          
        </FlexCol>
        
        
      </SelectPanel>
    
  )
}

export default IndicatorSelectorModal

const SelectPanel = styled.div`
  
  min-height: 100px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 0px;
  z-index: 100;
  display: block;
  background-color: #23282D;

  /* top: 100px;
  left: 0px; */
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  color: rgb(132, 142, 156);
  border-bottom: 1px solid #474D57;
  padding: 5px 10px;
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 500px;
`

const Operator = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10px;
  color: rgb(132, 142, 156);
  cursor: pointer;
`

const SearchBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 10px;
  border-bottom: 1px solid #474D57;
`
const SearchInput = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  font-weight: 500px;
  margin-left: 20px;
  width: 100%;
  color: rgb(234, 236, 239);
  font-size: 14px;
  padding-left: 4px;
  padding-right: 4px;
  text-align: left;
  height: 40px;
  
`


const Label = styled.div`
  color: #EBECEF;
  font-size: 16px;
  font-weight: 500;
  padding: 0px 10px;
`

const IndCheckBox = styled.div<{$selected?: boolean}>`
  width: 20px;
  height: 20px;
  
  position: relative;
  
  border-radius: 2px;

  ${(props) => {
    return props.$selected ? css`
    background-color: #E3B014;
    border: 1px solid #E3B014;
    ` : css`
    background-color: transparent;
    border: 1px solid rgb(132, 142, 156);
    `
  }}
`

const CheckIcon = styled.div`
  width: 12px;
  height: 6px;
  border-top: 2px solid #23282D;
  border-right: 2px solid #23282D;
  transform: rotate(130deg);
  position: absolute;
  top: 5px;
  left: 3px;
`


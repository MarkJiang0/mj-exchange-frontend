import React from 'react'
import FlexCol from '../Box/FlexCol'
import { Box, Flex } from '../Box'
import styled from 'styled-components'
import { css } from 'styled-components'
import { useRegisterForm } from './hooks'

const RegisterForm = () => {
  const {formData, setPhone, setCode, setPassword, setConfirmPass, setAgree, submitForm} = useRegisterForm()



  return (
    <Container>
      <FlexCol justifyContent={'flex-start'} alignItems={'center'}>
        <Box paddingY={'20px'}>
          <Title>Register</Title>
        </Box>
        <Flex justifyContent={'flex-start'} alignItems={'center'} width={'360px'} paddingY={'10px'}>
          <FormInputBox placeholder='Phone number' value={formData.phone} onChange={(e) => setPhone(e.target.value)}/>
        </Flex>
        <Flex justifyContent={'space-between'} alignItems={'center'} width={'360px'} paddingY={'10px'}>
          <FormInputBox placeholder='Verify code' value={formData.code} onChange={(e) => setCode(e.target.value)}/>
          <SendCodeButton>Send</SendCodeButton>
        </Flex>
        <Flex width={'360px'} paddingY={'10px'}>
          <FormInputBox placeholder='Password' value={formData.password} onChange={(e) => setPassword(e.target.value)} type='password'/>
        </Flex>
        <Flex width={'360px'} paddingY={'10px'}>
          <FormInputBox placeholder='Confirm password' value={formData.confirmPass} onChange={(e) => setConfirmPass(e.target.value)}  type='password'/>
        </Flex>
        <Flex>
          <IndCheckBox $selected={formData.agree} onClick={setAgree}>
            <CheckIcon />
          </IndCheckBox>
          <TermText>I agree to Terms of Service and Privacy Policy.</TermText>
        </Flex>
        <Box width={'360px'} paddingTop={'10px'} paddingBottom={'20px'}>
          <RegisterButton onClick={submitForm}>Register</RegisterButton>
        </Box>
      </FlexCol>
    </Container>
    
  )
}

export default RegisterForm

const Container = styled.div`
  border: 2px solid #21262C;
  padding: 0 20px;
  border-radius: 10px;
  width: 400px;
  
  color: #EBECEF;
`

const Title = styled.div`
  font-size: 32px;
  font-weight: bold;
`

const TermText = styled.div`
  margin-left: 5px;
  font-size: 14px;
`

const FormInputBox = styled.input`
  outline: none;
  background-color: transparent;
  font-weight: 500px;
  width: 100%;
  color: rgb(234, 236, 239);
  font-size: 14px;
  padding-left: 4px;
  padding-right: 4px;
  height: 40px;
  border: 1px solid #21262C;
  border-radius: 5px;
  

  &:focus {
    border: 1px solid #E3B014;
  }
`


const RegisterButton = styled.div`
  background-color: #E3B014;
  color: #21262C;
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
`

const SendCodeButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: 1px solid #E3B014;
  color: #E3B014;
  height: 38px;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  padding: 0 10px;
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
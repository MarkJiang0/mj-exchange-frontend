import styled from 'styled-components'
import { Box, Flex } from '../Box'
import FlexCol from '../Box/FlexCol'
import { useLoginForm } from './hooks'
import Link from 'next/link'
import { Bounce, toast } from 'react-toastify'

const LoginForm = () => {
  const {formData, setPhone, setPassword, submitForm} = useLoginForm()

  const handleSubmitForm = () => {
    submitForm()
  }

  return (
    <Container>
      <FlexCol justifyContent={'flex-start'} alignItems={'center'}>
        <Box paddingY={'20px'}>
          <Title>Login</Title>
        </Box>
        <Flex justifyContent={'flex-start'} alignItems={'center'} width={'360px'} paddingY={'10px'}>
          <FormInputBox placeholder='Phone number' value={formData.phone} onChange={(e) => setPhone(e.target.value)}/>
        </Flex>
        <Flex width={'360px'} paddingY={'10px'}>
          <FormInputBox placeholder='Password' value={formData.password} onChange={(e) => setPassword(e.target.value)} type='password'/>
        </Flex>
        <Box width={'360px'} paddingY={'10px'}>
          <RegisterButton onClick={handleSubmitForm}>Login</RegisterButton>
        </Box>
        <Flex justifyContent={'flex-end'} alignItems={'center'} paddingBottom={'20px'} width={'100%'}>
          
          <Link href={'/register'}>
            <RegisterText>Register</RegisterText>
          </Link>
        </Flex>
      </FlexCol>
    </Container>
    
  )
}

export default LoginForm

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

const RegisterText = styled.div`
  color: #E3B014;
  font-size: 14px;
`
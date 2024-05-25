import { Flex } from '@/components/Box'
import LoginForm from '@/components/Login/LoginForm'

const login = () => {
  return (
    <Flex justifyContent={'center'} alignItems={'center'} height={'800px'}>
      <LoginForm />
    </Flex>
  )
}

export default login

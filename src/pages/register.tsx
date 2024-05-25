import { Flex } from '@/components/Box'
import RegisterForm from '@/components/Register/RegisterBox'
import React from 'react'

const register = () => {
  return (
    <Flex justifyContent={'center'} alignItems={'center'} height={'800px'}>
      <RegisterForm />
    </Flex>
  )
}

export default register

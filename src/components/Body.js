import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  Stack,
  useDisclosure,
  useColorModeValue,
  Collapse,
  Divider
} from '@chakra-ui/react';

export const Body = () => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Center mt={4} mb={6}>
      <Box
        maxW={'92vw'}
        w={'900px'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow="dark-lg"
        rounded={'md'}
        p={6}
        textAlign="left"
        overflow={'hidden'}>
        <Stack>
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}>
            Direct Chat
          </Text>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            fontFamily={'body'}>
            Complete los campos para Iniciar el chat!
          </Heading>
          <Text color={'gray.500'}>
           Seleccione primero el país y luego ingrese el número con quien desea chatear.
          </Text>
        </Stack>
        <Divider mt={4} mb={4} />
        <Stack>
          
        </Stack>
       <Button w="100%" colorScheme="green" bg='green.700' mt={3} > Calcular!</Button>
        <Collapse in={isOpen} animateOpacity>
          <Box
            p="40px"
            color="white"
            mt="4"
            bg="teal.700"
            rounded="lg"
            shadow="md"
          >
           </Box>
        </Collapse>
      </Box>
    </Center>
  )
}

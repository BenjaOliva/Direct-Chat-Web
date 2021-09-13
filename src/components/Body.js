import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  Textarea,
  Stack,
  useDisclosure,
  useColorModeValue,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  Switch
} from '@chakra-ui/react';

import PhoneNumberInput from './PhoneNumberInput';

import { COUNTRIES } from "./countries";

export const Body = () => {
  const { isOpen, onToggle } = useDisclosure()
  const [value, setValue] = useState("");
  const [number, setNumber] = useState("");
  const [text, setText] = useState("");
  const [enableState, setEnable] = useState(true);

  const countryOptions = COUNTRIES.map(({ name, iso }) => ({
    label: name,
    value: iso
  }));

  function handleChange(value) {
    //console.log(value);
    setValue(value)
    setNumber(value)
    value.indexOf("+") ? setEnable(true) : setEnable(false);
  }

  function handleTextField(event) {
    setText(event.target.value)
  }

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
          <PhoneNumberInput
            value={value}
            options={countryOptions}
            placeholder="Seleccione primero el pais..."
            onChange={handleChange}
            mb={4}
          />
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="message-toggle" mb="0">
              Iniciar chat con un mensaje?
            </FormLabel>
            <Switch ml={7} colorScheme="whatsapp" id="message-toggle" size="lg" onChange={ () => {onToggle(); setText("")}} />
          </FormControl>
          <Collapse in={isOpen} animateOpacity>
            <Box
              p="20px"
              color="white"
              mt="2"
              bg="green.900"
              rounded="md"
              shadow="md"
            >
              <Text mb="6px">Texto del Mensaje: </Text>
              <Textarea
                placeholder="Escriba aqui el mensaje..."
                onChange={handleTextField}
                size="sm"
              />
            </Box>
          </Collapse>
        </Stack>
        <Button isDisabled={enableState} w="100%" as="a" href={`https://api.whatsapp.com/send/?phone=${number}&text=${text}`} rel="noopener noreferrer" target="_blank" colorScheme="green" bg='green.600' mt={3} > Ir al Chat!</Button>
      </Box>
    </Center>
  )
}

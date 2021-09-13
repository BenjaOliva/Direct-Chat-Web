import React from 'react'

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Button,
    ModalFooter,
    ModalHeader,
    ModalCloseButton,
    Divider
} from '@chakra-ui/react';


const ModalItem = ({ title, text }) => {

    return (
        <AccordionItem>
            <AccordionButton>
                <Box as="i" flex="1" textAlign="left">
                    <strong>{title}</strong>
                </Box>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                {text}
            </AccordionPanel>
        </AccordionItem>
    )
}

const InfoModal = ({ openModal, setModal }) => {
    return (
        <Modal
            isCentered
            onClose={() => { setModal(false) }}
            isOpen={openModal}
            size={'2xl'}
            motionPreset="slideInBottom"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Acerca De</ModalHeader>
                <Divider m={2} />
                <ModalCloseButton />
                <ModalBody>
                    <Accordion allowToggle>
                        <ModalItem
                            title='Que es Direct Chat ?'
                            text='Este es un sitio que permite abrir un chat de Whatsapp con 
                            cualquier número. Hasta puedes incluir un mensaje antes de abrir el chat!'
                        />
                        <ModalItem
                            title='Es Seguro ?'
                            text='Totalmente, este sitio hace uso de la API de WhatsApp, por lo 
                            que no se recopila ningun tipo de dato en este sitio.'
                        />
                        <ModalItem
                            title='Como funciona esta herramienta ?'
                            text='Con la API de Whatsapp se coloca el numero y el texto que uno 
                            desee como si fuese una url. Esta herrmienta facilita ese proceso!'
                        />
                    </Accordion>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="green" mr={3} onClick={() => { setModal(false) }}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default InfoModal
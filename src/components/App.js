import React from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  extendTheme,
  VStack
} from '@chakra-ui/react';
import { Simple as Navbar } from "./navbar"
import Footer from './Footer';
import { Body } from './Body';

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

const App = () => {

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="90vh" p={3}>
          <div id="Inicio">
            <Navbar />
          </div>
          <VStack>
            <Body isOpen={true}></Body>
          </VStack>
        </Grid>
      </Box>
      <div id="Contacto">
        <Footer />
      </div>
    </ChakraProvider>
  );
}

export default App;

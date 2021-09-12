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
        <Grid minH="89vh" p={3}>
          <Navbar />
          <VStack>
            <Body isOpen={true}></Body>
          </VStack>
        </Grid>
      </Box>
      <Footer />
    </ChakraProvider>
  );
}

export default App;

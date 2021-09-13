import React, { useState, useEffect } from "react";
import { FaGlobeAmericas } from "react-icons/fa";
import {
  Box,
  Flex,
  Input,
  Select,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import Flag from "react-world-flags";
import { AsYouType } from "libphonenumber-js";
import { getCountryTelCode } from "./countries";

export default function PhoneNumberInput(props) {
  const {
    size,
    value,
    country,
    options,
    onChange,
    placeholder,
    ...rest
  } = props  
  let [number, setNumber] = useState(value);
  let [selectedCountry, setSelectedCountry] = useState(country || "");

  useEffect(() => {
    setSelectedCountry(country);
  }, [country]);

  useEffect(() => {
    setNumber(value);
  }, [value]);

  const onCountryChange = (e) => {
    let value = e.target.value;
    let code = getCountryTelCode(value);
    let parsedNumber = new AsYouType().input(`${code}${number}`);

    setSelectedCountry(value);
    onChange(parsedNumber);
  };

  const onPhoneNumberChange = (e) => {
    let value = e.target.value;

    setNumber(value);
    onChange(value);
  };

  return (
    <InputGroup size={size} {...rest}>
      <InputLeftElement width="4rem">
        <Select
          top="0"
          left="3"
          zIndex={1}
          bottom={0}
          opacity={0}
          height="100%"
          position="absolute"
          value={selectedCountry}
          onChange={onCountryChange}
        >
          <option value={''} />
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Flex pl={2} mr={3} width="100%" alignItems="center">
          {selectedCountry ? (
            <Box mr="4px" width="50%" flex={1}>
              <Flag height="1rem" code={selectedCountry || ""} />
            </Box>
          ) : (
            <FaGlobeAmericas />
          )}
        </Flex>
      </InputLeftElement>
      <Input
        pl="4rem"
        type="tel"
        value={number}
        pattern="[0-9]"
        placeholder={placeholder}
        onChange={onPhoneNumberChange}
      />
    </InputGroup>
  );
}

PhoneNumberInput.defaultProps = {
  options: [],
  size: "md"
};

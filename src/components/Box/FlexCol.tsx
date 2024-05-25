import styled from "styled-components";
import { flexbox } from "styled-system";
import Box from "./Box";
import { FlexProps } from "./types";
import Flex from "./Flex";

const FlexCol = styled(Flex)`
  flex-direction: column;
`;

export default FlexCol;

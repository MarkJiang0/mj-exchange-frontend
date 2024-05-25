import styled from "styled-components";
import { flexbox } from "styled-system";
import Box from "./Box";
import { FlexProps } from "./types";
import Flex from "./Flex";

const FlexSpaceBetween = styled(Flex)`
  justify-content: space-between;
`;

export default FlexSpaceBetween;

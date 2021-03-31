import React from "react";
import styled from "styled-components";

const Grid = (props) => {
  const {
    height,
    _onClick,
    center,
    is_flex,
    width,
    margin,
    padding,
    bg,
    children,
  } = props;

  const styles = {
    height: height,
    is_flex: is_flex,
    width: width,
    margin: margin,
    padding: padding,
    bg: bg,
    center: center,
  };

  return (
    <React.Fragment>
      <GridBox onClick={_onClick} {...styles}>
        {children}
      </GridBox>
    </React.Fragment>
  );
};

// 아무런 props 가 없을 때 default view

Grid.defaultProps = {
  children: null,
  is_flex: false,
  width: "100%",
  padding: false,
  margin: false,
  bg: false,
  center: false,
  height: "100%",
  _onClick: () => {},
};

const GridBox = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  box-sizing: border-box;
  ${(props) => (props.padding ? `padding: ${props.padding};` : "")};
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")};
  ${(props) => (props.bg ? `background-color: ${props.bg};` : "")};
  ${(props) =>
    props.is_flex
      ? `display: flex; align-items: center; justify-content: space-between`
      : ""};
  ${(props) => (props.center ? `text-align: center` : "")}
`;

export default Grid;

import React from "react";
import { Route } from "react-router";
import styled from "styled-components";
import { Text, Grid } from "./index";

const Input = (props) => {
  const {
    onSubmit,
    is_Submit,
    value,
    multiLine,
    label,
    placeholder,
    _onChange,
    type,
  } = props;

  if (multiLine) {
    return (
      <Grid height="20%">
        {label && <Text margin="0px">{label}</Text>}
        <ElTextarea
          rows={10}
          value={value}
          placeholder={placeholder}
          onChange={_onChange}
        ></ElTextarea>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid height="20%">
        {label && <Text margin="0px">{label}</Text>}
        <Text margin="0px"></Text>
        {is_Submit ? (
          <ElInput
            type={type}
            placeholder={placeholder}
            onChange={_onChange}
            value={value}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onSubmit(e);
              }
            }}
          />
        ) : (
          <ElInput type={type} placeholder={placeholder} onChange={_onChange} />
        )}
      </Grid>
    </React.Fragment>
  );
};

Input.defaultProps = {
  multiLine: false,
  label: false,
  placeholder: "텍스트를 입력해주세요.",
  _onChange: () => {},
  type: "text",
  value: "",
  is_Submit: false,
  onSubmit: () => {},
};

const ElTextarea = styled.textarea`
  border: 1px solid #212121;
  width: 100%;
  padding: 12px 4px;
  box-sizing: border-box;
`;

const ElInput = styled.input`
  border: 1px solid #212121;
  width: 100%;
  padding: 12px 4px;
  box-sizing: border-box;
`;
export default Input;

"use client";
import {
  Children,
  type FunctionComponent,
  type ReactElement,
  type ReactNode,
} from "react";

type DefaultProps = {
  children: ReactElement[];
};

type CaseProps = {
  children: ReactNode;
  condition: boolean;
};

const Switch: FunctionComponent<DefaultProps> = ({ children }) => {
  let matchChild: ReactNode = null;
  let defaultCase: ReactNode = null;

  Children.forEach(children, (child) => {
    if (!matchChild && child.type === Case) {
      const { condition } = child.props as CaseProps;

      const conditionResult = Boolean(condition);

      if (conditionResult) {
        matchChild = child;
      }
    } else if (!defaultCase && child.type === Default) {
      defaultCase = child;
    }
  });

  return matchChild ?? defaultCase ?? null;
};

const Case: FunctionComponent<CaseProps> = ({ children }) => {
  return children;
};

const Default: FunctionComponent<DefaultProps> = ({ children }) => {
  return children;
};

export { Switch, Case, Default };

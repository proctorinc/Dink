import {
  Children,
  cloneElement,
  isValidElement,
  type FC,
  type ReactNode,
} from "react";
import CardAction, { type CardActionProps } from "./CardAction";
import CardBody, { type CardBodyProps } from "./CardBody";
import CardCollapse, { type CardCollapseProps } from "./CardCollapse";
import CardGroup, { type CardGroupProps } from "./CardGroup";
import CardHeader, { type CardHeaderProps } from "./CardHeader";

export type CardProps = {
  className?: string;
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  horizontal?: boolean;
  size?: "sm";
  noShadow?: boolean;
};

type CardSubcomponents = {
  Header: FC<CardHeaderProps>;
  Body: FC<CardBodyProps>;
  Group: FC<CardGroupProps>;
  Action: FC<CardActionProps>;
  Collapse: FC<CardCollapseProps>;
};

type sizeableComponent = {
  size?: string;
};

const Card: FC<CardProps> & CardSubcomponents = ({
  className,
  children,
  onClick,
  size,
  noShadow,
}) => {
  const clickable = !!onClick
    ? "group hover:bg-primary-light hover:text-primary-dark cursor-pointer"
    : "";
  const cardStyle = `${
    noShadow ? "" : "shadow-lg"
  } flex flex-col w-full rounded-xl bg-primary-med ${clickable}`;

  const renderChildren = () => {
    return Children.map(children, (child) => {
      if (!!size && isValidElement<sizeableComponent>(child)) {
        return cloneElement(child, {
          size,
        });
      }
      return child;
    });
  };

  return (
    <div className={`${cardStyle} ${className ?? ""}`} onClick={onClick}>
      {renderChildren()}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Group = CardGroup;
Card.Action = CardAction;
Card.Collapse = CardCollapse;

export default Card;

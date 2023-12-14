import {
  type FC,
  type InputHTMLAttributes,
  type ChangeEvent,
  useState,
} from "react";

type CurrencyInputProps = InputHTMLAttributes<HTMLInputElement> & {
  onValueChange: (value: number) => void;
};

const CurrencyInput: FC<CurrencyInputProps> = ({
  onValueChange,
  ...otherProps
}) => {
  const [formattedValue, setFormattedValue] = useState("$0.00");

  const formatNumberToCurrency = (value: number) => {
    const USD = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return USD.format(Number(value));
  };

  const parseNumberFromCurrency = (stringNumber: string) => {
    const thousandSeparator = Intl.NumberFormat("en-US")
      .format(11111)
      .replace(/\p{Number}/gu, "");
    const decimalSeparator = Intl.NumberFormat("en-US")
      .format(1.1)
      .replace(/\p{Number}/gu, "");

    return parseFloat(
      stringNumber
        .replace(new RegExp("\\" + thousandSeparator, "g"), "")
        .replace(new RegExp("\\" + decimalSeparator), ".")
        .replace(new RegExp("\\$"), "")
    );
  };

  const onUpdateInput = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedCurrency = event.target.value;
    let updatedValue = parseNumberFromCurrency(updatedCurrency);

    if (updatedCurrency.length > formattedValue.length) {
      updatedValue *= 10;
    } else {
      updatedValue /= 10;
    }

    setFormattedValue(formatNumberToCurrency(updatedValue));
    onValueChange(updatedValue);
  };

  return (
    <input
      pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
      data-type="currency"
      placeholder="$0.00"
      className="w-full px-2 font-bold placeholder-gray-500"
      value={formattedValue}
      onChange={onUpdateInput}
      {...otherProps}
    />
  );
};

export default CurrencyInput;

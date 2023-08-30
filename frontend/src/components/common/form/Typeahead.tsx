import classNames from 'classnames';
import TooltipIcon from 'components/common/TooltipIcon';
import { getIn, useFormikContext } from 'formik';
import * as React from 'react';
import { useRef } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import styled from 'styled-components';

import TooltipWrapper from '../TooltipWrapper';
import { SelectOption } from './Select';

export interface ITypeaheadFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  /** whether or not this component should show the validation checkmark */
  hideValidation?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** A function that takes in the value stored in formik and returns the corresponding label for that value. */
  getOptionByValue?: (value?: any) => any[];
  /** pass a custom onChange to the TypeaheadField */
  onChange?: (vals: any) => void;
  /** pass a custom selection to the TypeaheadField */
  selected?: any;
  /** Class name of the input wrapper */
  outerClassName?: string;
  /** clear menu on custom header click */
  clearMenu?: boolean;
  /** controlling the selected inputs for multiple select enabled queries */
  multiSelections?: any;
  /** Display errors in a tooltip instead of in a div */
  displayErrorTooltips?: boolean;
  /** used to trigger ref.current.blur where applicable */
  clearSelected?: boolean;
  /** reset clear  state via this component */
  setClear?: Function;
  /** get the component to select the item with closest label match to the input provided */
  selectClosest?: boolean;
  placeholder?: string;
  inputProps?: Record<string, any>;
  options: SelectOption[];
  disabled?: boolean;
}

const Feedback = styled(Form.Control.Feedback)`
  display: block;
`;

export function TypeaheadField({
  label,
  required,
  name,
  hideValidation,
  tooltip,
  getOptionByValue,
  multiSelections,
  onChange,
  setClear,
  clearSelected,
  outerClassName,
  selectClosest,
  clearMenu,
  displayErrorTooltips,
  options,
  placeholder,
  inputProps,
  ...rest
}: ITypeaheadFieldProps) {
  const { touched, values, errors, setFieldTouched, setFieldValue } = useFormikContext();
  const hasError = !!getIn(touched, name) && !!getIn(errors, name);
  const isValid = !!getIn(touched, name) && !getIn(errors, name);
  const error = getIn(errors, name);
  const touch = getIn(touched, name);
  const errorTooltip = error && touch && displayErrorTooltips ? error : undefined;

  const customBlur = (val: string) => {
    setFieldTouched(name, true);
    if (
      (!getIn(name, 'value') && val !== '' && getIn(values, name) === '') ||
      (!getIn(values, name) && getIn(values, name) !== '')
    ) {
      const regex = new RegExp(val, 'i');
      const exact = new RegExp(`^${val}$`, 'i');
      /** check for exact match before returning closest fit, will return undefined if failure */
      const checkExactMatch = options.find((x: any) =>
        x.label ? x.label.match(exact) : x.match(exact),
      );

      /** returns item with the closest matching text, used if exact match is not found */
      const matchedItem = options.find((x: any) =>
        x.label ? x.label.match(regex) : x.match(regex),
      );

      if ((checkExactMatch as any)?.value || (matchedItem as any)?.value) {
        setFieldValue(
          name,
          checkExactMatch ? (checkExactMatch as any).value : (matchedItem as any).value,
        );
      } else {
        setFieldValue(name, checkExactMatch ? checkExactMatch : matchedItem);
      }
    }
  };
  if (!getOptionByValue) {
    getOptionByValue = (value: any) => (!!value ? ([value] as any[]) : ([] as any[]));
  }

  const ref = useRef<any>();
  React.useEffect(() => {
    if (clearSelected && ref.current?.clear) {
      ref.current.clear();
      setFieldValue(name, '');
      setClear && setClear(false);
    }
    if (clearMenu && ref.current?.blur) {
      ref.current.blur();
      setClear && setClear(false);
    }
  }, [clearMenu, clearSelected, setClear, name, setFieldValue]);

  return (
    <Form.Group className={classNames(!!required ? 'required' : '', outerClassName)}>
      {!!label && <Form.Label>{label}</Form.Label>}
      {!!tooltip && <TooltipIcon toolTipId="typeAhead-tip" toolTip={tooltip} />}
      <TooltipWrapper toolTipId={`${name}-error-tooltip}`} toolTip={errorTooltip}>
        <Typeahead
          {...rest}
          options={options}
          inputProps={{
            ...inputProps,
            name,
            id: `${name}-field`,
            style: { width: '100%' },
          }}
          isInvalid={hasError as any}
          highlightOnlyResult
          isValid={!hideValidation && isValid}
          selected={
            multiSelections?.length > 0 ? multiSelections : getOptionByValue(getIn(values, name))
          }
          ref={ref}
          onChange={
            onChange
              ? onChange
              : (newValues: any[]) => {
                  setFieldValue(name, getIn(newValues[0], 'value') ?? newValues[0]);
                }
          }
          onBlur={
            selectClosest
              ? (e: any) => customBlur(e.target.value)
              : () => setFieldTouched(name, true)
          }
          id={`${name}-field`}
          placeholder={placeholder ?? ''}
        />
      </TooltipWrapper>
      {hasError && !displayErrorTooltips && (
        <Feedback type="invalid">{getIn(errors, name)}</Feedback>
      )}
    </Form.Group>
  );
}

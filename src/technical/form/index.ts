import { FieldValues, FormState, Path } from 'react-hook-form';

export const isFieldValid = <Values extends FieldValues = FieldValues>(
  state: FormState<Values>,
  fieldName: Path<Values>,
) => {
  if (state.errors[fieldName] && state.touchedFields[fieldName]) {
    return false;
  }

  return true;
};

export const getFieldError = <Values extends FieldValues = FieldValues>(
  state: FormState<Values>,
  fieldName: Path<Values>,
) => {
  if (isFieldValid(state, fieldName)) {
    return undefined;
  }

  if (!state.errors[fieldName] || !state.errors[fieldName]!.message) {
    return `Field ${fieldName} is invalid.`;
  }

  return state.errors[fieldName]!.message!.toString();
};

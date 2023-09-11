import { SetStateAction, Dispatch, FormEvent } from 'react';
import { TableContents } from '../Table/Table';

interface AlertModalProps {
  useContents: Dispatch<SetStateAction<TableContents>>;
}

export default function AlertModal({ useContents }: AlertModalProps) {
  function OnSubmitEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newAlert = (e.target as any).elements[0].value;
    useContents((prev) => ({
      ...prev,
      rowContents: [
        ...prev.rowContents,
        { alert: newAlert, status: '', updates: [] },
      ],
    }));
  }

  return (
    <form data-testid="form" onSubmit={OnSubmitEvent}>
      <label> Add new alert: </label>
      <input type="text" id="alert" name="alert" />
      <button type="submit"> Add </button>
    </form>
  );
}

'use client'

import TextField from "@mui/material/TextField";
import { createTransaction, updateTransaction } from "../lib/transaction-actions";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import { useState } from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert";

export default function TransactionForm({
    id, value, description, date
}: {
    id?: number,
    value?: number,
    description?: string,
    date?: string
}) {
    const [open, setOpen] = useState(false)
    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const shadow = 'shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff]'
    const hover = 'hover:shadow-none hover:inset-shadow-[-4px_4px_8px_#dddddd,4px_-4px_6px_#ffffff] hover:cursor-pointer'
    const linkClass = `flex items-center justify-center w-full h-9 px-2 py-1 rounded-md bg-white/15 backdrop-blur-md ${shadow} ${hover}`
    const updateTransactionWithId = updateTransaction.bind(null, id || 0)
    const createTransactionExtension = async (formData: FormData) => {
        const response = await createTransaction(formData)
        if (response.status === 200) setOpen(true)
    }
    return (
        <form
            className="flex flex-col gap-4 max-w-md w-full"
            action={id ? updateTransactionWithId : createTransactionExtension}
        >
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Successfully created transaction!
                </Alert>
            </Snackbar>
            <FormControl className="flex flex-col">
                <TextField name={`value`}
                           id="Amount"
                           label="Amount"
                           type={`number`}
                           slotProps={{
                                htmlInput: {
                                    step: "0.01",
                                    inputMode: "decimal",
                                    pattern: "[0-9]*[.,]?[0-9]*",
                                    min: "0"
                                }
                           }}
                           defaultValue={value ? Math.abs(value) : ''}
                           variant="outlined"/>
            </FormControl>

            <div className="flex flex-col">
                <TextField name={`description`}
                           id="Description"
                           label="Description"
                           defaultValue={description ?? ""}
                           variant="outlined"/>
            </div>

            <FormControl className="flex flex-col w-full">
                <RadioGroup
                    className={`w-full`}
                    row
                    defaultValue={ value && value > 0 ? 'income' : 'expenditure'}
                    name="type"
                >
                    <FormControlLabel value="income" className="flex-1" control={<Radio />} label="Income" />
                    <FormControlLabel value="expenditure" className="flex-1" control={<Radio />} label="Expenditure" />
                </RadioGroup>
            </FormControl>

            <FormControl className="flex flex-col">
                <TextField name={`date`}
                           id="Date"
                           label="Date"
                           variant="outlined"
                           type="date"
                           defaultValue={date ?? ""}
                           slotProps={{
                               inputLabel: {shrink: true}
                        }}
                />
            </FormControl>

            <button
                type="submit"
                className={linkClass}
            >
                {id ? 'Update' : 'Create'} transaction
            </button>
        </form>
    );
}

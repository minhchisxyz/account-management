'use client'

import {createTransaction, updateTransaction} from "@/app/lib/transaction/actions";
import {Field, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field";
import {Input} from "./ui/input";
import {RadioGroup, RadioGroupItem} from "./ui/radio-group";
import {Label} from "@/components/ui/label";
import {toast} from "sonner";
import {useRouter, useSearchParams} from "next/navigation";
import VoiceRecorder from "@/components/voice-recorder";
import {useEffect, useState} from "react";

export default function TransactionForm({
  id, amount, description, date
}: {
  id?: number,
  amount?: number,
  description?: string,
  date?: string
}) {
  const shadow = 'shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff]'
  const hover = 'hover:shadow-none hover:inset-shadow-[-4px_4px_8px_#dddddd,4px_-4px_6px_#ffffff] hover:cursor-pointer'
  const linkClass = `flex items-center justify-center w-full h-9 px-2 py-1 rounded-md bg-white/15 backdrop-blur-md ${shadow} ${hover}`
  const router = useRouter()
  const params = useSearchParams()
  const [formData, setFormData] = useState({
    amount: Math.abs(amount || 0),
    description: description || '',
    type: amount && amount > 0 ? 'income' : 'expense',
    date: date || ''
  })
  useEffect(() => {
    amount = Number(params.get('amount')) || 0
    description = params.get('description') || ''
    date = params.get('date') || ''
    setFormData(prev => ({
      ...prev,
      amount: Math.abs(amount || 0),
      description: description || '',
      date: date || '',
      type: amount && amount > 0 ? 'income' : 'expense'
    }))
  }, [params]);
  const updateTransactionWithId = async (formData: FormData) => {
    const toastId = toast.loading('Updating transaction...')
    if (!id) {
      toast.error('Failed to update transaction! No transaction id provided!', {id: toastId})
      return
    }
    const path = await updateTransaction(Number(id), formData)
    toast.success('Transaction updated successfully!', {id: toastId})
    router.push(path || '/')
  }
  const createTransactionExtension = async (formData: FormData) => {
    const toastId = toast.loading('Creating transaction...')
    const res = await createTransaction(formData)
    if (res) toast.success('Transaction created successfully!', {id: toastId})
    else toast.error('Failed to create transaction!', {id: toastId})
  }
  return (
    <form
      className="flex flex-col gap-4 max-w-md w-full"
      action={id ? updateTransactionWithId : createTransactionExtension}
    >
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>Translate voice to a transaction</FieldLabel>
            <VoiceRecorder/>
          </Field>
          <Field>
            <FieldLabel htmlFor={`amount`}>Amount</FieldLabel>
            <Input id={`amount`}
                   type={`number`}
                   name={`amount`}
                   value={amount ? Math.abs(amount) : ''}
                   onChange={(e) => setFormData(prev => ({...prev, amount: Math.abs(Number(e.target.value))}))}/>
          </Field>
          <Field>
            <FieldLabel htmlFor={`description`}>Description</FieldLabel>
            <Input id={`description`}
                   type={`text`}
                   name={`description`}
                   value={description ?? ''}
                   onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}/>
          </Field>
          <Field>
            <RadioGroup value={amount && amount > 0 ? 'income' : 'expense'}
                        onValueChange={(val) => setFormData({...formData, type: val})}
                        name="type"
                        className="flex flex-row space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense"/>
                <Label htmlFor="expense">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="Income"/>
                <Label htmlFor="Income">Income</Label>
              </div>
            </RadioGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor={`date`}>Date</FieldLabel>
            <Input id={`date`}
                   type={`date`}
                   name={`date`}
                   value={date ?? ''}
                   onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}/>
          </Field>
        </FieldGroup>
      </FieldSet>

      <button
        type="submit"
        className={linkClass}
      >
        {id ? 'Update' : 'Create'} transaction
      </button>
    </form>
  );
}


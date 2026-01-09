'use client'

import {Field, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {useActionState} from "react";
import {signIn} from "@/app/lib/auth";
import {Button} from "@/components/ui/button";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(signIn, undefined)
  return (
    <div className={`flex flex-col items-center justify-center w-full h-screen gap-5`}>
      <form className={`w-64`} action={action}>
        <FieldSet>
          <FieldGroup>
            {state && (
                <p className={`text-sm text-red-500`}>{ state.error }</p>
            )}
            <Field>
              <FieldLabel htmlFor={`username`}>Username</FieldLabel>
              <Input id={`username`} type={`text`} name={`username`}/>
            </Field>
            <Field>
              <FieldLabel htmlFor={`password`}>Password</FieldLabel>
              <Input id={`password`} type={`password`} name={`password`}/>
            </Field>
            <Button type={`submit`} disabled={isPending}>
              {isPending ? `Signing In...` : `Sign In`}
            </Button>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  )
}
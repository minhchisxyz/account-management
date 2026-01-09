'use server'

import {SignInSchema, SignInState} from "@/app/lib/definitions"
import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {createSession} from "@/app/lib/session";

export async function signIn(state: SignInState, formData: FormData) {
  const validatedFields = SignInSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password')
  })
  if (!validatedFields.success) {
    return {
      error: 'Invalid Input'
    }
  }
  const {username, password} = validatedFields.data
  const user = await prisma.user.findUnique({where: {username}})
  if (!user) {
    return {
      error: `User ${username} not found`
    }
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return {
      error: 'Invalid Credentials'
    }
  }
  await createSession(user)
  redirect('/')
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (refreshToken) await prisma.refreshToken.delete({where: {token: refreshToken}})
  cookieStore.delete('refreshToken')
  redirect('/login')
}
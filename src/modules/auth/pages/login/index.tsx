// import logo from '@assets/images/logoW.webp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '@/hooks'
import Loading from '@/components/shared/loading'

const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es requerida')
})

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  telefono: z.string().min(6, 'Teléfono inválido'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

const LoginPage = (): JSX.Element => {
  const { signWithEmailPassword, registerWithEmailPassword, isMutating, error } = useAuth()

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      telefono: '',
      email: '',
      password: ''
    }
  })

  const onLogin = (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    void signWithEmailPassword(data)
  }

  const onRegister = (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    void registerWithEmailPassword(data)
  }

  return (
    <div className="flex flex-col min-h-screen dark:bg-dark-background-primary">
      <main className="flex-grow flex items-center justify-center py-12">
        <Tabs defaultValue="login" className="w-[420px]">

        <TabsList className="
            flex w-full justify-between p-1 rounded-lg
            bg-gray-200 text-gray-700
            dark:bg-dark-bg-secondary dark:text-dark-text-secondary
          ">
            <TabsTrigger
              value="login"
              className="
                w-full py-2 text-sm font-medium rounded-md
                transition
                dark:text-white
                data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm
                dark:data-[state=active]:bg-dark-bg-primary dark:data-[state=active]:text-dark-text-primary
                hover:bg-gray-100 dark:hover:bg-dark-bg-primary/60
              "
            >
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="
                w-full py-2 text-sm font-medium rounded-md
                transition
                dark:text-white
                data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm
                dark:data-[state=active]:bg-dark-bg-primary dark:data-[state=active]:text-dark-text-primary
                hover:bg-gray-100 dark:hover:bg-dark-bg-primary/60
              "
            >
              Registrarse
            </TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <Card className="rounded-xl shadow-md border border-gray-200 bg-white dark:bg-dark-bg-primary dark:border-dark-bg-secondary">
              <CardHeader>
                <CardTitle className="text-center">Bienvenido</CardTitle>
                <CardDescription className="text-center">
                  Ingrese su correo electrónico para acceder a su cuenta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {error && <div className="text-red-500 text-center">{error}</div>}
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="ejemplo@gmail.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isMutating}>
                      {isMutating ? <Loading /> : 'Iniciar sesión'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REGISTRO */}
          <TabsContent value="register">
            <Card className="rounded-xl shadow-md border border-gray-200 bg-white dark:bg-dark-bg-primary dark:border-dark-bg-secondary">
              <CardHeader>
                <CardTitle className="text-center">Crear Cuenta</CardTitle>
                <CardDescription className="text-center">
                  Regístrese completando los siguientes campos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan Pérez" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="telefono"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+591 70000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="ejemplo@gmail.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isMutating}>
                      {isMutating ? <Loading /> : 'Registrarse'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default LoginPage

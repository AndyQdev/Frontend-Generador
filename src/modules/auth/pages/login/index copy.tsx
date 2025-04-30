import logo from '@assets/images/.webp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
// import { useAuth } from '@/hooks'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
// import { SiteFooter } from '@/components/shared/'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks'
import Loading from '@/components/shared/loading'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
// import Loading from '@/components/shared/loading'

const formSchema = z.object({
  email: z.string({ message: 'El correo electrónico es requerido' })
    .min(2, 'El correo electrónico debe tener al menos 2 caracteres')
    .max(50, 'El correo electrónico debe tener menos de 50 caracteres'),
  password: z.string().min(1, 'La contraseña es requerida')
})
const LoginPage = (): JSX.Element => {
  const { signWithEmailPassword, isMutating, error } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (data: any) => {
    // void signWithEmailPassword({
    //   email: data.email,
    //   password: data.password
    // })
    console.log(data)
  }

  return (
    <div className="flex flex-col bg-background-lila">
      {/* Contenido principal */}
      <main className="flex-grow flex min-h-screen items-center justify-center py-12">
          <div className="grid w-[350px] gap-6">
            <Card className="relative">
              <CardHeader className='relative'>
                <div className='absolute -top-10 left-1/2 transform -translate-x-1/2'>
                  <img src={logo} alt="Logo" className='w-32 h-28'/>
                </div>
                <CardTitle className="text-center mt-10 pt-12">UI Sketch</CardTitle>
                <CardDescription className='text-center'>
                  Ingrese su correo electrónico a continuación para iniciar sesión en su cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {error && <div className="text-red-500 text-center">{error}</div>}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="ejemplo@gmail.com" required {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" required {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <CardDescription className='pt-4'>
                      <a href="">
                        Olvidaste tu contraseña?
                      </a>
                    </CardDescription>
                    <Button type="submit" disabled = {isMutating} className="w-full mt-4">
                      {isMutating ? <Loading /> : 'Iniciar sesión'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
      </main>
      {/* <SiteFooter /> */}
    </div>
  )
}

export default LoginPage

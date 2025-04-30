export function SiteFooter() {
  return (
      <footer className="bg-dark-background py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm">© 2024 Algo Bonito. All rights reserved.</p>
            <nav className="flex flex-col text-sm space-y-2">
              <a href="#">Conócenos</a>
              <a href="#">Nuestras tiendas</a>
              <a href="#">Contacto</a>
            </nav>
          </div>
          <div className="flex flex-col items-center">
            <nav className="flex space-x-4">
              <a href="#"><i className="fab fa-facebook"></i> Facebook</a>
              <a href="#"><i className="fab fa-instagram"></i> Instagram</a>
              <a href="#"><i className="fab fa-pinterest"></i> Pinterest</a>
            </nav>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <nav className="flex flex-col text-sm space-y-2">
              <a href="#">Aviso Legal</a>
              <a href="#">Política de Privacidad</a>
              <a href="#">Términos del servicio</a>
            </nav>
          </div>
        </div>
      </footer>
  )
}

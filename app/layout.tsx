import './globals.css'  // Asegúrate de que esta línea esté presente

export const metadata = {
  title: 'Juego de Memoria',
  description: 'Un juego de memoria divertido para niños',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
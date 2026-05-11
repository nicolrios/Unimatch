import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Definimos las rutas que NO requieren estar logueado
const isPublicRoute = createRouteMatcher([
  '/', 
  '/login(.*)', 
  '/register(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  // Si la ruta no es pública, obligamos a loguearse
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Ignora archivos internos de Next.js y archivos estáticos (imágenes, css, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre corre para rutas de API
    '/(api|trpc)(.*)',
  ],
};
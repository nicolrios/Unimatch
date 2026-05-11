import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Definimos qué rutas son PÚBLICAS (sin necesidad de login)
const isPublicRoute = createRouteMatcher([
  '/', 
  '/login(.*)', 
  '/register(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  // 2. Si la ruta NO es pública, protegemos con login
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Ignora archivos estáticos y Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre se ejecuta para rutas de API
    '/(api|trpc)(.*)',
  ],
};
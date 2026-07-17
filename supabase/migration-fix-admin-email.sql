-- ============================================
-- FIX: el admin no podía guardar cambios (error 42501, RLS)
-- La función is_admin() de la base de datos no incluía el email
-- real del administrador (admin@udvillardelolmo.es), por lo que
-- todas las políticas RLS de escritura le denegaban el acceso.
--
-- Ejecutar en: Supabase Dashboard > SQL Editor > Run
-- Esta lista debe coincidir con NEXT_PUBLIC_ADMIN_EMAILS del .env
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT (auth.jwt() ->> 'email') IN (
    'mpweblabs@gmail.com',
    'admin@udvillardelolmo.es'
  );
$$;

-- Verificación rápida (opcional): logueado como el admin en la web,
-- guardar una noticia debería funcionar inmediatamente.

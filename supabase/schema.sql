-- ============================================
-- SCHEMA SQL PARA C.D. UNIÓN DEPORTIVA VILLAR DEL OLMO
-- Base de datos Supabase
-- ============================================
-- Este archivo es la fuente única de verdad del esquema: tablas, datos
-- semilla, índices, triggers, seguridad a nivel de fila (RLS) y políticas
-- de Storage. Reúne lo que antes estaba repartido en varios archivos de
-- migración (migration-admin-email.sql, migration-cleanup-leaked-policies.sql,
-- migration-storage-policies.sql), ya incorporado aquí.
--
-- Pensado para crear la base de datos desde cero. Si ya tienes una base de
-- datos en marcha, NO ejecutes todo el archivo de golpe (las tablas ya
-- existen y CREATE TABLE fallaría): usa solo la sección que necesites.

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: usuarios (autenticación y roles)
-- ============================================
-- Nota: el control de quién es administrador YA NO se hace mirando
-- usuarios.rol, sino por email (ver función is_admin() más abajo). Esta
-- tabla se mantiene porque "noticias.autor_id" todavía puede referenciarla.
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255),
  telefono VARCHAR(20),
  avatar_url TEXT,
  rol VARCHAR(50) DEFAULT 'usuario' CHECK (rol IN ('admin', 'editor', 'usuario')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: socios
-- ============================================
CREATE TABLE public.socios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  numero_socio VARCHAR(10) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  dni VARCHAR(20),
  fecha_nacimiento DATE,
  direccion TEXT,
  codigo_postal VARCHAR(10),
  localidad VARCHAR(100),
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Adulto', 'Juvenil', 'Infantil', 'Veterano', 'Honorario')),
  estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('activo', 'pendiente', 'inactivo', 'baja')),
  fecha_alta DATE DEFAULT CURRENT_DATE,
  fecha_baja DATE,
  cuota_anual DECIMAL(10, 2),
  forma_pago VARCHAR(50) CHECK (forma_pago IN ('transferencia', 'domiciliacion', 'efectivo')),
  iban VARCHAR(34),
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: categorias_equipo
-- ============================================
CREATE TABLE public.categorias_equipo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  orden INT DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar categorías por defecto
INSERT INTO public.categorias_equipo (nombre, orden) VALUES
  ('Prebenjamín', 1),
  ('Benjamín', 2),
  ('Alevín', 3),
  ('Infantil', 4),
  ('Cadete', 5),
  ('Juvenil', 6),
  ('Femenino', 7),
  ('Sénior', 8),
  ('Veteranos', 9);

-- ============================================
-- TABLA: equipos
-- ============================================
CREATE TABLE public.equipos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categoria_id UUID NOT NULL REFERENCES public.categorias_equipo(id) ON DELETE RESTRICT,
  nombre VARCHAR(255) NOT NULL,
  temporada VARCHAR(20) NOT NULL, -- Ej: "2026-27"
  descripcion TEXT,
  imagen_url TEXT,
  entrenador VARCHAR(255),
  delegado VARCHAR(255),
  grupo_liga VARCHAR(100),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: jugadores
-- ============================================
CREATE TABLE public.jugadores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  socio_id UUID REFERENCES public.socios(id) ON DELETE SET NULL,
  equipo_id UUID REFERENCES public.equipos(id) ON DELETE SET NULL,
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  fecha_nacimiento DATE,
  dorsal INT,
  posicion VARCHAR(50) CHECK (posicion IN ('Portero', 'Defensa', 'Centrocampista', 'Delantero')),
  foto_url TEXT,
  ficha_federativa VARCHAR(50),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: categorias_noticia
-- ============================================
CREATE TABLE public.categorias_noticia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7), -- Hex color
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar categorías por defecto
INSERT INTO public.categorias_noticia (nombre, slug, color) VALUES
  ('Primer Equipo', 'primer-equipo', '#2A5D3C'),
  ('Cantera', 'cantera', '#4A7C59'),
  ('Club', 'club', '#1A1A1A'),
  ('Femenino', 'femenino', '#8B4513'),
  ('Eventos', 'eventos', '#DAA520');

-- ============================================
-- TABLA: noticias
-- ============================================
CREATE TABLE public.noticias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categoria_id UUID REFERENCES public.categorias_noticia(id) ON DELETE SET NULL,
  autor_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  titulo VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  extracto TEXT,
  contenido TEXT NOT NULL,
  imagen_principal TEXT,
  galeria_imagenes TEXT[], -- Array de URLs
  destacada BOOLEAN DEFAULT false,
  publicada BOOLEAN DEFAULT false,
  fecha_publicacion TIMESTAMPTZ,
  vistas INT DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: contacto_mensajes
-- ============================================
CREATE TABLE public.contacto_mensajes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  asunto VARCHAR(500) NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT false,
  respondido BOOLEAN DEFAULT false,
  fecha_respuesta TIMESTAMPTZ,
  notas_internas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: eventos
-- ============================================
CREATE TABLE public.eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  descripcion TEXT,
  descripcion_larga TEXT,
  imagen_url TEXT,
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ,
  lugar VARCHAR(255),
  precio DECIMAL(10, 2),
  capacidad INT,
  inscripcion_requerida BOOLEAN DEFAULT false,
  url_inscripcion TEXT,
  publicado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: galeria (fotos y videos del club)
-- ============================================
CREATE TABLE public.galeria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  imagen_url TEXT NOT NULL,
  miniatura_url TEXT,
  tipo VARCHAR(50) DEFAULT 'imagen' CHECK (tipo IN ('imagen', 'video')),
  album VARCHAR(100),
  fecha DATE,
  destacada BOOLEAN DEFAULT false,
  publicada BOOLEAN DEFAULT true,
  orden INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: configuracion_web
-- ============================================
CREATE TABLE public.configuracion_web (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT,
  tipo VARCHAR(50) DEFAULT 'text' CHECK (tipo IN ('text', 'number', 'boolean', 'json', 'html')),
  descripcion TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar configuración por defecto
INSERT INTO public.configuracion_web (clave, valor, tipo, descripcion) VALUES
  ('club_nombre', 'C.D. Unión Deportiva Villar del Olmo', 'text', 'Nombre completo del club'),
  ('club_fundacion', '1970', 'text', 'Año de fundación'),
  ('club_email', 'info@udvillardelolmo.es', 'text', 'Email de contacto'),
  ('club_telefono', '+34 600 000 000', 'text', 'Teléfono de contacto'),
  ('club_direccion', 'Campo Municipal de Fútbol, 28511 Villar del Olmo, Madrid', 'text', 'Dirección'),
  ('redes_instagram', '', 'text', 'URL Instagram'),
  ('redes_facebook', '', 'text', 'URL Facebook'),
  ('redes_twitter', '', 'text', 'URL Twitter/X'),
  ('redes_youtube', '', 'text', 'URL YouTube');

-- Contenido editable de la home (hero, "sobre nosotros", CTA) desde
-- /admin/contenido. Va en su propia sentencia con ON CONFLICT DO NOTHING
-- para poder ejecutarse suelta sobre una base de datos ya existente sin
-- pisar contenido que el cliente ya haya personalizado.
INSERT INTO public.configuracion_web (clave, valor, tipo, descripcion) VALUES
  ('home_hero', '{"tituloLinea1":"Pasión","tituloLinea2":"por el","tituloLinea3":"Fútbol","descripcion":"Décadas formando futbolistas y personas. El club de referencia del fútbol base en la comarca.","imagenFondo":"/images/noticias-bg.jpg","ctaPrimarioTexto":"CONOCE EL CLUB","ctaPrimarioUrl":"/historia","ctaSecundarioTexto":"ÚNETE AL CLUB","ctaSecundarioUrl":"/socios"}', 'json', 'Contenido de la sección Hero de la home'),
  ('home_about', '{"badge":"Sobre nosotros","titulo":"Pasión por el Fútbol","parrafo1":"Un club de pueblo, una cantera con valores y una forma de entender el fútbol desde el compromiso, el esfuerzo y el sentimiento de equipo.","parrafo2":"El C.D. Unión Deportiva Villar del Olmo forma parte de la vida deportiva del municipio desde hace décadas. Un club cercano, construido alrededor del fútbol base, el esfuerzo diario y el compromiso de familias, jugadores y entrenadores.","parrafo3":"Más que competir, el objetivo siempre ha sido formar. Formar futbolistas, pero sobre todo personas que entiendan el valor del compañerismo, el respeto y la pertenencia a un equipo.","enlaceTexto":"Conoce nuestra historia","enlaceUrl":"/historia"}', 'json', 'Contenido de la sección Sobre nosotros de la home'),
  ('home_cta', '{"badge":"Inscripciones abiertas","tituloLinea1":"ÚNETE A LA","tituloLinea2":"FAMILIA","descripcion":"Inscripciones abiertas para todas las categorías. Ven a conocernos y forma parte de nuestro proyecto deportivo.","botonPrimarioTexto":"HAZTE SOCIO","botonPrimarioUrl":"/socios","botonSecundarioTexto":"CONTACTAR","botonSecundarioUrl":"/contacto"}', 'json', 'Contenido de la sección Únete (CTA) de la home'),
  ('pagina_historia', '{"tituloLinea1":"NUESTRA","tituloLinea2":"HISTORIA","subtitulo":"Décadas de pasión, esfuerzo y fútbol en el corazón de Madrid.","clubBadge":"Historia del Club","clubTitulo":"Décadas formando futbolistas","clubParrafo1":"El C.D. Unión Deportiva Villar del Olmo nació con la idea de acercar el fútbol a los jóvenes del municipio y crear un espacio donde competir, aprender y crecer dentro de un ambiente de equipo.","clubParrafo2":"Con el paso de los años, el club se ha convertido en un punto de encuentro para muchas familias de Villar del Olmo y alrededores. Por sus equipos han pasado generaciones de jugadores que han defendido sus colores con ilusión, esfuerzo y respeto por este deporte.","clubParrafo3":"Hoy, el club mantiene esa misma esencia: seguir impulsando el fútbol base, cuidar la cantera y representar al pueblo dentro y fuera del campo.","puebloBadge":"Historia del Pueblo","puebloTitulo":"Villar del Olmo","puebloParrafo1":"Villar del Olmo es un municipio del este de la Comunidad de Madrid, situado en un entorno natural que conserva el carácter tranquilo y cercano de los pueblos de la comarca. Su historia está ligada a la repoblación medieval y al desarrollo de pequeñas comunidades rurales que fueron dando forma a la identidad del municipio.","puebloParrafo2":"Esa identidad sigue muy presente hoy: un pueblo donde la vida social, las familias y las actividades deportivas tienen un papel importante. En ese contexto, el fútbol se ha convertido en una forma de unión entre generaciones, vecinos y jugadores que comparten algo más que un escudo.","puebloParrafo3":"El C.D. Unión Deportiva Villar del Olmo representa esa conexión entre pueblo y deporte: competir con orgullo, formar desde la base y mantener vivo el sentimiento de pertenencia."}', 'json', 'Contenido de la página Historia'),
  ('pagina_contacto', '{"tituloLinea1":"PONTE EN","tituloLinea2":"CONTACTO","subtitulo":"Estamos aquí para resolver cualquier duda sobre inscripciones, equipos o actividades del club."}', 'json', 'Contenido de la página Contacto'),
  ('pagina_socios', '{"heroBadge":"Hazte Socio","heroTituloLinea1":"Únete a la","heroTituloLinea2":"Familia Verde","heroDescripcion":"Más que un club, una comunidad. Tu apoyo hace posible que sigamos formando deportistas y creando recuerdos.","heroBotonTexto":"Quiero ser socio","heroBotonUrl":"/contacto","miembroTitulo":"¿Ya eres socio?","miembroDescripcion":"Accede a tu área personal para gestionar tu membresía, ver tu historial y mucho más.","miembroBotonTexto":"Acceder a mi cuenta","miembroBotonUrl":"/socios/login"}', 'json', 'Contenido de la página Hazte Socio'),
  ('pagina_instalaciones', '{"tituloLinea1":"NUESTRAS","tituloLinea2":"INSTALACIONES","subtitulo":"Instalaciones modernas al servicio del fútbol base y de toda la comunidad de Villar del Olmo."}', 'json', 'Cabecera de la página Instalaciones'),
  ('pagina_equipos', '{"tituloLinea1":"NUESTROS","tituloLinea2":"EQUIPOS","subtitulo":"Equipos federados que representan los colores del club cada fin de semana."}', 'json', 'Cabecera de la página Equipos'),
  ('pagina_historia_timeline', '[{"anio":"1970","evento":"Fundación del club por un grupo de vecinos apasionados"},{"anio":"1985","evento":"Inauguración del campo municipal"},{"anio":"2000","evento":"Creación de la escuela de fútbol base"},{"anio":"2015","evento":"Renovación completa de instalaciones"},{"anio":"2020","evento":"Celebración del 50 aniversario"}]', 'json', 'Línea de tiempo de la página Historia'),
  ('pagina_historia_valores', '[{"numero":"01","titulo":"FORMACIÓN","descripcion":"Nuestro principal objetivo es formar futbolistas y personas con valores."},{"numero":"02","titulo":"RESPETO","descripcion":"El respeto a compañeros, rivales y árbitros es fundamental en nuestro club."},{"numero":"03","titulo":"COMUNIDAD","descripcion":"Somos parte activa del tejido social de Villar del Olmo."},{"numero":"04","titulo":"PASIÓN","descripcion":"El amor por el fútbol y por nuestros colores nos define."}]', 'json', 'Valores del club (página Historia)'),
  ('pagina_instalaciones_lista', '[{"nombre":"Vestuarios","descripcion":"Vestuarios completamente renovados con todas las comodidades para los jugadores y cuerpo técnico del club.","imagen":"/images/instalacion-vestuarios.jpg"},{"nombre":"Campo de Juego","descripcion":"Césped artificial de última generación homologado para competición federada, con medidas reglamentarias.","imagen":"/images/instalacion-campo.jpg"},{"nombre":"Gradas","descripcion":"Gradas con capacidad para los aficionados que nos acompañan en los partidos de local.","imagen":"/images/instalacion-gradas.jpg"}]', 'json', 'Lista de instalaciones')
ON CONFLICT (clave) DO NOTHING;

-- ============================================
-- ÍNDICES
-- ============================================

-- Noticias
CREATE INDEX idx_noticias_slug ON public.noticias(slug);
CREATE INDEX idx_noticias_publicada ON public.noticias(publicada, fecha_publicacion DESC);
CREATE INDEX idx_noticias_categoria ON public.noticias(categoria_id);

-- Socios
CREATE INDEX idx_socios_numero ON public.socios(numero_socio);
CREATE INDEX idx_socios_estado ON public.socios(estado);
CREATE INDEX idx_socios_tipo ON public.socios(tipo);

-- Equipos
CREATE INDEX idx_equipos_temporada ON public.equipos(temporada);
CREATE INDEX idx_equipos_categoria ON public.equipos(categoria_id);

-- Jugadores
CREATE INDEX idx_jugadores_equipo ON public.jugadores(equipo_id);

-- Contacto
CREATE INDEX idx_contacto_leido ON public.contacto_mensajes(leido, created_at DESC);

-- ============================================
-- TRIGGERS para updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_socios_updated_at BEFORE UPDATE ON public.socios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipos_updated_at BEFORE UPDATE ON public.equipos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jugadores_updated_at BEFORE UPDATE ON public.jugadores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_noticias_updated_at BEFORE UPDATE ON public.noticias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON public.eventos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Función que comprueba si el usuario autenticado es administrador,
-- mirando su email contra una lista fija. Para cambiar quién es admin,
-- edita esta lista Y la variable NEXT_PUBLIC_ADMIN_EMAILS del .env
-- (deben coincidir).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT (auth.jwt() ->> 'email') IN (
    'mpweblabs@gmail.com',
    'admin@villardelolmo.es'
  );
$$;

-- Habilitar RLS en todas las tablas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_equipo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_noticia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacto_mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion_web ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeria ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de lectura (contenido visible para todos, con filtro)
CREATE POLICY "Noticias publicadas son públicas" ON public.noticias FOR SELECT USING (publicada = true);
CREATE POLICY "Equipos activos son públicos" ON public.equipos FOR SELECT USING (activo = true);
CREATE POLICY "Categorías de equipo son públicas" ON public.categorias_equipo FOR SELECT USING (activo = true);
CREATE POLICY "Categorías de noticia son públicas" ON public.categorias_noticia FOR SELECT USING (true);
CREATE POLICY "Jugadores activos son públicos" ON public.jugadores FOR SELECT USING (activo = true);
CREATE POLICY "Configuración web es pública" ON public.configuracion_web FOR SELECT USING (true);
CREATE POLICY "Galería publicada es pública" ON public.galeria FOR SELECT USING (publicada = true);

-- Políticas de inserción pública (formularios del sitio web)
CREATE POLICY "Cualquiera puede enviar mensaje de contacto" ON public.contacto_mensajes FOR INSERT WITH CHECK (true);

-- Un socio puede ver y editar SU PROPIA ficha (además del acceso total de admin, más abajo)
CREATE POLICY "Un socio ve su propia ficha" ON public.socios FOR SELECT USING (
  email = (auth.jwt() ->> 'email')
);
CREATE POLICY "Un socio edita su propia ficha" ON public.socios FOR UPDATE USING (
  email = (auth.jwt() ->> 'email')
);

-- Los eventos son contenido exclusivo de socios: nadie más puede verlos, ni
-- siquiera con la URL directa, solo quien tiene sesión y figura en la tabla
-- socios (los admins tienen acceso total vía la política de más abajo).
CREATE POLICY "Solo los socios ven los eventos publicados" ON public.eventos FOR SELECT USING (
  publicado = true
  AND EXISTS (
    SELECT 1 FROM public.socios s WHERE s.email = (auth.jwt() ->> 'email')
  )
);

-- Políticas de admin: acceso total mediante is_admin() (email)
CREATE POLICY "Admins tienen acceso total a usuarios" ON public.usuarios FOR ALL USING (public.is_admin());
CREATE POLICY "Admins tienen acceso total a socios" ON public.socios FOR ALL USING (public.is_admin());
CREATE POLICY "Admins tienen acceso total a noticias" ON public.noticias FOR ALL USING (public.is_admin());
CREATE POLICY "Admins tienen acceso total a contacto" ON public.contacto_mensajes FOR ALL USING (public.is_admin());
CREATE POLICY "Admins pueden gestionar equipos" ON public.equipos FOR ALL USING (public.is_admin());
CREATE POLICY "Admins pueden gestionar jugadores" ON public.jugadores FOR ALL USING (public.is_admin());
CREATE POLICY "Admins pueden gestionar eventos" ON public.eventos FOR ALL USING (public.is_admin());
CREATE POLICY "Admins pueden gestionar categorías" ON public.categorias_equipo FOR ALL USING (public.is_admin());
CREATE POLICY "Admins pueden gestionar categorías noticia" ON public.categorias_noticia FOR ALL USING (public.is_admin());
CREATE POLICY "Admins pueden gestionar configuración" ON public.configuracion_web FOR ALL USING (public.is_admin());
CREATE POLICY "Admins pueden gestionar galería" ON public.galeria FOR ALL USING (public.is_admin());

-- ============================================
-- VISTAS útiles
-- ============================================

-- Vista de noticias con categoría
CREATE VIEW public.v_noticias_completas AS
SELECT
  n.*,
  c.nombre as categoria_nombre,
  c.slug as categoria_slug,
  c.color as categoria_color,
  u.nombre as autor_nombre
FROM public.noticias n
LEFT JOIN public.categorias_noticia c ON n.categoria_id = c.id
LEFT JOIN public.usuarios u ON n.autor_id = u.id;

-- Vista de equipos con categoría
CREATE VIEW public.v_equipos_completos AS
SELECT
  e.*,
  c.nombre as categoria_nombre,
  (SELECT COUNT(*) FROM public.jugadores j WHERE j.equipo_id = e.id AND j.activo = true) as num_jugadores
FROM public.equipos e
LEFT JOIN public.categorias_equipo c ON e.categoria_id = c.id;

-- ============================================
-- STORAGE: bucket "galeria" (fotos subidas desde el admin)
-- ============================================
-- Bucket público de solo imágenes (sin SVG, para evitar XSS vía SVG con
-- <script> incrustado). Solo admins pueden subir/modificar/borrar; la
-- lectura es pública para que las fotos se vean en la web.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'galeria',
  'galeria',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

CREATE POLICY "Lectura pública galeria bucket" ON storage.objects FOR SELECT USING (
  bucket_id = 'galeria'
);

CREATE POLICY "Admins suben a galeria bucket" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'galeria' AND public.is_admin()
);

CREATE POLICY "Admins modifican galeria bucket" ON storage.objects FOR UPDATE USING (
  bucket_id = 'galeria' AND public.is_admin()
);

CREATE POLICY "Admins borran de galeria bucket" ON storage.objects FOR DELETE USING (
  bucket_id = 'galeria' AND public.is_admin()
);

-- ============================================
-- FIN DEL SCHEMA
-- ============================================

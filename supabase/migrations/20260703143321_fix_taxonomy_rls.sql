-- Permitir leitura para usuários autenticados
CREATE POLICY "authenticated_read_courses"
ON public.courses
FOR SELECT
TO authenticated
USING (true);

-- Permitir que administradores gerenciem cursos
CREATE POLICY "admin_manage_courses"
ON public.courses
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Positions
CREATE POLICY "authenticated_read_positions"
ON public.positions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_positions"
ON public.positions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Boards
CREATE POLICY "authenticated_read_boards"
ON public.boards
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_boards"
ON public.boards
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Exams
CREATE POLICY "authenticated_read_exams"
ON public.exams
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_exams"
ON public.exams
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Subjects
CREATE POLICY "authenticated_read_subjects"
ON public.subjects
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_subjects"
ON public.subjects
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Topics
CREATE POLICY "authenticated_read_topics"
ON public.topics
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_topics"
ON public.topics
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
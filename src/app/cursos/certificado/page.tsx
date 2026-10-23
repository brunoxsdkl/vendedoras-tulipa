import Certificado from "./certificado";

export default async function CertificadoPage({
  searchParams,
}: {
  searchParams: Promise<{ curso?: string; aluno?: string }>;
}) {
  const { curso, aluno } = await searchParams;
  return <Certificado cursoId={curso || ""} alunoId={aluno || ""} />;
}

import PdfToWord from '@/src/tools/pdf-tools/pdf-to-word/PdfToWord'

export const metadata = {
  title: 'PDF to Word | AI Student Toolkit',
  description: 'Convert your PDF documents to editable Word format in the browser.',
}

export default function PdfToWordRoute() {
  return <PdfToWord />
}

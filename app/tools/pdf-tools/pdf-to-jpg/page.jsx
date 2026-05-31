import PdfToJpg from '@/src/tools/pdf-tools/pdf-to-jpg/PdfToJpg'

export const metadata = {
  title: 'PDF to JPG | AI Student Toolkit',
  description: 'Convert PDF pages to high-quality JPG images.',
}

export default function PdfToJpgRoute() {
  return <PdfToJpg />
}

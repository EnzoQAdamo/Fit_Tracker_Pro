import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Student, Measurement } from '../types';

export const generateStudentPDF = async (
  student: Student, 
  measurement: Measurement,
  gender: 'male' | 'female' = 'male',
  selectedCharts: string[] = [],
  measurements: Measurement[] = []
): Promise<void> => {
  try {
    // Get the PDF content element
    const element = document.getElementById('pdf-content');
    if (!element) {
      throw new Error('PDF content element not found');
    }

    // Configure html2canvas options for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Calculate PDF dimensions (A4 format)
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename with student name and date
    const fileName = `${student.name.replace(/\s+/g, '_')}_medicoes_${new Date().toISOString().split('T')[0]}.pdf`;

    // Save the PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Falha ao gerar o PDF. Tente novamente.');
  }
};
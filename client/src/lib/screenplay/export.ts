/**
 * Screenplay Export Utilities
 * Hollywood Standard PDF Export
 */

import { ScriptElement, ScriptMetadata, SCREENPLAY_FORMAT } from '@/lib/types/script';
import jsPDF from 'jspdf';

/**
 * Export screenplay to PDF (Hollywood Standard)
 *
 * Standard margins:
 * - Left: 1.5"
 * - Right: 1"
 * - Top: 1"
 * - Bottom: 0.5"
 *
 * Font: Courier 12pt
 */
export async function exportToPDF(
  elements: ScriptElement[],
  metadata: ScriptMetadata
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter', // 8.5" x 11"
  });

  // Use Courier font (built-in)
  pdf.setFont('courier');
  pdf.setFontSize(12);

  const pageWidth = 8.5;
  const pageHeight = 11;
  const leftMargin = 1.5;
  const rightMargin = 1;
  const topMargin = 1;
  const bottomMargin = 0.5;
  const lineHeight = 12 / 72; // 12pt in inches

  let currentY = topMargin;
  let currentPage = 1;

  // Helper: Add new page
  const addNewPage = () => {
    pdf.addPage();
    currentPage++;
    currentY = topMargin;

    // Page number (top right)
    pdf.setFontSize(12);
    pdf.text(`${currentPage}.`, pageWidth - rightMargin, topMargin - 0.25, {
      align: 'right',
    });
  };

  // Helper: Check if need new page
  const checkPageBreak = (linesNeeded: number = 1) => {
    const spaceNeeded = linesNeeded * lineHeight;
    if (currentY + spaceNeeded > pageHeight - bottomMargin) {
      addNewPage();
    }
  };

  // Title page
  pdf.setFontSize(12);
  const titleY = pageHeight / 2 - 1;

  pdf.text(metadata.title.toUpperCase(), pageWidth / 2, titleY, {
    align: 'center',
  });

  if (metadata.subtitle) {
    pdf.text(metadata.subtitle, pageWidth / 2, titleY + 0.3, {
      align: 'center',
    });
  }

  pdf.text(`by`, pageWidth / 2, titleY + 0.8, {
    align: 'center',
  });

  pdf.text(metadata.author, pageWidth / 2, titleY + 1.1, {
    align: 'center',
  });

  if (metadata.basedOn) {
    pdf.text(metadata.basedOn, pageWidth / 2, titleY + 1.6, {
      align: 'center',
      maxWidth: 4,
    });
  }

  // Contact info (bottom left)
  if (metadata.contact) {
    pdf.setFontSize(10);
    pdf.text(metadata.contact, leftMargin, pageHeight - 1, {
      maxWidth: 3,
    });
  }

  // Draft info (bottom right)
  pdf.setFontSize(10);
  const draftDate = new Date(metadata.draftDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  pdf.text(
    `Draft ${metadata.draftNumber}\n${draftDate}`,
    pageWidth - rightMargin,
    pageHeight - 1,
    { align: 'right' }
  );

  // Start script content on new page
  addNewPage();
  pdf.setFontSize(12);

  // Render each element
  for (const element of elements) {
    const format = SCREENPLAY_FORMAT[element.type];
    const content = format.uppercase ? element.content.toUpperCase() : element.content;

    if (!content.trim()) continue; // Skip empty elements

    // Calculate position
    const indentInches = format.indent * (1 / 10); // 1 char = 0.1 inch
    const x = leftMargin + indentInches;
    const maxWidth = format.width * (1 / 10); // width in inches

    // Check for page break
    const lines = pdf.splitTextToSize(content, maxWidth);
    checkPageBreak(lines.length);

    // Add element
    if (format.alignRight) {
      // Transitions aligned right
      pdf.text(content, pageWidth - rightMargin, currentY, {
        align: 'right',
      });
      currentY += lineHeight;
    } else if (format.italic) {
      // Parentheticals (italic simulation with slashes)
      pdf.text(`${content}`, x, currentY, {
        maxWidth,
      });
      currentY += lines.length * lineHeight;
    } else {
      // Regular elements
      pdf.text(content, x, currentY, {
        maxWidth,
      });
      currentY += lines.length * lineHeight;
    }

    // Add spacing after element
    if (element.type === 'scene_heading') {
      currentY += lineHeight * 0.5;
    } else if (element.type === 'character') {
      // No extra space before dialogue
    } else if (element.type === 'dialogue') {
      currentY += lineHeight * 0.5;
    } else if (element.type === 'transition') {
      currentY += lineHeight;
    } else {
      currentY += lineHeight * 0.3;
    }
  }

  // Save PDF
  const fileName = `${metadata.title.replace(/\s+/g, '_')}_Draft${metadata.draftNumber}.pdf`;
  pdf.save(fileName);
}

/**
 * Export to Fountain format (.fountain)
 * Markdown-based screenplay format
 * https://fountain.io/syntax
 */
export function exportToFountain(
  elements: ScriptElement[],
  metadata: ScriptMetadata
): string {
  let fountain = '';

  // Title page
  fountain += `Title: ${metadata.title}\n`;
  if (metadata.subtitle) fountain += `Subtitle: ${metadata.subtitle}\n`;
  fountain += `Author: ${metadata.author}\n`;
  if (metadata.basedOn) fountain += `Based on: ${metadata.basedOn}\n`;
  if (metadata.contact) fountain += `Contact: ${metadata.contact}\n`;
  fountain += `Draft: ${metadata.draftNumber}\n`;
  fountain += `Date: ${new Date(metadata.draftDate).toLocaleDateString()}\n`;
  if (metadata.copyright) fountain += `Copyright: ${metadata.copyright}\n`;
  fountain += '\n';

  // Script content
  for (const element of elements) {
    const content = element.content.trim();
    if (!content) continue;

    switch (element.type) {
      case 'scene_heading':
        fountain += `${content}\n\n`;
        break;

      case 'action':
        fountain += `${content}\n\n`;
        break;

      case 'character':
        fountain += `${content.toUpperCase()}\n`;
        break;

      case 'dialogue':
        fountain += `${content}\n\n`;
        break;

      case 'parenthetical':
        fountain += `${content}\n`;
        break;

      case 'transition':
        fountain += `> ${content}\n\n`;
        break;

      case 'shot':
        fountain += `!${content}\n\n`;
        break;

      case 'note':
        fountain += `[[${content}]]\n\n`;
        break;
    }
  }

  return fountain;
}

/**
 * Download Fountain file
 */
export function downloadFountain(
  elements: ScriptElement[],
  metadata: ScriptMetadata
): void {
  const content = exportToFountain(elements, metadata);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${metadata.title.replace(/\s+/g, '_')}_Draft${metadata.draftNumber}.fountain`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Calculate screenplay statistics
 */
export function calculateStats(elements: ScriptElement[]) {
  const sceneCount = elements.filter((el) => el.type === 'scene_heading').length;
  const dialogueCount = elements.filter((el) => el.type === 'dialogue').length;

  // Approximate page count (60 lines per page, ~1 page = 1 minute)
  const totalLines = elements.reduce((count, el) => {
    const content = el.content || '';
    const lines = Math.max(1, Math.ceil(content.length / 60));
    return count + lines + 1; // +1 for spacing
  }, 0);

  const pageCount = Math.ceil(totalLines / 60);
  const estimatedTime = pageCount; // 1 page ≈ 1 minute

  // Extract characters
  const characters = new Set<string>();
  elements.forEach((el) => {
    if (el.type === 'character') {
      const name = el.content.toUpperCase().split('(')[0].trim();
      if (name) characters.add(name);
    }
  });

  // Extract locations
  const locations = new Set<string>();
  elements.forEach((el) => {
    if (el.type === 'scene_heading') {
      const location = el.content.toUpperCase();
      if (location) locations.add(location);
    }
  });

  return {
    pageCount,
    estimatedTime,
    sceneCount,
    characterCount: characters.size,
    locationCount: locations.size,
    dialogueCount,
    characters: Array.from(characters),
    locations: Array.from(locations),
  };
}

export const formatChatResponse = (text) => {
  if (!text) return "";

  let formatted = text;

  // Remove all asterisks for bold/italic
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "$1"); // **bold** → bold
  formatted = formatted.replace(/\*(.*?)\*/g, "$1"); // *italic* → italic

  // Remove other markdown
  formatted = formatted.replace(/_(.*?)_/g, "$1"); // _italic_ → italic
  formatted = formatted.replace(/`(.*?)`/g, "$1"); // `code` → code

  // Clean up excessive line breaks but keep paragraphs
  formatted = formatted.replace(/\n{3,}/g, "\n\n");

  // Ensure proper spacing
  formatted = formatted.replace(/\s+/g, " ");
  formatted = formatted.replace(/(•|\-)\s*/g, "\n• ");

  // Trim and return
  return formatted.trim();
};

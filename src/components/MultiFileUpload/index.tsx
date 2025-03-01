import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Paper, IconButton, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { Theme } from '@mui/material/styles';
import Image from 'next/image';

interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  maxSize?: number; // in bytes
  accept?: string; // Add accept prop for file types
  multiple?: boolean; // Allow multiple file selection
  files?: File[]; // Current files
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledPaper = styled(Paper)(({ theme }: { theme: Theme }) => ({
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.default,
  boxShadow: 'none',
  transition: theme.transitions.create(['background-color', 'box-shadow']),
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100px',
  borderRadius: theme.shape.borderRadius,
  objectFit: 'cover',
  overflow: 'hidden',
  position: 'relative',
}));

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export default function MultiFileUpload({
  onFilesSelected,
  maxSize = DEFAULT_MAX_SIZE,
  accept,
  multiple = false,
  files = [],
}: FileUploadProps): React.JSX.Element {
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>(files);
  const [previews, setPreviews] = React.useState<string[]>([]);

  // Update previews when files change
  React.useEffect(() => {
    // Revoke old preview URLs to avoid memory leaks
    previews.forEach(url => URL.revokeObjectURL(url));

    // Create new preview URLs
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Cleanup function
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (newFiles: File[]): void => {
    if (newFiles.length === 0) return;

    // Filter invalid files
    const validFiles = newFiles.filter(file => {
      // Check file size
      if (file.size > maxSize) {
        const maxSizeInMB = maxSize / (1024 * 1024);
        alert(`File "${file.name}" is too large. Maximum file size is ${maxSizeInMB}MB.`);
        return false;
      }

      // Check file type
      if (accept && !accept.split(',').some(type => file.type.match(type.trim()))) {
        alert(`File "${file.name}" type not accepted.`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    let updatedFiles: File[];

    if (multiple) {
      // Add new files to existing files
      updatedFiles = [...selectedFiles, ...validFiles];
    } else {
      // Replace existing file with new file
      updatedFiles = [validFiles[0]];
    }

    setSelectedFiles(updatedFiles);
    onFilesSelected?.(updatedFiles);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  const handleRemoveFile = (index: number, e?: React.MouseEvent): void => {
    if (e) e.stopPropagation();

    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);

    setSelectedFiles(updatedFiles);
    onFilesSelected?.(updatedFiles);
  };

  return (
    <Box>
      {/* Image previews */}
      {selectedFiles.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {selectedFiles.map((file, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Box sx={{ position: 'relative' }}>
                <ImagePreview>
                  <Image
                    src={previews[index]}
                    alt={`Preview ${index}`}
                    fill
                    sizes='(max-width: 768px) 100vw, 33vw'
                    style={{ objectFit: 'cover' }}
                    priority={index < 4} // Prioritize loading the first few images
                  />
                </ImagePreview>
                <IconButton
                  size='small'
                  sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255,0,0,0.7)' },
                  }}
                  onClick={e => handleRemoveFile(index, e)}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
                <Typography variant='caption' sx={{ display: 'block', mt: 0.5, textAlign: 'center' }}>
                  {file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload area */}
      <StyledPaper
        component='label'
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        elevation={isDragging ? 3 : 1}
        sx={{
          //   p: 3,
          //   borderStyle: 'dashed',
          //   borderWidth: 2,
          borderColor: theme =>
            isDragging
              ? theme.palette.primary.main
              : selectedFiles.length > 0
              ? theme.palette.success.light
              : theme.palette.grey[300],
          borderRadius: 2,
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <CloudUploadIcon color='primary' sx={{ fontSize: 40 }} />
          <Typography variant='body1'>
            {multiple ? 'Drag your images or click to browse' : 'Drag your image or click to browse'}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            Max {maxSize / (1024 * 1024)}MB {multiple ? 'per file' : 'file'} |{' '}
            {accept?.replace(/image\//g, '').replace(/,/g, ', ')} formats
          </Typography>
          <VisuallyHiddenInput type='file' onChange={handleFileInput} accept={accept} multiple={multiple} />
        </Box>
      </StyledPaper>
    </Box>
  );
}

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { UploadCloud, FileType, AlertCircle, User } from 'lucide-react';
import { mockUploadResume } from '../services/mockBackend';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const validateFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted for resume.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('File size must be less than 10MB.');
      return false;
    }
    setError(null);
    return true;
  };

  const validatePhoto = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPEG, PNG, or WebP images are accepted for photo.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('Photo size must be less than 5MB.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedPhoto = e.target.files[0];
      if (validatePhoto(selectedPhoto)) {
        setPhotoFile(selectedPhoto);

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedPhoto);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Upload file (Mocked)
      await mockUploadResume(file);

      // 2. Generate a resume ID
      const tempResumeId = `resume_${Date.now()}`;

      // 3. Store the PDF file in sessionStorage
      const pdfReader = new FileReader();
      pdfReader.onload = () => {
        sessionStorage.setItem(`file_${tempResumeId}`, pdfReader.result as string);
        sessionStorage.setItem(`fileName_${tempResumeId}`, file.name);
        sessionStorage.setItem(`fileType_${tempResumeId}`, file.type);

        // 4. Store photo if uploaded
        if (photoFile && photoPreview) {
          sessionStorage.setItem(`photo_${tempResumeId}`, photoPreview);
        }

        // 5. Navigate to processing page
        navigate(`/processing?resumeId=${tempResumeId}`);
      };
      pdfReader.readAsDataURL(file);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Upload your Resume
          </CardTitle>
          <p className="text-center text-slate-600 mt-2">
            Upload your resume and profile photo to generate your professional portfolio
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resume Upload */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Resume (PDF) *
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer ${isDragging
                ? 'border-primary bg-blue-50'
                : error
                  ? 'border-red-300 bg-red-50'
                  : 'border-slate-300 hover:border-primary/50 hover:bg-slate-50'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                  {file ? <FileType className="h-8 w-8" /> : <UploadCloud className="h-8 w-8" />}
                </div>

                <div className="space-y-1">
                  {file ? (
                    <>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-slate-900">Click to upload or drag and drop</p>
                      <p className="text-sm text-slate-500">PDF (MAX. 10MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Profile Photo (Optional)
            </label>
            <div className="flex items-center gap-6">
              {/* Photo Preview */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  className="w-full sm:w-auto"
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  {photoFile ? 'Change Photo' : 'Upload Photo'}
                </Button>
                <p className="text-sm text-slate-500 mt-2">
                  JPEG, PNG or WebP (MAX. 5MB)
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!file || isUploading}
              className="w-full sm:w-auto"
              isLoading={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Generate Portfolio'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
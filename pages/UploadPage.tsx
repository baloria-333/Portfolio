import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { UploadCloud, FileType, AlertCircle } from 'lucide-react';
import { mockUploadResume } from '../services/mockBackend';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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
      setError('Only PDF files are accepted.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('File size must be less than 10MB.');
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

  const handleSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Upload file (Mocked)
      const filePath = await mockUploadResume(file);
      
      // 2. Generate a fake ID for the processing step
      const tempResumeId = `resume_${Date.now()}`;
      
      // 3. Navigate
      navigate(`/processing?resumeId=${tempResumeId}`);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Upload your Resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer ${
              isDragging 
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

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex justify-end">
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
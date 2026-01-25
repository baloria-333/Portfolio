import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { mockProcessResume } from '../services/mockBackend';
import { ResumeStatus } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

const steps = [
  { status: ResumeStatus.UPLOADED, label: 'Resume Uploaded' },
  { status: ResumeStatus.EXTRACTING, label: 'Extracting Text' },
  { status: ResumeStatus.ANALYZING, label: 'Analyzing with Gemini AI' },
  { status: ResumeStatus.GENERATING, label: 'Building Portfolio' },
];

export const ProcessingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('resumeId');
  const [currentStatus, setCurrentStatus] = useState<ResumeStatus>(ResumeStatus.UPLOADED);
  const processStarted = useRef(false);

  useEffect(() => {
    if (!resumeId) {
      navigate('/upload');
      return;
    }

    if (processStarted.current) return;
    processStarted.current = true;

    const runProcess = async () => {
      try {
        const result = await mockProcessResume(resumeId, (status) => {
          setCurrentStatus(status);
        });
        
        // Store result in local storage to pass to editor (since we don't have a real DB in this demo)
        localStorage.setItem(`portfolio_${resumeId}`, JSON.stringify(result));
        
        // Small delay to show completion
        setTimeout(() => {
          navigate(`/editor?resumeId=${resumeId}`);
        }, 1000);
      } catch (error) {
        console.error("Processing failed", error);
        setCurrentStatus(ResumeStatus.FAILED);
      }
    };

    runProcess();
  }, [resumeId, navigate]);

  const getStepState = (stepStatus: ResumeStatus) => {
    const statusOrder = [
      ResumeStatus.UPLOADED,
      ResumeStatus.EXTRACTING,
      ResumeStatus.ANALYZING,
      ResumeStatus.GENERATING,
      ResumeStatus.COMPLETED
    ];
    
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Creating Your Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {steps.map((step) => {
              const state = getStepState(step.status);
              return (
                <div key={step.status} className="flex items-center gap-3">
                  {state === 'completed' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                  {state === 'current' && <Loader2 className="h-6 w-6 text-primary animate-spin" />}
                  {state === 'pending' && <Circle className="h-6 w-6 text-slate-300" />}
                  
                  <span className={`${state === 'current' ? 'font-medium text-slate-900' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {currentStatus === ResumeStatus.FAILED && (
            <div className="text-center text-red-500">
              Something went wrong. Please try again.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
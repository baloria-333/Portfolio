import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle2, FileText, Sparkles, Layout as LayoutIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export const LandingPage: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    if (user) {
      navigate('/upload');
    } else {
      await signInWithGoogle();
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-20">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900">
            Turn your <span className="text-primary">Resume</span> into a 
            <br className="hidden md:inline" /> 
            Professional <span className="text-accent">Portfolio</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-[600px] mx-auto">
            Upload your PDF resume. Our AI analyzes your skills and experience to build a stunning portfolio website in seconds.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={handleGetStarted} className="px-8 text-lg h-12">
            {user ? 'Go to Dashboard' : 'Sign in with Google'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" /> No credit card required. Delete your data anytime.
        </p>
      </section>

      {/* Feature Showcase */}
      <section className="py-16 grid md:grid-cols-3 gap-8">
        <Card className="border-none shadow-lg bg-white/50">
          <CardContent className="pt-6 text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">Upload PDF</h3>
            <p className="text-slate-600 text-sm">Simply drag and drop your existing resume. We handle the text extraction.</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-white/50">
          <CardContent className="pt-6 text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">AI Analysis</h3>
            <p className="text-slate-600 text-sm">Gemini AI identifies your persona, skills, and projects to structure your site.</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-white/50">
          <CardContent className="pt-6 text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <LayoutIcon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">Instant Publish</h3>
            <p className="text-slate-600 text-sm">Edit your content in real-time and publish to a unique URL instantly.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
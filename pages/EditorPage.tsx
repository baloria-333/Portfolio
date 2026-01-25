import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { PortfolioContent } from '../types';
import { Save, ExternalLink, RefreshCw, Mail, Github, Linkedin } from 'lucide-react';

export const EditorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'preview'>('details');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (resumeId) {
      const stored = localStorage.getItem(`portfolio_${resumeId}`);
      if (stored) {
        setContent(JSON.parse(stored));
      }
    }
  }, [resumeId]);

  if (!content) return <div>Loading editor...</div>;

  const handleInputChange = (section: keyof PortfolioContent, field: string, value: any, index?: number) => {
    setContent(prev => {
      if (!prev) return null;
      const newData = { ...prev };
      
      if (index !== undefined && Array.isArray(newData[section])) {
        // Handle array items (experience, projects)
        // @ts-ignore
        newData[section][index] = { ...newData[section][index], [field]: value };
      } else if (typeof newData[section] === 'object') {
        // Handle nested objects (hero, about, contact)
        // @ts-ignore
        newData[section] = { ...newData[section], [field]: value };
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    localStorage.setItem(`portfolio_${resumeId}`, JSON.stringify(content));
    setIsSaving(false);
    alert('Draft saved!');
  };

  const PreviewComponent = () => (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border min-h-[800px]">
      {/* Hero */}
      <div className="bg-slate-900 text-white p-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{content.hero.headline}</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">{content.hero.subheadline}</p>
        <div className="flex justify-center gap-4">
          <Button>{content.hero.ctaText}</Button>
        </div>
      </div>

      {/* About */}
      <div className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">About Me</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">{content.about.summary}</p>
        <div className="flex flex-wrap gap-2">
          {content.about.skills.map(skill => (
            <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="p-8 max-w-4xl mx-auto bg-slate-50">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Experience</h2>
        <div className="space-y-6">
          {content.experience.map((exp, i) => (
            <div key={i} className="border-l-2 border-slate-300 pl-4">
              <h3 className="font-bold text-lg">{exp.role}</h3>
              <div className="text-slate-500 text-sm mb-2">{exp.company} | {exp.duration}</div>
              <p className="text-slate-600">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Projects</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {content.projects.map((proj, i) => (
            <Card key={i} className="h-full hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">{proj.title}</h3>
                <p className="text-slate-600 text-sm mb-4 h-20 overflow-hidden">{proj.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {proj.technologies.map(t => (
                    <span key={t} className="text-xs border px-2 py-0.5 rounded text-slate-500">{t}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

       {/* Contact */}
       <div className="p-8 bg-slate-900 text-white text-center">
        <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
        <div className="flex justify-center gap-6">
          {content.contact.email && (
            <a href={`mailto:${content.contact.email}`} className="hover:text-primary transition-colors">
              <Mail className="h-6 w-6" />
            </a>
          )}
          {content.contact.linkedin && (
            <a href={`https://${content.contact.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <Linkedin className="h-6 w-6" />
            </a>
          )}
          {content.contact.github && (
            <a href={`https://${content.contact.github}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
              <Github className="h-6 w-6" />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Portfolio Editor</h1>
        <div className="flex gap-2">
           {/* Mobile Tabs */}
           <div className="md:hidden flex rounded-md bg-slate-100 p-1 mr-4">
            <button 
              className={`px-3 py-1 text-sm rounded-sm ${activeTab === 'details' ? 'bg-white shadow' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Edit
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-sm ${activeTab === 'preview' ? 'bg-white shadow' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
          </div>

          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <Button variant="secondary" onClick={handleSave} isLoading={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => alert('Publishing feature coming in V2!')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 h-full overflow-hidden">
        {/* Editor Form Column */}
        <div className={`overflow-y-auto pr-2 pb-20 ${activeTab === 'preview' ? 'hidden md:block' : 'block'}`}>
          <div className="space-y-6">
            
            <section className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Hero Section</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Headline</label>
                <input 
                  className="w-full border rounded p-2" 
                  value={content.hero.headline}
                  onChange={(e) => handleInputChange('hero', 'headline', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subheadline</label>
                <textarea 
                  className="w-full border rounded p-2 h-20"
                  value={content.hero.subheadline}
                  onChange={(e) => handleInputChange('hero', 'subheadline', e.target.value)}
                />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Experience</h3>
              {content.experience.map((exp, idx) => (
                <Card key={idx} className="bg-slate-50">
                  <CardContent className="pt-4 space-y-3">
                    <input 
                      className="w-full border rounded p-2 text-sm font-bold"
                      value={exp.role}
                      onChange={(e) => handleInputChange('experience', 'role', e.target.value, idx)}
                      placeholder="Role"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        className="border rounded p-2 text-sm"
                        value={exp.company}
                        onChange={(e) => handleInputChange('experience', 'company', e.target.value, idx)}
                        placeholder="Company"
                      />
                       <input 
                        className="border rounded p-2 text-sm"
                        value={exp.duration}
                        onChange={(e) => handleInputChange('experience', 'duration', e.target.value, idx)}
                        placeholder="Duration"
                      />
                    </div>
                    <textarea 
                      className="w-full border rounded p-2 text-sm"
                      value={exp.description}
                      onChange={(e) => handleInputChange('experience', 'description', e.target.value, idx)}
                      rows={3}
                    />
                  </CardContent>
                </Card>
              ))}
            </section>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className={`overflow-y-auto bg-slate-100 rounded-lg border p-4 ${activeTab === 'details' ? 'hidden md:block' : 'block'}`}>
          <div className="scale-[0.9] origin-top">
            <PreviewComponent />
          </div>
        </div>
      </div>
    </div>
  );
};
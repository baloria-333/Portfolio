import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { PortfolioContent } from '../types';
import { Save, ExternalLink, RefreshCw, Mail, Github, Linkedin, User, MapPin, Briefcase, Calendar } from 'lucide-react';

export const EditorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'preview'>('preview');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (resumeId) {
      const stored = localStorage.getItem(`portfolio_${resumeId}`);
      if (stored) {
        setContent(JSON.parse(stored));
      }
    }
  }, [resumeId]);

  if (!content) return <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-slate-600">Loading your portfolio...</p>
    </div>
  </div>;

  const handleInputChange = (section: keyof PortfolioContent, field: string, value: any, index?: number) => {
    setContent(prev => {
      if (!prev) return null;
      const newData = { ...prev };

      if (index !== undefined && Array.isArray(newData[section])) {
        // @ts-ignore
        newData[section][index] = { ...newData[section][index], [field]: value };
      } else if (typeof newData[section] === 'object') {
        // @ts-ignore
        newData[section] = { ...newData[section], [field]: value };
      }

      return newData;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    localStorage.setItem(`portfolio_${resumeId}`, JSON.stringify(content));
    setIsSaving(false);
    alert('Draft saved!');
  };

  const PreviewComponent = () => (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-[800px]">
      {/* Hero Section - Modern & Captivating */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90"></div>

        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 py-20">
          {/* Profile Photo */}
          {content.profilePhoto ? (
            <div className="mb-8 inline-block">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur opacity-75 animate-pulse"></div>
                <img
                  src={content.profilePhoto}
                  alt="Profile"
                  className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                />
              </div>
            </div>
          ) : (
            <div className="mb-8 inline-block">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur opacity-75"></div>
                <div className="relative w-32 h-32 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-2xl">
                  <User className="h-16 w-16 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight fade-in-up">
            {content.hero.headline}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed fade-in-up" style={{ animationDelay: '0.2s' }}>
            {content.hero.subheadline}
          </p>
          <div className="flex justify-center gap-4 fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button className="bg-white text-indigo-600 hover:bg-white/90 px-8 py-3 text-lg font-semibold shadow-xl hover-lift">
              {content.hero.ctaText}
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold backdrop-blur-sm">
              Download CV
            </Button>
          </div>
        </div>
      </section>

      {/* About Section - Glassmorphism */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl p-8 md:p-12 hover-lift">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">About Me</h2>
            <p className="text-lg text-slate-700 mb-8 leading-relaxed whitespace-pre-line">
              {content.about.summary}
            </p>

            {/* Skills - Interactive Pills */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {content.about.skills.map((skill, idx) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-md hover-scale cursor-default"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section - Timeline Design */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">Professional Experience</h2>
          <div className="space-y-8">
            {content.experience.map((exp, idx) => (
              <div
                key={idx}
                className="relative pl-8 md:pl-12 fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 top-2 w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-lg"></div>

                {/* Timeline Line */}
                {idx < content.experience.length - 1 && (
                  <div className="absolute left-2 top-6 w-0.5 h-full bg-gradient-to-b from-indigo-200 to-transparent"></div>
                )}

                {/* Content Card */}
                <div className="glass-card rounded-xl p-6 md:p-8 hover-lift">
                  <div className="flex flex-wrap items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">{exp.role}</h3>
                      <div className="flex items-center gap-4 text-slate-600">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {exp.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {exp.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section - Card Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.projects.map((proj, idx) => (
              <div
                key={idx}
                className="glass-card rounded-xl overflow-hidden hover-lift hover-glow transition-all duration-300 fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="h-40 bg-gradient-to-br from-indigo-400 to-purple-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl">{proj.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-700 text-sm mb-4 line-clamp-3">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proj.technologies.slice(0, 4).map(tech => (
                      <span key={tech} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {proj.link && proj.link !== '#' && (
                    <Button variant="outline" size="sm" className="w-full">
                      View Project
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Modern Footer */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's Connect</h2>
          <p className="text-slate-300 text-lg mb-10">
            Interested in working together? Let's talk!
          </p>
          <div className="flex justify-center gap-6 mb-8">
            {content.contact.email && (
              <a
                href={`mailto:${content.contact.email}`}
                className="p-4 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all hover-scale"
              >
                <Mail className="h-6 w-6" />
              </a>
            )}
            {content.contact.linkedin && (
              <a
                href={`https://${content.contact.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all hover-scale"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {content.contact.github && (
              <a
                href={`https://${content.contact.github}`}
                target="_blank"
                rel="noreferrer"
                className="p-4 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all hover-scale"
              >
                <Github className="h-6 w-6" />
              </a>
            )}
          </div>
          <p className="text-slate-400 text-sm">© 2026 All rights reserved. Built with ResuFolio</p>
        </div>
      </section>
    </div>
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 px-6">
        <h1 className="text-2xl font-bold gradient-text">Portfolio Editor</h1>
        <div className="flex gap-2">
          {/* Mobile Tabs */}
          <div className="md:hidden flex rounded-lg bg-slate-100 p-1 mr-4">
            <button
              className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'details' ? 'bg-white shadow-sm font-medium' : 'text-slate-600'}`}
              onClick={() => setActiveTab('details')}
            >
              Edit
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm font-medium' : 'text-slate-600'}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
          </div>

          <Button variant="outline" onClick={() => window.location.reload()} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <Button variant="secondary" onClick={handleSave} isLoading={isSaving} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={() => alert('Publishing feature coming soon!')} size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 h-full overflow-hidden px-6">
        {/* Editor Form Column */}
        <div className={`overflow-y-auto pr-2 pb-20 ${activeTab === 'preview' ? 'hidden md:block' : 'block'}`}>
          <div className="space-y-6">
            <section className="glass-card rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 gradient-text">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Headline</label>
                  <input
                    className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={content.hero.headline}
                    onChange={(e) => handleInputChange('hero', 'headline', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Subheadline</label>
                  <textarea
                    className="w-full border border-slate-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={content.hero.subheadline}
                    onChange={(e) => handleInputChange('hero', 'subheadline', e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="glass-card rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 gradient-text">Experience</h3>
              <div className="space-y-4">
                {content.experience.map((exp, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
                    <input
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                      value={exp.role}
                      onChange={(e) => handleInputChange('experience', 'role', e.target.value, idx)}
                      placeholder="Role"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        value={exp.company}
                        onChange={(e) => handleInputChange('experience', 'company', e.target.value, idx)}
                        placeholder="Company"
                      />
                      <input
                        className="border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        value={exp.duration}
                        onChange={(e) => handleInputChange('experience', 'duration', e.target.value, idx)}
                        placeholder="Duration"
                      />
                    </div>
                    <textarea
                      className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                      value={exp.description}
                      onChange={(e) => handleInputChange('experience', 'description', e.target.value, idx)}
                      rows={3}
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className={`overflow-y-auto bg-slate-100 rounded-xl border-2 border-slate-200 ${activeTab === 'details' ? 'hidden md:block' : 'block'}`}>
          <div className="scale-90 origin-top">
            <PreviewComponent />
          </div>
        </div>
      </div>
    </div>
  );
};
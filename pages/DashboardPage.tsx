import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { getPortfolios, deletePortfolio, publishPortfolio, unpublishPortfolio, PortfolioRecord } from '../services/database';
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, Calendar, FileText } from 'lucide-react';

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [portfolios, setPortfolios] = useState<PortfolioRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPortfolios();
    }, []);

    const loadPortfolios = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPortfolios();
            setPortfolios(data);
        } catch (err: any) {
            setError(err.message);
            console.error('Failed to load portfolios:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await deletePortfolio(id);
            setPortfolios(prev => prev.filter(p => p.id !== id));
        } catch (err: any) {
            alert(`Failed to delete portfolio: ${err.message}`);
        }
    };

    const handleTogglePublish = async (portfolio: PortfolioRecord) => {
        try {
            if (portfolio.is_published) {
                await unpublishPortfolio(portfolio.id);
                setPortfolios(prev => prev.map(p =>
                    p.id === portfolio.id ? { ...p, is_published: false } : p
                ));
            } else {
                const slug = prompt('Enter a unique URL slug for your portfolio:',
                    portfolio.title.toLowerCase().replace(/\s+/g, '-'));
                if (!slug) return;

                await publishPortfolio(portfolio.id, slug);
                setPortfolios(prev => prev.map(p =>
                    p.id === portfolio.id ? { ...p, is_published: true, slug } : p
                ));
            }
        } catch (err: any) {
            alert(`Failed to ${portfolio.is_published ? 'unpublish' : 'publish'} portfolio: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your portfolios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-6">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-bold gradient-text mb-2">My Portfolios</h1>
                <p className="text-slate-600">Create, manage, and publish your professional portfolios</p>
            </div>

            {/* Create New Button */}
            <div className="mb-8">
                <Button
                    onClick={() => navigate('/upload')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    size="lg"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Portfolio
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Portfolios Grid */}
            {portfolios.length === 0 ? (
                <div className="text-center py-20">
                    <div className="glass-card rounded-2xl p-12 max-w-md mx-auto">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="h-10 w-10 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">No portfolios yet</h3>
                        <p className="text-slate-600 mb-6">
                            Get started by uploading your resume and creating your first AI-powered portfolio
                        </p>
                        <Button
                            onClick={() => navigate('/upload')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Portfolio
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map((portfolio) => (
                        <Card
                            key={portfolio.id}
                            className="glass-card hover-lift overflow-hidden group"
                        >
                            {/* Preview Banner */}
                            <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                                {portfolio.profile_photo && (
                                    <img
                                        src={portfolio.profile_photo}
                                        alt="Profile"
                                        className="absolute bottom-0 left-6 w-20 h-20 rounded-full border-4 border-white object-cover transform translate-y-1/2"
                                    />
                                )}
                                {portfolio.is_published && (
                                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                                        Published
                                    </div>
                                )}
                            </div>

                            <CardContent className="pt-12 pb-6">
                                <h3 className="font-bold text-xl mb-2 line-clamp-1">{portfolio.title}</h3>
                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                    {portfolio.hero.headline}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                                    <Calendar className="h-3 w-3" />
                                    Updated {new Date(portfolio.updated_at).toLocaleDateString()}
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate(`/editor?resumeId=${portfolio.id}`)}
                                        className="w-full"
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>

                                    <Button
                                        variant={portfolio.is_published ? 'secondary' : 'primary'}
                                        size="sm"
                                        onClick={() => handleTogglePublish(portfolio)}
                                        className="w-full"
                                    >
                                        {portfolio.is_published ? (
                                            <>
                                                <EyeOff className="h-4 w-4 mr-1" />
                                                Unpublish
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-4 w-4 mr-1" />
                                                Publish
                                            </>
                                        )}
                                    </Button>

                                    {portfolio.is_published && portfolio.slug && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(`/portfolio/${portfolio.slug}`, '_blank')}
                                            className="col-span-2"
                                        >
                                            <ExternalLink className="h-4 w-4 mr-1" />
                                            View Public Page
                                        </Button>
                                    )}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(portfolio.id, portfolio.title)}
                                        className="col-span-2 text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PortfolioPage: React.FC = () => {
  console.log('PortfolioPage MOUNT');
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;
  const LOCAL_KEY = userId ? `portfolioProjects_${userId}` : 'portfolioProjects';
  const [activeTab, setActiveTab] = useState('view');
  const [newProject, setNewProject] = useState({
    title: '',
    category: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    technologies: ''
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [projects, setProjects] = useState<any[]>(() => {
    const data = localStorage.getItem(LOCAL_KEY);
    const parsed = data ? JSON.parse(data) : [];
    console.log('PortfolioPage initial load from localStorage:', parsed);
    return parsed;
  });

  // Debug: log projects array every render
  console.log('PortfolioPage render projects:', projects);

  const categories = [
    'Web Development',
    'Mobile Development',
    'Graphic Design',
    'UI/UX Design',
    'Content Writing',
    'Video Production',
    'Digital Marketing',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log('Portfolio Submit');
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...projects];
      updated[editIndex] = { ...newProject, technologies: newProject.technologies.split(',').map(t => t.trim()) };
      setProjects(updated);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('portfolio-updated'));
      setEditIndex(null);
      setSuccessMsg('Project updated!');
    } else {
      const updated = [
        ...projects,
        { ...newProject, id: Date.now(), technologies: newProject.technologies.split(',').map(t => t.trim()) }
      ];
      console.log('Updated projects:', updated);
      setProjects(updated);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('portfolio-updated'));
      setSuccessMsg('Project added!');
    }
    setNewProject({ title: '', category: '', description: '', imageUrl: '', projectUrl: '', technologies: '' });
    setActiveTab('view');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    const proj = projects[idx];
    setNewProject({
      title: proj.title,
      category: proj.category,
      description: proj.description,
      imageUrl: proj.imageUrl,
      projectUrl: proj.projectUrl,
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || ''
    });
    setActiveTab('add');
  };

  const handleDelete = (idx: number) => {
    const updated = projects.filter((_: any, i: number) => i !== idx);
    setProjects(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('portfolio-updated'));
    setSuccessMsg('Project deleted!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleReset = () => {
    setNewProject({ title: '', category: '', description: '', imageUrl: '', projectUrl: '', technologies: '' });
    setEditIndex(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900">
      <div className="w-full px-6 py-8">
        <button
          onClick={() => navigate('/profile-completion')}
          className="mb-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow transition-all"
        >
          Profile
        </button>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            My Portfolio 🎨
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Showcase your best work to attract high-quality clients and demonstrate your expertise.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-dark-800 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'view'
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            View Portfolio
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'add'
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Add Project
          </button>
        </div>

        {activeTab === 'add' ? (
          /* Add Project Form */
          <div className="bg-dark-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Project Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newProject.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                    placeholder="e.g., E-commerce Website"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Category *</label>
                  <select
                    name="category"
                    value={newProject.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Description *</label>
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                  placeholder="Describe your project and the work you did..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Project Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={newProject.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Project URL</label>
                  <input
                    type="url"
                    name="projectUrl"
                    value={newProject.projectUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Technologies Used</label>
                <input
                  type="text"
                  name="technologies"
                  value={newProject.technologies}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('view')}
                  className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* View Portfolio */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Projects</h2>
              <button
                onClick={() => setActiveTab('add')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                + Add Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
                <p className="text-gray-300 mb-6">Add your first project to showcase your work</p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                  Add Your First Project
                </button>
              </div>
            ) : (
              <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {projects.map((project: any, index: number) => (
                  <div key={project.id} className="bg-dark-800 rounded-lg overflow-hidden hover:scale-[1.02] transition-all duration-300">
                    <div className="relative">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                      {project.featured && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-300 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">{project.category}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors duration-200 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/profile-completion')}
            className="px-8 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Profile Completion
          </button>
        </div>
        {successMsg && (
          <div className="text-center py-4 text-green-400 text-lg">
            {successMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage; 
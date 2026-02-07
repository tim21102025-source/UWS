/**
 * Interactive Projects Map Component
 * 
 * Map showing company projects across different city districts
 */

import React, { useCallback, useState } from 'react';

export interface ProjectMarker {
  id: string;
  title: string;
  type: 'window' | 'door' | 'balcony' | 'facade';
  address: string;
  district: string;
  coordinates: { lat: number; lng: number };
  image?: string;
  description?: string;
  year: number;
  completed?: boolean;
}

export interface ProjectsMapProps {
  projects: ProjectMarker[];
  city?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  showFilters?: boolean;
  onProjectClick?: (project: ProjectMarker) => void;
}

export const ProjectsMap: React.FC<ProjectsMapProps> = ({
  projects,
  city = 'Киев',
  center = { lat: 50.4501, lng: 30.5234 },
  zoom = 11,
  showFilters = true,
  onProjectClick,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectMarker | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const filters = [
    { id: 'all', label: 'Все проекты', icon: '🏠' },
    { id: 'window', label: 'Окна', icon: '🪟' },
    { id: 'door', label: 'Двери', icon: '🚪' },
    { id: 'balcony', label: 'Балконы', icon: '🏗️' },
    { id: 'facade', label: 'Фасады', icon: '🏢' },
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.type === activeFilter);

  const handleMarkerClick = useCallback((project: ProjectMarker) => {
    setSelectedProject(project);
    onProjectClick?.(project);
  }, [onProjectClick]);

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'window': return 'bg-primary-500';
      case 'door': return 'bg-green-500';
      case 'balcony': return 'bg-blue-500';
      case 'facade': return 'bg-purple-500';
      default: return 'bg-primary-500';
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'window': return '🪟';
      case 'door': return '🚪';
      case 'balcony': return '🏗️';
      case 'facade': return '🏢';
      default: return '📍';
    }
  };

  // Mock map visualization since we don't have a real map API
  return (
    <div className="projects-map bg-dark-50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-primary-500 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Наши проекты на карте {city}</h2>
        <p className="text-primary-100 text-sm">{filteredProjects.length} выполненных проектов</p>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b border-dark-200">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-dark-600 hover:bg-primary-50 border border-dark-200'
                }`}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative h-[400px] bg-dark-100">
        {/* Simplified map representation */}
        <div className="absolute inset-0 p-4">
          <div className="w-full h-full bg-white rounded-xl shadow-inner relative overflow-hidden">
            {/* Map grid */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.5" />
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>

            {/* District labels */}
            <div className="absolute top-4 left-4 text-xs text-dark-400 font-medium">Центральный район</div>
            <div className="absolute top-4 right-4 text-xs text-dark-400 font-medium">Северный район</div>
            <div className="absolute bottom-4 left-4 text-xs text-dark-400 font-medium">Южный район</div>
            <div className="absolute bottom-4 right-4 text-xs text-dark-400 font-medium">Западный район</div>

            {/* Project markers */}
            {filteredProjects.map((project, index) => {
              const left = 15 + (index * 12) % 70;
              const top = 20 + ((index * 17) % 60);
              const isHovered = hoveredProject === project.id;
              
              return (
                <div
                  key={project.id}
                  className="absolute cursor-pointer transition-all duration-300"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => handleMarkerClick(project)}
                >
                  {/* Marker */}
                  <div
                    className={`relative ${isHovered ? 'scale-125 z-10' : 'scale-100'} transition-transform`}
                  >
                    <div className={`w-10 h-10 rounded-full ${getTypeColor(project.type)} flex items-center justify-center shadow-lg`}>
                      <span className="text-lg">{getTypeIcon(project.type)}</span>
                    </div>
                    {/* Pulse effect for completed projects */}
                    {project.completed && (
                      <div className="absolute inset-0 rounded-full animate-ping opacity-50" />
                    )}
                  </div>

                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-xl shadow-xl p-3 z-20">
                      <p className="font-semibold text-dark-900 text-sm">{project.title}</p>
                      <p className="text-xs text-dark-500 mt-1">{project.address}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                          {project.year} г.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Project Details */}
      {selectedProject && (
        <div className="p-4 border-t border-dark-200 bg-white">
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute top-2 right-2 p-1 text-dark-400 hover:text-dark-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex gap-4">
            {selectedProject.image && (
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                  {selectedProject.type === 'window' ? 'Окна' : selectedProject.type === 'door' ? 'Двери' : selectedProject.type === 'balcony' ? 'Балкон' : 'Фасад'}
                </span>
                <span className="text-xs text-dark-400">{selectedProject.district}</span>
              </div>
              <h3 className="font-bold text-dark-900">{selectedProject.title}</h3>
              <p className="text-sm text-dark-600 mt-1">{selectedProject.address}</p>
              {selectedProject.description && (
                <p className="text-sm text-dark-500 mt-2 line-clamp-2">{selectedProject.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="p-4 bg-dark-50 border-t border-dark-200">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary-600">{projects.length}</p>
            <p className="text-xs text-dark-500">Всего проектов</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{projects.filter(p => p.type === 'window').length}</p>
            <p className="text-xs text-dark-500">Окон</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{projects.filter(p => p.type === 'balcony').length}</p>
            <p className="text-xs text-dark-500">Балконов</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{projects.filter(p => p.type === 'facade').length}</p>
            <p className="text-xs text-dark-500">Фасадов</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample projects data
export const SAMPLE_PROJECTS: ProjectMarker[] = [
  {
    id: 'p1',
    title: 'Остекление ЖК "Солнечный"',
    type: 'window',
    address: 'ул. Садовая, 15',
    district: 'Центральный район',
    coordinates: { lat: 50.4501, lng: 30.5234 },
    image: '/images/projects/projects-1.jpg',
    description: 'Полное остекление 5-этажного жилого комплекса',
    year: 2024,
    completed: true,
  },
  {
    id: 'p2',
    title: 'Балкон под ключ',
    type: 'balcony',
    address: 'пр. Победы, 42',
    district: 'Северный район',
    coordinates: { lat: 50.4634, lng: 30.4989 },
    image: '/images/services/balkony.jpg',
    description: 'Тёплое остекление и утепление балкона',
    year: 2024,
    completed: true,
  },
  {
    id: 'p3',
    title: 'Входные двери',
    type: 'door',
    address: 'ул. Лесная, 8',
    district: 'Западный район',
    coordinates: { lat: 50.4389, lng: 30.4899 },
    image: '/images/projects/projects-3.jpg',
    description: 'Установка металлических входных дверей в частном доме',
    year: 2023,
    completed: true,
  },
  {
    id: 'p4',
    title: 'Фасадное остекление',
    type: 'facade',
    address: 'ул. Промышленная, 3',
    district: 'Южный район',
    coordinates: { lat: 50.4289, lng: 30.5434 },
    image: '/images/projects/projects-5.jpg',
    description: 'Алюминиевое фасадное остекление офисного здания',
    year: 2024,
    completed: true,
  },
  {
    id: 'p5',
    title: 'Замена окон в квартире',
    type: 'window',
    address: 'ул. Днепровская, 22',
    district: 'Центральный район',
    coordinates: { lat: 50.4521, lng: 30.5294 },
    image: '/images/projects/projects-2.jpg',
    description: 'Замена старых деревянных окон на энергосберегающие',
    year: 2024,
    completed: true,
  },
  {
    id: 'p6',
    title: 'Остекление коттеджа',
    type: 'window',
    address: 'пос. Петровское',
    district: 'Западный район',
    coordinates: { lat: 50.4089, lng: 30.4599 },
    image: '/images/projects/projects-6.jpg',
    description: 'Панорамное остекление загородного дома',
    year: 2023,
    completed: true,
  },
  {
    id: 'p7',
    title: 'Балкон + лоджия',
    type: 'balcony',
    address: 'пр. Науки, 18',
    district: 'Северный район',
    coordinates: { lat: 50.4734, lng: 30.5189 },
    image: '/images/projects/projects-7.jpg',
    description: 'Комплексное остекление балкона и лоджии',
    year: 2024,
    completed: true,
  },
  {
    id: 'p8',
    title: 'Офисные перегородки',
    type: 'facade',
    address: 'ул. Шевченка, 10',
    district: 'Центральный район',
    coordinates: { lat: 50.4441, lng: 30.5334 },
    image: '/images/projects/projects-8.jpg',
    description: 'Стеклянные офисные перегородки',
    year: 2024,
    completed: true,
  },
];

export default ProjectsMap;

import React, { useState } from 'react';
import { ClassicTemplate } from '../templates/ClassicTemplates';
import { ModernTemplate } from '../templates/ModernTemplates';
import  MinimalTemplate  from '../templates/MinimalTemplates';
import ProfessionalTemplates  from '../templates/ProfessionalTemplates';
import OneColumnTemplate from '../templates/OneColumnTemplate';
import { ResumeData } from '../types/resume';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const templates = {
  oneColumn: OneColumnTemplate,
  professional: ProfessionalTemplates,
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
};

const initialResumeData: ResumeData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-111-1111',
  },
  experience: [
    {
      company: 'COMPANY A',
      position: 'Advanced Development Intern',
      startDate: 'May 2018',
      endDate: 'Aug 2018',
      location: 'Somewhere, XX',
      points: [
        'Developed tools to automate and enhance the engineering process for network installation using AWS and Python',
        'Worked with other teams to create a system to collect and curate customer feedback using AWS, Python, and Docker',
        'Collaborated with teams to jump start cloud-technology adoption',
        'Contributed to shift planning for voice alignment system utilizing AWS voice recognition features and NLP architecture',
      ],
    },
    {
      company: 'COMPANY B',
      position: 'Intern',
      startDate: 'Feb 2017',
      endDate: 'May 2017',
      location: 'Somewhere, XX',
      points: [
        'Designed and implemented test suite to lead a software product evaluation resulting in a fit-for-purpose verdict',
        'Acted as an information gateway to answer cross-departmental questions',
        'Participated in an Internal CodeJam to prototype a blockchain application',
      ],
    },
  ],
  education: [
    {
      university: 'MY UNIVERSITY',
      degree: 'Bachelor of Science in Mathematics and Statistics',
      startDate: '2016',
      endDate: '2020',
      location: 'Somewhere, XX',
      gpa: '4.0/4.0',
    },
  ],
  skills: [
    {
      category: 'Programming',
      items: ['Python', 'C/C++', 'Java', 'R', 'SAS'],
    },
    {
      category: 'Technology',
      items: ['AWS', 'Linux', 'Docker', 'Git'],
    },
  ],
  coursework: {
    Graduate: ['Analysis of Algorithms'],
    Undergraduate: ['Artificial Intelligence', 'Operating Systems I', 'Data Analysis I'],
  },
  projects: [
    {
      name: 'SPACE ROBOTICS TEAM',
      role: 'Path-Planning Lead',
      description: 'Space robotics project',
      technologies: ['Python', 'ROS'],
      points: [
        'Spearheaded the enhancement effort for the path-planning functionality of a team of three robots',
        'Led several development sprints and the planning is being documented in Python to allow for fully autonomous operation',
      ],
    },
  ],
  societies: [
    'Association for Computing Machinery',
    'Brown Alliance Certified ScrumMaster',
    'University Honor College',
  ],
  links: [
    { platform: 'GitHub', url: 'github.com/johndoe' },
    { platform: 'LinkedIn', url: 'linkedin.com/johndoe' },
  ],
};

function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('classic');
  const [isEditing, setIsEditing] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('resume.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const SelectedTemplate = templates[selectedTemplate];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative">
      {/* Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#7c3aed15_1px,transparent_1px),linear-gradient(to_bottom,#7c3aed15_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(124,58,237,0.05),transparent)]" />
      
      <div className="relative min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8 border border-purple-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-900 to-purple-600 bg-clip-text text-transparent mb-2">
                  Resume Builder
                </h1>
                <p className="text-gray-600">Create your professional resume with precision</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <select
                  className="px-4 py-3 border border-gray-200 rounded-xl text-gray-700 
                           hover:border-purple-400 focus:border-purple-500 focus:ring-2 
                           focus:ring-purple-100 transition-all duration-200 outline-none
                           bg-white/80 backdrop-blur-sm shadow-sm w-full sm:w-[220px]
                           text-sm font-medium"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof templates)}
                >
                  <option value="classic">Classic Template</option>
                  <option value="professional">Professional Template (Two-column)</option>
                  <option value="oneColumn">Professional Template (One-column)</option>
                  <option value="modern">Modern Template</option>
                  <option value="minimal">Minimal Template</option>
                </select>
                
                <button
                  className="px-6 py-3 bg-gradient-to-r from-purple-700 to-purple-900 
                           text-white rounded-xl hover:from-purple-800 hover:to-purple-950 
                           focus:ring-4 focus:ring-purple-100 transition-all duration-200
                           shadow-sm text-sm font-medium relative overflow-hidden group"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <span className="relative z-10">
                    {isEditing ? 'Preview Resume' : 'Edit Resume'}
                  </span>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:8px_8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                
                <button
                  className="px-6 py-3 bg-gradient-to-r from-purple-900 to-gray-900 
                           text-white rounded-xl hover:from-purple-950 hover:to-gray-950 
                           focus:ring-4 focus:ring-purple-100 transition-all duration-200 
                           flex items-center justify-center gap-2 shadow-sm text-sm font-medium
                           relative overflow-hidden group"
                  onClick={handleDownloadPDF}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Export PDF
                  </span>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:8px_8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </div>

          <div 
            id="resume-preview" 
            className="bg-white rounded-2xl shadow-lg overflow-hidden 
                     border border-purple-50 relative"
          >
            <SelectedTemplate data={resumeData} isEditable={isEditing} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;


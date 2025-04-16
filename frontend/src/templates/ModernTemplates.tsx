// src/templates/ModernTemplate.tsx
import React from 'react';
import { ResumeData } from '../types/resume';

export const ModernTemplate: React.FC<{ data: ResumeData; isEditable?: boolean }> = ({
  data,
  isEditable = false
}) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white grid grid-cols-3 gap-6">
      {/* Left Sidebar */}
      <div className="col-span-1 bg-gray-100 p-6">
        <div className="mb-6">
          {isEditable ? (
            <input
              className="text-2xl font-bold w-full"
              defaultValue={data.personalInfo.name}
            />
          ) : (
            <h1 className="text-2xl font-bold">{data.personalInfo.name}</h1>
          )}
        </div>
        
        {/* Contact Info */}
        <div className="space-y-2 mb-6">
          {isEditable ? (
            <>
              <input
                className="w-full"
                defaultValue={data.personalInfo.email}
              />
              <input
                className="w-full"
                defaultValue={data.personalInfo.phone}
              />
            </>
          ) : (
            <>
              <p>{data.personalInfo.email}</p>
              <p>{data.personalInfo.phone}</p>
            </>
          )}
        </div>
        
        {/* Skills */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Skills</h2>
          {data.skills.map((skillGroup, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-semibold">{skillGroup.category}</h3>
              <ul className="list-disc ml-4">
                {skillGroup.items.map((skill, idx) => (
                  <li key={idx}>
                    {isEditable ? (
                      <input className="w-full" defaultValue={skill} />
                    ) : (
                      skill
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-2">
        {/* Experience */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              {/* Similar structure to ClassicTemplate but with modern styling */}
            </div>
          ))}
        </section>
        
        {/* Add other sections */}
      </div>
    </div>
  );
};
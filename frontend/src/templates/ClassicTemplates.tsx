// src/templates/ClassicTemplate.tsx
import React from 'react';
import { ResumeData } from '../types/resume';

export const ClassicTemplate: React.FC<{ data: ResumeData; isEditable?: boolean }> = ({
  data,
  isEditable = false
}) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <div className="text-center mb-6">
        {isEditable ? (
          <input
            className="text-3xl font-bold text-center w-full"
            defaultValue={data.personalInfo.name}
          />
        ) : (
          <h1 className="text-3xl font-bold">{data.personalInfo.name}</h1>
        )}
        <div className="text-sm text-gray-600 mt-2">
          {isEditable ? (
            <div className="space-x-4">
              <input
                className="text-center"
                defaultValue={data.personalInfo.email}
              />
              <input
                className="text-center"
                defaultValue={data.personalInfo.phone}
              />
            </div>
          ) : (
            <>
              <span>{data.personalInfo.email}</span>
              <span className="mx-2">|</span>
              <span>{data.personalInfo.phone}</span>
            </>
          )}
        </div>
      </div>
      
      {/* Experience Section */}
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-3">
          Experience
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <div>
                {isEditable ? (
                  <input
                    className="font-bold text-lg"
                    defaultValue={exp.company}
                  />
                ) : (
                  <h3 className="font-bold text-lg">{exp.company}</h3>
                )}
                {isEditable ? (
                  <input
                    className="italic"
                    defaultValue={exp.position}
                  />
                ) : (
                  <p className="italic">{exp.position}</p>
                )}
              </div>
              <div className="text-right">
                <p>{exp.startDate} - {exp.endDate}</p>
                <p>{exp.location}</p>
              </div>
            </div>
            <ul className="list-disc ml-6 mt-2">
              {exp.points.map((point, idx) => (
                <li key={idx}>
                  {isEditable ? (
                    <input className="w-full" defaultValue={point} />
                  ) : (
                    point
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      
      {/* Add other sections similarly */}
    </div>
  );
};
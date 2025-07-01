import { GoogleGenAI } from '@google/genai';
import { Task, User } from './store';

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function getTaskExplanation(taskTitle: string, taskDescription: string) {
  const prompt = `
    As an expert project manager for a drone competition project (AgriSync-X), explain the following task in detail:
    
    Task: ${taskTitle}
    Description: ${taskDescription}
    
    Please provide:
    1. Context and importance of this task in the drone development lifecycle
    2. Practical steps to complete it effectively
    3. Potential challenges and solutions specific to drone/robotics engineering
    4. Success criteria and deliverables
    5. Dependencies and prerequisites
    
    Keep the explanation clear, actionable, and focused on drone/robotics engineering context.
    Format the response in a structured, easy-to-read manner.
  `;
  
  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{role: 'user', parts: [{text: prompt}] }]
    });
    return result.text;
  } catch (error) {
    console.error('Error getting task explanation:', error);
    return 'Unable to generate explanation at this time. Please check your API key configuration and try again later.';
  }
}

export async function getChatResponse(message: string, context?: string) {
  const prompt = `
    You are an AI assistant for the AgriSync-X drone competition project team. 
    You are an expert in:
    - Drone/UAV development and engineering
    - Precision agriculture applications
    - Project management for robotics teams
    - Competition strategy and preparation
    - Technical problem-solving
    
    ${context ? `Context: ${context}` : ''}
    
    User message: ${message}
    
    Provide helpful, technical guidance that is:
    - Specific to drone/robotics development
    - Actionable and practical
    - Relevant to competition preparation
    - Concise but comprehensive
    
    If the question is not related to the project, politely redirect to project-related topics.
  `;
  
  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{role: 'user', parts: [{text: prompt}] }]
    });
    return result.text;
  } catch (error) {
    console.error('Error getting chat response:', error);
    return 'I apologize, but I\'m having trouble processing your request right now. Please check the API configuration and try again.';
  }
}

export async function generateProjectInsights(tasks: Task[], teamMembers: User[]) {
  const prompt = `
    Analyze the following AgriSync-X drone project data and provide insights:
    
    Tasks: ${JSON.stringify(tasks, null, 2)}
    Team Members: ${JSON.stringify(teamMembers, null, 2)}
    
    Please provide:
    1. Project health assessment
    2. Risk analysis and mitigation strategies
    3. Optimization recommendations
    4. Timeline predictions
    5. Resource allocation suggestions
    
    Focus on actionable insights for a drone competition team.
  `;
  
  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{role: 'user', parts: [{text: prompt}] }]
    });
    return result.text;
  } catch (error) {
    console.error('Error generating insights:', error);
    return 'Unable to generate insights at this time.';
  }
}
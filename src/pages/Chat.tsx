import React from 'react';
import Chatbot from '@/src/components/Chatbot';

const Chat = () => {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-4">Chat With Us</h1>
          <p className="text-slate-600">Have questions? Our AI assistant is here to help you 24/7.</p>
        </div>
        
        <Chatbot />
        
        <div className="mt-12 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-4">Common Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "What flavors do you have?",
              "What is your service area?",
              "How much does it cost to book?",
              "Do you serve dairy-free options?"
            ].map((q) => (
              <button
                key={q}
                className="text-left p-4 rounded-xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50 transition-all text-sm text-slate-600 font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

# AskPDF – PDF Q&A App

This project is a small full-stack app I built as part of an assignment. The goal is straightforward:  
upload a PDF, type in your question, and get back answers based on the document. I wanted it to feel
a little different than the usual “utility” apps, so I gave it a neon-styled interface that makes
the whole process look more fun.



->Tech Stack

- Next.js (App Router + API routes)
- TypeScript
- TailwindCSS ,with a custom neon theme
- OpenAI API ,for generating answers
- Pdf-parse ,for PDF text extraction
- Node.js file system for saving parsed text and metadata

  

->Getting Started

1. Clone the repo:
      1. git clone https://github.com/<your-username>/pdf-qa.git
      2. cd pdf-qa
   
3. Install Dependencies: npm install
   
5. Set up environment variables: Create a .env.local file in the root folder and add the necessary fields.
   
7. Run the app: npm run dev

   

->Features
 1. Secure login before uploading or asking questions
 2. Upload any PDF (text content is parsed and stored locally)
 3. Neon-themed UI with dark/light toggle
 4. Simple workflow: Upload → Ask → Get answers
 5. Clean separation of frontend and backend routes


 

->How to Use
1. Log in with the passcode (set in .env.local).
2. Upload a PDF file.
3. Type a question and hit Ask
4. Answer appears below in real time.
  
 


That’s it — thanks for checking it out!

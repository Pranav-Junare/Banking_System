const pptxgen = require('pptxgenjs');

let pres = new pptxgen();

// Slide 1: Title
let slide1 = pres.addSlide();
slide1.addText("Next-Generation Digital Banking System", { x: 1, y: 1.5, w: "80%", fontSize: 36, bold: true, align: "center", color: "363636" });
slide1.addText("A Unified Platform for Modern Financial Services", { x: 1, y: 2.5, w: "80%", fontSize: 24, align: "center", color: "666666" });
slide1.addText("Team Members:\n[Student 1]\n[Student 2]\n[Student 3]\n[Student 4]\n[Student 5]", { x: 1, y: 3.5, w: 4, fontSize: 14 });
slide1.addText("Course: [Course Name]\nGuide: [Guide Name]", { x: 5, y: 3.5, w: 4, fontSize: 14, align: "right" });

// Slide 2: Introduction
let slide2 = pres.addSlide();
slide2.addText("Introduction", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "003366" });
slide2.addText([
    { text: "Welcome to our project: a modern, comprehensive Banking System." },
    { text: "Bridges the gap between traditional banking and modern fintech." },
    { text: "Consolidates everyday banking, wealth management, Forex, and utility payments." },
    { text: "Goal: Empower users with complete control over their financial lifecycle." }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 18, bullet: true, lineSpacing: 30 });

// Slide 3: Problem Statement
let slide3 = pres.addSlide();
slide3.addText("Problem Statement", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "003366" });
slide3.addText([
    { text: "Fragmented Experience: Juggling multiple apps for banking, investments, and bills." },
    { text: "Tedious Onboarding: Traditional KYC processes are manual and slow." },
    { text: "Lack of Financial Visibility: No real-time, consolidated insights into spending." },
    { text: "Legacy Architectures: Existing interfaces are slow and not user-centric." }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 18, bullet: true, lineSpacing: 30 });

// Slide 4: Project Objectives
let slide4 = pres.addSlide();
slide4.addText("Project Objectives", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "003366" });
slide4.addText([
    { text: "Develop a highly secure, full-stack digital banking web application." },
    { text: "Streamline onboarding with automated KYC upload and verification." },
    { text: "Provide dedicated modules for Forex, Wealth Management, and Fixed Deposits." },
    { text: "Create a dedicated Admin Dashboard to monitor and manage user accounts." }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 18, bullet: true, lineSpacing: 30 });

// Slide 5: Existing vs. Proposed System
let slide5 = pres.addSlide();
slide5.addText("Existing vs. Proposed System", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "003366" });
slide5.addText("Existing System:\n- Branch visits for KYC\n- Siloed data (cards, forex, core separated)\n- Clunky UX", { x: 0.5, y: 1.5, w: "45%", fontSize: 16, fill: "F2F2F2", align: "left" });
slide5.addText("Proposed Banking System:\n- 100% digital KYC\n- Unified dashboard\n- Real-time processing via modern APIs", { x: 5.0, y: 1.5, w: "45%", fontSize: 16, fill: "E6F0FA", align: "left" });

// Slide 6: System Architecture
let slide6 = pres.addSlide();
slide6.addText("System Architecture", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "003366" });
slide6.addText([
    { text: "Frontend: Single Page Application (SPA) using React.js and Vite." },
    { text: "Backend: Java and Spring Boot (MVC pattern)." },
    { text: "Security Layer: Spring Security and robust CORS configuration." },
    { text: "Processing: Spring Batch for secure background transactions." }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 18, bullet: true, lineSpacing: 30 });

// Slide 7: Working Methodology
let slide7 = pres.addSlide();
slide7.addText("Working Methodology", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "003366" });
slide7.addText([
    { text: "Requirements & Design: Mapped out user journeys." },
    { text: "Frontend Development: Created modular React components." },
    { text: "Backend Implementation: Developed secure Spring Boot endpoints." },
    { text: "Integration & Testing: Connected React frontend with backend APIs." }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 18, bullet: true, lineSpacing: 30 });

// Slide 8: System Features
let slide8 = pres.addSlide();
slide8.addText("Key System Features", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "003366" });
slide8.addText([
    { text: "Core Banking: Secure transfers and passbooks." },
    { text: "Smart Savings: 'Pots' and Fixed Deposit management." },
    { text: "Global & Wealth Tools: Live Forex and Wealth Management." },
    { text: "Card & Utility: Manage credit cards and pay bills." },
    { text: "Admin Controls: Centralized dashboard for staff." }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 18, bullet: true, lineSpacing: 30 });

// Slide 9: Technologies Used
let slide9 = pres.addSlide();
slide9.addText("Technologies Used", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "003366" });
slide9.addText([
    { text: "Frontend: React.js, Vite, HTML5, CSS" },
    { text: "Backend: Java 17+, Spring Boot, Spring Web" },
    { text: "Security: Spring Security, Spring Batch" },
    { text: "Build Tools: NPM & Maven" }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 18, bullet: true, lineSpacing: 30 });

// Slide 10: Future Enhancements
let slide10 = pres.addSlide();
slide10.addText("Future Scope", { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "003366" });
slide10.addText([
    { text: "AI Financial Assistant: Machine learning for personalized advice." },
    { text: "Mobile Application: React Native for iOS and Android." },
    { text: "Blockchain Integration: Decentralized ledgers for Forex." }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 18, bullet: true, lineSpacing: 30 });

// Slide 11: Thank You
let slide11 = pres.addSlide();
slide11.addText("Thank You!", { x: 1, y: 1.5, w: "80%", fontSize: 40, bold: true, align: "center", color: "003366" });
slide11.addText("We are now open to taking deposits of feedback\nand withdrawing any questions you might have!", { x: 1, y: 3.0, w: "80%", fontSize: 20, align: "center", italic: true, color: "666666" });

// Save
pres.writeFile({ fileName: "Banking_System_Presentation.pptx" }).then(() => {
    console.log("PPTX created successfully!");
});

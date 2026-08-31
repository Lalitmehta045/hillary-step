const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/components/site/ITSolutionsContent.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Use regex to avoid \r\n issues

// 1. Extract the Hero Section
const heroSectionMatch = content.match(/\{\/\* Hero Section \*\/\}\s*<div className="relative w-full h-\[540px\].*?<\/div>\s*<\/div>\s*<\/div>/s);
if (!heroSectionMatch) {
    console.error("Could not find Hero Section");
    process.exit(1);
}
let heroSection = heroSectionMatch[0];
content = content.replace(heroSectionMatch[0], ''); // Remove from original spot

// 2. Add Cognitive Digital text
const bgOverlay = '<div className="absolute inset-0 bg-black/40"></div>';
const cognitiveText = `
            {/* Top Text inside hero */}
            <div className="absolute top-10 left-10 z-10 max-w-[700px]">
              <p className="text-[14px] font-[600] tracking-wide text-[#60A5FA] uppercase mb-[16px] drop-shadow-md">
                Cognitive Digital – Platforms
              </p>
              <h2 className="font-display text-[42px] max-md:text-[32px] font-[700] leading-[1.1] tracking-[-1px] text-white mb-[16px] drop-shadow-lg">
                <span className="bg-gradient-to-r from-[#60A5FA] via-[#white] to-[#60A5FA] bg-[length:200%_auto] animate-[gradient-flow_3s_ease_infinite] bg-clip-text text-transparent">Technology</span> that powers<br className="max-md:hidden" /> your business forward.
              </h2>
              <p className="text-[16px] max-md:text-[14px] leading-[26px] text-white/90 drop-shadow-md">
                From strategy to deployment, we build secure, scalable, and future-ready solutions to help your business adapt, innovate, and grow.
              </p>
            </div>
`;
heroSection = heroSection.replace(bgOverlay, bgOverlay + '\n' + cognitiveText);

// 3. Find and Replace Old Header
const headerMatch = content.match(/\{\/\* Header \*\/\}\s*<div className="mb-\[64px\].*?<\/div>/s);
if (!headerMatch) {
    console.error("Could not find Old Header");
    process.exit(1);
}

// Replace old header with the modified hero section
content = content.replace(headerMatch[0], heroSection);

// 4. Remove Intro text
const introMatch = content.match(/\{\/\* Intro text \*\/\}\s*<div className="mt-8">.*?<\/div>/s);
if (introMatch) {
    content = content.replace(introMatch[0], '');
}

fs.writeFileSync(filePath, content);
console.log("Successfully extracted Hero Section and moved it to the top.");
